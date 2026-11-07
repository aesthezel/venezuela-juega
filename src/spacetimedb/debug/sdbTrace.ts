/**
 * SpacetimeDB runtime trace (debug mode only).
 *
 * Goal: find out *exactly* which main-thread task freezes the page for 1-3s
 * while the SpacetimeDB session is being established.
 *
 * Enable it in any of these ways:
 *   - `VITE_SDB_DEBUG=true` (`.env.debug` / `npm run dev:debug`)
 *   - Opening the app with `?sdbdebug=1` (persists in localStorage)
 *   - `?sdbdebug=0` disables it again
 *
 * Once enabled it:
 *   - records a timestamped event timeline (connection, subscription, sync)
 *   - measures every sync span with `performance.measure` (visible in DevTools)
 *   - instruments WebSocket creation, bytes, and `onmessage` handler duration
 *   - reports Long Tasks (>50ms by default), resource timings and event-loop lag
 *   - exposes `window.__SDB_TRACE__` for console/report/JSON download
 *
 * When disabled every helper is a no-op, so production pays ~nothing.
 */

export type TraceDetail = Record<string, unknown>;

export interface TraceEntry {
    seq: number;
    /** ms since page navigation start (same clock as DevTools) */
    t: number;
    /** ms since the previous traced event */
    dt: number;
    event: string;
    detail?: TraceDetail;
}

export interface LongTaskEntry {
    start: number;
    durationMs: number;
    attribution?: string;
    /** If the task started shortly after an inbound WebSocket message, its size. */
    wsMessageBytes?: number;
    /** Milliseconds between the inbound WS message and the start of this task. */
    afterWsMessageMs?: number;
    /**
     * A task this long is usually not JavaScript work: it is a debugger pause,
     * a frozen/background tab, or the OS sleeping. The trace keeps the evidence
     * instead of blaming the last WebSocket message.
     */
    suspectedPause?: boolean;
    pauseReason?: string;
    visibility?: string;
    hidden?: boolean;
    hasFocus?: boolean;
    /** Last few inbound SpacetimeDB messages before the task started. */
    recentWsMessages?: Array<{ at: number; bytes: number; kind: string }>;
}

export type SocketKind = 'spacetimedb' | 'vite-hmr' | 'other';

export interface SocketSummary {
    id: number;
    url: string;
    kind: SocketKind;
    messages: number;
    bytes: number;
    createdAt: number;
    closedAt?: number;
    closeCode?: number;
    closeReason?: string;
}

interface InboundMessage {
    at: number;
    bytes: number;
    kind: SocketKind;
}

export interface TraceReport {
    schemaVersion: 1;
    enabled: boolean;
    url: string;
    userAgent: string;
    startedAt: number;
    exportedAt: string;
    durationMs: number;
    counters: Record<string, number>;
    longTasks: {
        count: number;
        totalMs: number;
        maxMs: number;
        items: LongTaskEntry[];
    };
    slowestSpans: TraceEntry[];
    connection: {
        builderToAppliedMs: number | null;
        events: TraceEntry[];
    };
    sockets: SocketSummary[];
    pageEvents: TraceEntry[];
    entries: TraceEntry[];
}

interface TraceSnapshot {
    enabled: boolean;
    startedAt: number;
    now: number;
    entries: TraceEntry[];
    longTasks: LongTaskEntry[];
    counters: Record<string, number>;
    maxLongTaskMs: number;
    totalLongTaskMs: number;
    lastEntry: TraceEntry | null;
}

interface SdbTraceApi {
    enabled: boolean;
    entries: () => TraceEntry[];
    longTasks: () => LongTaskEntry[];
    report: () => TraceReport;
    dump: () => string;
    download: () => void;
    copy: () => Promise<boolean>;
    clear: () => void;
}

declare global {
    interface Window {
        __SDB_TRACE__?: SdbTraceApi;
    }
}

const MAX_ENTRIES = 3000;
const MAX_LONG_TASKS = 200;

const env = ((import.meta as ImportMeta & { env?: Record<string, unknown> }).env ?? {}) as Record<string, unknown>;

function readFlag(value: unknown): boolean {
    const normalized = String(value ?? '').trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
}

function detectEnabled(): boolean {
    if (typeof window === 'undefined') return readFlag(env.VITE_SDB_DEBUG);

    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('sdbdebug')) {
            const value = params.get('sdbdebug');
            const on = value !== '0' && value !== 'false' && value !== 'off';
            try { localStorage.setItem('sdb_debug', on ? '1' : '0'); } catch { /* private mode */ }
            return on;
        }

        try {
            const stored = localStorage.getItem('sdb_debug');
            if (stored === '1') return true;
            if (stored === '0') return false;
        } catch { /* private mode */ }
    } catch { /* ignore */ }

    return readFlag(env.VITE_SDB_DEBUG);
}

const enabled = detectEnabled();
const configuredSlowMs = Number(env.VITE_SDB_TRACE_SLOW_MS);
const SLOW_MS = Number.isFinite(configuredSlowMs) && configuredSlowMs > 0 ? configuredSlowMs : 50;

const startedAt = typeof performance !== 'undefined' ? performance.now() : 0;
const entries: TraceEntry[] = [];
const longTasks: LongTaskEntry[] = [];
const counters: Record<string, number> = {};

let seq = 0;
let lastT = startedAt;
let measureSeq = 0;
let installed = false;
let socketSeq = 0;

const sockets: SocketSummary[] = [];
const recentInboundMessages: InboundMessage[] = [];

const RECENT_WS_LIMIT = 40;
const WS_CORRELATION_WINDOW_MS = 250;
const SUSPECTED_PAUSE_MS = 5000;

function classifySocket(rawUrl: string): SocketKind {
    if (/\/v1\/database\//i.test(rawUrl)) return 'spacetimedb';

    try {
        const url = new URL(rawUrl);
        const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === location.hostname;
        const isViteHmr = isLocal && (url.pathname === '/' || url.pathname === '/@vite/client') && !url.searchParams.has('token');
        if (isViteHmr) return 'vite-hmr';
    } catch {
        // ignore
    }

    return 'other';
}

function rememberInboundMessage(message: InboundMessage): void {
    recentInboundMessages.push(message);
    if (recentInboundMessages.length > RECENT_WS_LIMIT) recentInboundMessages.shift();
}

function pageState(): { visibility: string; hidden: boolean; hasFocus: boolean } {
    return {
        visibility: typeof document !== 'undefined' ? document.visibilityState : 'unknown',
        hidden: typeof document !== 'undefined' ? document.hidden : false,
        hasFocus: typeof document !== 'undefined' && typeof document.hasFocus === 'function'
            ? document.hasFocus()
            : false,
    };
}

const round = (value: number): number => Math.round(value * 100) / 100;

function heapMb(): number | undefined {
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
    if (!memory) return undefined;
    return Math.round((memory.usedJSHeapSize / 1048576) * 10) / 10;
}

function errText(error: unknown): string {
    if (error instanceof Error) return `${error.name}: ${error.message}`;
    if (typeof error === 'string') return error;
    try { return JSON.stringify(error); } catch { return String(error); }
}

function bumpCounter(name: string, by = 1): void {
    if (!enabled) return;
    counters[name] = (counters[name] ?? 0) + by;
}

function pushEntry(event: string, detail: TraceDetail | undefined, logToConsole: boolean): TraceEntry {
    const t = performance.now();
    const entry: TraceEntry = {
        seq: ++seq,
        t: round(t),
        dt: round(t - lastT),
        event,
        ...(detail ? { detail: { ...detail, ...(heapMb() !== undefined ? { heapMB: heapMb() } : {}) } } : {}),
    };
    lastT = t;

    entries.push(entry);
    if (entries.length > MAX_ENTRIES) entries.shift();

    // User Timing marks: DevTools > Performance > Timings track.
    if (/^(conn:|idle:|subscription:|sync:.*initial|ws:(open|close|error)|longtask|loop:lag|nav:|paint)/.test(event)) {
        try { performance.mark(`sdb:${event}:${entry.seq}`); } catch { /* ignore */ }
    }

    if (logToConsole && typeof console !== 'undefined') {
        const elapsed = entry.t - startedAt;
        const extra = entry.detail ?? '';
        console.debug(
            `%c[SDB +${elapsed.toFixed(0)}ms] ${event}`,
            'color:#22c55e;font-weight:700',
            extra,
        );
    }

    return entry;
}

/** Record a traced event. No-op when debug mode is off. */
export function trace(event: string, detail?: TraceDetail): void {
    if (!enabled) return;
    pushEntry(event, detail, true);
}

/** Record a high-frequency event without writing it to the console. */
export function traceQuiet(event: string, detail?: TraceDetail): void {
    if (!enabled) return;
    pushEntry(event, detail, false);
}

/** Increment an aggregated counter (callback floods, message counts, etc.). */
export function countEvent(name: string, by = 1): void {
    bumpCounter(name, by);
}

/**
 * Measure a synchronous span and record it both in the trace and in the
 * browser's User Timing track (so it shows up in the DevTools flame chart).
 */
export function measureSync<T>(
    event: string,
    fn: () => T,
    detail?: (result: T, durationMs: number) => TraceDetail,
): T {
    if (!enabled) return fn();

    const id = ++measureSeq;
    const startMark = `sdb.${event}.${id}.start`;
    try { performance.mark(startMark); } catch { /* ignore */ }
    const start = performance.now();

    let result: T;
    try {
        result = fn();
    } catch (error) {
        const duration = performance.now() - start;
        try { performance.measure(`sdb.${event}:error`, startMark); } catch { /* ignore */ }
        trace(`${event}:error`, { durationMs: round(duration), error: errText(error) });
        throw error;
    }

    const duration = performance.now() - start;
    try { performance.measure(`sdb.${event}`, startMark); } catch { /* ignore */ }
    try { performance.clearMarks(startMark); } catch { /* ignore */ }

    const extra = detail ? detail(result, duration) : undefined;
    trace(event, {
        durationMs: round(duration),
        long: duration >= SLOW_MS,
        ...(extra ?? {}),
    });

    return result;
}

/** Table row counts without iterating rows (`count()` is O(1) in the SpacetimeDB SDK). */
export function traceTableCounts(event: string, db: unknown, tableNames: string[]): void {
    if (!enabled) return;

    const tables: Record<string, number | string> = {};
    for (const name of tableNames) {
        try {
            const table = (db as Record<string, { count?: () => bigint | number }> | null)?.[name];
            if (table && typeof table.count === 'function') {
                tables[name] = Number(table.count());
            } else if (table) {
                tables[name] = 'n/a';
            }
        } catch (error) {
            tables[name] = `error: ${errText(error)}`;
        }
    }
    trace(event, { tables });
}

function installLongTaskObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    // Shared across module re-evaluations (Vite HMR / duplicate imports) so the
    // same task is not recorded twice.
    const reportedSignatures = ((window as any).__SDB_LONG_TASK_SIGNATURES__ ??= new Set<string>()) as Set<string>;

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const signature = `${round(entry.startTime)}:${round(entry.duration)}`;
                if (reportedSignatures.has(signature)) continue;
                reportedSignatures.add(signature);
                if (reportedSignatures.size > 500) reportedSignatures.clear();

                const attribution = (entry as PerformanceEntry & {
                    attribution?: Array<{ name?: string; containerType?: string; containerSrc?: string }>;
                }).attribution?.[0];
                const durationMs = round(entry.duration);
                const longTask: LongTaskEntry = {
                    start: round(entry.startTime),
                    durationMs,
                    attribution: attribution?.name || attribution?.containerType || undefined,
                };

                if (durationMs >= SUSPECTED_PAUSE_MS) {
                    // A multi-second "task" is almost never JS work: it is a
                    // debugger pause, a frozen tab or the OS sleeping. Keep the
                    // evidence and do not blame the last 167-byte heartbeat.
                    const state = pageState();
                    longTask.suspectedPause = true;
                    longTask.visibility = state.visibility;
                    longTask.hidden = state.hidden;
                    longTask.hasFocus = state.hasFocus;
                    longTask.pauseReason = state.hidden
                        ? 'tab-hidden-or-frozen'
                        : !state.hasFocus
                            ? 'window-unfocused'
                            : 'debugger-pause-or-os-sleep';
                    longTask.recentWsMessages = recentInboundMessages
                        .filter((message) => message.at <= entry.startTime && entry.startTime - message.at <= 1000)
                        .slice(-5)
                        .map((message) => ({
                            at: round(message.at),
                            bytes: message.bytes,
                            kind: message.kind,
                        }));
                } else {
                    // Only correlate plausible tasks (<=5s) and prefer the
                    // largest message in the short window, not the latest tiny
                    // heartbeat that happened to arrive just before the task.
                    const candidates = recentInboundMessages.filter((message) =>
                        message.at <= entry.startTime &&
                        entry.startTime - message.at <= WS_CORRELATION_WINDOW_MS,
                    );
                    const largest = [...candidates].sort((a, b) => b.bytes - a.bytes)[0];
                    if (largest) {
                        longTask.afterWsMessageMs = round(entry.startTime - largest.at);
                        longTask.wsMessageBytes = largest.bytes;
                    }
                }

                longTasks.push(longTask);
                if (longTasks.length > MAX_LONG_TASKS) longTasks.shift();

                bumpCounter('longTasks');
                pushEntry('longtask', { ...longTask }, true);
            }
        });
        observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
        trace('trace:longtask-unavailable', { error: errText(error) });
    }
}

function installResourceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const resource = entry as PerformanceResourceTiming;
                if (resource.duration < 300) continue;
                trace('resource:slow', {
                    name: resource.name.replace(location.origin, ''),
                    type: resource.initiatorType,
                    startMs: Math.round(resource.startTime),
                    durationMs: round(resource.duration),
                    transferSize: resource.transferSize,
                });
            }
        });
        observer.observe({ type: 'resource', buffered: true });
    } catch { /* ignore */ }
}

function sanitizeUrl(rawUrl: string): string {
    try {
        const url = new URL(rawUrl);
        if (url.searchParams.has('token')) url.searchParams.set('token', '[redacted]');
        return url.toString();
    } catch {
        return rawUrl.replace(/([?&]token=)[^&]*/i, '$1[redacted]');
    }
}

function messageByteLength(data: unknown): number {
    if (typeof data === 'string') return data.length;
    if (data instanceof ArrayBuffer) return data.byteLength;
    if (typeof Blob !== 'undefined' && data instanceof Blob) return data.size;
    if (ArrayBuffer.isView(data)) return data.byteLength;
    return 0;
}

/**
 * Wraps the global WebSocket so the trace can see:
 *  - when the socket is created/opened/closed
 *  - how many bytes the server sends
 *  - how long the SDK `onmessage` handler blocks the main thread
 *
 * The SpacetimeDB SDK assigns `ws.onmessage = ...` on the instance, so we
 * intercept that assignment to measure the handler. The heavy work (decode +
 * apply of the initial subscription snapshot) happens inside that handler.
 */
function installWebSocketTracing(): void {
    if (typeof window === 'undefined' || typeof window.WebSocket !== 'function') return;

    const NativeWebSocket = window.WebSocket;
    if ((NativeWebSocket as unknown as { __sdbTraced?: boolean }).__sdbTraced) return;

    // `onmessage` is an accessor on WebSocket.prototype. If we shadow it with a
    // plain instance property, the native WebSocket never registers the handler
    // and the SDK stops receiving messages. We must forward to the native setter.
    const nativeOnMessage = Object.getOwnPropertyDescriptor(NativeWebSocket.prototype, 'onmessage');

    const TracedWebSocket = new Proxy(NativeWebSocket, {
        construct(target, args) {
            const ws = Reflect.construct(target, args) as WebSocket;
            const rawUrl = typeof args[0] === 'string' ? args[0] : String(args[0]);
            const url = sanitizeUrl(rawUrl);
            const kind = classifySocket(rawUrl);
            const createdAt = performance.now();
            const isSdb = kind === 'spacetimedb';
            const log = isSdb ? trace : traceQuiet;
            const socket: SocketSummary = {
                id: ++socketSeq,
                url,
                kind,
                messages: 0,
                bytes: 0,
                createdAt: round(createdAt),
            };

            sockets.push(socket);
            if (sockets.length > 20) sockets.shift();

            log('ws:create', { id: socket.id, kind, url });

            ws.addEventListener('open', () => {
                log('ws:open', {
                    id: socket.id,
                    kind,
                    url,
                    protocol: ws.protocol || null,
                    durationMs: round(performance.now() - createdAt),
                });
            });

            ws.addEventListener('close', (event) => {
                socket.closedAt = round(performance.now());
                socket.closeCode = event.code;
                socket.closeReason = event.reason || undefined;
                log('ws:close', {
                    id: socket.id,
                    kind,
                    code: event.code,
                    reason: event.reason || undefined,
                    clean: event.wasClean,
                    messages: socket.messages,
                    bytes: socket.bytes,
                });
            });

            ws.addEventListener('error', () => {
                log('ws:error', { id: socket.id, kind, url });
            });

            ws.addEventListener('message', (event) => {
                const bytes = messageByteLength(event.data);
                socket.messages += 1;
                socket.bytes += bytes;

                if (kind === 'spacetimedb') {
                    rememberInboundMessage({ at: performance.now(), bytes, kind });
                    bumpCounter('sdb.ws.messages');
                    bumpCounter('sdb.ws.bytes', bytes);
                } else if (kind === 'vite-hmr') {
                    bumpCounter('hmr.ws.messages');
                    bumpCounter('hmr.ws.bytes', bytes);
                } else {
                    bumpCounter('other.ws.messages');
                    bumpCounter('other.ws.bytes', bytes);
                }

                bumpCounter('ws.messages');
                bumpCounter('ws.bytes', bytes);

                // Heartbeats are ~167 bytes every 2s; recording each one makes
                // the trace unreadable. Keep only substantial payloads.
                if (bytes >= 4096) {
                    traceQuiet('ws:message', {
                        id: socket.id,
                        kind,
                        bytes,
                        totalBytes: socket.bytes,
                        messages: socket.messages,
                    });
                }
            });

            // Only the SpacetimeDB socket needs the handler wrapper. Vite HMR
            // keeps its native handler untouched.
            if (isSdb && nativeOnMessage?.get && nativeOnMessage?.set) {
                const nativeGet = nativeOnMessage.get;
                const nativeSet = nativeOnMessage.set;

                Object.defineProperty(ws, 'onmessage', {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return nativeGet.call(this);
                    },
                    set(fn: ((this: WebSocket, event: MessageEvent) => unknown) | null) {
                        if (typeof fn !== 'function') {
                            nativeSet.call(this, fn);
                            return;
                        }

                        const wrapped = function (this: WebSocket, event: MessageEvent) {
                            const bytes = messageByteLength(event.data);

                            // Do NOT measure the promise lifetime here: the SDK's
                            // adapter resolves it after decompression and that
                            // can wait on unrelated page work. Actual main-thread
                            // blocking is captured by the Long Task observer and
                            // correlated with the inbound message.
                            try {
                                const result = fn.call(this, event);
                                if (result && typeof (result as Promise<unknown>).then === 'function') {
                                    return (result as Promise<unknown>).then(
                                        (value) => { bumpCounter('ws.handlers'); return value; },
                                        (error) => {
                                            trace('ws:handler:error', { error: errText(error), bytes });
                                            throw error;
                                        },
                                    );
                                }
                                bumpCounter('ws.handlers');
                                return result;
                            } catch (error) {
                                trace('ws:handler:error', { error: errText(error), bytes });
                                throw error;
                            }
                        };

                        // Register through the native setter so the browser
                        // actually dispatches events to our wrapper.
                        nativeSet.call(this, wrapped);
                    },
                });
            }

            return ws;
        },
    });

    (TracedWebSocket as unknown as { __sdbTraced?: boolean }).__sdbTraced = true;
    window.WebSocket = TracedWebSocket as unknown as typeof WebSocket;
}

function installLoopLagMonitor(): void {
    const intervalMs = 500;
    let last = performance.now();

    setInterval(() => {
        const now = performance.now();
        const lag = now - last - intervalMs;
        last = now;

        if (lag >= 2000) {
            // The event loop did not run for seconds. This is a debugger pause,
            // a frozen/background tab or the OS sleeping, not normal JS work.
            bumpCounter('page.pauses');
            trace('page:pause', {
                gapMs: round(lag),
                ...pageState(),
                previousEvent: entries.length > 0 ? entries[entries.length - 1].event : null,
            });
        } else if (lag >= SLOW_MS) {
            bumpCounter('loop.lags');
            trace('loop:lag', { lagMs: round(lag), ...pageState() });
        }
    }, intervalMs);
}

function installPageLifecycleTrace(): void {
    document.addEventListener('visibilitychange', () => {
        trace('page:visibility', pageState());
    });

    window.addEventListener('pagehide', (event) => {
        trace('page:pagehide', {
            persisted: (event as PageTransitionEvent).persisted,
            ...pageState(),
        });
    });

    window.addEventListener('pageshow', (event) => {
        trace('page:pageshow', {
            persisted: (event as PageTransitionEvent).persisted,
            ...pageState(),
        });
    });

    // Page Lifecycle API (Chromium). Not in the DOM typings yet.
    window.addEventListener('freeze' as any, () => {
        trace('page:freeze', pageState());
    });
    window.addEventListener('resume' as any, () => {
        trace('page:resume', pageState());
    });
}

function installNavigationTrace(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navigation) {
        trace('nav:timing', {
            type: navigation.type,
            ttfbMs: round(navigation.responseStart),
            domContentLoadedMs: round(navigation.domContentLoadedEventEnd),
            loadMs: round(navigation.loadEventEnd),
            transferSize: navigation.transferSize,
            encodedBodySize: navigation.encodedBodySize,
        });
    }

    for (const paint of performance.getEntriesByType('paint')) {
        trace('paint', { name: paint.name, startMs: round(paint.startTime) });
    }

    window.addEventListener('load', () => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        trace('nav:load', {
            domContentLoadedMs: nav ? round(nav.domContentLoadedEventEnd) : null,
            loadMs: nav ? round(nav.loadEventEnd) : null,
            nowMs: round(performance.now()),
        });
    }, { once: true });
}

function installErrorHooks(): void {
    window.addEventListener('error', (event) => {
        const message = event.message || '';

        // Chrome emits this as an `error` event, but it is a benign
        // ResizeObserver notification warning, not an app exception.
        if (message.includes('ResizeObserver loop')) {
            trace('warning:resize-observer', { message });
            return;
        }

        trace('error', {
            message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        trace('unhandledrejection', { reason: errText(event.reason) });
    });
}

function buildReport(): TraceReport {
    const durationMs = round(performance.now() - startedAt);
    const totalLongTaskMs = longTasks.reduce((sum, task) => sum + task.durationMs, 0);
    const maxLongTaskMs = longTasks.reduce((max, task) => Math.max(max, task.durationMs), 0);

    const spans = entries.filter((entry) => typeof entry.detail?.durationMs === 'number');
    const slowestSpans = [...spans]
        .sort((a, b) => Number(b.detail?.durationMs) - Number(a.detail?.durationMs))
        .slice(0, 20);

    const connectionEvents = entries.filter((entry) =>
        /^(idle|conn|subscription|sync|ws:(create|open|close|error|handler))/i.test(entry.event),
    );

    const builder = entries.find((entry) => entry.event === 'conn:builder-start' || entry.event === 'conn:builder');
    const applied = entries.find((entry) => entry.event === 'subscription:applied');
    const pageEvents = entries.filter((entry) =>
        entry.event.startsWith('page:') || entry.event === 'loop:lag',
    );

    return {
        schemaVersion: 1,
        enabled,
        url: typeof location !== 'undefined' ? location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        startedAt: round(startedAt),
        exportedAt: new Date().toISOString(),
        durationMs,
        counters: { ...counters },
        longTasks: {
            count: longTasks.length,
            totalMs: round(totalLongTaskMs),
            maxMs: round(maxLongTaskMs),
            items: [...longTasks],
        },
        slowestSpans,
        connection: {
            builderToAppliedMs: builder && applied ? round(applied.t - builder.t) : null,
            events: connectionEvents,
        },
        sockets: sockets.map((socket) => ({ ...socket })),
        pageEvents,
        entries: [...entries],
    };
}

function downloadReport(): void {
    const json = JSON.stringify(buildReport(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `sdb-trace-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

async function copyReport(): Promise<boolean> {
    const json = JSON.stringify(buildReport(), null, 2);
    try {
        await navigator.clipboard.writeText(json);
        return true;
    } catch {
        return false;
    }
}

function clearTrace(): void {
    entries.length = 0;
    longTasks.length = 0;
    sockets.length = 0;
    recentInboundMessages.length = 0;
    for (const key of Object.keys(counters)) delete counters[key];
    lastT = performance.now();
    trace('trace:cleared');
}

export function isSdbTraceEnabled(): boolean {
    return enabled;
}

export function getTraceSnapshot(): TraceSnapshot {
    const totalLongTaskMs = longTasks.reduce((sum, task) => sum + task.durationMs, 0);
    const maxLongTaskMs = longTasks.reduce((max, task) => Math.max(max, task.durationMs), 0);

    return {
        enabled,
        startedAt: round(startedAt),
        now: round(performance.now()),
        entries,
        longTasks,
        counters: { ...counters },
        maxLongTaskMs: round(maxLongTaskMs),
        totalLongTaskMs: round(totalLongTaskMs),
        lastEntry: entries.length > 0 ? entries[entries.length - 1] : null,
    };
}

export function getTraceReport(): TraceReport {
    return buildReport();
}

/** Install all instrumentation. Safe to call more than once. */
export function installSdbTrace(): void {
    if (installed || typeof window === 'undefined') return;
    installed = true;

    const api: SdbTraceApi = {
        enabled,
        entries: () => [...entries],
        longTasks: () => [...longTasks],
        report: buildReport,
        dump: () => JSON.stringify(buildReport(), null, 2),
        download: downloadReport,
        copy: copyReport,
        clear: clearTrace,
    };
    window.__SDB_TRACE__ = api;

    if (!enabled) return;

    trace('trace:start', {
        href: location.href,
        referrer: document.referrer || null,
        slowThresholdMs: SLOW_MS,
        debugSource: readFlag(env.VITE_SDB_DEBUG) ? 'VITE_SDB_DEBUG' : 'query/localStorage',
    });

    installLongTaskObserver();
    installResourceObserver();
    installWebSocketTracing();
    installLoopLagMonitor();
    installPageLifecycleTrace();
    installNavigationTrace();
    installErrorHooks();

    console.info(
        '%c[SDB] Runtime trace enabled.%c Use `__SDB_TRACE__.report()` or `__SDB_TRACE__.download()` in the console.',
        'color:#22c55e;font-weight:700',
        'color:inherit',
    );
}

// Side-effect install when this module is imported (see src/index.tsx).
installSdbTrace();

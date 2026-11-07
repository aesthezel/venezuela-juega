#!/usr/bin/env node
/**
 * Summarize a SpacetimeDB trace exported from the browser.
 *
 * Usage:
 *   npm run trace:analyze -- ./sdb-trace-2026-....json
 *   node scripts/analyze-sdb-trace.mjs ./trace.json
 */

import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];

if (!input) {
    console.error('Usage: node scripts/analyze-sdb-trace.mjs <sdb-trace.json>');
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), input);
if (!fs.existsSync(filePath)) {
    console.error(`Trace file not found: ${filePath}`);
    process.exit(1);
}

let data;
try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (error) {
    // The console/overlay can produce several concatenated JSON objects when
    // `dump()` is called more than once. Extract them and use the newest one.
    const raw = fs.readFileSync(filePath, 'utf-8');
    const objects = extractJsonObjects(raw);
    if (objects.length === 0) {
        console.error(`Could not parse ${filePath}: ${error.message}`);
        process.exit(1);
    }
    data = objects[objects.length - 1];
    console.warn(`⚠️  ${objects.length} JSON objects found in the file; analyzing the last one.`);
}

function extractJsonObjects(text) {
    const objects = [];
    let depth = 0;
    let start = -1;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inString) {
            if (escaped) escaped = false;
            else if (char === '\\') escaped = true;
            else if (char === '"') inString = false;
            continue;
        }

        if (char === '"') {
            inString = true;
            continue;
        }

        if (char === '{') {
            if (depth === 0) start = i;
            depth += 1;
        } else if (char === '}') {
            if (depth > 0) depth -= 1;
            if (depth === 0 && start !== -1) {
                const candidate = text.slice(start, i + 1);
                try {
                    objects.push(JSON.parse(candidate));
                } catch {
                    // Not a complete/valid object; keep scanning.
                }
                start = -1;
            }
        }
    }

    return objects;
}

const entries = Array.isArray(data.entries) ? data.entries : [];
const longTasks = Array.isArray(data.longTasks)
    ? data.longTasks
    : Array.isArray(data.longTasks?.items)
        ? data.longTasks.items
        : [];
const counters = data.counters && typeof data.counters === 'object' ? data.counters : {};
const sockets = Array.isArray(data.sockets) ? data.sockets : [];

const fmt = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '—';
    return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
};

const detailText = (entry) => {
    if (!entry?.detail) return '';
    const detail = { ...entry.detail };
    const duration = detail.durationMs;
    delete detail.durationMs;
    delete detail.heapMB;
    const rest = Object.keys(detail).length ? JSON.stringify(detail) : '';
    return duration !== undefined ? `${fmt(Number(duration))} ${rest}` : rest;
};

const builder = entries.find((entry) => entry.event === 'conn:builder-start') ?? entries.find((entry) => entry.event === 'conn:builder');
const applied = entries.find((entry) => entry.event === 'subscription:applied');
const readyMs = data.connection?.builderToAppliedMs ?? (builder && applied ? applied.t - builder.t : null);
const totalLongTaskMs = longTasks.reduce((sum, task) => sum + Number(task.durationMs ?? 0), 0);
const maxLongTaskMs = longTasks.reduce((max, task) => Math.max(max, Number(task.durationMs ?? 0)), 0);

const suspectedPauses = longTasks.filter((task) =>
    task.suspectedPause === true || Number(task.durationMs ?? 0) >= 5000,
);
const computeLongTasks = longTasks.filter((task) => !suspectedPauses.includes(task));

const snapshotEntry = [...entries].reverse().find((entry) => entry.event === 'subscription:snapshot');
const syncStats = entries.find((entry) => entry.event === 'sync:stats');
const syncActivity = entries.find((entry) => entry.event === 'sync:activity');
const pagePauses = entries.filter((entry) => entry.event === 'page:pause');
const pageEvents = entries.filter((entry) => entry.event.startsWith('page:') && entry.event !== 'page:pause');

console.log('');
console.log('┌─ SpacetimeDB trace ─────────────────────────────────────────────');
console.log(`│ file        ${filePath}`);
console.log(`│ url         ${data.url ?? '—'}`);
console.log(`│ captured    ${data.exportedAt ?? '—'}  (${fmt(Number(data.durationMs ?? 0))})`);
console.log(`│ builder→applied  ${fmt(readyMs)}`);
console.log(`│ snapshot applied ${fmt(Number(applied?.detail?.waitedMs ?? NaN))}`);
console.log('└─────────────────────────────────────────────────────────────────');
console.log('');

console.log('Sockets:');
if (sockets.length > 0) {
    for (const socket of sockets) {
        const close = socket.closeCode !== undefined
            ? `  close=${socket.closeCode}${socket.closeReason ? ` (${socket.closeReason})` : ''}`
            : '';
        console.log(`   - #${socket.id} ${String(socket.kind).padEnd(12)} ${socket.url}`);
        console.log(`     messages=${socket.messages} bytes=${socket.bytes}${close}`);
    }
} else {
    console.log('   (no per-socket data; trace was generated by an older build)');
}
console.log('');

console.log(`Long tasks: ${longTasks.length}  |  max ${fmt(maxLongTaskMs)}  |  total ${fmt(totalLongTaskMs)}`);
if (computeLongTasks.length > 0) {
    const top = [...computeLongTasks].sort((a, b) => Number(b.durationMs) - Number(a.durationMs)).slice(0, 10);
    console.log('  compute tasks (plausible JS work):');
    for (const task of top) {
        const ws = task.wsMessageBytes
            ? `  lastWsMessage=${task.wsMessageBytes}B (+${fmt(Number(task.afterWsMessageMs))})`
            : '';
        console.log(`   - ${fmt(Number(task.durationMs)).padStart(7)} @ ${fmt(Number(task.start))} ${task.attribution ?? ''}${ws}`);
    }
}
if (suspectedPauses.length > 0) {
    console.log('  suspected pauses (NOT normal JS work):');
    for (const task of suspectedPauses) {
        console.log(`   - ${fmt(Number(task.durationMs)).padStart(7)} @ ${fmt(Number(task.start))}`);
        console.log(`     reason=${task.pauseReason ?? 'unknown'} visibility=${task.visibility ?? '—'} hasFocus=${task.hasFocus ?? '—'}`);
        if (Array.isArray(task.recentWsMessages) && task.recentWsMessages.length > 0) {
            const recent = task.recentWsMessages.map((message) => `${message.bytes}B@${fmt(message.at)}`).join(', ');
            console.log(`     recentWsMessages: ${recent}`);
        }
    }
}
console.log('');

if (pageEvents.length > 0 || pagePauses.length > 0) {
    console.log('Page lifecycle / event-loop pauses:');
    for (const entry of [...pageEvents, ...pagePauses].slice(-20)) {
        console.log(`   ${fmt(entry.t).padStart(9)}  ${entry.event.padEnd(20)} ${detailText(entry)}`);
    }
    console.log('');
}

if (snapshotEntry?.detail?.tables) {
    console.log('Snapshot row counts (targeted subscription):');
    for (const [table, count] of Object.entries(snapshotEntry.detail.tables)) {
        console.log(`   - ${String(table).padEnd(14)} ${count}`);
    }
    console.log('');
}

const spans = entries
    .filter((entry) => entry.event !== 'longtask' && typeof entry.detail?.durationMs === 'number')
    .sort((a, b) => Number(b.detail.durationMs) - Number(a.detail.durationMs))
    .slice(0, 15);

if (spans.length > 0) {
    console.log('Slowest measured spans:');
    for (const entry of spans) {
        console.log(`   - ${entry.event.padEnd(24)} ${fmt(Number(entry.detail.durationMs)).padStart(7)} @ ${fmt(entry.t)} ${detailText(entry)}`);
    }
    console.log('');
}

const timeline = entries.filter((entry) =>
    /^(idle|conn|subscription|sync|catalog|page:|loop:lag|ws:(create|open|close|error|handler)|longtask)/.test(entry.event),
);
if (timeline.length > 0) {
    console.log(`Connection timeline (${timeline.length} events):`);
    for (const entry of timeline.slice(-70)) {
        const kind = entry.detail?.kind ? `[${entry.detail.kind}] ` : '';
        console.log(`   ${fmt(entry.t).padStart(9)}  ${(kind + entry.event).padEnd(30)} ${detailText(entry)}`);
    }
    console.log('');
}

const counterKeys = Object.keys(counters);
if (counterKeys.length > 0) {
    console.log('Counters:');
    for (const key of counterKeys.sort()) {
        console.log(`   - ${key}: ${counters[key]}`);
    }
    console.log('');
}

console.log('Diagnosis hints:');
const hints = [];

if (suspectedPauses.length > 0) {
    const worst = suspectedPauses.reduce((max, task) => Number(task.durationMs) > Number(max.durationMs) ? task : max, suspectedPauses[0]);
    hints.push(
        `No parece un bloqueo de JS/SpacetimeDB: hay ${suspectedPauses.length} pausa(s) de ${fmt(Number(worst.durationMs))} ` +
        `(${worst.pauseReason ?? 'debugger/OS/tab freeze'}). El event loop no estaba ejecutando JS.`,
    );
    if (pagePauses.length > 0) {
        const lastPause = pagePauses[pagePauses.length - 1];
        hints.push(`El monitor de event loop detectó un gap de ${fmt(Number(lastPause.detail?.gapMs))} con visibility=${lastPause.detail?.visibility} hasFocus=${lastPause.detail?.hasFocus}.`);
    }
}

if (applied && syncStats && syncActivity) {
    hints.push(
        `El snapshot de SpacetimeDB se aplicó en ${fmt(Number(applied.detail?.waitedMs))}; ` +
        `sync:stats=${fmt(Number(syncStats.detail?.durationMs))}, sync:activity=${fmt(Number(syncActivity.detail?.durationMs))}.`,
    );
}

const hmrSockets = sockets.filter((socket) => socket.kind === 'vite-hmr');
const hmrErrors = entries.filter((entry) => entry.event === 'ws:error' && entry.detail?.kind === 'vite-hmr');
if (hmrSockets.length > 0 || hmrErrors.length > 0) {
    hints.push(
        `Se detectaron ${hmrSockets.length} socket(s) de Vite HMR y ${hmrErrors.length} reconexión(es) fallida(s). ` +
        'Eso es el servidor de desarrollo, no SpacetimeDB: reinicia `npm run dev:debug` si el servidor se detuvo.',
    );
}

const slowWs = computeLongTasks.find((task) => Number(task.wsMessageBytes) >= 4096 && Number(task.durationMs) >= 300);
if (slowWs) {
    hints.push(
        `Un task de ${fmt(Number(slowWs.durationMs))} empezó ${fmt(Number(slowWs.afterWsMessageMs))} después de un mensaje grande de ` +
        `${slowWs.wsMessageBytes} bytes. Revisa si coincide con el snapshot (decode + apply) o con un render grande.`,
    );
}

const slowActivity = entries.find((entry) => entry.event === 'sync:activity' && Number(entry.detail?.durationMs) >= 100);
if (slowActivity) hints.push(`sync:activity bloqueó ${fmt(Number(slowActivity.detail.durationMs))}; recorre todas las filas de my_activity.`);

const slowStats = entries.find((entry) => entry.event === 'sync:stats' && Number(entry.detail?.durationMs) >= 100);
if (slowStats) hints.push(`sync:stats bloqueó ${fmt(Number(slowStats.detail.durationMs))}; recorre todas las filas de game_stats.`);

const slowCatalogParse = entries.find((entry) => /^catalog:parse-/.test(entry.event) && Number(entry.detail?.durationMs) >= 100);
if (slowCatalogParse) hints.push(`${slowCatalogParse.event} bloqueó ${fmt(Number(slowCatalogParse.detail.durationMs))}; la revalidación del catálogo compite con el snapshot.`);

const activityRows = Number(snapshotEntry?.detail?.tables?.my_activity ?? 0);
const profileRows = Number(snapshotEntry?.detail?.tables?.profile ?? 0);
if (activityRows >= 1000) hints.push(`my_activity tiene ${activityRows} filas en caché: la suscripción filtrada por player_id no está activa.`);
if (profileRows >= 1000) hints.push(`profile tiene ${profileRows} filas en caché: la suscripción filtrada por id no está activa.`);

const sdbBytes = Number(counters['sdb.ws.bytes'] ?? counters['ws.bytes'] ?? 0);
if (sdbBytes > 0) hints.push(`Tráfico SpacetimeDB recibido: ${(sdbBytes / 1024).toFixed(1)} KB.`);

if (hints.length === 0) {
    hints.push('No se detectó un bloqueo dominante. Revisa el flame chart de DevTools para la tarea que coincida con la timeline.');
}
for (const hint of hints) console.log(`   • ${hint}`);
console.log('');

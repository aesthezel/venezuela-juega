import { useEffect, useState } from 'preact/hooks';
import { useSpacetimeDB } from '../connection';
import { getTraceSnapshot, isSdbTraceEnabled, type TraceEntry } from './sdbTrace';

function formatMs(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    if (value >= 1000) return `${(value / 1000).toFixed(2)}s`;
    return `${Math.round(value)}ms`;
}

function detailPreview(entry: TraceEntry): string {
    if (!entry.detail) return '';
    const detail = { ...entry.detail };
    const duration = detail.durationMs;
    delete detail.durationMs;
    delete detail.heapMB;
    const rest = Object.keys(detail).length > 0 ? JSON.stringify(detail) : '';
    const text = duration !== undefined ? `${formatMs(Number(duration))} ${rest}` : rest;
    return text.length > 95 ? `${text.slice(0, 92)}…` : text;
}

/**
 * Floating trace panel. Only renders when the SpacetimeDB debug mode is on.
 */
export default function SdbDebugOverlay() {
    const { isConnected, identity, gameStatsMap, myActivityMap } = useSpacetimeDB();
    const [snapshot, setSnapshot] = useState(() => getTraceSnapshot());
    const [collapsed, setCollapsed] = useState(false);
    const [copied, setCopied] = useState<'idle' | 'ok' | 'error'>('idle');

    useEffect(() => {
        if (!isSdbTraceEnabled()) return;

        const timer = setInterval(() => {
            setSnapshot((previous) => {
                const next = getTraceSnapshot();
                if (
                    previous.lastEntry?.seq === next.lastEntry?.seq &&
                    previous.longTasks.length === next.longTasks.length
                ) {
                    return previous;
                }
                return next;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    if (!isSdbTraceEnabled()) return null;

    const builder = snapshot.entries.find((entry) => entry.event === 'conn:builder-start' || entry.event === 'conn:builder');
    const applied = snapshot.entries.find((entry) => entry.event === 'subscription:applied');
    const readyMs = builder && applied ? applied.t - builder.t : null;
    const snapshotEntry = [...snapshot.entries].reverse().find((entry) => entry.event === 'subscription:snapshot');
    const tableCounts = snapshotEntry?.detail?.tables as Record<string, number | string> | undefined;
    const recent = snapshot.entries
        .filter((entry) => entry.detail?.kind !== 'vite-hmr')
        .slice(-12);
    const suspectedPause = snapshot.maxLongTaskMs >= 5000;
    const lastPause = [...snapshot.entries].reverse().find((entry) => entry.event === 'page:pause' || entry.event === 'page:freeze');
    const hmrMessages = Number(snapshot.counters['hmr.ws.messages'] ?? 0);
    const hmrBytes = Number(snapshot.counters['hmr.ws.bytes'] ?? 0);
    const hmrErrors = snapshot.entries.filter((entry) => entry.event === 'ws:error' && entry.detail?.kind === 'vite-hmr').length;
    const status = isConnected ? 'CONNECTED' : identity ? 'IDENTITY' : 'CONNECTING';
    const statusColor = isConnected ? '#22c55e' : identity ? '#eab308' : '#f97316';

    const handleCopy = async () => {
        const ok = await window.__SDB_TRACE__?.copy();
        setCopied(ok ? 'ok' : 'error');
        setTimeout(() => setCopied('idle'), 1500);
    };

    const handleClear = () => {
        window.__SDB_TRACE__?.clear();
        setSnapshot(getTraceSnapshot());
    };

    if (collapsed) {
        return (
            <button
                type="button"
                onClick={() => setCollapsed(false)}
                title="Open SpacetimeDB trace"
                style={{
                    position: 'fixed', right: '12px', bottom: '12px', zIndex: 9999,
                    background: '#0a0a0a', color: '#22c55e', border: '1px solid rgba(34,197,94,.45)',
                    borderRadius: '8px', padding: '6px 10px', fontFamily: 'monospace', fontSize: '11px',
                }}
            >
                SDB TRACE
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                right: '12px',
                bottom: '12px',
                zIndex: 9999,
                width: 'min(460px, calc(100vw - 24px))',
                maxHeight: '70vh',
                overflow: 'auto',
                background: 'rgba(5, 8, 7, 0.94)',
                color: '#d1fae5',
                border: '1px solid rgba(34, 197, 94, 0.45)',
                borderRadius: '10px',
                boxShadow: '0 18px 45px rgba(0,0,0,.55)',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: '11px',
                lineHeight: 1.45,
                padding: '10px 12px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ color: '#22c55e', fontWeight: 700, letterSpacing: '.04em' }}>SDB TRACE</span>
                <span
                    style={{
                        color: statusColor,
                        border: `1px solid ${statusColor}66`,
                        borderRadius: '999px',
                        padding: '0 6px',
                    }}
                >
                    {status}
                </span>
                <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>{formatMs(snapshot.now - snapshot.startedAt)}</span>
                <button type="button" onClick={() => setCollapsed(true)} title="Collapse" style={buttonStyle}>—</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 8px', marginBottom: '6px' }}>
                <span style={{ color: '#9ca3af' }}>ready</span>
                <span>{formatMs(readyMs)}</span>
                <span style={{ color: '#9ca3af' }}>long tasks</span>
                <span style={{ color: snapshot.maxLongTaskMs >= 100 ? '#f87171' : '#fbbf24' }}>
                    {snapshot.longTasks.length} · max {formatMs(snapshot.maxLongTaskMs)} · total {formatMs(snapshot.totalLongTaskMs)}
                </span>
                {suspectedPause && (
                    <>
                        <span style={{ color: '#f87171' }}>pause?</span>
                        <span style={{ color: '#f87171' }}>
                            {formatMs(snapshot.maxLongTaskMs)} — probable debugger/tab freeze, no JS de SpacetimeDB
                            {lastPause?.detail?.visibility ? ` (visibility=${String(lastPause.detail.visibility)})` : ''}
                        </span>
                    </>
                )}
                {(hmrMessages > 0 || hmrErrors > 0) && (
                    <>
                        <span style={{ color: '#9ca3af' }}>vite hmr</span>
                        <span style={{ color: '#fbbf24' }}>
                            {hmrMessages} msgs · {(hmrBytes / 1024).toFixed(1)} KB · {hmrErrors} errores (no SDB)
                        </span>
                    </>
                )}
                <span style={{ color: '#9ca3af' }}>maps</span>
                <span>stats {Object.keys(gameStatsMap).length} · activity {Object.keys(myActivityMap).length}</span>
                {tableCounts && (
                    <>
                        <span style={{ color: '#9ca3af' }}>tables</span>
                        <span>{Object.entries(tableCounts).map(([name, count]) => `${name}:${count}`).join(' · ')}</span>
                    </>
                )}
            </div>

            <div style={{ borderTop: '1px solid rgba(34,197,94,.2)', paddingTop: '5px' }}>
                {recent.length === 0 && <div style={{ color: '#6b7280' }}>Waiting for events…</div>}
                {recent.map((entry) => (
                    <div key={entry.seq} style={{ display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#6b7280', minWidth: '52px', textAlign: 'right' }}>{formatMs(entry.t)}</span>
                        <span style={{ color: entry.event.includes('slow') || entry.event === 'longtask' || entry.event === 'page:pause' ? '#f87171' : entry.event.startsWith('warning:') ? '#fbbf24' : '#86efac' }}>
                            {entry.event}
                        </span>
                        <span style={{ color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {detailPreview(entry)}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => window.__SDB_TRACE__?.download()} style={buttonStyle}>
                    Download JSON
                </button>
                <button type="button" onClick={handleCopy} style={buttonStyle}>
                    {copied === 'ok' ? 'Copied ✓' : copied === 'error' ? 'Copy failed' : 'Copy trace'}
                </button>
                <button type="button" onClick={handleClear} style={buttonStyle}>Clear</button>
                <span style={{ marginLeft: 'auto', color: '#6b7280', alignSelf: 'center' }}>
                    __SDB_TRACE__
                </span>
            </div>
        </div>
    );
}

const buttonStyle = {
    background: '#111827',
    color: '#d1fae5',
    border: '1px solid rgba(34,197,94,.35)',
    borderRadius: '6px',
    padding: '2px 7px',
    fontFamily: 'inherit',
    fontSize: '10px',
    cursor: 'pointer',
} as const;

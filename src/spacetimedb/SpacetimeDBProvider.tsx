import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'preact/hooks';
import type { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';
import { generateSlug } from '@/utils/gameUtils';
import { trace, traceTableCounts, measureSync, countEvent } from './debug/sdbTrace';

/** Minimal interface for SpacetimeDB identity objects returned by the SDK. */
interface SdbIdentity {
    toHexString(): string;
    data?: Uint8Array;
}

export interface GameStats { gameSlug: string; totalHearts: number; totalVisits: number; }
export interface MyActivity { gameSlug: string; hasLiked: boolean; isFavorite: boolean; visitCount: number; lastVisitAt?: number; }

interface SpacetimeDBContextType {
    connection: DbConnection | null;
    identity: string | null;
    isConnected: boolean;
    error: string | null;
    gameStatsMap: Record<string, GameStats>;
    myActivityMap: Record<string, MyActivity>;
}

const SpacetimeDBContext = createContext<SpacetimeDBContextType>({
    connection: null, identity: null, isConnected: false, error: null, gameStatsMap: {}, myActivityMap: {},
});

let connInst: DbConnection | null = null;
/**
 * Generated table definitions. They are imported lazily together with the
 * SpacetimeDB SDK so the ~40 KB SDK bundle does not compete with LCP.
 */
let tablesRef: typeof import('./module_bindings').tables | null = null;
/** Timestamp (performance.now) of the last builder attempt, used by the trace. */
let connectionRequestedAt = 0;

const getHex = (id: unknown): string | null => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    const asIdentity = id as SdbIdentity;
    if (typeof asIdentity.toHexString === 'function') return asIdentity.toHexString();
    if (asIdentity.data instanceof Uint8Array) return Array.from(asIdentity.data).map((b: number) => b.toString(16).padStart(2, '0')).join('');
    if (id instanceof Uint8Array) return Array.from(id).map((b: number) => b.toString(16).padStart(2, '0')).join('');
    return null;
};

/** Access a row property by camelCase or snake_case key — needed for SDK version compatibility. */
const getP = (r: Record<string, unknown>, c: string, s: string): unknown => {
    if (!r) return undefined;
    if (typeof r[c] !== 'undefined') return r[c];
    if (typeof r[s] !== 'undefined') return r[s];
    return undefined;
};

/** Typed accessors built on top of getP. */
const getString = (r: Record<string, unknown>, c: string, s: string): string => String(getP(r, c, s) ?? '');
const getNum    = (r: Record<string, unknown>, c: string, s: string): number => Number(getP(r, c, s) ?? 0);
const getBool   = (r: Record<string, unknown>, c: string, s: string): boolean => !!getP(r, c, s);

export const SpacetimeDBProvider = ({ children }: { children: ComponentChildren }) => {
    const [identity, setIdentity] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameStatsMap, setGameStatsMap] = useState<Record<string, GameStats>>({});
    const [myActivityMap, setMyActivityMap] = useState<Record<string, MyActivity>>({});

    const syncActivity = useCallback((c: DbConnection) => {
        if (!c || !c.identity) return;
        const mid = getHex(c.identity);
        if (!mid) return;

        const result = measureSync('sync:activity', () => {
            const out: Record<string, MyActivity> = {};
            let scanned = 0;
            let matched = 0;
            for (const r of c.db.my_activity.iter()) {
                scanned += 1;
                const row = r as Record<string, unknown>;
                if (getHex(getP(row, 'playerId', 'player_id')) === mid) {
                    matched += 1;
                    const s = generateSlug(getString(row, 'gameSlug', 'game_slug'));
                    if (s) {
                        out[s] = {
                            gameSlug: s,
                            hasLiked:   getBool(row, 'hasLiked',    'has_liked'),
                            isFavorite: getBool(row, 'isFavorite',  'is_favorite'),
                            visitCount: getNum(row,  'visitCount',  'visit_count'),
                            lastVisitAt: getNum(row, 'lastVisitAt', 'last_visit_at')
                        };
                    }
                }
            }
            return { out, scanned, matched };
        }, ({ out, scanned, matched }) => ({
            rowsInCache: Number(c.db.my_activity.count()),
            scanned,
            matched,
            games: Object.keys(out).length,
        }));

        setMyActivityMap(result.out);
    }, []);

    const syncStats = useCallback((c: DbConnection) => {
        if (!c) return;
        const result = measureSync('sync:stats', () => {
            const out: Record<string, GameStats> = {};
            let scanned = 0;
            for (const r of c.db.game_stats.iter()) {
                scanned += 1;
                const row = r as Record<string, unknown>;
                const s = generateSlug(getString(row, 'gameSlug', 'game_slug'));
                if (s) {
                    out[s] = {
                        gameSlug: s,
                        totalHearts: getNum(row, 'totalHearts', 'total_hearts'),
                        totalVisits: getNum(row, 'totalVisits', 'total_visits')
                    };
                }
            }
            return { out, scanned };
        }, ({ out, scanned }) => ({
            rowsInCache: Number(c.db.game_stats.count()),
            scanned,
            games: Object.keys(out).length,
        }));

        setGameStatsMap(result.out);
    }, []);

    const statRafRef = useRef<number | null>(null);
    const activityRafRef = useRef<number | null>(null);
    // Prevents RAF updates from firing during the initial SpacetimeDB snapshot flood.
    // Set to true only inside onApplied, once the full initial state has arrived.
    const isInitialSyncDoneRef = useRef(false);

    const onStatEvt = useCallback(() => {
        countEvent('callbacks:game_stats');
        if (!isInitialSyncDoneRef.current) return; // Block RAF during initial snapshot
        if (statRafRef.current) return; // Already scheduled for this frame
        statRafRef.current = requestAnimationFrame(() => {
            statRafRef.current = null;
            if (connInst) syncStats(connInst);
        });
    }, [syncStats]);

    const onActivityEvt = useCallback(() => {
        countEvent('callbacks:my_activity');
        if (!isInitialSyncDoneRef.current) return; // Block RAF during initial snapshot
        if (activityRafRef.current) return;
        activityRafRef.current = requestAnimationFrame(() => {
            activityRafRef.current = null;
            if (connInst) syncActivity(connInst);
        });
    }, [syncActivity]);

    const isSetupRef = useRef(false);

    const setup = useCallback((c: DbConnection) => {
        const identity = c.identity;
        if (!identity) {
            trace('subscription:skipped', { reason: 'missing-identity' });
            return;
        }
        if (isSetupRef.current) return;
        if (!tablesRef) {
            trace('subscription:skipped', { reason: 'tables-not-loaded' });
            return;
        }
        isSetupRef.current = true;

        trace('subscription:listeners', {
            gameStats: ['insert', 'update'],
            myActivity: ['insert', 'update', 'delete'],
        });

        c.db.game_stats.onInsert(onStatEvt);
        c.db.game_stats.onUpdate(onStatEvt);
        c.db.my_activity.onInsert(onActivityEvt);
        c.db.my_activity.onUpdate(onActivityEvt);
        c.db.my_activity.onDelete(onActivityEvt);

        // onApplied fires once when the full initial snapshot has been processed.
        // This is the single safe moment to do the first bulk state sync,
        // replacing the blind setTimeout(500) that could race with the snapshot arrival.
        const requestedAt = performance.now();
        c.subscriptionBuilder()
            .onApplied(() => {
                trace('subscription:applied', {
                    waitedMs: Math.round((performance.now() - requestedAt) * 100) / 100,
                });
                traceTableCounts('subscription:snapshot', c.db, [
                    'firefly', 'game_stats', 'profile', 'my_activity',
                ]);
                isInitialSyncDoneRef.current = true;
                syncStats(c);
                syncActivity(c);
            })
            .onError((ctx) => {
                const error = ctx.event;
                trace('subscription:error', {
                    error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
                });
            })
            // Only subscribe to the rows this client actually consumes:
            //  - game_stats: all games (needed by the catalog)
            //  - my_activity: only this player (favorites/likes/visits)
            //  - profile: only this player (XP/level badge)
            //  - firefly: presence for other visitors (small table)
            // `profile` is keyed by identity, so this filter is index-backed.
            // `my_activity` has no index in the generated schema; if the server
            // rejects the filtered query, add an index on player_id server-side.
            .subscribe([
                tablesRef.game_stats,
                tablesRef.my_activity.where((row) => row.playerId.eq(identity)),
                tablesRef.profile.where((row) => row.id.eq(identity)),
                tablesRef.firefly,
            ]);
        trace('subscription:requested', {
            mode: 'targeted',
            identity: identity.toHexString().slice(0, 12),
            queries: [
                'game_stats',
                'my_activity WHERE player_id = identity',
                'profile WHERE id = identity',
                'firefly',
            ],
        });
    }, [onStatEvt, onActivityEvt, syncStats, syncActivity]);

    useEffect(() => {
        trace('provider:effect', {
            hasConnection: !!connInst,
            identity,
            isConnected,
            active: connInst ? connInst.isActive : null,
        });

        if (connInst) {
            if (connInst.isActive && connInst.identity) {
                const h = connInst.identity.toHexString();
                if (identity !== h) setIdentity(h);
                if (!isConnected) setIsConnected(true);
                setup(connInst);
            }
            return;
        }

        let cancelled = false;
        const initConnection = async () => {
            if (cancelled || connInst) {
                trace('conn:skipped', { cancelled, hasConnection: !!connInst });
                return;
            }

            // Lazy-load the generated bindings + SDK on idle. Keeping this out
            // of the initial bundle removes ~40 KB of JavaScript from LCP.
            let DbConnectionRuntime: typeof import('./module_bindings').DbConnection;
            try {
                const bindings = await import('./module_bindings');
                DbConnectionRuntime = bindings.DbConnection;
                tablesRef = bindings.tables;
            } catch (err) {
                trace('conn:import-error', {
                    error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
                });
                return;
            }

            if (cancelled || connInst) return;

            trace('conn:builder-start', {
                uri: SPACETIMEDB_URI,
                module: MODULE_NAME,
                hasToken: !!localStorage.getItem(AUTH_TOKEN_KEY),
            });
            connectionRequestedAt = performance.now();

            try {
                connInst = DbConnectionRuntime.builder()
                    .withUri(SPACETIMEDB_URI)
                    .withDatabaseName(MODULE_NAME)
                    .withToken(localStorage.getItem(AUTH_TOKEN_KEY) || undefined)
                    .onConnect((c: DbConnection, id: SdbIdentity, t: string) => {
                        trace('conn:connected', {
                            identity: id.toHexString().slice(0, 12),
                            msSinceBuilder: Math.round((performance.now() - connectionRequestedAt) * 100) / 100,
                        });
                        setIdentity(id.toHexString());
                        setIsConnected(true);
                        localStorage.setItem(AUTH_TOKEN_KEY, t);
                        setup(c);
                    })
                    .onConnectError((_c, err) => {
                        trace('conn:error', {
                            error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
                            msSinceBuilder: Math.round((performance.now() - connectionRequestedAt) * 100) / 100,
                        });
                        console.warn('[SpacetimeDB] Connection failed:', err);
                        // Stale or invalid auth token: clear so subsequent attempt starts clean
                        localStorage.removeItem(AUTH_TOKEN_KEY);
                        setIsConnected(false);
                    })
                    .onDisconnect(() => {
                        trace('conn:disconnect', {});
                        setIsConnected(false);
                        isSetupRef.current = false;
                    })
                    .build();

                trace('conn:build-returned', {
                    msSinceBuilder: Math.round((performance.now() - connectionRequestedAt) * 100) / 100,
                });
            } catch (err) {
                trace('conn:builder-error', {
                    error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
                });
                console.warn('[SpacetimeDB] Error during builder init:', err);
                localStorage.removeItem(AUTH_TOKEN_KEY);
            }
        };

        // Defer WebSocket connection so it does not compete with initial paint / LCP
        const idleCallback = typeof window !== 'undefined' && (window as any).requestIdleCallback;
        const cancelIdle = typeof window !== 'undefined' && (window as any).cancelIdleCallback;
        const scheduledAt = performance.now();
        const usesIdle = typeof idleCallback === 'function';
        const runInit = () => {
            trace('idle:fire', {
                api: usesIdle ? 'requestIdleCallback' : 'setTimeout',
                waitedMs: Math.round((performance.now() - scheduledAt) * 100) / 100,
            });
            initConnection();
        };

        const handle = usesIdle
            ? idleCallback(runInit, { timeout: 2000 })
            : setTimeout(runInit, 1500);
        trace('idle:requested', {
            api: usesIdle ? 'requestIdleCallback' : 'setTimeout',
            timeoutMs: usesIdle ? 2000 : 1500,
        });

        return () => {
            cancelled = true;
            trace('idle:cancelled', {
                api: usesIdle ? 'requestIdleCallback' : 'setTimeout',
                waitedMs: Math.round((performance.now() - scheduledAt) * 100) / 100,
            });
            if (typeof cancelIdle === 'function') {
                cancelIdle(handle);
            } else {
                clearTimeout(handle);
            }
        };
    }, [setup, identity, isConnected]);

    const val = useMemo(() => ({ connection: connInst, identity, isConnected, error: null, gameStatsMap, myActivityMap }), 
        [identity, isConnected, gameStatsMap, myActivityMap]);

    return <SpacetimeDBContext.Provider value={val}>{children}</SpacetimeDBContext.Provider>;
};

export const useSpacetimeDB = () => useContext(SpacetimeDBContext);

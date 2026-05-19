import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { useContext, useEffect, useState, useMemo, useCallback } from 'preact/hooks';
import { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';
import { generateSlug } from '@/utils/gameUtils';

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

        const na: Record<string, MyActivity> = {};
        for (const r of c.db.my_activity.iter()) {
            const row = r as Record<string, unknown>;
            if (getHex(getP(row, 'playerId', 'player_id')) === mid) {
                const s = generateSlug(getString(row, 'gameSlug', 'game_slug'));
                if (s) {
                    na[s] = {
                        gameSlug: s,
                        hasLiked:   getBool(row, 'hasLiked',    'has_liked'),
                        isFavorite: getBool(row, 'isFavorite',  'is_favorite'),
                        visitCount: getNum(row,  'visitCount',  'visit_count'),
                        lastVisitAt: getNum(row, 'lastVisitAt', 'last_visit_at')
                    };
                }
            }
        }
        setMyActivityMap(na);
    }, []);

    const syncStats = useCallback((c: DbConnection) => {
        if (!c) return;
        const ns: Record<string, GameStats> = {};
        for (const r of c.db.game_stats.iter()) {
            const row = r as Record<string, unknown>;
            const s = generateSlug(getString(row, 'gameSlug', 'game_slug'));
            if (s) {
                ns[s] = {
                    gameSlug: s,
                    totalHearts: getNum(row, 'totalHearts', 'total_hearts'),
                    totalVisits: getNum(row, 'totalVisits', 'total_visits')
                };
            }
        }
        setGameStatsMap(ns);
    }, []);

    const onStatEvt = useCallback(() => {
        if (connInst) syncStats(connInst);
    }, [syncStats]);

    const onActivityEvt = useCallback(() => {
        if (connInst) syncActivity(connInst);
    }, [syncActivity]);

    const setup = useCallback((c: DbConnection) => {
        c.db.game_stats.onInsert(onStatEvt);
        c.db.game_stats.onUpdate(onStatEvt);
        c.db.my_activity.onInsert(onActivityEvt);
        c.db.my_activity.onUpdate(onActivityEvt);
        c.db.my_activity.onDelete(onActivityEvt);
        
        c.subscriptionBuilder().subscribeToAllTables();
        setTimeout(() => { syncStats(c); syncActivity(c); }, 500);
    }, [onStatEvt, onActivityEvt, syncStats, syncActivity]);

    useEffect(() => {
        if (connInst) return;
        connInst = DbConnection.builder().withUri(SPACETIMEDB_URI).withDatabaseName(MODULE_NAME)
            .withToken(localStorage.getItem(AUTH_TOKEN_KEY) || undefined)
            .onConnect((c: DbConnection, id: SdbIdentity, t: string) => {
                setIdentity(id.toHexString()); setIsConnected(true);
                localStorage.setItem(AUTH_TOKEN_KEY, t); setup(c);
            }).build();
    }, [setup]);

    useEffect(() => {
        if (connInst?.isActive && connInst.identity) {
            const h = connInst.identity.toHexString();
            if (identity !== h) setIdentity(h);
            if (!isConnected) setIsConnected(true);
            setup(connInst);
        }
    }, [setup, identity, isConnected]);

    const val = useMemo(() => ({ connection: connInst, identity, isConnected, error: null, gameStatsMap, myActivityMap }), 
        [identity, isConnected, gameStatsMap, myActivityMap]);

    return <SpacetimeDBContext.Provider value={val}>{children}</SpacetimeDBContext.Provider>;
};

export const useSpacetimeDB = () => useContext(SpacetimeDBContext);

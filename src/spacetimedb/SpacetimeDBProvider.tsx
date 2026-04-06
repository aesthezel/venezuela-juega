import { createContext } from 'preact';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'preact/hooks';
import { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';
import { generateSlug } from '@/src/utils/gameUtils';

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

const getHex = (id: any): string | null => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (typeof id.toHexString === 'function') return id.toHexString();
    if (id.data && id.data instanceof Uint8Array) return Array.from(id.data).map((b: any) => b.toString(16).padStart(2, '0')).join('');
    if (id instanceof Uint8Array) return Array.from(id).map((b: any) => b.toString(16).padStart(2, '0')).join('');
    return null;
};

const getP = (r: any, c: string, s: string) => {
    if (!r) return undefined;
    if (typeof r[c] !== 'undefined') return r[c];
    if (typeof r[s] !== 'undefined') return r[s];
    return undefined;
};

export const SpacetimeDBProvider = ({ children }: { children: any }) => {
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
            if (getHex(getP(r, 'playerId', 'player_id')) === mid) {
                const s = generateSlug(getP(r, 'gameSlug', 'game_slug') || '');
                if (s) {
                    na[s] = {
                        gameSlug: s,
                        hasLiked: !!getP(r, 'hasLiked', 'has_liked'),
                        isFavorite: !!getP(r, 'isFavorite', 'is_favorite'),
                        visitCount: Number(getP(r, 'visitCount', 'visit_count') ?? 0),
                        lastVisitAt: Number(getP(r, 'lastVisitAt', 'last_visit_at') ?? 0)
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
            const s = generateSlug(getP(r, 'gameSlug', 'game_slug') || '');
            if (s) {
                ns[s] = {
                    gameSlug: s,
                    totalHearts: Number(getP(r, 'totalHearts', 'total_hearts') ?? 0),
                    totalVisits: Number(getP(r, 'totalVisits', 'total_visits') ?? 0)
                };
            }
        }
        setGameStatsMap(ns);
    }, []);

    const onStatEvt = useCallback(() => {
        if (connInst) syncStats(connInst);
    }, [syncStats]);

    const onActivityEvt = useCallback(() => {
        console.log(`[Reactivity] Activity event detected. Rescanning table...`);
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
            .onConnect((c: any, id: any, t: any) => {
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

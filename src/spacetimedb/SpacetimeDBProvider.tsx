import { createContext } from 'preact';
import { ComponentChildren } from 'preact';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'preact/hooks';
import { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';
import { generateSlug } from '@/utils/gameUtils';
import { useAuth } from '@/hooks/AuthContext';

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
    const { user, idToken, loading: authLoading } = useAuth();
    const [identity, setIdentity] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [gameStatsMap, setGameStatsMap] = useState<Record<string, GameStats>>({});
    const [myActivityMap, setMyActivityMap] = useState<Record<string, MyActivity>>({});

    // Tracks which auth identity the live connection was built for ('anon' or firebase uid),
    // so we only tear down + reconnect when the *identity* changes, not on every token refresh.
    const connectedKeyRef = useRef<string | null>(null);

    const syncActivity = useCallback((c: DbConnection) => {
        if (!c || !c.identity) return;
        const mid = getHex(c.identity);
        if (!mid) return;

        const na: Record<string, MyActivity> = {};
        for (const r of c.db.myActivity.iter()) {
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
        for (const r of c.db.gameStats.iter()) {
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
        c.db.gameStats.onInsert(onStatEvt);
        c.db.gameStats.onUpdate(onStatEvt);
        c.db.myActivity.onInsert(onActivityEvt);
        c.db.myActivity.onUpdate(onActivityEvt);
        c.db.myActivity.onDelete(onActivityEvt);
        
        c.subscriptionBuilder().subscribeToAllTables();
        setTimeout(() => { syncStats(c); syncActivity(c); }, 500);
    }, [onStatEvt, onActivityEvt, syncStats, syncActivity]);

    useEffect(() => {
        // Wait for Firebase to resolve the initial auth state before connecting.
        if (authLoading) return;

        // Logged in but the ID token hasn't resolved yet (getIdToken is async):
        // do NOT connect tokenless, or SpacetimeDB assigns a random anonymous
        // identity instead of the JWT-derived one. Wait for idToken; this effect
        // re-runs when it arrives (idToken is in the deps).
        if (user && !idToken) return;

        const desiredKey = user?.uid ?? 'anon';
        // Already connected for this identity — nothing to do (ignores ~1h token refreshes).
        if (connectedKeyRef.current === desiredKey && connInst) return;

        // Auth identity changed (login/logout/account switch): tear down the old connection.
        if (connInst) {
            try { connInst.disconnect(); } catch { /* ignore */ }
            connInst = null;
            setIsConnected(false);
            setIdentity(null);
            setGameStatsMap({});
            setMyActivityMap({});
        }

        // Logged in → use the Firebase JWT (SpacetimeDB validates it via OIDC).
        // Anonymous → reuse the cached SpacetimeDB session token.
        const token = user ? (idToken ?? undefined) : (localStorage.getItem(AUTH_TOKEN_KEY) || undefined);
        connectedKeyRef.current = desiredKey;

        connInst = DbConnection.builder().withUri(SPACETIMEDB_URI).withDatabaseName(MODULE_NAME)
            .withToken(token)
            .onConnect((c: DbConnection, id: SdbIdentity, t: string) => {
                setIdentity(id.toHexString());
                setIsConnected(true);
                // Cache the issued session token only for the anonymous flow; never overwrite
                // it with a Firebase-derived session.
                if (!user) localStorage.setItem(AUTH_TOKEN_KEY, t);
                setup(c);
            })
            .onConnectError((_ctx: unknown, err: unknown) => {
                // Surface silent connection failures (e.g. rejected JWT) instead of failing quietly.
                console.error('[SpacetimeDB] connect error', err);
            })
            .build();
    }, [user, idToken, authLoading, setup]);

    const val = useMemo(() => ({ connection: connInst, identity, isConnected, error: null, gameStatsMap, myActivityMap }), 
        [identity, isConnected, gameStatsMap, myActivityMap]);

    return <SpacetimeDBContext.Provider value={val}>{children}</SpacetimeDBContext.Provider>;
};

export const useSpacetimeDB = () => useContext(SpacetimeDBContext);

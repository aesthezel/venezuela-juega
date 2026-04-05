import { createContext } from 'preact';
import { useContext, useEffect, useState, useMemo } from 'preact/hooks';
import { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';

interface SpacetimeDBContextType {
    connection: DbConnection | null;
    identity: string | null;
    isConnected: boolean;
    error: string | null;
}

const SpacetimeDBContext = createContext<SpacetimeDBContextType>({
    connection: null,
    identity: null,
    isConnected: false,
    error: null,
});

let connectionInstance: DbConnection | null = null;

export const SpacetimeDBProvider = ({ children }: { children: any }) => {
    const [identity, setIdentity] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connection = useMemo(() => {
        if (connectionInstance) return connectionInstance;

        console.log('SpacetimeDB: Initializing connection instance...');
        connectionInstance = DbConnection.builder()
            .withUri(SPACETIMEDB_URI)
            .withDatabaseName(MODULE_NAME)
            .withToken(localStorage.getItem(AUTH_TOKEN_KEY) || undefined)
            .onDisconnect(() => {
                console.log('SpacetimeDB: disconnected');
                setIsConnected(false);
            })
            .onConnectError((err: any) => {
                console.error('SpacetimeDB: connection error', err);
                setError('Failed to connect to SpacetimeDB');
                setIsConnected(false);
            })
            .onConnect((conn: any, id: any, token: any) => {
                const idHex = id.toHexString();
                console.log('SpacetimeDB: connected with identity', idHex);
                setIdentity(idHex);
                setIsConnected(true);
                localStorage.setItem(AUTH_TOKEN_KEY, token);
                
                // Subscription is critical for real-time reactivity
                console.log('SpacetimeDB: subscribing to all tables...');
                conn.subscriptionBuilder().subscribeToAllTables();
            })
            .build();

        return connectionInstance;
    }, []);

    // Sync state if already connected (for HMR or late mounts)
    useEffect(() => {
        if (connectionInstance) {
            if (connectionInstance.isActive && connectionInstance.identity) {
                setIdentity(connectionInstance.identity.toHexString());
                setIsConnected(true);
                // Ensure subscription is active even on re-mounts/HMR
                connectionInstance.subscriptionBuilder().subscribeToAllTables();
            }
        }
    }, []);

    const value = useMemo(() => ({
        connection,
        identity,
        isConnected,
        error
    }), [connection, identity, isConnected, error]);

    return (
        <SpacetimeDBContext.Provider value={value}>
            {children}
        </SpacetimeDBContext.Provider>
    );
};

export const useSpacetimeDB = () => {
    const context = useContext(SpacetimeDBContext);
    if (!context) {
        throw new Error('useSpacetimeDB must be used within a SpacetimeDBProvider');
    }
    return context;
};

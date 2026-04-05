import { useEffect, useState, useMemo } from 'preact/hooks';
import { DbConnection, tables } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';

let connectionInstance: DbConnection | null = null;

export const useSpacetimeDB = () => {
  const [identity, setIdentity] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connection = useMemo(() => {
    if (connectionInstance) return connectionInstance;

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
        console.log('SpacetimeDB: connected with identity', id.toHexString());
        setIdentity(id.toHexString());
        setIsConnected(true);
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        conn.subscriptionBuilder().subscribeToAllTables();
      })
      .build();

    return connectionInstance;
  }, []);

  // Sync state if already connected
  useEffect(() => {
    if (connectionInstance && connectionInstance.isActive && connectionInstance.identity) {
      setIdentity(connectionInstance.identity.toHexString());
      setIsConnected(true);
    }
  }, [connection]);

  return { connection, identity, isConnected, error };
};

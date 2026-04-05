import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useSpacetimeDB } from '../spacetimedb/connection';

export const useFireflies = (currentPath: string) => {
  const { connection, identity, isConnected } = useSpacetimeDB();
  const [otherFireflies, setOtherFireflies] = useState<any[]>([]);
  const mousePos = useRef({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    mousePos.current = { x, y };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const sendUpdate = useCallback(() => {
    if (!isConnected || !connection) return;
    
    connection.reducers.updateFirefly({
      x: mousePos.current.x,
      y: mousePos.current.y,
      location: currentPath
    });
  }, [isConnected, connection, currentPath]);

  // Heartbeat every 2s for smoother presence
  useEffect(() => {
    if (!isConnected || !connection) return;

    sendUpdate();
    const interval = setInterval(sendUpdate, 2000);
    return () => clearInterval(interval);
  }, [isConnected, connection, sendUpdate]);

  useEffect(() => {
    if (isConnected && connection) {
      sendUpdate();
    }
  }, [currentPath, isConnected, connection, sendUpdate]);

  useEffect(() => {
    if (!isConnected || !connection || !identity) return;

    const updateOtherFireflies = () => {
      if (!connection || !connection.db || !connection.db.firefly) return;
      
      const allFireflies = Array.from(connection.db.firefly.iter());
      const normalize = (p: string) => p.replace(/\/$/, '') || '/';
      const normalizedPath = normalize(currentPath);

      const nearby = allFireflies.filter(f => {
        const isMatch = normalize(f.location) === normalizedPath;
        const isOther = f.playerId.toHexString() !== identity;
        return isMatch && isOther;
      });
      
      setOtherFireflies(nearby);
    };

    updateOtherFireflies();

    connection.db.firefly.onInsert(updateOtherFireflies);
    connection.db.firefly.onUpdate(updateOtherFireflies);
    connection.db.firefly.onDelete(updateOtherFireflies);

    return () => {
      connection.db.firefly.removeOnInsert(updateOtherFireflies);
      connection.db.firefly.removeOnUpdate(updateOtherFireflies);
      connection.db.firefly.removeOnDelete(updateOtherFireflies);
    };
  }, [isConnected, connection, identity, currentPath]);

  return { otherFireflies };
};

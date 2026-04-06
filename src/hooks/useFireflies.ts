import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useSpacetimeDB } from '../spacetimedb/connection';

export const useFireflies = (currentPath: string) => {
  const { connection, identity, isConnected } = useSpacetimeDB();
  const [otherFireflies, setOtherFireflies] = useState<any[]>([]);
  const mousePos = useRef({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    const x = (e.pageX / scrollWidth) * 100;
    const y = (e.pageY / scrollHeight) * 100;
    mousePos.current = { x, y };
  }, []);

  const handleTouch = useCallback((e: TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      const scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

      const x = (e.touches[0].pageX / scrollWidth) * 100;
      const y = (e.touches[0].pageY / scrollHeight) * 100;
      mousePos.current = { x, y };
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [handleMouseMove, handleTouch]);

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

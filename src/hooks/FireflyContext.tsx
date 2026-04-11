import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { useSpacetimeDB } from '../spacetimedb/connection';

interface FireflyContextValue {
  otherFireflies: any[];
  presenceBySlug: Record<string, number>;
}

const FireflyContext = createContext<FireflyContextValue>({
  otherFireflies: [],
  presenceBySlug: {},
});

interface FireflyProviderProps {
  currentPath: string;
  children: ComponentChildren;
}

/**
 * Single provider that:
 * 1. Tracks mouse/touch position and sends heartbeat (existing behavior)
 * 2. Iterates firefly table ONCE per update
 * 3. Produces otherFireflies (for overlay) AND presenceBySlug (for game cards)
 */
export const FireflyProvider = ({ currentPath, children }: FireflyProviderProps) => {
  const { connection, identity, isConnected } = useSpacetimeDB();
  const [otherFireflies, setOtherFireflies] = useState<any[]>([]);
  const [presenceBySlug, setPresenceBySlug] = useState<Record<string, number>>({});
  const mousePos = useRef({ x: 50, y: 50 });

  // --- Mouse/Touch tracking (unchanged from original useFireflies) ---

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

  // --- Heartbeat (unchanged) ---

  const sendUpdate = useCallback(() => {
    if (!isConnected || !connection) return;

    connection.reducers.updateFirefly({
      x: mousePos.current.x,
      y: mousePos.current.y,
      location: currentPath
    });
  }, [isConnected, connection, currentPath]);

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

  // --- Single iteration: compute both datasets ---

  useEffect(() => {
    if (!isConnected || !connection || !identity) return;

    const computeFireflyData = () => {
      if (!connection || !connection.db || !connection.db.firefly) return;

      const allFireflies = Array.from(connection.db.firefly.iter());
      const normalize = (p: string) => p.replace(/\/$/, '') || '/';
      const normalizedPath = normalize(currentPath);

      const nearby: any[] = [];
      const slugCounts: Record<string, number> = {};

      for (const f of allFireflies) {
        const loc = normalize(f.location);

        // 1. Overlay: same-page fireflies (excluding self)
        if (loc === normalizedPath && f.playerId.toHexString() !== identity) {
          nearby.push(f);
        }

        // 2. Presence: extract slug from /game/:slug or /games/:slug
        const match = loc.match(/^\/games?\/(.+)$/);
        if (match) {
          const slug = match[1];
          slugCounts[slug] = (slugCounts[slug] || 0) + 1;
        }
      }

      setOtherFireflies(nearby);
      setPresenceBySlug(prev => {
        // Avoid unnecessary re-renders: only update if counts changed
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(slugCounts);
        if (prevKeys.length === newKeys.length && prevKeys.every(k => prev[k] === slugCounts[k])) {
          return prev;
        }
        return slugCounts;
      });
    };

    computeFireflyData();

    connection.db.firefly.onInsert(computeFireflyData);
    connection.db.firefly.onUpdate(computeFireflyData);
    connection.db.firefly.onDelete(computeFireflyData);

    return () => {
      connection.db.firefly.removeOnInsert(computeFireflyData);
      connection.db.firefly.removeOnUpdate(computeFireflyData);
      connection.db.firefly.removeOnDelete(computeFireflyData);
    };
  }, [isConnected, connection, identity, currentPath]);

  const value = useMemo(() => ({ otherFireflies, presenceBySlug }), [otherFireflies, presenceBySlug]);

  return (
    <FireflyContext.Provider value={value}>
      {children}
    </FireflyContext.Provider>
  );
};

/**
 * Used by FireflyOverlay — returns fireflies on same page.
 */
export const useFireflyOverlay = () => {
  const { otherFireflies } = useContext(FireflyContext);
  return { otherFireflies };
};

/**
 * Used by GameCard/GameList — returns firefly count for a specific game slug.
 */
export const useFireflyPresence = (slug: string): number => {
  const { presenceBySlug } = useContext(FireflyContext);
  return presenceBySlug[slug] || 0;
};

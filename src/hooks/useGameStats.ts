import { useState, useCallback, useMemo, useEffect } from 'preact/hooks';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { generateSlug } from '@/src/utils/gameUtils';

/**
 * useGameStats - Custom hook to manage real-time game statistics (likes, visits)
 * and player-specific activity (if they liked or favorited a game).
 * 
 * Supports Optimistic UI updates to provide instant feedback.
 */
export const useGameStats = (gameSlugRaw: string) => {
    const gameSlug = useMemo(() => {
        const slug = generateSlug(gameSlugRaw);
        console.log(`[useGameStats] Hook initialized for: "${gameSlugRaw}" -> "${slug}"`);
        return slug;
    }, [gameSlugRaw]);

    const { 
        connection, 
        isConnected, 
        identity, 
        error: dbError,
        gameStatsMap,
        myActivityMap
    } = useSpacetimeDB();

    // Raw values from global state
    const serverTotalHearts = gameStatsMap[gameSlug]?.totalHearts ?? 0;
    const serverTotalVisits = gameStatsMap[gameSlug]?.totalVisits ?? 0;
    const serverHasLiked = myActivityMap[gameSlug]?.hasLiked ?? false;
    const serverIsFavorite = myActivityMap[gameSlug]?.isFavorite ?? false;

    // Local optimistic overrides
    const [optHasLiked, setOptHasLiked] = useState<boolean | null>(null);
    const [optIsFavorite, setOptIsFavorite] = useState<boolean | null>(null);

    // Sync optimistic state with server state when server state changes (granularly)
    useEffect(() => { setOptHasLiked(null); }, [serverHasLiked]);
    useEffect(() => { setOptIsFavorite(null); }, [serverIsFavorite]);

    // Effective values (optimistic > server)
    const hasLiked = optHasLiked !== null ? optHasLiked : serverHasLiked;
    const isFavorite = optIsFavorite !== null ? optIsFavorite : serverIsFavorite;
    
    // Derived total hearts: Handle case where our optimistic like isn't yet in serverTotalHearts
    const totalHearts = useMemo(() => {
        let count = serverTotalHearts;
        if (optHasLiked === true && !serverHasLiked) count += 1;
        if (optHasLiked === false && serverHasLiked) count -= 1;
        return Math.max(0, count);
    }, [serverTotalHearts, serverHasLiked, optHasLiked]);

    const totalVisits = serverTotalVisits;

    const toggleLike = useCallback(() => {
        if (isConnected && connection && identity) {
            const nextLiked = !hasLiked;
            
            // Apply optimistic update
            setOptHasLiked(nextLiked);
            
            console.log(`[useGameStats] Toggling Like for "${gameSlug}". Sending to server...`);
            connection.reducers.toggleLike({ gameSlug });
        } else if (!identity) {
            console.warn(`[useGameStats] Cannot toggle like for "${gameSlug}" without identity (Guest mode)`);
        }
    }, [isConnected, connection, identity, gameSlug, hasLiked]);

    const toggleFavorite = useCallback(() => {
        if (isConnected && connection && identity) {
            const nextFav = !isFavorite;
            setOptIsFavorite(nextFav);
            
            console.log(`[useGameStats] Toggling Favorite for "${gameSlug}". Sending to server...`);
            connection.reducers.toggleFavorite({ gameSlug });
        } else if (!identity) {
            console.warn(`[useGameStats] Cannot toggle favorite for "${gameSlug}" without identity`);
        }
    }, [isConnected, connection, identity, gameSlug, isFavorite]);

    return { 
        totalHearts, 
        totalVisits, 
        hasLiked, 
        isFavorite, 
        toggleLike, 
        toggleFavorite, 
        isConnected,
        identity,
        isReady: isConnected && !!identity,
        dbError
    };
};

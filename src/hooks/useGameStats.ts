import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';

/**
 * useGameStats - Custom hook to manage real-time game statistics (likes, visits)
 * and player-specific activity (if they liked or favorited a game).
 * 
 * Provides stable listeners to prevent memory leaks and ensures global state sync via Provider.
 */
export const useGameStats = (gameSlugRaw: string) => {
    // Slugs are lowercase and use hyphens for spaces as per user confirmation
    const gameSlug = useMemo(() => 
        gameSlugRaw.trim().toLowerCase().replace(/\s+/g, '-'), 
    [gameSlugRaw]);

    const { connection, isConnected, identity, error: dbError } = useSpacetimeDB();
    const [totalHearts, setTotalHearts] = useState<number>(0);
    const [totalVisits, setTotalVisits] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    
    // Initial data fetch and update from tables
    const updateData = useCallback(() => {
        if (!connection) return;

        // Fetch Stats
        const stats = Array.from(connection.db.game_stats.iter()).find(s => 
            (s.gameSlug || s.game_slug || '').toLowerCase() === gameSlug
        );
        if (stats) {
            setTotalHearts(Number(stats.totalHearts ?? stats.total_hearts ?? 0));
            setTotalVisits(Number(stats.totalVisits ?? stats.total_visits ?? 0));
        }

        // Fetch personal activity
        if (identity && connection.identity) {
            const myIdHex = connection.identity.toHexString();
            const activity = Array.from(connection.db.my_activity.iter()).find(a => {
                const rowSlug = (a.gameSlug || a.game_slug || '').toLowerCase();
                const rowPlayerId = a.playerId || a.player_id;
                return rowSlug === gameSlug && rowPlayerId && rowPlayerId.toHexString() === myIdHex;
            });

            if (activity) {
                setHasLiked(activity.hasLiked ?? activity.has_liked ?? false);
                setIsFavorite(activity.isFavorite ?? activity.is_favorite ?? false);
            } else {
                setHasLiked(false);
                setIsFavorite(false);
            }
        } else {
            setHasLiked(false);
            setIsFavorite(false);
        }
    }, [connection, identity, gameSlug]);

    useEffect(() => {
        if (!isConnected || !connection) return;

        updateData();

        const handleStatsChange = (newRow: any) => {
            const rowSlug = (newRow.gameSlug || newRow.game_slug || '').toLowerCase();
            if (rowSlug === gameSlug) {
                console.log(`[useGameStats] Stats update for ${gameSlug}:`, newRow);
                setTotalHearts(Number(newRow.totalHearts ?? newRow.total_hearts ?? 0));
                setTotalVisits(Number(newRow.totalVisits ?? newRow.total_visits ?? 0));
            }
        };

        const handleActivityChange = (newRow: any) => {
            const rowSlug = (newRow.gameSlug || newRow.game_slug || '').toLowerCase();
            const rowPlayerId = newRow.playerId || newRow.player_id;
            const myIdHex = connection.identity?.toHexString();
            
            if (rowSlug === gameSlug && myIdHex && rowPlayerId && rowPlayerId.toHexString() === myIdHex) {
                const newHasLiked = newRow.hasLiked ?? newRow.has_liked ?? false;
                const newIsFavorite = newRow.isFavorite ?? newRow.is_favorite ?? false;
                console.log(`[useGameStats] Activity update for ${gameSlug}: liked=${newHasLiked}, fav=${newIsFavorite}`);
                setHasLiked(newHasLiked);
                setIsFavorite(newIsFavorite);
            }
        };

        const handleActivityDelete = (row: any) => {
            const rowSlug = (row.gameSlug || row.game_slug || '').toLowerCase();
            const rowPlayerId = row.playerId || row.player_id;
            const myIdHex = connection.identity?.toHexString();
            
            if (rowSlug === gameSlug && myIdHex && rowPlayerId && rowPlayerId.toHexString() === myIdHex) {
                console.log(`[useGameStats] Activity DELETED for ${gameSlug}`);
                setHasLiked(false);
                setIsFavorite(false);
            }
        };

        // Subscription handlers
        const onSInsert = (n: any) => handleStatsChange(n);
        const onSUpdate = (_o: any, n: any) => handleStatsChange(n);
        const onAInsert = (n: any) => handleActivityChange(n);
        const onAUpdate = (_o: any, n: any) => handleActivityChange(n);
        const onADelete = (r: any) => handleActivityDelete(r);

        // Register listeners
        connection.db.game_stats.onInsert(onSInsert);
        connection.db.game_stats.onUpdate(onSUpdate);
        connection.db.my_activity.onInsert(onAInsert);
        connection.db.my_activity.onUpdate(onAUpdate);
        connection.db.my_activity.onDelete(onADelete);

        return () => {
            connection.db.game_stats.removeOnInsert(onSInsert);
            connection.db.game_stats.removeOnUpdate(onSUpdate);
            connection.db.my_activity.removeOnInsert(onAInsert);
            connection.db.my_activity.removeOnUpdate(onAUpdate);
            connection.db.my_activity.removeOnDelete(onADelete);
        };
    }, [isConnected, connection, identity, gameSlug, updateData]);

    const toggleLike = useCallback(() => {
        if (isConnected && connection && identity) {
            // Optimistic UI: toggle immediately for responsiveness
            const nextHasLiked = !hasLiked;
            setHasLiked(nextHasLiked);
            setTotalHearts(prev => nextHasLiked ? prev + 1 : Math.max(0, prev - 1));
            
            connection.reducers.toggleLike({ gameSlug });
        } else if (!identity) {
            console.warn('GameStats: Cannot toggle like without identity (Guest mode)');
        }
    }, [isConnected, connection, identity, gameSlug, hasLiked]);

    const toggleFavorite = useCallback(() => {
        if (isConnected && connection && identity) {
            setIsFavorite(prev => !prev);
            connection.reducers.toggleFavorite({ gameSlug });
        }
    }, [isConnected, connection, identity, gameSlug]);

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

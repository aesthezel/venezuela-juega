import { useEffect, useRef } from 'preact/hooks';
import { Game, JamGame, JamSettingRow } from '@/types';
import {
    readCache,
    writeCache,
    clearCache,
    JamCache,
    MAIN_CACHE_KEY,
    JAM_CACHE_KEY,
    CACHE_TTL_MS,
} from '@/services/catalogService';
import {
    gamesSignal,
    jamGamesSignal,
    jamSettingsSignal,
    catalogLoadingSignal,
    jamLoadingSignal,
    isRefreshingSignal,
    catalogErrorSignal,
    lastRefreshedSignal,
    loadCatalogGames,
    loadJamCatalogData,
    refreshAllCatalog,
} from '@/state/catalogSignals';

export {
    readCache,
    writeCache,
    clearCache,
    MAIN_CACHE_KEY,
    JAM_CACHE_KEY,
    CACHE_TTL_MS,
};
export type { JamGame, JamSettingRow, JamCache };

export interface UseGamesDataReturn {
    games: Game[];
    loading: boolean;
    error: string | null;
    jamGames: JamGame[];
    jamSettings: JamSettingRow[];
    jamLoading: boolean;
    isRefreshing: boolean;
    lastRefreshed: number | null;
    refreshData: (force?: boolean) => Promise<void>;
}

export interface UseGamesDataOptions {
    /** Whether to eager-load jam data on mount. Defaults to true for backward compatibility. */
    loadJams?: boolean;
}

export const useGamesData = (options: UseGamesDataOptions = { loadJams: true }): UseGamesDataReturn => {
    const lastFocusCheckRef = useRef(Date.now());

    useEffect(() => {
        // Initial load of main games (0ms if in cache, <50ms if cold start via snapshot)
        loadCatalogGames();

        // Optionally load jams (can be lazy-loaded on jam routes)
        if (options.loadJams) {
            loadJamCatalogData();
        }

        // Global debug helper in console
        if (typeof window !== 'undefined') {
            (window as any).__refreshVenezuelaJuega = (force = true) => refreshAllCatalog(force);
        }
    }, [options.loadJams]);

    // Tab Focus & Visibility Revalidation:
    // Only revalidate if user returns after at least 15 minutes away (eliminates aggressive 60s thrashing)
    useEffect(() => {
        const handleVisibilityOrFocus = () => {
            if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
                return;
            }
            const now = Date.now();
            const timeSinceLast = now - lastFocusCheckRef.current;
            if (timeSinceLast > 15 * 60 * 1000 && !isRefreshingSignal.value) {
                lastFocusCheckRef.current = now;
                refreshAllCatalog(false);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityOrFocus);
        window.addEventListener('focus', handleVisibilityOrFocus);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
            window.removeEventListener('focus', handleVisibilityOrFocus);
        };
    }, []);

    return {
        games: gamesSignal.value,
        loading: catalogLoadingSignal.value,
        error: catalogErrorSignal.value,
        jamGames: jamGamesSignal.value,
        jamSettings: jamSettingsSignal.value,
        jamLoading: jamLoadingSignal.value,
        isRefreshing: isRefreshingSignal.value,
        lastRefreshed: lastRefreshedSignal.value,
        refreshData: (force?: boolean) => refreshAllCatalog(force),
    };
};

import { signal, computed } from '@preact/signals';
import { Game, JamGame, JamSettingRow } from '@/types';
import {
    getCatalogGames,
    getJamCatalogData,
    revalidateCatalogGames,
    revalidateJamData,
    clearCache
} from '@/services/catalogService';

// ─── Reactive Signals ────────────────────────────────────────────────────────

export const gamesSignal = signal<Game[]>([]);
export const jamGamesSignal = signal<JamGame[]>([]);
export const jamSettingsSignal = signal<JamSettingRow[]>([]);

export const catalogLoadingSignal = signal<boolean>(true);
export const jamLoadingSignal = signal<boolean>(false);
export const isRefreshingSignal = signal<boolean>(false);
export const catalogErrorSignal = signal<string | null>(null);

export const lastRefreshedSignal = signal<number | null>(null);

/** Computed combination of catalog games and jam games */
export const allGamesSignal = computed<Game[]>(() => [
    ...gamesSignal.value,
    ...jamGamesSignal.value,
]);

// ─── Actions ─────────────────────────────────────────────────────────────────

let initialGamesPromise: Promise<Game[]> | null = null;
let initialJamPromise: Promise<{ jamGames: JamGame[]; jamSettings: JamSettingRow[] }> | null = null;

/**
 * Loads main games catalog (Cold start <100ms via static snapshot or 0ms from localStorage)
 */
export async function loadCatalogGames(force = false): Promise<Game[]> {
    if (initialGamesPromise && !force) return initialGamesPromise;

    catalogLoadingSignal.value = gamesSignal.value.length === 0;

    initialGamesPromise = getCatalogGames((freshGames) => {
        if (freshGames && freshGames.length > 0) {
            gamesSignal.value = freshGames;
            catalogLoadingSignal.value = false;
            catalogErrorSignal.value = null;
            lastRefreshedSignal.value = Date.now();
        }
    }).then((games) => {
        if (games && games.length > 0) {
            gamesSignal.value = games;
            catalogErrorSignal.value = null;
        }
        catalogLoadingSignal.value = false;
        return games;
    }).catch((err) => {
        catalogErrorSignal.value = 'Ha habido un error al cargar la lista de juegos';
        catalogLoadingSignal.value = false;
        console.error('[catalogSignals] Error loading games:', err);
        return [];
    });

    return initialGamesPromise;
}

/**
 * Lazy loads Game Jams catalog only when requested (e.g. on /jams or when slug not found)
 */
export async function loadJamCatalogData(force = false): Promise<{ jamGames: JamGame[]; jamSettings: JamSettingRow[] }> {
    if (initialJamPromise && !force) return initialJamPromise;

    jamLoadingSignal.value = jamGamesSignal.value.length === 0;

    initialJamPromise = getJamCatalogData((freshData) => {
        if (freshData) {
            jamGamesSignal.value = freshData.jamGames || [];
            jamSettingsSignal.value = freshData.jamSettings || [];
            jamLoadingSignal.value = false;
        }
    }).then((data) => {
        if (data) {
            jamGamesSignal.value = data.jamGames || [];
            jamSettingsSignal.value = data.jamSettings || [];
        }
        jamLoadingSignal.value = false;
        return data;
    }).catch((err) => {
        jamLoadingSignal.value = false;
        console.error('[catalogSignals] Error loading jams:', err);
        return { jamGames: [], jamSettings: [] };
    });

    return initialJamPromise;
}

/**
 * Manual or periodic refresh
 */
export async function refreshAllCatalog(force = false): Promise<void> {
    isRefreshingSignal.value = true;
    if (force) {
        clearCache();
        initialGamesPromise = null;
        initialJamPromise = null;
    }

    try {
        const promises: Promise<any>[] = [revalidateCatalogGames()];
        // If jam data was already requested/loaded, also revalidate jams
        if (jamGamesSignal.value.length > 0 || jamSettingsSignal.value.length > 0) {
            promises.push(revalidateJamData());
        }

        const [freshGames, freshJams] = await Promise.all(promises);
        if (freshGames && freshGames.length > 0) {
            gamesSignal.value = freshGames;
            catalogErrorSignal.value = null;
        }
        if (freshJams) {
            jamGamesSignal.value = freshJams.jamGames || [];
            jamSettingsSignal.value = freshJams.jamSettings || [];
        }
        lastRefreshedSignal.value = Date.now();
    } catch (err) {
        console.error('[catalogSignals] Error refreshing catalog:', err);
    } finally {
        isRefreshingSignal.value = false;
    }
}

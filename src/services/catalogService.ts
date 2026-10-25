import { Game, JamGame, JamSettingRow } from '@/types';
import { parseMainRows, parseJamGamesRows, parseJamSettingsRows } from '@/shared/catalogParser';

// ─── Cache Configuration ──────────────────────────────────────────────────────

/** Fresh TTL: 1 hour (GitHub Pages CDN cache + periodic revalidation) */
export const CACHE_TTL_MS = 60 * 60 * 1000;

export const MAIN_CACHE_KEY = 'vj_snapshot_games_v2';
export const JAM_CACHE_KEY = 'vj_snapshot_jams_v2';

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const GAMES_SNAPSHOT_URL = `${BASE_PATH}/data/games.json`;
export const JAMS_SNAPSHOT_URL = `${BASE_PATH}/data/jams.json`;


export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    version: string;
}

export type JamCache = {
    jamGames: JamGame[];
    jamSettings: JamSettingRow[];
};

const memoryStorageMap = new Map<string, string>();
const memoryStorageObj = {
    getItem: (k: string) => memoryStorageMap.get(k) || null,
    setItem: (k: string, v: string) => memoryStorageMap.set(k, v),
    removeItem: (k: string) => { memoryStorageMap.delete(k); },
    clear: () => memoryStorageMap.clear(),
    get length() { return memoryStorageMap.size; },
    key: (i: number) => Array.from(memoryStorageMap.keys())[i] || null,
};

function getStorage(): Storage | typeof memoryStorageObj {
    try {
        if (typeof localStorage !== 'undefined') {
            const testKey = '__vj_storage_test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return localStorage;
        }
    } catch {}

    try {
        if (typeof sessionStorage !== 'undefined') {
            return sessionStorage;
        }
    } catch {}

    return memoryStorageObj;
}

export function readCache<T>(key: string, version: string): { data: T; isStale: boolean; timestamp: number } | null {
    try {
        const storage = getStorage();
        const raw = storage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (entry.version !== version) return null; // Version/sheet mismatch -> discard
        const isStale = Date.now() - entry.timestamp > CACHE_TTL_MS;
        return { data: entry.data, isStale, timestamp: entry.timestamp };
    } catch {
        return null;
    }
}

export function writeCache<T>(key: string, version: string, data: T): void {
    try {
        const storage = getStorage();
        const entry: CacheEntry<T> = { data, timestamp: Date.now(), version };
        storage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.warn('[catalogService] Storage full or inaccessible:', e);
    }
}

export function clearCache(key?: string): void {
    try {
        const storage = getStorage();
        if (key) {
            storage.removeItem(key);
        } else {
            const keysToRemove: string[] = [];
            for (let i = 0; i < storage.length; i++) {
                const k = storage.key(i);
                if (k && (k.startsWith('vj_') || k.startsWith('vj_cache_'))) {
                    keysToRemove.push(k);
                }
            }
            keysToRemove.forEach(k => storage.removeItem(k));
        }
    } catch {}
}


// ─── Revalidation & Edge Fallbacks ───────────────────────────────────────────

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;

const JAM_SPREADSHEET_ID = import.meta.env.VITE_GAMEJAMSHEET_ID;
const JAM_GAMES_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_GAMES;
const JAM_SETTINGS_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_SETTINGS;

let mainRevalidatingPromise: Promise<Game[]> | null = null;
let jamRevalidatingPromise: Promise<JamCache> | null = null;

/**
 * Revalidates games from the Edge Worker or falls back to Google Sheets CSV with lazy PapaParse.
 */
export async function revalidateCatalogGames(): Promise<Game[]> {
    if (mainRevalidatingPromise) return mainRevalidatingPromise;

    mainRevalidatingPromise = (async () => {
        try {
            // 1. First attempt: Revalidate from GitHub Pages CDN static snapshot (TTFB < 30ms, 0 429 errors)
            try {
                const snapRes = await fetch(`${GAMES_SNAPSHOT_URL}?_t=${Date.now()}`);
                if (snapRes.ok) {
                    const freshGames: Game[] = await snapRes.json();
                    if (Array.isArray(freshGames) && freshGames.length > 0) {
                        writeCache(MAIN_CACHE_KEY, SPREADSHEET_ID || 'v2', freshGames);
                        return freshGames;
                    }
                }
            } catch {
                // Static snapshot fetch failed; fall through to Google Sheets fallback
            }

            // 2. Direct fallback to Google Sheets CSV with 5-minute bucketed cache-buster
            if (!SPREADSHEET_ID || !SHEET_NAME) {
                return [];
            }

            const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
            const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}&_cb=${bucket}`;

            // Lazy dynamic import of PapaParse - not included in initial bundle!
            const papaModule = await import('papaparse');
            const Papa = papaModule.default || papaModule;

            return await new Promise<Game[]>((resolve) => {
                Papa.parse(url, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsed = parseMainRows(results.data as string[][]);
                        if (parsed.length > 0) {
                            writeCache(MAIN_CACHE_KEY, SPREADSHEET_ID, parsed);
                        }
                        resolve(parsed);
                    },
                    error: () => resolve([]),
                });
            });
        } finally {
            mainRevalidatingPromise = null;
        }
    })();

    return mainRevalidatingPromise;
}

/**
 * Revalidates Game Jams data from GitHub Pages CDN snapshot or falls back to Google Sheets CSV.
 */
export async function revalidateJamData(): Promise<JamCache> {
    if (jamRevalidatingPromise) return jamRevalidatingPromise;

    jamRevalidatingPromise = (async () => {
        try {
            // 1. First attempt: Revalidate from GitHub Pages CDN static snapshot (TTFB < 30ms)
            try {
                const snapRes = await fetch(`${JAMS_SNAPSHOT_URL}?_t=${Date.now()}`);
                if (snapRes.ok) {
                    const freshData = await snapRes.json();
                    if (freshData && Array.isArray(freshData.jamGames)) {
                        const payload: JamCache = {
                            jamGames: freshData.jamGames || [],
                            jamSettings: freshData.jamSettings || [],
                        };
                        writeCache(JAM_CACHE_KEY, JAM_SPREADSHEET_ID || 'v2', payload);
                        return payload;
                    }
                }
            } catch {
                // Snapshot fetch failed; fallback to Google Sheets
            }

            if (!JAM_SPREADSHEET_ID || !JAM_GAMES_SHEET || !JAM_SETTINGS_SHEET) {
                return { jamGames: [], jamSettings: [] };
            }

            const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
            const gamesUrl = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(JAM_GAMES_SHEET)}&_cb=${bucket}`;
            const settingsUrl = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(JAM_SETTINGS_SHEET)}&_cb=${bucket}`;

            const papaModule = await import('papaparse');
            const Papa = papaModule.default || papaModule;

            const [loadedJamGames, loadedSettings] = await Promise.all([
                new Promise<JamGame[]>((resolve) => {
                    Papa.parse(gamesUrl, {
                        download: true,
                        header: false,
                        skipEmptyLines: true,
                        complete: (results) => resolve(parseJamGamesRows(results.data as string[][])),
                        error: () => resolve([]),
                    });
                }),
                new Promise<JamSettingRow[]>((resolve) => {
                    Papa.parse(settingsUrl, {
                        download: true,
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => resolve(parseJamSettingsRows(results.data as Record<string, string>[])),
                        error: () => resolve([]),
                    });
                }),
            ]);

            const payload: JamCache = { jamGames: loadedJamGames, jamSettings: loadedSettings };
            if (loadedJamGames.length > 0 || loadedSettings.length > 0) {
                writeCache(JAM_CACHE_KEY, JAM_SPREADSHEET_ID, payload);
            }
            return payload;

        } finally {
            jamRevalidatingPromise = null;
        }
    })();

    return jamRevalidatingPromise;
}

// ─── Public API: Instant Cold-Start + SWR ─────────────────────────────────────

/**
 * Returns games catalog instantaneously:
 * 1. From persistent local storage cache (~0ms)
 * 2. Or from pre-compiled snapshot `/data/games.json` (<50ms, no PapaParse)
 * 3. Triggers background revalidation if data is stale or snapshot was used.
 */
export async function getCatalogGames(
    onBackgroundUpdate?: (freshGames: Game[]) => void
): Promise<Game[]> {
    const version = SPREADSHEET_ID || 'v2';
    const cached = readCache<Game[]>(MAIN_CACHE_KEY, version);

    if (cached && cached.data.length > 0) {
        if (cached.isStale && onBackgroundUpdate) {
            revalidateCatalogGames().then(onBackgroundUpdate).catch(console.error);
        }
        return cached.data;
    }

    // Cold start: Load static JSON snapshot generated during build
    try {
        const res = await fetch(GAMES_SNAPSHOT_URL);
        if (res.ok) {
            const initialGames: Game[] = await res.json();
            if (Array.isArray(initialGames) && initialGames.length > 0) {
                writeCache(MAIN_CACHE_KEY, version, initialGames);
                // Cold-start loads fresh build-time snapshot; avoid immediate PapaParse / Google Sheets download
                return initialGames;
            }
        }
    } catch (e) {
        console.warn('[catalogService] Fallback to live revalidation:', e);
    }

    // Direct fetch fallback if static snapshot is missing
    return revalidateCatalogGames();
}

/**
 * Returns Game Jams data instantaneously (Snapshot + SWR).
 */
export async function getJamCatalogData(
    onBackgroundUpdate?: (freshData: JamCache) => void
): Promise<JamCache> {
    const version = JAM_SPREADSHEET_ID || 'v2';
    const cached = readCache<JamCache>(JAM_CACHE_KEY, version);

    if (cached && (cached.data.jamGames?.length > 0 || cached.data.jamSettings?.length > 0)) {
        if (cached.isStale && onBackgroundUpdate) {
            revalidateJamData().then(onBackgroundUpdate).catch(console.error);
        }
        return cached.data;
    }

    // Cold start: Load static JSON snapshot generated during build
    try {
        const res = await fetch(JAMS_SNAPSHOT_URL);
        if (res.ok) {
            const initialJamData = await res.json();
            const payload: JamCache = {
                jamGames: initialJamData.jamGames || [],
                jamSettings: initialJamData.jamSettings || [],
            };
            if (payload.jamGames.length > 0 || payload.jamSettings.length > 0) {
                writeCache(JAM_CACHE_KEY, version, payload);
                // Cold-start loads fresh build-time snapshot; avoid immediate PapaParse / Google Sheets download
                return payload;
            }
        }
    } catch (e) {
        console.warn('[catalogService] Fallback to live jam revalidation:', e);
    }

    return revalidateJamData();
}

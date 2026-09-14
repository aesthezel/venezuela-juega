import { useState, useEffect, useRef } from 'preact/hooks';
import Papa from 'papaparse';
import { Game } from '@/types';
import { 
    generateSlug, 
    ensureUniqueSlug, 
    parseStringToArray, 
    mapStatus, 
    mapOrigin,
    ensureHttps
} from '@/utils';

export interface JamGame extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}

export interface JamSettingRow {
    Organization: string;
    Venue: string;
    Venue_City: string;
    Venue_Logo_URL?: string;
    Venue_Logo?: string;
    Venue_Socials?: string;
    Order_Priority: string;
    UID: string;
}

// ─── Cache Layer ─────────────────────────────────────────────────────────────

/** Default fresh TTL: 3 minutes (reduced from 30 min to keep data timely) */
const CACHE_TTL_MS = 3 * 60 * 1000;

interface CacheEntry<T> {
    data: T;
    /** Unix timestamp (ms) when this entry was written */
    timestamp: number;
    /** spreadsheetId — auto-invalidates if config changes */
    version: string;
}

export function readCache<T>(key: string, version: string): { data: T; isStale: boolean; timestamp: number } | null {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (entry.version !== version) return null; // config changed → discard
        const isStale = Date.now() - entry.timestamp > CACHE_TTL_MS;
        return { data: entry.data, isStale, timestamp: entry.timestamp };
    } catch {
        return null;
    }
}

export function writeCache<T>(key: string, version: string, data: T): void {
    try {
        const entry: CacheEntry<T> = { data, timestamp: Date.now(), version };
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
        // sessionStorage full or unavailable — silently continue
    }
}

export function clearCache(key?: string): void {
    try {
        if (key) {
            sessionStorage.removeItem(key);
        } else {
            const keysToRemove: string[] = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const k = sessionStorage.key(i);
                if (k && k.startsWith('vj_')) {
                    keysToRemove.push(k);
                }
            }
            keysToRemove.forEach(k => sessionStorage.removeItem(k));
        }
    } catch {
        // sessionStorage unavailable
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

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

export const useGamesData = (): UseGamesDataReturn => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [jamGames, setJamGames] = useState<JamGame[]>([]);
    const [jamSettings, setJamSettings] = useState<JamSettingRow[]>([]);
    const [jamLoading, setJamLoading] = useState(true);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);

    const gamesRevalidating = useRef(false);
    const jamRevalidating = useRef(false);
    const lastFetchTimeRef = useRef(0);

    const parseScreenshots = (value?: string): string[] => {
        if (!value) return [];
        const trimmed = value.trim();
        if (!trimmed) return [];
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return parsed
                        .filter((v) => typeof v === 'string')
                        .map((v) => v.trim())
                        .filter(Boolean);
                }
            } catch {
                // Fallback to comma separated
            }
        }
        return parseStringToArray(value).map((v) => v.trim()).filter(Boolean);
    };

    const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
    const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;
    const MAIN_CACHE_KEY = `vj_games_${SPREADSHEET_ID}`;

    const JAM_SPREADSHEET_ID = import.meta.env.VITE_GAMEJAMSHEET_ID;
    const JAM_GAMES_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_GAMES;
    const JAM_SETTINGS_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_SETTINGS;
    const JAM_CACHE_KEY = `vj_jam_${JAM_SPREADSHEET_ID}`;

    type JamCache = { jamGames: JamGame[]; jamSettings: JamSettingRow[] };

    const CORRECT_HEADERS = [
        'Título del videojuego', 'Plataforma(s)', 'Género(s)', 'Desarrollador(es)',
        'Distribuidor', 'Fecha de lanzamiento', 'Última actualización', 'Estado actual',
        'Tiendas', 'Enlace(s)', 'Presskit', 'Pitch', 'Financiamiento', 'Motor',
        'Origen inicial', 'Idioma(s) disponible(s)', 'Destacado', 'Descripción del Destacado', 'steam_appid',
        'google_appid', 'Enlace directo', 'Steam', 'GOG', 'Itch', 'Nintendo Shop',
        'PlayStation Store', 'Microsoft Store', 'Play Store', 'App Store', 'Meta',
        'Tienda externa', 'Hero', 'Portada', 'Mini Image', 'Trailer', 'Screenshots', 'Descripción'
    ];

    const REQUIRED_COLUMNS = [
        'Título del videojuego', 'Descripción', 'Estado actual', 'Plataforma(s)'
    ];

    const storeColumns = [
        'Steam', 'Itch', 'Nintendo Shop', 'PlayStation Store',
        'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'GOG', 'Tienda externa'
    ];

    const parseMainRows = (data: string[][]): Game[] => {
        const headerIndex = data.findIndex(row => row[0] === 'Título del videojuego');
        if (headerIndex === -1) {
            setError('Error: No se encontró la fila de encabezado "Título del videojuego" en el CSV.');
            setLoading(false);
            return [];
        }

        const headerRow = data[headerIndex];
        const missingCols = REQUIRED_COLUMNS.filter(col => !headerRow.includes(col));
        if (missingCols.length > 0) {
            console.warn(`[useGamesData] Columnas requeridas faltantes: ${missingCols.join(', ')}`);
        }

        const gameRows = data.slice(headerIndex + 1);
        const existingSlugs = new Set<string>();

        return gameRows.map((row: string[]): Game | null => {
            const rowObject = CORRECT_HEADERS.reduce((obj, header, i) => {
                if (header && i < row.length) obj[header] = row[i];
                return obj;
            }, {} as { [key: string]: string });

            const title = rowObject['Título del videojuego'];
            if (!title) return null;

            const baseSlug = generateSlug(title);
            const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

            const stores = storeColumns
                .map(storeName => ({ name: storeName, url: rowObject[storeName]?.trim() }))
                .filter(store => store.url);

            const links = Object.keys(rowObject)
                .filter(key => key.startsWith('Link') && key.endsWith('Name'))
                .map(nameKey => {
                    const urlKey = nameKey.replace('Name', 'URL');
                    const name = rowObject[nameKey]?.trim();
                    const url = rowObject[urlKey]?.trim();
                    return (name && url) ? { name, url } : null;
                })
                .filter((link): link is { name: string; url: string } => link !== null);

            return {
                id: existingSlugs.size + 1,
                slug: uniqueSlug,
                title,
                platform: parseStringToArray(rowObject['Plataforma(s)']),
                genre: parseStringToArray(rowObject['Género(s)']),
                developers: parseStringToArray(rowObject['Desarrollador(es)']),
                publishers: parseStringToArray(rowObject['Distribuidor']),
                releaseDate: rowObject['Fecha de lanzamiento'] || 'No especificada',
                lastUpdateDate: rowObject['Última actualización'] || undefined,
                status: mapStatus(rowObject['Estado actual']),
                stores,
                links,
                pressKitUrl: rowObject['Presskit'] || undefined,
                pitch: rowObject['Pitch'] || '',
                funding: rowObject['Financiamiento'] || undefined,
                engine: rowObject['Motor'] || 'No especificado',
                languages: parseStringToArray(rowObject['Idioma(s) disponible(s)']),
                imageUrl: ensureHttps(rowObject['Mini Image']) || '',
                imageCover: ensureHttps(rowObject['Portada']) || '',
                imageHero: ensureHttps(rowObject['Hero']) || '',
                trailerUrl: ensureHttps(rowObject['Trailer']?.trim()) || undefined,
                description: rowObject['Descripción'] || '',
                isHighlighted: rowObject['Destacado']?.toUpperCase() === 'TRUE',
                highlightReason: rowObject['Descripción del Destacado'] || '',
                screenshots: parseScreenshots(rowObject['Screenshots']).map(s => ensureHttps(s) || ''),
                origin: mapOrigin(rowObject['Origen inicial']),
            };
        }).filter((game): game is Game => game !== null);
    };

    const fetchMainGames = (force = false): Promise<Game[]> => {
        if (gamesRevalidating.current) {
            return Promise.resolve(games);
        }
        gamesRevalidating.current = true;

        const timestamp = Date.now();
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&_cb=${timestamp}`;

        return new Promise<Game[]>((resolve) => {
            Papa.parse(url, {
                download: true,
                header: false,
                skipEmptyLines: true,
                complete: (results) => {
                    gamesRevalidating.current = false;
                    const parsed = parseMainRows(results.data as string[][]);
                    if (parsed.length > 0) {
                        writeCache(MAIN_CACHE_KEY, SPREADSHEET_ID, parsed);
                        setGames(parsed);
                        setError(null);
                    }
                    setLoading(false);
                    resolve(parsed);
                },
                error: (err) => {
                    gamesRevalidating.current = false;
                    setError('Ha habido un error al cargar la lista de juegos');
                    console.error('[useGamesData] Error al obtener spreadsheet:', err);
                    setLoading(false);
                    resolve([]);
                }
            });
        });
    };

    const JAM_REQUIRED_COLUMNS = [
        'Título del videojuego', 'Estado actual', 'Plataforma(s)',
    ];

    const fetchJamData = (force = false): Promise<JamCache> => {
        if (jamRevalidating.current) {
            return Promise.resolve({ jamGames, jamSettings });
        }
        jamRevalidating.current = true;

        const timestamp = Date.now();
        const gamesUrl = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_GAMES_SHEET}&_cb=${timestamp}`;
        const settingsUrl = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_SETTINGS_SHEET}&_cb=${timestamp}`;

        return Promise.all([
            new Promise<JamGame[]>((resolve) => {
                Papa.parse(gamesUrl, {
                    download: true,
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const data = results.data as string[][];
                        const headerIndex = data.findIndex(row =>
                            row.includes('Título del videojuego') && row.includes('Jam_Org_UID')
                        );
                        if (headerIndex === -1) {
                            console.warn('[useGamesData/jams] No se encontró la fila de encabezado jam.');
                            resolve([]);
                            return;
                        }

                        const headerRow = [...data[headerIndex]];
                        const uidIdx = headerRow.indexOf('Jam_Org_UID');
                        if (uidIdx !== -1) {
                            const positionalFallbacks: Record<number, string> = {
                                [uidIdx + 1]: 'Jam_Edition',
                                [uidIdx + 2]: 'Fecha de lanzamiento',
                                [uidIdx + 3]: 'Última actualización',
                            };
                            for (const [idx, name] of Object.entries(positionalFallbacks)) {
                                const i = Number(idx);
                                if (i < headerRow.length && !headerRow[i]) {
                                    headerRow[i] = name;
                                }
                            }
                        }

                        const colIndex: Record<string, number> = {};
                        headerRow.forEach((name, i) => { if (name) colIndex[name] = i; });

                        const missingCols = JAM_REQUIRED_COLUMNS.filter(col => !(col in colIndex));
                        if (missingCols.length > 0) {
                            console.warn(`[useGamesData/jams] Columnas requeridas faltantes: ${missingCols.join(', ')}`);
                        }

                        const col = (name: string, row: string[]): string =>
                            colIndex[name] !== undefined ? (row[colIndex[name]] ?? '') : '';

                        const existingSlugs = new Set<string>();
                        const gameRows = data.slice(headerIndex + 1);

                        const parsedJamGames = gameRows.map((row, index): JamGame | null => {
                            const title = col('Título del videojuego', row);
                            if (!title.trim()) return null;

                            const baseSlug = generateSlug(title);
                            const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                            return {
                                id: index + 1,
                                slug: uniqueSlug,
                                title,
                                platform: parseStringToArray(col('Plataforma(s)', row)),
                                genre: parseStringToArray(col('Género(s)', row)),
                                developers: parseStringToArray(col('Desarrollador(es)', row)),
                                publishers: parseStringToArray(col('Distribuidor', row)),
                                releaseDate: col('Fecha de lanzamiento', row) || 'No especificada',
                                lastUpdateDate: col('Última actualización', row) || undefined,
                                status: mapStatus(col('Estado actual', row)),
                                stores: storeColumns
                                    .map(name => ({ name, url: col(name, row).trim() }))
                                    .filter(s => s.url),
                                links: [],
                                pressKitUrl: col('Presskit', row) || undefined,
                                pitch: col('Pitch', row) || '',
                                funding: col('Financiamiento', row) || undefined,
                                engine: col('Motor', row) || 'No especificado',
                                languages: parseStringToArray(col('Idioma(s) disponible(s)', row)),
                                imageUrl: ensureHttps(col('Mini Image', row)) || '',
                                imageCover: ensureHttps(col('Portada', row)) || '',
                                imageHero: ensureHttps(col('Hero', row)) || '',
                                trailerUrl: ensureHttps(col('Trailer', row).trim()) || undefined,
                                description: col('Descripción', row) || '',
                                isHighlighted: col('Destacado', row).toUpperCase() === 'TRUE',
                                highlightReason: col('Descripción del Destacado', row) || '',
                                screenshots: parseScreenshots(col('Screenshots', row)).map(s => ensureHttps(s) || ''),
                                origin: mapOrigin(col('Origen inicial', row)),
                                Jam_Org_UID: col('Jam_Org_UID', row).trim() || undefined,
                                Jam_Edition: col('Jam_Edition', row).trim() || undefined,
                            };
                        }).filter((game): game is JamGame => game !== null);
                        resolve(parsedJamGames);
                    },
                    error: () => resolve([])
                });
            }),
            new Promise<JamSettingRow[]>((resolve) => {
                Papa.parse(settingsUrl, {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const data = results.data as Record<string, string>[];
                        const settings: JamSettingRow[] = data
                            .filter(row => row['Organization'] && row['Venue'] && row['UID'])
                            .map(row => ({
                                Organization: row['Organization']?.trim() || '',
                                Venue: row['Venue']?.trim() || '',
                                Venue_City: row['Venue_City']?.trim() || '',
                                Venue_Logo_URL: ensureHttps(row['Venue_Logo_URL']?.trim()) || undefined,
                                Venue_Logo: ensureHttps(row['Venue_Logo']?.trim()) || undefined,
                                Venue_Socials: row['Venue_Socials']?.trim() || undefined,
                                Order_Priority: row['Order_Priority']?.trim() || '0',
                                UID: row['UID']?.trim() || '',
                            }));
                        resolve(settings);
                    },
                    error: () => resolve([])
                });
            })
        ]).then(([loadedJamGames, loadedSettings]) => {
            jamRevalidating.current = false;
            const jamCacheData: JamCache = {
                jamGames: loadedJamGames,
                jamSettings: loadedSettings,
            };
            if (loadedJamGames.length > 0 || loadedSettings.length > 0) {
                writeCache<JamCache>(JAM_CACHE_KEY, JAM_SPREADSHEET_ID, jamCacheData);
                setJamGames(loadedJamGames);
                setJamSettings(loadedSettings);
            }
            setJamLoading(false);
            return jamCacheData;
        }).catch(() => {
            jamRevalidating.current = false;
            setJamLoading(false);
            return { jamGames: [], jamSettings: [] };
        });
    };

    const refreshData = async (force = false): Promise<void> => {
        setIsRefreshing(true);
        if (force) {
            clearCache();
        }

        try {
            await Promise.all([fetchMainGames(force), fetchJamData(force)]);
            const now = Date.now();
            lastFetchTimeRef.current = now;
            setLastRefreshed(now);
        } catch (err) {
            console.error('[useGamesData] Error al refrescar datos:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Initial Load: Stale-While-Revalidate
    useEffect(() => {
        const cachedMain = readCache<Game[]>(MAIN_CACHE_KEY, SPREADSHEET_ID);
        const cachedJam = readCache<JamCache>(JAM_CACHE_KEY, JAM_SPREADSHEET_ID);

        let needFetchMain = !cachedMain;
        let needFetchJam = !cachedJam;

        if (cachedMain) {
            setGames(cachedMain.data);
            setLoading(false);
            if (cachedMain.isStale) needFetchMain = true;
        }

        if (cachedJam) {
            setJamGames(cachedJam.data.jamGames);
            setJamSettings(cachedJam.data.jamSettings);
            setJamLoading(false);
            if (cachedJam.isStale) needFetchJam = true;
        }

        if (needFetchMain || needFetchJam) {
            const promises: Promise<any>[] = [];
            if (needFetchMain) promises.push(fetchMainGames());
            if (needFetchJam) promises.push(fetchJamData());

            setIsRefreshing(true);
            Promise.all(promises).then(() => {
                const now = Date.now();
                lastFetchTimeRef.current = now;
                setLastRefreshed(now);
            }).finally(() => {
                setIsRefreshing(false);
            });
        } else {
            const now = Date.now();
            lastFetchTimeRef.current = now;
            setLastRefreshed(now);
        }

        // Global debug hook for quick manual reload in console
        if (typeof window !== 'undefined') {
            (window as any).__refreshVenezuelaJuega = (force = true) => refreshData(force);
        }
    }, [SPREADSHEET_ID, JAM_SPREADSHEET_ID]);

    // Tab Focus & Visibility Revalidation:
    // If the user returns to the tab after leaving, silently check for updates if >60s elapsed
    useEffect(() => {
        const handleVisibilityOrFocus = () => {
            if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
                return;
            }
            const timeSinceLast = Date.now() - lastFetchTimeRef.current;
            // If more than 60 seconds have passed, revalidate in background
            if (timeSinceLast > 60 * 1000 && !isRefreshing) {
                refreshData(false);
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityOrFocus);
        window.addEventListener('focus', handleVisibilityOrFocus);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
            window.removeEventListener('focus', handleVisibilityOrFocus);
        };
    }, [isRefreshing]);

    return {
        games,
        loading,
        error,
        jamGames,
        jamSettings,
        jamLoading,
        isRefreshing,
        lastRefreshed,
        refreshData,
    };
};


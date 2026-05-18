import { useState, useEffect, useRef } from 'preact/hooks';
import Papa from 'papaparse';
import { Game } from '@/src/types';
import { 
    generateSlug, 
    ensureUniqueSlug, 
    parseStringToArray, 
    mapStatus, 
    mapOrigin,
    ensureHttps
} from '@/src/utils';

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

/** Default TTL: 30 minutes */
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CacheEntry<T> {
    data: T;
    /** Unix timestamp (ms) when this entry was written */
    timestamp: number;
    /** spreadsheetId — auto-invalidates if config changes */
    version: string;
}

function readCache<T>(key: string, version: string): { data: T; isStale: boolean } | null {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry<T> = JSON.parse(raw);
        if (entry.version !== version) return null; // config changed → discard
        const isStale = Date.now() - entry.timestamp > CACHE_TTL_MS;
        return { data: entry.data, isStale };
    } catch {
        return null;
    }
}

function writeCache<T>(key: string, version: string, data: T): void {
    try {
        const entry: CacheEntry<T> = { data, timestamp: Date.now(), version };
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
        // sessionStorage full or unavailable — silently continue
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGamesData = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [jamGames, setJamGames] = useState<JamGame[]>([]);
    const [jamSettings, setJamSettings] = useState<JamSettingRow[]>([]);
    const [jamLoading, setJamLoading] = useState(true);

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

    // ── Main Games Fetch ─────────────────────────────────────────────────────

    const gamesRevalidating = useRef(false);

    useEffect(() => {
        const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
        const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;
        const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
        const CACHE_KEY = `vj_games_${SPREADSHEET_ID}`;

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

        const parseRows = (data: string[][]): Game[] => {
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
            const storeColumns = [
                'Steam', 'Itch', 'Nintendo Shop', 'PlayStation Store',
                'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'GOG', 'Tienda externa'
            ];

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

        const doFetch = () => {
            if (gamesRevalidating.current) return;
            gamesRevalidating.current = true;

            Papa.parse(SPREADSHEET_URL, {
                download: true,
                header: false,
                skipEmptyLines: true,
                complete: (results) => {
                    gamesRevalidating.current = false;
                    const parsed = parseRows(results.data as string[][]);
                    if (parsed.length > 0) {
                        writeCache(CACHE_KEY, SPREADSHEET_ID, parsed);
                        setGames(parsed);
                    }
                    setLoading(false);
                },
                error: (err) => {
                    gamesRevalidating.current = false;
                    setError('Ha habido un error al cargar la lista de juegos');
                    console.error(err);
                    setLoading(false);
                }
            });
        };

        // Stale-while-revalidate: serve cache immediately, refresh in background if stale
        const cached = readCache<Game[]>(CACHE_KEY, SPREADSHEET_ID);
        if (cached) {
            setGames(cached.data);
            setLoading(false);
            if (cached.isStale) doFetch();
        } else {
            doFetch();
        }
    }, []);

    // ── Game Jams Fetch ──────────────────────────────────────────────────────

    useEffect(() => {
        const JAM_SPREADSHEET_ID = import.meta.env.VITE_GAMEJAMSHEET_ID;
        const JAM_GAMES_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_GAMES;
        const JAM_SETTINGS_SHEET = import.meta.env.VITE_GAMEJAMSHEET_NAME_SETTINGS;

        const JAM_GAMES_URL = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_GAMES_SHEET}`;
        const JAM_SETTINGS_URL = `https://docs.google.com/spreadsheets/d/${JAM_SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${JAM_SETTINGS_SHEET}`;

        const JAM_GAME_HEADERS = [
            'Título del videojuego', 'Plataforma(s)', 'Género(s)', 'Desarrollador(es)', 'Distribuidor',
            'Jam_Org_UID', 'Jam_Edition', 'Fecha de lanzamiento', 'Última actualización', 'Estado actual',
            'Tiendas', 'Enlace(s)', 'Presskit', 'Pitch', 'Financiamiento', 'Motor',
            'Origen inicial', 'Idioma(s) disponible(s)', 'Destacado', 'Descripción del Destacado',
            'steam_appid', 'google_appid', 'Enlace directo', 'Steam', 'GOG', 'Itch', 'Nintendo Shop',
            'PlayStation Store', 'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'Tienda externa',
            'Hero', 'Portada', 'Mini Image', 'Trailer', 'Screenshots', 'Descripción', 'UID'
        ];

        const JAM_CACHE_KEY = `vj_jam_${JAM_SPREADSHEET_ID}`;
        type JamCache = { jamGames: JamGame[]; jamSettings: JamSettingRow[] };

        const storeColumns = [
            'Steam', 'Itch', 'Nintendo Shop', 'PlayStation Store',
            'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'GOG', 'Tienda externa'
        ];

        const doJamFetch = () => {
            Promise.all([
                new Promise<JamGame[]>((resolve) => {
                    Papa.parse(JAM_GAMES_URL, {
                        download: true,
                        header: false,
                        skipEmptyLines: true,
                        complete: (results) => {
                            const data = results.data as string[][];
                            const headerIndex = data.findIndex(row => row[0] === 'Título del videojuego' && row[5] === 'Jam_Org_UID');
                            if (headerIndex === -1) { resolve([]); return; }

                            const gameRows = data.slice(headerIndex + 1);
                            const existingSlugs = new Set<string>();

                            const parsedJamGames = gameRows.map((row: string[], index): JamGame | null => {
                                const rowObject = JAM_GAME_HEADERS.reduce((obj, header, i) => {
                                    if (header && i < row.length) obj[header] = row[i];
                                    return obj;
                                }, {} as { [key: string]: string });

                                const title = rowObject['Título del videojuego'];
                                if (!title || !title.trim()) return null;

                                const baseSlug = generateSlug(title);
                                const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

                                return {
                                    id: index + 1,
                                    slug: uniqueSlug,
                                    title,
                                    platform: parseStringToArray(rowObject['Plataforma(s)']),
                                    genre: parseStringToArray(rowObject['Género(s)']),
                                    developers: parseStringToArray(rowObject['Desarrollador(es)']),
                                    publishers: parseStringToArray(rowObject['Distribuidor']),
                                    releaseDate: rowObject['Fecha de lanzamiento'] || 'No especificada',
                                    lastUpdateDate: rowObject['Última actualización'] || undefined,
                                    status: mapStatus(rowObject['Estado actual']),
                                    stores: storeColumns.map(name => ({ name, url: rowObject[name]?.trim() })).filter(s => s.url),
                                    links: [],
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
                                    Jam_Org_UID: rowObject['Jam_Org_UID']?.trim() || undefined,
                                    Jam_Edition: rowObject['Jam_Edition']?.trim() || undefined,
                                };
                            }).filter((game): game is JamGame => game !== null);
                            resolve(parsedJamGames);
                        },
                        error: () => resolve([])
                    });
                }),
                new Promise<JamSettingRow[]>((resolve) => {
                    Papa.parse(JAM_SETTINGS_URL, {
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
                writeCache<JamCache>(JAM_CACHE_KEY, JAM_SPREADSHEET_ID, {
                    jamGames: loadedJamGames,
                    jamSettings: loadedSettings,
                });
                setJamGames(loadedJamGames);
                setJamSettings(loadedSettings);
                setJamLoading(false);
            });
        };

        // Stale-while-revalidate for jam data
        const cachedJam = readCache<JamCache>(JAM_CACHE_KEY, JAM_SPREADSHEET_ID);
        if (cachedJam) {
            setJamGames(cachedJam.data.jamGames);
            setJamSettings(cachedJam.data.jamSettings);
            setJamLoading(false);
            if (cachedJam.isStale) doJamFetch();
        } else {
            doJamFetch();
        }
    }, []);

    return {
        games,
        loading,
        error,
        jamGames,
        jamSettings,
        jamLoading
    };
};

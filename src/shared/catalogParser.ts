import { Game, GameStatus, GameOrigin } from '../types';
import { generateSlug, ensureUniqueSlug, mapStatus, mapOrigin } from '../utils/gameUtils';
import { parseStringToArray, ensureHttps } from '../utils/stringUtils';

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

export const CORRECT_HEADERS = [
    'Título del videojuego', 'Plataforma(s)', 'Género(s)', 'Desarrollador(es)',
    'Distribuidor', 'Fecha de lanzamiento', 'Última actualización', 'Estado actual',
    'Tiendas', 'Enlace(s)', 'Presskit', 'Pitch', 'Financiamiento', 'Motor',
    'Origen inicial', 'Idioma(s) disponible(s)', 'Destacado', 'Descripción del Destacado', 'steam_appid',
    'google_appid', 'Enlace directo', 'Steam', 'GOG', 'Itch', 'Nintendo Shop',
    'PlayStation Store', 'Microsoft Store', 'Play Store', 'App Store', 'Meta',
    'Tienda externa', 'Hero', 'Portada', 'Mini Image', 'Trailer', 'Screenshots', 'Descripción'
];

export const REQUIRED_COLUMNS = [
    'Título del videojuego', 'Descripción', 'Estado actual', 'Plataforma(s)'
];

export const STORE_COLUMNS = [
    'Steam', 'Itch', 'Nintendo Shop', 'PlayStation Store',
    'Microsoft Store', 'Play Store', 'App Store', 'Meta', 'GOG', 'Tienda externa'
];

export const JAM_REQUIRED_COLUMNS = [
    'Título del videojuego', 'Estado actual', 'Plataforma(s)'
];

export const parseScreenshots = (value?: string): string[] => {
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

/**
 * Normalizes 2D CSV array from the main games Google Sheet into structured Game[] objects.
 */
export function parseMainRows(data: string[][]): Game[] {
    if (!Array.isArray(data) || data.length === 0) return [];

    const headerIndex = data.findIndex(row => row && row[0] === 'Título del videojuego');
    if (headerIndex === -1) {
        console.warn('[catalogParser] No se encontró la fila de encabezado "Título del videojuego" en el CSV.');
        return [];
    }

    const headerRow = data[headerIndex];
    const missingCols = REQUIRED_COLUMNS.filter(col => !headerRow.includes(col));
    if (missingCols.length > 0) {
        console.warn(`[catalogParser] Columnas requeridas faltantes: ${missingCols.join(', ')}`);
    }

    const gameRows = data.slice(headerIndex + 1);
    const existingSlugs = new Set<string>();

    return gameRows.map((row: string[]): Game | null => {
        if (!row || row.length === 0) return null;

        const rowObject = CORRECT_HEADERS.reduce((obj, header, i) => {
            if (header && i < row.length) obj[header] = row[i];
            return obj;
        }, {} as Record<string, string>);

        const title = rowObject['Título del videojuego']?.trim();
        if (!title) return null;

        const baseSlug = generateSlug(title);
        const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);

        const stores = STORE_COLUMNS
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
}

/**
 * Normalizes 2D CSV array from the Game Jams Google Sheet into structured JamGame[] objects.
 */
export function parseJamGamesRows(data: string[][]): JamGame[] {
    if (!Array.isArray(data) || data.length === 0) return [];

    const headerIndex = data.findIndex(row =>
        row && row.includes('Título del videojuego') && row.includes('Jam_Org_UID')
    );
    if (headerIndex === -1) {
        console.warn('[catalogParser/jams] No se encontró la fila de encabezado jam.');
        return [];
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

    // Find unnamed incremental ID column or explicit ID column
    const findIdColumn = (): number => {
        const namedIdx = headerRow.findIndex(name => String(name).trim().toLowerCase() === 'id');
        if (namedIdx !== -1) return namedIdx;
        const bodyRows = data.slice(headerIndex + 1);
        for (let i = headerRow.length - 1; i >= 0; i--) {
            if (String(headerRow[i] ?? '').trim()) continue;
            const sample = bodyRows.find(row => String(row[i] ?? '').trim());
            if (sample && /^\d+$/.test(String(sample[i]).trim())) return i;
        }
        return -1;
    };
    const idIndex = findIdColumn();

    const missingCols = JAM_REQUIRED_COLUMNS.filter(col => !(col in colIndex));
    if (missingCols.length > 0) {
        console.warn(`[catalogParser/jams] Columnas requeridas faltantes: ${missingCols.join(', ')}`);
    }

    const col = (name: string, row: string[]): string =>
        colIndex[name] !== undefined ? (row[colIndex[name]] ?? '') : '';

    const existingSlugs = new Set<string>();
    const gameRows = data.slice(headerIndex + 1);

    return gameRows.map((row, index): JamGame | null => {
        if (!row || row.length === 0) return null;

        const title = col('Título del videojuego', row);
        if (!title.trim()) return null;

        const baseSlug = generateSlug(title);
        const uniqueSlug = ensureUniqueSlug(baseSlug, existingSlugs);
        const explicitId = idIndex !== -1 ? Number(String(row[idIndex] ?? '').trim()) : NaN;

        return {
            id: Number.isInteger(explicitId) && explicitId > 0 ? explicitId : index + 1,
            slug: uniqueSlug,
            title,
            platform: parseStringToArray(col('Plataforma(s)', row)),
            genre: parseStringToArray(col('Género(s)', row)),
            developers: parseStringToArray(col('Desarrollador(es)', row)),
            publishers: parseStringToArray(col('Distribuidor', row)),
            releaseDate: col('Fecha de lanzamiento', row) || 'No especificada',
            lastUpdateDate: col('Última actualización', row) || undefined,
            status: mapStatus(col('Estado actual', row)),
            stores: STORE_COLUMNS
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
}

/**
 * Normalizes array of row objects from the JamSettings Google Sheet into JamSettingRow[]
 */
export function parseJamSettingsRows(data: Record<string, string>[]): JamSettingRow[] {
    if (!Array.isArray(data)) return [];

    return data
        .filter(row => row && row['Organization'] && row['Venue'] && row['UID'])
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
}

export {
    generateSlug,
    ensureUniqueSlug,
    mapStatus,
    mapOrigin,
    parseStringToArray,
    ensureHttps,
};

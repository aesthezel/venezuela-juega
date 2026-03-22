import { GameStatus, GameOrigin } from '@/src/types';

export const mapStatus = (statusStr: string | undefined): GameStatus => {
    const statusMap: { [key: string]: GameStatus } = {
        'publicado': GameStatus.RELEASED,
        'en desarrollo': GameStatus.IN_DEVELOPMENT,
        'pausado': GameStatus.ON_HOLD,
        'cancelado': GameStatus.CANCELED,
        'lost media': GameStatus.LOST_MEDIA,
        'acceso anticipado': GameStatus.EARLY_ACCESS,
        'descontinuado': GameStatus.CANCELED,
        'desconocido': GameStatus.UNKNOWN,
        'prototipo': GameStatus.PROTOTYPE,
        'publicado (demo)': GameStatus.RELEASED_DEMO,
        'recuperado': GameStatus.RECOVERED,
    };
    return statusMap[statusStr?.toLowerCase() || ''] || GameStatus.IN_DEVELOPMENT;
};

export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[áàâäã]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòôöõ]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const ensureUniqueSlug = (baseSlug: string, existingSlugs: Set<string>): string => {
    let slug = baseSlug;
    let counter = 1;
    
    while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    existingSlugs.add(slug);
    return slug;
};

/**
 * Maps a raw origin string from the spreadsheet to the GameOrigin enum
 * @param rawOrigin - The origin string from the spreadsheet
 * @returns The corresponding GameOrigin enum value or undefined if not found
 */
export const mapOrigin = (rawOrigin?: string): GameOrigin | undefined => {
    if (!rawOrigin) return undefined;
    
    const normalizedOrigin = rawOrigin.trim();
    
    // Map the string values to enum values
    switch (normalizedOrigin) {
        case 'Desde casa':
            return GameOrigin.FROM_HOME;
        case 'Gamejam':
            return GameOrigin.GAME_JAM;
        case 'Proyecto de grado':
            return GameOrigin.DEGREE_PROJECT;
        case 'Contratación':
            return GameOrigin.CONTRACT;
        case 'Modding':
            return GameOrigin.MODDING;
        case 'GameJam+ 25/26':
            return GameOrigin.GAME_JAM_PLUS_25_26;
        default:
            console.warn(`Unknown origin: ${normalizedOrigin}`);
            return undefined;
    }
};

export type TrailerInfo = { type: 'youtube'; id: string } | { type: 'video'; url: string } | null;

/**
 * Extracts trailer info, detecting if it's a direct HTML video or a YouTube URL.
 * @param url - The Trailer URL
 * @returns The TrailerInfo object or null if not found
 */
export const getTrailerInfo = (url?: string): TrailerInfo => {
    if (!url) return null;
    
    // Si contiene extensión de vídeo o es de steam, usamos la etiqueta <video>
    if (url.includes('.mp4') || url.includes('.webm') || url.includes('steamstatic.com')) {
        return { type: 'video', url };
    }

    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (match && match[1]) {
        return { type: 'youtube', id: match[1] };
    }

    return null;
};
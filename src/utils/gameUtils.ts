import { GameStatus } from '@/src/types';

/**
 * Maps a string status to the corresponding GameStatus enum value.
 * 
 * This function is used to convert status strings from the data source
 * into the standardized GameStatus enum values used in the application.
 * 
 * @param statusStr - The status string to map
 * @returns The corresponding GameStatus enum value
 * 
 * @example
 * ```ts
 * // Returns GameStatus.RELEASED
 * mapStatus("publicado");
 * 
 * // Returns GameStatus.IN_DEVELOPMENT
 * mapStatus("en desarrollo");
 * 
 * // Returns GameStatus.IN_DEVELOPMENT (default)
 * mapStatus(undefined);
 * ```
 */
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

/**
 * Generates a URL-friendly slug from a title.
 * 
 * This function converts a title into a slug by:
 * - Converting to lowercase
 * - Replacing accented characters with their non-accented equivalents
 * - Removing special characters
 * - Replacing spaces with hyphens
 * - Removing duplicate hyphens
 * - Trimming hyphens from the beginning and end
 * 
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 * 
 * @example
 * ```ts
 * // Returns "super-juego-venezolano"
 * generateSlug("Super Juego Venezolano");
 * 
 * // Returns "juego-con-caracteres-especiales"
 * generateSlug("Juego con Caracteres Especiales!");
 * 
 * // Returns "juego-con-acentos"
 * generateSlug("Juego con Acentos áéíóú");
 * ```
 */
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

/**
 * Ensures a slug is unique by appending a number if necessary.
 * 
 * This function checks if a slug already exists in a set of existing slugs.
 * If it does, it appends a number to make it unique.
 * 
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - A set of existing slugs to check against
 * @returns A unique slug
 * 
 * @example
 * ```ts
 * const existingSlugs = new Set(['game-1', 'game-2']);
 * 
 * // Returns "new-game"
 * ensureUniqueSlug("new-game", existingSlugs);
 * 
 * // Returns "game-1-1"
 * ensureUniqueSlug("game-1", existingSlugs);
 * ```
 */
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
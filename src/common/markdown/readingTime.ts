/**
 * Lectura / estimación de tiempo de lectura para contenido markdown.
 */

/** Cuenta palabras ignorando el marcado markdown más común. */
export function countWords(text: string): number {
    if (!text) return 0;
    const plain = text
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/[#>*_`~]/g, ' ')
        .trim();
    if (!plain) return 0;
    return plain.split(/\s+/).filter(Boolean).length;
}

/**
 * Estima los minutos de lectura (~200 palabras por minuto).
 * Devuelve 0 para contenido vacío.
 */
export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
    const words = countWords(text);
    if (words === 0) return 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

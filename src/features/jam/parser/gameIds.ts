/**
 * Utilidades para interpretar la lista de IDs de juegos declarada en el
 * frontmatter (`games:`) o en un bloque `:::games` del contenido de una jam.
 *
 * Acepta IDs sueltos, listas en YAML, strings separados por comas/espacios y
 * rangos inclusivos, por ejemplo:
 *
 * ```yaml
 * games: [90, 91, 92]
 * games: 90, 91, 92
 * games:
 *   - 90-101
 *   - 75
 * ```
 */
export function parseGameIds(value: unknown): number[] {
    const chunks: string[] = [];

    if (Array.isArray(value)) {
        for (const item of value) {
            chunks.push(String(item));
        }
    } else if (typeof value === 'number') {
        chunks.push(String(value));
    } else if (typeof value === 'string') {
        chunks.push(value);
    }

    const ids: number[] = [];
    const seen = new Set<number>();

    const push = (id: number) => {
        if (!Number.isInteger(id) || id <= 0 || seen.has(id)) return;
        seen.add(id);
        ids.push(id);
    };

    for (const chunk of chunks) {
        const tokens = chunk.split(/[,;\s]+/).filter(Boolean);

        for (const token of tokens) {
            const rangeMatch = token.match(/^#?(\d+)\s*[-–]\s*#?(\d+)$/);
            if (rangeMatch) {
                const a = Number(rangeMatch[1]);
                const b = Number(rangeMatch[2]);
                const from = Math.min(a, b);
                const to = Math.max(a, b);
                for (let id = from; id <= to; id++) push(id);
                continue;
            }

            push(Number(token.replace(/^#/, '')));
        }
    }

    return ids;
}

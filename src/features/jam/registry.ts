import type { JamEvent } from './types';
import { parseJamContent } from './parser';

// ─── Auto-discovery of Jam Content via Vite Glob ──────────────────────────────

const mdModules = import.meta.glob('./content/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

const jsonModules = import.meta.glob('./content/*.json', {
    eager: true,
    import: 'default',
}) as Record<string, any>;

function loadJamsFromContent(): JamEvent[] {
    const jams: JamEvent[] = [];

    // Process Markdown files
    for (const [path, rawContent] of Object.entries(mdModules)) {
        try {
            // Extract filename without path and extension as fallback slug
            const filename = path.split('/').pop()?.replace(/\.md$/, '') || '';
            const jam = parseJamContent(rawContent, filename);
            jams.push(jam);
        } catch (err) {
            console.error(`[Jam CMS] Error parsing markdown jam at ${path}:`, err);
        }
    }

    // Process JSON files
    for (const [path, content] of Object.entries(jsonModules)) {
        try {
            const filename = path.split('/').pop()?.replace(/\.json$/, '') || '';
            if (typeof content === 'string') {
                jams.push(parseJamContent(content, filename));
            } else if (typeof content === 'object' && content !== null) {
                jams.push(parseJamContent(JSON.stringify(content), filename));
            }
        } catch (err) {
            console.error(`[Jam CMS] Error parsing JSON jam at ${path}:`, err);
        }
    }

    // Sort jams: active/open/upcoming first, then ended/draft, sorted by date
    const statusPriority: Record<string, number> = {
        active: 1,
        open: 2,
        upcoming: 3,
        voting: 4,
        ended: 5,
        draft: 6,
    };

    jams.sort((a, b) => {
        const priorityA = statusPriority[a.status] ?? 99;
        const priorityB = statusPriority[b.status] ?? 99;
        if (priorityA !== priorityB) return priorityA - priorityB;

        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
    });

    return jams;
}

const registry: JamEvent[] = loadJamsFromContent();

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Devuelve todas las jams visibles (excepto borradores draft) */
export function getActiveJams(): JamEvent[] {
    return registry.filter((j) => j.status !== 'draft');
}

/** Devuelve la edición más reciente de un slug dado */
export function getLatestEdition(jamName: string): JamEvent | undefined {
    const editions = registry.filter((j) => j.slug === jamName);
    if (!editions.length) return undefined;
    return editions[editions.length - 1];
}

/** Devuelve una jam por slug + edición opcional */
export function getJamBySlug(jamName: string, edition?: string): JamEvent | undefined {
    if (edition) {
        return registry.find((j) => j.slug === jamName && j.edition === edition);
    }
    return getLatestEdition(jamName);
}

/** Todas las jams del registry */
export function getAllJams(): JamEvent[] {
    return registry;
}

export { registry as JamRegistry };

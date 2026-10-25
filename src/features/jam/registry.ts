import type { JamEvent } from './types';
import { parseJamContent } from './parser';
import { parseDate } from '@/common/markdown';
import manifestData from './content/manifest.json';

// ─── Lazy Markdown Loaders (Code-Splitting body content out of Home bundle) ───

const mdLoaders = import.meta.glob('./content/*.md', {
    query: '?raw',
    import: 'default',
}) as Record<string, () => Promise<string>>;

const jsonLoaders = import.meta.glob(['./content/*.json', '!./content/manifest.json'], {
    import: 'default',
}) as Record<string, () => Promise<any>>;

function initBaseJams(): JamEvent[] {
    const jams: JamEvent[] = manifestData.map((item: any) => ({
        slug: item.slug,
        edition: item.edition || 'i',
        name: item.name || 'Game Jam',
        shortName: item.shortName || item.name,
        tagline: item.tagline || '',
        status: (item.status as any) || 'draft',
        startDate: parseDate(item.startDate),
        endDate: parseDate(item.endDate),
        submissionUrl: item.submissionUrl || null,
        registrationUrl: item.registrationUrl || undefined,
        registrationLabel: item.registrationLabel || undefined,
        registrationOpenDate: item.registrationOpenDate ? parseDate(item.registrationOpenDate) : undefined,
        registrationCloseDate: item.registrationCloseDate ? parseDate(item.registrationCloseDate) : undefined,
        platform: item.platform || 'itch.io',
        heroGradient: item.heroGradient,
        heroImage: item.heroImage,
        accentColor: item.accentColor,
        accentTextColor: item.accentTextColor,
        logo: item.logo,
        objectives: [],
        prizes: [],
        isCharity: Boolean(item.isCharity),
        donationUrl: item.donationUrl,
        donationGoal: item.donationGoal,
        phases: [],
        faqs: [],
        sponsors: [],
        jamUid: item.jamUid,
        gamesTitle: item.gamesTitle,
        gamesSubtitle: item.gamesSubtitle,
        stats: item.stats,
        layout: item.layout || ['hero', 'games', 'about', 'schedule', 'faq'],
        customSections: {},
        attendanceMode: item.attendanceMode,
        locationVenue: item.locationVenue,
        locationAddress: item.locationAddress,
        locationCity: item.locationCity,
        locationState: item.locationState,
        locationCountry: item.locationCountry,
        onlineUrl: item.onlineUrl,
        organizerName: item.organizerName,
    }));

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

const registry: JamEvent[] = initBaseJams();
const fullContentCache = new Map<string, JamEvent>();

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

/** Devuelve una jam por slug + edición opcional (sincrónico, con metadata completa) */
export function getJamBySlug(jamName: string, edition?: string): JamEvent | undefined {
    const cacheKey = `${jamName}__${edition || 'latest'}`;
    if (fullContentCache.has(cacheKey)) {
        return fullContentCache.get(cacheKey);
    }

    if (edition) {
        return registry.find((j) => j.slug === jamName && j.edition === edition);
    }
    return getLatestEdition(jamName);
}

/** Todas las jams del registry */
export function getAllJams(): JamEvent[] {
    return registry;
}

/**
 * Carga bajo demanda el contenido Markdown completo para la vista de detalle
 */
export async function loadJamFullContent(jamName: string, edition?: string): Promise<JamEvent | undefined> {
    const cacheKey = `${jamName}__${edition || 'latest'}`;
    if (fullContentCache.has(cacheKey)) {
        return fullContentCache.get(cacheKey);
    }

    const base = getJamBySlug(jamName, edition);
    if (!base) return undefined;

    // Look for matching loader in mdLoaders
    for (const [filePath, loader] of Object.entries(mdLoaders)) {
        const filename = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
        // Check if filename matches or slug matches
        if (filename === base.slug || filename === jamName) {
            try {
                const rawContent = await loader();
                const parsed = parseJamContent(rawContent, filename);
                fullContentCache.set(cacheKey, parsed);
                return parsed;
            } catch (err) {
                console.error(`[Jam CMS] Error loading full content for ${filePath}:`, err);
            }
        }
    }

    // Try matching by reading raw files if slug differs from filename
    for (const [filePath, loader] of Object.entries(mdLoaders)) {
        try {
            const rawContent = await loader();
            const filename = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
            const parsed = parseJamContent(rawContent, filename);
            if (parsed.slug === base.slug && (!edition || parsed.edition === edition)) {
                fullContentCache.set(cacheKey, parsed);
                return parsed;
            }
        } catch {}
    }

    return base;
}

export { registry as JamRegistry };

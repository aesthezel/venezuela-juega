import type {
    DocArticle,
    DocCallout,
    DocCalloutKind,
    DocCategory,
    DocSection,
    DocSource,
    DocStatus,
} from '../types';
import { getDocCategoryMeta } from '../categories';
import {
    extractDirectiveBlocks,
    extractFrontmatter,
    extractToc,
    estimateReadingTime,
    parseDate,
    toStringArray,
} from '@/common/markdown';

/** Orden de secciones por defecto del renderizador de artículos. */
export const DEFAULT_DOC_LAYOUT = ['hero', 'meta', 'body', 'toc', 'sources', 'related'];

const CALLOUT_KINDS: Record<string, DocCalloutKind> = {
    info: 'info',
    note: 'note',
    tip: 'tip',
    warning: 'warning',
    danger: 'danger',
    error: 'danger',
    success: 'success',
};

const VALID_STATUS: DocStatus[] = ['draft', 'published', 'archived'];

/** Maps a `:::` directive type to a callout kind (null when it is not a callout). */
export function getCalloutKind(type: string): DocCalloutKind | null {
    return CALLOUT_KINDS[type] ?? null;
}

function normalizeStatus(value: unknown): DocStatus {
    return VALID_STATUS.includes(value as DocStatus) ? (value as DocStatus) : 'draft';
}

function parseSourceLine(rawLine: string): DocSource | null {
    const line = rawLine.trim().replace(/^[-*]\s*/, '');
    if (!line) return null;

    // Markdown link: [label](url)
    const link = line.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (link) return { label: link[1].trim(), url: link[2].trim() };

    // Pipe shorthand: label | url
    const pipe = line.match(/^(.+?)\s*\|\s*(\S+)$/);
    if (pipe && /^https?:\/\//i.test(pipe[2])) {
        return { label: pipe[1].trim(), url: pipe[2].trim() };
    }

    // Plain URL (with optional label before it)
    const urlMatch = line.match(/https?:\/\/\S+/);
    if (urlMatch) {
        const url = urlMatch[0].replace(/[),.;]+$/, '');
        const label = line.replace(urlMatch[0], '').replace(/[-–—:]\s*$/, '').trim();
        return { label: label || url, url };
    }

    return null;
}

/** Parses a `:::sources` directive block into a list of external references. */
export function parseSources(content: string): DocSource[] {
    const sources: DocSource[] = [];
    for (const rawLine of content.split(/\r?\n/)) {
        const source = parseSourceLine(rawLine);
        if (source) sources.push(source);
    }
    return sources;
}

function parseFrontmatterSources(value: unknown): DocSource[] {
    if (!Array.isArray(value)) return [];
    const sources: DocSource[] = [];
    for (const item of value) {
        if (typeof item === 'string') {
            const source = parseSourceLine(item);
            if (source) sources.push(source);
        } else if (item && typeof item === 'object' && item.url) {
            sources.push({ label: item.label || String(item.url), url: String(item.url) });
        }
    }
    return sources;
}

function dedupeSources(sources: DocSource[]): DocSource[] {
    const seen = new Set<string>();
    return sources.filter((s) => {
        if (seen.has(s.url)) return false;
        seen.add(s.url);
        return true;
    });
}

/**
 * Parses raw markdown content into a `DocArticle`.
 *
 * Reutiliza la librería común `@/common/markdown` para frontmatter,
 * directivas, TOC y tiempo de lectura.
 */
export function parseDocContent(rawContent: string, defaultSlug?: string): DocArticle {
    const { attributes, body } = extractFrontmatter(rawContent);

    const slug = String(attributes.slug || defaultSlug || 'documento');
    const title = String(attributes.title || 'Documento sin título');
    const description = String(attributes.description || attributes.subtitle || title);
    const category = (attributes.category as DocCategory) || 'community';
    const meta = getDocCategoryMeta(category);
    const status = normalizeStatus(attributes.status);

    const directiveBlocks = extractDirectiveBlocks(body);

    const callouts: DocCallout[] = [];
    const customSections: Record<string, DocSection> = {};
    const sources: DocSource[] = parseFrontmatterSources(attributes.sources);

    for (const block of directiveBlocks) {
        const calloutKind = CALLOUT_KINDS[block.type];

        if (calloutKind) {
            callouts.push({
                id: block.params.id || `callout-${callouts.length + 1}`,
                kind: calloutKind,
                title: block.params.title,
                content: block.content,
                index: callouts.length,
            });
            continue;
        }

        if (block.type === 'sources' || block.type === 'references' || block.type === 'fuentes') {
            sources.push(...parseSources(block.content));
            continue;
        }

        if (['custom', 'markdown', 'section', 'embed'].includes(block.type)) {
            const sectionId = block.params.id || `custom-${Object.keys(customSections).length + 1}`;
            customSections[sectionId] = {
                id: sectionId,
                type: block.type === 'embed' ? 'embed' : 'markdown',
                title: block.params.title,
                subtitle: block.params.subtitle,
                badge: block.params.badge,
                content: block.content,
                embedUrl: block.params.url || block.params.embedUrl,
                theme: (block.params.theme as DocSection['theme']) || 'base-100',
            };
        }
    }

    const layout = Array.isArray(attributes.layout) && attributes.layout.length > 0
        ? attributes.layout.map(String)
        : DEFAULT_DOC_LAYOUT;

    return {
        slug,
        title,
        subtitle: attributes.subtitle ? String(attributes.subtitle) : undefined,
        description,
        category,
        tags: toStringArray(attributes.tags),
        status,
        author: attributes.author ? String(attributes.author) : undefined,
        authorUrl: attributes.authorUrl ? String(attributes.authorUrl) : undefined,
        publishedDate: parseDate(attributes.publishedDate ?? attributes.date),
        updatedDate: attributes.updatedDate ? parseDate(attributes.updatedDate) : undefined,
        readingTime: estimateReadingTime(body),
        coverImage: attributes.coverImage ? String(attributes.coverImage) : undefined,
        accentColor: attributes.accentColor ? String(attributes.accentColor) : meta.color,
        icon: attributes.icon ? String(attributes.icon) : meta.icon,
        body,
        toc: extractToc(body),
        relatedSlugs: toStringArray(attributes.relatedSlugs),
        layout,
        callouts,
        customSections: Object.keys(customSections).length > 0 ? customSections : undefined,
        sources: sources.length > 0 ? dedupeSources(sources) : undefined,
        featured: Boolean(attributes.featured),
        order: attributes.order !== undefined ? Number(attributes.order) : undefined,
    };
}

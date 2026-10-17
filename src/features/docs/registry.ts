import type { DocArticle, DocCategory, DocStatus } from './types';
import { getDocCategoryMeta } from './categories';
import { parseDocContent } from './parser';

// ─── Auto-discovery of Doc Content via Vite Glob ─────────────────────────────

const mdModules = import.meta.glob('./content/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

function getFilename(path: string): string {
    return path.split('/').pop()?.replace(/\.md$/, '') || '';
}

/** Files that are not content: READMEs, partials (`_`) and dotfiles. */
function isIgnoredFile(filename: string): boolean {
    return filename.toLowerCase() === 'readme' || filename.startsWith('_') || filename.startsWith('.');
}

function sortDocs(a: DocArticle, b: DocArticle): number {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;

    if (a.order !== undefined || b.order !== undefined) {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
    }

    const dateA = a.publishedDate ? a.publishedDate.getTime() : 0;
    const dateB = b.publishedDate ? b.publishedDate.getTime() : 0;
    if (dateA !== dateB) return dateB - dateA;

    return a.title.localeCompare(b.title, 'es');
}

function loadDocsFromContent(): DocArticle[] {
    const docs: DocArticle[] = [];

    for (const [path, rawContent] of Object.entries(mdModules)) {
        const filename = getFilename(path);
        if (isIgnoredFile(filename)) continue;

        try {
            docs.push(parseDocContent(rawContent, filename));
        } catch (err) {
            console.error(`[Docs CMS] Error parsing markdown doc at ${path}:`, err);
        }
    }

    docs.sort(sortDocs);
    return docs;
}

const registry: DocArticle[] = loadDocsFromContent();

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Documentos publicados (excluye borradores y archivados). */
export function getAllDocs(): DocArticle[] {
    return registry.filter((d) => d.status === 'published');
}

/** Documento por slug. Incluye borradores para permitir previsualización por URL. */
export function getDocBySlug(slug: string): DocArticle | undefined {
    return registry.find((d) => d.slug === slug);
}

/** Documentos por estado (útil para vistas de administración/preview). */
export function getDocsByStatus(status: DocStatus): DocArticle[] {
    return registry.filter((d) => d.status === status);
}

export function getDocsByCategory(category: DocCategory): DocArticle[] {
    return getAllDocs().filter((d) => d.category === category);
}

export function getDocsByTag(tag: string): DocArticle[] {
    const normalized = tag.toLowerCase();
    return getAllDocs().filter((d) => d.tags.some((t) => t.toLowerCase() === normalized));
}

/**
 * Artículos relacionados: primero los declarados manualmente en
 * `relatedSlugs`, luego los que comparten categoría y/o tags.
 */
export function getRelatedDocs(article: DocArticle, limit = 3): DocArticle[] {
    const candidates = getAllDocs().filter((d) => d.slug !== article.slug);

    const manual = (article.relatedSlugs ?? [])
        .map((slug) => candidates.find((d) => d.slug === slug))
        .filter((d): d is DocArticle => Boolean(d));

    const manualSlugs = new Set(manual.map((d) => d.slug));
    const articleTags = new Set(article.tags.map((t) => t.toLowerCase()));

    const score = (doc: DocArticle): number => {
        let value = doc.category === article.category ? 2 : 0;
        for (const tag of doc.tags) {
            if (articleTags.has(tag.toLowerCase())) value += 1;
        }
        return value;
    };

    const auto = candidates
        .filter((d) => !manualSlugs.has(d.slug))
        .map((doc) => ({ doc, score: score(doc) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.doc);

    return [...manual, ...auto].slice(0, limit);
}

/** Categorías con documentos publicados y su conteo. */
export function getDocCategories(): { value: string; label: string; icon: string; color: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const doc of getAllDocs()) {
        counts.set(doc.category, (counts.get(doc.category) ?? 0) + 1);
    }

    return Array.from(counts.entries())
        .map(([value, count]) => {
            const meta = getDocCategoryMeta(value);
            return { value, label: meta.label, icon: meta.icon, color: meta.color, count };
        })
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'));
}

/** Tags únicos de documentos publicados, ordenados por frecuencia. */
export function getDocTags(): string[] {
    const counts = new Map<string, number>();
    for (const doc of getAllDocs()) {
        for (const tag of doc.tags) {
            const key = tag.toLowerCase();
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
    }

    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
        .map(([tag]) => tag);
}

export { registry as DocRegistry };

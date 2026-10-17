/**
 * Table of contents generation for markdown content.
 *
 * Headings inside directive blocks (`:::info ... :::`) are ignored, and
 * duplicate heading texts get unique suffixes (`-2`, `-3`, ...) so anchors
 * always resolve.
 */

import { stripDirectiveBlocks } from './blockParser';

export interface TocItem {
    /** Anchor id (matches the rendered heading id) */
    id: string;
    /** Heading text without inline markdown */
    text: string;
    /** Heading level (2 = h2, 3 = h3, ...) */
    level: number;
}

const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;

/** Removes inline markdown decorations from heading text (keeps accents/case). */
export function cleanHeadingText(text: string): string {
    return text
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~]/g, '')
        .trim();
}

/** Convierte el texto de un heading en un id de anchor URL-safe y único por documento. */
export function slugifyHeading(text: string): string {
    const slug = cleanHeadingText(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return slug || 'seccion';
}

export interface ExtractTocOptions {
    /** First heading level to include (default 2) */
    minLevel?: number;
    /** Last heading level to include (default 3) */
    maxLevel?: number;
}

/**
 * Escanea headings de un body markdown y devuelve la tabla de contenidos.
 */
export function extractToc(markdown: string, options: ExtractTocOptions = {}): TocItem[] {
    const { minLevel = 2, maxLevel = 3 } = options;
    const body = stripDirectiveBlocks(markdown ?? '');
    const items: TocItem[] = [];
    const seen = new Map<string, number>();

    for (const rawLine of body.split(/\r?\n/)) {
        const match = rawLine.match(HEADING_RE);
        if (!match) continue;

        const level = match[1].length;
        if (level < minLevel || level > maxLevel) continue;

        const text = cleanHeadingText(match[2]);
        if (!text) continue;

        const base = slugifyHeading(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);

        items.push({
            id: count > 0 ? `${base}-${count + 1}` : base,
            text,
            level,
        });
    }

    return items;
}

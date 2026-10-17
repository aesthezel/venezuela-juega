/**
 * Splits a markdown body into semantic blocks that features can render
 * with their own styles (paragraphs, lists, quotes, headings, code and
 * directives).
 *
 * Blank lines separate blocks; consecutive list/quote lines are grouped.
 */

import { parseBlockParams } from './blockParser';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ContentBlock =
    | { kind: 'header'; level: HeadingLevel; text: string }
    | { kind: 'quote'; lines: string[] }
    | { kind: 'list'; items: string[] }
    | { kind: 'ordered-list'; items: string[] }
    | { kind: 'code'; lang?: string; code: string }
    | { kind: 'directive'; type: string; params: Record<string, string>; content: string }
    | { kind: 'paragraph'; lines: string[] };

const HEADER_RE = /^(#{1,6})\s+(.*)$/;
const DIRECTIVE_OPEN_RE = /^:::[ \t]*([a-zA-Z0-9_-]+)(?:[ \t]+([^\r\n]*))?[ \t]*$/;
const DIRECTIVE_CLOSE_RE = /^:::[ \t]*$/;
const UNORDERED_ITEM_RE = /^[-*]\s+/;
const ORDERED_ITEM_RE = /^\d+[.)]\s+/;
const CODE_FENCE_RE = /^```\s*([a-zA-Z0-9_+-]*)\s*$/;

/**
 * Builds the block list for a markdown body.
 */
export function buildContentBlocks(content: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let pending: Extract<ContentBlock, { kind: 'quote' | 'list' | 'ordered-list' | 'paragraph' }> | null = null;

    const flush = () => {
        if (pending) {
            blocks.push(pending);
            pending = null;
        }
    };

    const lines = (content ?? '').split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            flush();
            continue;
        }

        // Fenced code block
        const fence = line.match(CODE_FENCE_RE);
        if (fence) {
            flush();
            const lang = fence[1] || undefined;
            const codeLines: string[] = [];
            i += 1;
            while (i < lines.length && !CODE_FENCE_RE.test(lines[i].trim())) {
                codeLines.push(lines[i]);
                i += 1;
            }
            blocks.push({ kind: 'code', lang, code: codeLines.join('\n') });
            continue;
        }

        // Directive block
        const directiveOpen = line.match(DIRECTIVE_OPEN_RE);
        if (directiveOpen) {
            flush();
            const rawLines: string[] = [];
            let closed = false;
            i += 1;
            while (i < lines.length) {
                if (DIRECTIVE_CLOSE_RE.test(lines[i].trim())) {
                    closed = true;
                    break;
                }
                rawLines.push(lines[i]);
                i += 1;
            }
            if (closed) {
                blocks.push({
                    kind: 'directive',
                    type: directiveOpen[1].toLowerCase(),
                    params: parseBlockParams(directiveOpen[2] || ''),
                    content: rawLines.join('\n').trim(),
                });
            } else {
                // Unterminated directive: keep it as plain text
                pending = { kind: 'paragraph', lines: [line, ...rawLines] };
                flush();
            }
            continue;
        }

        const header = line.match(HEADER_RE);
        if (header) {
            flush();
            blocks.push({
                kind: 'header',
                level: header[1].length as HeadingLevel,
                text: header[2].trim(),
            });
            continue;
        }

        if (line.startsWith('>')) {
            if (!pending || pending.kind !== 'quote') {
                flush();
                pending = { kind: 'quote', lines: [] };
            }
            pending.lines.push(line.replace(/^>\s*/, ''));
            continue;
        }

        if (UNORDERED_ITEM_RE.test(line)) {
            if (!pending || pending.kind !== 'list') {
                flush();
                pending = { kind: 'list', items: [] };
            }
            pending.items.push(line.replace(UNORDERED_ITEM_RE, ''));
            continue;
        }

        if (ORDERED_ITEM_RE.test(line)) {
            if (!pending || pending.kind !== 'ordered-list') {
                flush();
                pending = { kind: 'ordered-list', items: [] };
            }
            pending.items.push(line.replace(ORDERED_ITEM_RE, ''));
            continue;
        }

        if (!pending || pending.kind !== 'paragraph') {
            flush();
            pending = { kind: 'paragraph', lines: [] };
        }
        pending.lines.push(line);
    }

    flush();
    return blocks;
}

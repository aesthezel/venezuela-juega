/**
 * Splits a markdown body into semantic blocks that features can render
 * with their own styles (paragraphs, lists, quotes, headings, code and
 * directives).
 *
 * Blank lines separate blocks; consecutive list/quote lines are grouped.
 */

import { parseBlockParams } from './blockParser';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ListItemObject {
    text: string;
    subItems?: ListItem[];
    ordered?: boolean;
}

export type ListItem = string | ListItemObject;

export function getListItemText(item: ListItem): string {
    return typeof item === 'string' ? item : item.text;
}

export type ContentBlock =
    | { kind: 'header'; level: HeadingLevel; text: string }
    | { kind: 'quote'; lines: string[] }
    | { kind: 'list'; items: ListItem[] }
    | { kind: 'ordered-list'; items: ListItem[]; start?: number }
    | { kind: 'code'; lang?: string; code: string }
    | { kind: 'directive'; type: string; params: Record<string, string>; content: string }
    | { kind: 'paragraph'; lines: string[] };

const HEADER_RE = /^(#{1,6})\s+(.*)$/;
const DIRECTIVE_OPEN_RE = /^:::[ \t]*([a-zA-Z0-9_-]+)(?:[ \t]+([^\r\n]*))?[ \t]*$/;
const DIRECTIVE_CLOSE_RE = /^:::[ \t]*$/;
const UNORDERED_ITEM_RE = /^[-*]\s+/;
const ORDERED_ITEM_RE = /^(\d+)[.)]\s+/;
const CODE_FENCE_RE = /^```\s*([a-zA-Z0-9_+-]*)\s*$/;

const SUB_UNORDERED_RE = /^[-*]\s+(.*)$/;
const SUB_ORDERED_RE = /^(?:[a-zA-Z]|\d+\.[a-zA-Z]|\d+)[.)]\s+(.*)$/;

function appendSubItem(items: ListItem[], subText: string, isOrdered: boolean): void {
    if (items.length === 0) {
        items.push(subText);
        return;
    }

    const lastIdx = items.length - 1;
    const lastItem = items[lastIdx];

    if (typeof lastItem === 'string') {
        items[lastIdx] = {
            text: lastItem,
            subItems: [subText],
            ordered: isOrdered,
        };
    } else {
        if (!lastItem.subItems) {
            lastItem.subItems = [];
            lastItem.ordered = isOrdered;
        }
        lastItem.subItems.push(subText);
    }
}

function appendContinuationLine(items: ListItem[], lineText: string): void {
    if (items.length === 0) return;

    const lastIdx = items.length - 1;
    const lastItem = items[lastIdx];

    if (typeof lastItem === 'string') {
        items[lastIdx] = `${lastItem} ${lineText}`;
    } else if (lastItem.subItems && lastItem.subItems.length > 0) {
        const lastSubIdx = lastItem.subItems.length - 1;
        const lastSub = lastItem.subItems[lastSubIdx];
        if (typeof lastSub === 'string') {
            lastItem.subItems[lastSubIdx] = `${lastSub} ${lineText}`;
        } else {
            lastSub.text = `${lastSub.text} ${lineText}`;
        }
    } else {
        lastItem.text = `${lastItem.text} ${lineText}`;
    }
}

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
        const rawLine = lines[i];
        const line = rawLine.trim();
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

        // Check for indented sub-items if currently in a list block
        const indentMatch = rawLine.match(/^([ \t]+)/);
        const indent = indentMatch ? indentMatch[1].replace(/\t/g, '    ').length : 0;

        if (pending && (pending.kind === 'list' || pending.kind === 'ordered-list') && indent >= 2) {
            const subUnordered = line.match(SUB_UNORDERED_RE);
            if (subUnordered) {
                appendSubItem(pending.items, subUnordered[1].trim(), false);
                continue;
            }

            const subOrdered = line.match(SUB_ORDERED_RE);
            if (subOrdered) {
                appendSubItem(pending.items, subOrdered[1].trim(), true);
                continue;
            }

            appendContinuationLine(pending.items, line);
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

        const orderedMatch = line.match(ORDERED_ITEM_RE);
        if (orderedMatch) {
            if (!pending || pending.kind !== 'ordered-list') {
                flush();
                const startNum = parseInt(orderedMatch[1], 10);
                pending = {
                    kind: 'ordered-list',
                    items: [line.replace(ORDERED_ITEM_RE, '')],
                    start: startNum !== 1 ? startNum : undefined,
                };
            } else {
                pending.items.push(line.replace(ORDERED_ITEM_RE, ''));
            }
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

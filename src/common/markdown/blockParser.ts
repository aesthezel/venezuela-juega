/**
 * Generic markdown directive helpers.
 *
 * Directives are fenced blocks embedded in markdown:
 *
 *   :::info {title: "Importante"}
 *   Contenido...
 *   :::
 *
 * Any feature (docs, jams, blog, etc.) can extract them and decide how to
 * render each `type`.
 */

export interface DirectiveBlock {
    type: string;
    params: Record<string, string>;
    content: string;
}

/** Matches `:::name {params} ... :::` preserving inner content. */
const DIRECTIVE_BLOCK_PATTERN =
    /:::[ \t]*([a-zA-Z0-9_-]+)(?:[ \t]+([^\r\n]*))?([\s\S]*?)\r?\n[ \t]*:::[ \t]*(?=[\r\n]|$)/g;

/**
 * Parses block parameters like `{title: "¿Por qué esta jam?", subtitle: "Jugamos para ayudar", badge: "Nuevo"}`
 */
export function parseBlockParams(paramStr: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (!paramStr) return params;

    const trimmed = paramStr.trim();
    const clean = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;

    // Match key: "value" or key: 'value' or key: value
    const regex = /(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,\s}]+))/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(clean)) !== null) {
        const key = match[1];
        const val = match[2] ?? match[3] ?? match[4] ?? '';
        params[key] = val.trim();
    }

    return params;
}

/**
 * Extracts directive blocks `:::blockType {params} ... :::` from markdown body.
 */
export function extractDirectiveBlocks(body: string): DirectiveBlock[] {
    const blocks: DirectiveBlock[] = [];
    // Note: use [ \t] instead of \s so newlines are not swallowed as params
    const blockRegex = new RegExp(DIRECTIVE_BLOCK_PATTERN.source, 'g');
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(body)) !== null) {
        const type = match[1].toLowerCase();
        const paramStr = match[2] || '';
        const content = match[3].trim();
        const params = parseBlockParams(paramStr);

        blocks.push({
            type,
            params,
            content,
        });
    }

    return blocks;
}

/**
 * Removes every directive block (markers and content) from a markdown body.
 * Useful to build tables of contents or plain text previews.
 */
export function stripDirectiveBlocks(body: string): string {
    return body.replace(new RegExp(DIRECTIVE_BLOCK_PATTERN.source, 'g'), '');
}

/**
 * Parses H3 sections like:
 * ### ❤️‍🩹 Title
 * Description...
 */
export function parseH3Sections(content: string): { title: string; icon?: string; body: string }[] {
    const sections: { title: string; icon?: string; body: string }[] = [];
    // Split by ### whether at beginning of string or after a newline
    const parts = content.split(/(?:^|[\r\n]+)###\s+/);

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        const lines = trimmed.split(/\r?\n/);
        const header = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();

        // Check if header starts with an emoji / icon
        let icon: string | undefined = undefined;
        let title = header;

        const emojiMatch = header.match(/^([\p{Extended_Pictographic}\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]+)\s*(.*)$/u);
        if (emojiMatch && emojiMatch[2]) {
            icon = emojiMatch[1].trim();
            title = emojiMatch[2].trim();
        }

        sections.push({ title, icon, body });
    }

    return sections;
}

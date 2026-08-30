import type { VNode } from 'preact';

/**
 * Renderiza texto plano con soporte para markdown:
 *   - enlaces:  [texto](https://url)
 *   - negrita:  **texto**
 *   - cursiva:  *texto*
 *   - código:   `texto`
 */
const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

export function renderRichText(text: string): (string | VNode)[] {
    if (!text) return [];
    const parts: (string | VNode)[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = TOKEN.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));

        const [, linkLabel, linkUrl, boldText, italicText, codeText] = match;
        if (linkUrl) {
            parts.push(
                <a
                    key={`link-${match.index}`}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary font-semibold hover:underline"
                >
                    {linkLabel}
                </a>
            );
        } else if (boldText) {
            parts.push(<strong key={`bold-${match.index}`}>{boldText}</strong>);
        } else if (italicText) {
            parts.push(<em key={`italic-${match.index}`}>{italicText}</em>);
        } else if (codeText) {
            parts.push(
                <code key={`code-${match.index}`} className="badge badge-neutral font-mono text-xs px-1.5 py-0.5 mx-0.5">
                    {codeText}
                </code>
            );
        }

        last = match.index + match[0].length;
    }

    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

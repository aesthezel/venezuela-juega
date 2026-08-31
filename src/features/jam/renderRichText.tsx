import type { VNode } from 'preact';

/**
 * Renderiza texto plano con soporte para markdown:
 *   - imágenes: ![alt](url) o con opciones ![alt](url){width=300, height=200, align=center}
 *   - enlaces:  [texto](https://url)
 *   - negrita:  **texto**
 *   - cursiva:  *texto*
 *   - código:   `texto`
 */
const TOKEN = /!\[([^\]]+)\]\(([^)]+)\)(?:\s*\{([^}]*)\})?|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

interface ImageAttrs {
    width?: string;
    height?: string;
    align?: string;
}

function parseImageAttrs(raw: string | undefined): ImageAttrs {
    const attrs: ImageAttrs = {};
    if (!raw) return attrs;
    const attrRegex = /(\w+)\s*[:=]\s*([^\s,}]+)/g;
    let match: RegExpExecArray | null;
    while ((match = attrRegex.exec(raw)) !== null) {
        const key = match[1] as keyof ImageAttrs;
        const val = match[2].trim();
        if (key === 'width' || key === 'height') {
            attrs[key] = /^\d+$/.test(val) ? `${val}px` : val;
        } else if (key === 'align') {
            attrs.align = val;
        }
    }
    return attrs;
}

export function renderRichText(text: string): (string | VNode)[] {
    if (!text) return [];
    const parts: (string | VNode)[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = TOKEN.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));

        const [, imgAlt, imgUrl, imgAttrs, linkLabel, linkUrl, boldText, italicText, codeText] = match;
        if (imgUrl) {
            const attrs = parseImageAttrs(imgAttrs);
            const centered = attrs.align === 'center';
            parts.push(
                <img
                    key={`img-${match.index}`}
                    src={imgUrl}
                    alt={imgAlt}
                    loading="lazy"
                    className={`rounded-2xl border border-base-300 shadow-lg max-w-full h-auto my-4 ${
                        centered ? 'block mx-auto' : ''
                    }`}
                    style={
                        attrs.width || attrs.height
                            ? { width: attrs.width, height: attrs.height }
                            : undefined
                    }
                />
            );
        } else if (linkUrl) {
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

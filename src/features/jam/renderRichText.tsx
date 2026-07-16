import type { VNode } from 'preact';

/**
 * Renderiza texto plano con soporte para un subconjunto mínimo de markdown:
 *   - enlaces:  [texto](https://url)
 *   - negrita:  **texto**
 *
 * Pensado para contenido de confianza definido en el registry (no input de
 * usuario), por eso no necesita sanitización ni `dangerouslySetInnerHTML`.
 * Devuelve nodos de Preact, así que se usa directamente: {renderRichText(str)}
 */
const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

export function renderRichText(text: string): (string | VNode)[] {
    const parts: (string | VNode)[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = TOKEN.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));

        const [, linkLabel, linkUrl, boldText] = match;
        if (linkUrl) {
            parts.push(
                <a
                    key={match.index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                >
                    {linkLabel}
                </a>,
            );
        } else {
            parts.push(<strong key={match.index}>{boldText}</strong>);
        }

        last = match.index + match[0].length;
    }

    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

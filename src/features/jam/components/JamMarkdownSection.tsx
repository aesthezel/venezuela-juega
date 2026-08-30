import { h } from 'preact';
import type { JamCustomSection } from '../types';
import { renderRichText } from '../renderRichText';

interface JamMarkdownSectionProps {
    section: JamCustomSection;
    accentColor?: string;
}

type ContentBlock =
    | { kind: 'header'; text: string }
    | { kind: 'quote'; lines: string[] }
    | { kind: 'list'; items: string[] }
    | { kind: 'paragraph'; lines: string[] };

/**
 * Agrupa el contenido en bloques semánticos: agrupa líneas consecutivas de
 * viñetas (- / *) en una lista, citas (>) en blockquote, encabezados (###)
 * por separado y el resto en párrafos. Las líneas en blanco separan bloques.
 */
export function buildContentBlocks(content: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let pending: Extract<ContentBlock, { kind: 'quote' | 'list' | 'paragraph' }> | null = null;

    const flush = () => {
        if (pending) {
            blocks.push(pending);
            pending = null;
        }
    };

    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) {
            flush();
            continue;
        }

        if (line.startsWith('### ') || line.startsWith('#### ')) {
            flush();
            blocks.push({ kind: 'header', text: line.replace(/^#+\s*/, '') });
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

        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (!pending || pending.kind !== 'list') {
                flush();
                pending = { kind: 'list', items: [] };
            }
            pending.items.push(line.slice(2));
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

const JamMarkdownSection = ({ section, accentColor = '#e34262' }: JamMarkdownSectionProps) => {
    const bgClass =
        section.theme === 'base-200'
            ? 'bg-base-200'
            : section.theme === 'base-300'
            ? 'bg-base-300'
            : section.theme === 'neutral'
            ? 'bg-neutral text-neutral-content'
            : 'bg-base-100';

    if (section.type === 'embed' && section.embedUrl) {
        return (
            <section className={`py-16 px-6 ${bgClass}`}>
                <div className="max-w-4xl mx-auto">
                    {section.title && (
                        <div className="text-center mb-8">
                            {section.badge && (
                                <span className="badge badge-secondary badge-outline text-xs font-bold mb-2 uppercase">
                                    {section.badge}
                                </span>
                            )}
                            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                                {section.title}
                            </h2>
                            {section.subtitle && (
                                <p className="text-base-content/50 text-sm uppercase tracking-widest mt-2">
                                    {section.subtitle}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-base-300 bg-base-300">
                        <iframe
                            src={section.embedUrl}
                            title={section.title || 'Embed'}
                            className="w-full h-full border-0"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        );
    }

    // Parse block lines into paragraphs, lists, and headers
    const blocks = buildContentBlocks(section.content || '');

    return (
        <section className={`py-20 px-6 ${bgClass}`}>
            <div className="max-w-4xl mx-auto">
                {(section.title || section.badge) && (
                    <div className="text-center mb-12">
                        {section.badge && (
                            <span
                                className="badge text-xs font-bold mb-3 uppercase tracking-wider px-3 py-2"
                                style={{
                                    borderColor: accentColor,
                                    color: accentColor,
                                }}
                            >
                                {section.badge}
                            </span>
                        )}
                        {section.title && (
                            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                                {section.title}
                            </h2>
                        )}
                        {section.subtitle && (
                            <p className="text-base-content/50 text-sm uppercase tracking-widest mt-2">
                                {section.subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-6 text-base-content/80 text-base sm:text-lg leading-relaxed">
                    {blocks.map((block, bIdx) => {
                        if (block.kind === 'header') {
                            return (
                                <h3 key={bIdx} className="text-2xl font-black text-white pt-4 pb-1">
                                    {renderRichText(block.text)}
                                </h3>
                            );
                        }

                        if (block.kind === 'quote') {
                            return (
                                <div
                                    key={bIdx}
                                    className="border-l-4 pl-4 py-2 italic bg-base-200/60 rounded-r-xl border-secondary"
                                >
                                    {renderRichText(block.lines.join('\n'))}
                                </div>
                            );
                        }

                        if (block.kind === 'list') {
                            return (
                                <ul key={bIdx} className="space-y-2 list-disc list-inside bg-base-200/40 p-5 rounded-2xl border border-base-300">
                                    {block.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="leading-normal">
                                            {renderRichText(item)}
                                        </li>
                                    ))}
                                </ul>
                            );
                        }

                        return <p key={bIdx}>{renderRichText(block.lines.join(' '))}</p>;
                    })}
                </div>
            </div>
        </section>
    );
};

export default JamMarkdownSection;

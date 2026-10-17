import { h } from 'preact';
import type { VNode } from 'preact';
import type { JamCustomSection } from '../types';
import { renderRichText, buildContentBlocks } from '@/common/markdown';
import type { ContentBlock } from '@/common/markdown';

export { buildContentBlocks } from '@/common/markdown';

interface JamMarkdownSectionProps {
    section: JamCustomSection;
    accentColor?: string;
}

function renderBlocks(blocks: ContentBlock[]): VNode[] {
    return blocks.map((block, bIdx) => {
        switch (block.kind) {
            case 'header':
                return (
                    <h3 key={bIdx} className="text-2xl font-black text-white pt-4 pb-1">
                        {renderRichText(block.text)}
                    </h3>
                );

            case 'quote':
                return (
                    <div
                        key={bIdx}
                        className="border-l-4 pl-4 py-2 italic bg-base-200/60 rounded-r-xl border-secondary"
                    >
                        {renderRichText(block.lines.join('\n'))}
                    </div>
                );

            case 'list':
                return (
                    <ul key={bIdx} className="space-y-2 list-disc list-inside bg-base-200/40 p-5 rounded-2xl border border-base-300">
                        {block.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="leading-normal">
                                {renderRichText(item)}
                            </li>
                        ))}
                    </ul>
                );

            case 'ordered-list':
                return (
                    <ol key={bIdx} className="space-y-2 list-decimal list-inside bg-base-200/40 p-5 rounded-2xl border border-base-300">
                        {block.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="leading-normal">
                                {renderRichText(item)}
                            </li>
                        ))}
                    </ol>
                );

            case 'code':
                return (
                    <pre key={bIdx} className="bg-base-300/70 border border-base-300 rounded-2xl p-4 overflow-x-auto text-sm">
                        <code className="font-mono">{block.code}</code>
                    </pre>
                );

            case 'directive':
                return (
                    <div key={bIdx} className="border-l-2 border-base-300 pl-4 space-y-4">
                        {renderBlocks(buildContentBlocks(block.content))}
                    </div>
                );

            default:
                return <p key={bIdx}>{renderRichText(block.lines.join(' '))}</p>;
        }
    });
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

    // Parse block lines into paragraphs, lists, headers and directives
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
                    {renderBlocks(blocks)}
                </div>
            </div>
        </section>
    );
};

export default JamMarkdownSection;

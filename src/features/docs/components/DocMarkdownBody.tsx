import { h } from 'preact';
import type { VNode } from 'preact';
import { useMemo } from 'preact/hooks';
import type { DocArticle, DocSection } from '../types';
import { getCalloutKind } from '../parser';
import DocInfoBox from './DocInfoBox';
import { buildContentBlocks, renderRichText, slugifyHeading } from '@/common/markdown';
import type { ContentBlock, TocItem } from '@/common/markdown';

interface DocMarkdownBodyProps {
    article: DocArticle;
}

/** Assigns every heading block the anchor id generated for the TOC. */
function resolveHeadingIds(blocks: ContentBlock[], toc: TocItem[]): Map<number, string> {
    const ids = new Map<number, string>();
    let cursor = 0;

    blocks.forEach((block, index) => {
        if (block.kind !== 'header') return;
        for (let i = cursor; i < toc.length; i++) {
            if (toc[i].text === block.text && toc[i].level === block.level) {
                ids.set(index, toc[i].id);
                cursor = i + 1;
                return;
            }
        }
        ids.set(index, slugifyHeading(block.text));
    });

    return ids;
}

function renderSectionBlock(section: DocSection): VNode {
    if (section.type === 'embed' && section.embedUrl) {
        return (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-surface-700 bg-base-300 my-6">
                <iframe
                    src={section.embedUrl}
                    title={section.title || 'Contenido embebido'}
                    className="w-full h-full border-0"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">{renderBlocks(buildContentBlocks(section.content || ''), new Map())}</div>
    );
}

function renderBlocks(blocks: ContentBlock[], headingIds: Map<number, string>): VNode[] {
    return blocks.map((block, idx) => {
        switch (block.kind) {
            case 'header': {
                const id = headingIds.get(idx) ?? slugifyHeading(block.text);
                if (block.level <= 2) {
                    return (
                        <h2
                            key={idx}
                            id={id}
                            className="scroll-mt-24 text-2xl sm:text-3xl font-black text-white pt-8 leading-tight"
                        >
                            {renderRichText(block.text)}
                        </h2>
                    );
                }
                if (block.level === 3) {
                    return (
                        <h3 key={idx} id={id} className="scroll-mt-24 text-xl sm:text-2xl font-black text-white pt-6">
                            {renderRichText(block.text)}
                        </h3>
                    );
                }
                return (
                    <h4 key={idx} id={id} className="scroll-mt-24 text-lg font-bold text-white pt-4">
                        {renderRichText(block.text)}
                    </h4>
                );
            }

            case 'quote':
                return (
                    <blockquote
                        key={idx}
                        className="border-l-4 border-accent-teal/50 bg-base-200/60 rounded-r-2xl px-5 py-4 italic text-base-content/70"
                    >
                        {renderRichText(block.lines.join('\n'))}
                    </blockquote>
                );

            case 'list':
                return (
                    <ul key={idx} className="list-disc list-outside pl-6 space-y-2 marker:text-accent-teal">
                        {block.items.map((item, i) => (
                            <li key={i}>{renderRichText(item)}</li>
                        ))}
                    </ul>
                );

            case 'ordered-list':
                return (
                    <ol key={idx} className="list-decimal list-outside pl-6 space-y-2 marker:text-accent-teal marker:font-bold">
                        {block.items.map((item, i) => (
                            <li key={i}>{renderRichText(item)}</li>
                        ))}
                    </ol>
                );

            case 'code':
                return (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-surface-700 bg-surface-950/80">
                        {block.lang && (
                            <span className="absolute top-2 right-3 text-[10px] font-mono uppercase tracking-widest text-base-content/30">
                                {block.lang}
                            </span>
                        )}
                        <pre className="p-4 pt-6 overflow-x-auto text-sm leading-relaxed">
                            <code className="font-mono text-base-content/80">{block.code}</code>
                        </pre>
                    </div>
                );

            case 'directive': {
                const calloutKind = getCalloutKind(block.type);
                if (calloutKind) {
                    return (
                        <DocInfoBox
                            key={idx}
                            callout={{
                                id: block.params.id || `callout-${idx}`,
                                kind: calloutKind,
                                title: block.params.title,
                                content: block.content,
                                index: idx,
                            }}
                        />
                    );
                }

                // Sources are rendered by <DocSources /> at their layout position
                if (['sources', 'references', 'fuentes'].includes(block.type)) return null;

                if (['custom', 'markdown', 'section', 'embed'].includes(block.type)) {
                    const section: DocSection = {
                        id: block.params.id || `custom-${idx}`,
                        type: block.type === 'embed' ? 'embed' : 'markdown',
                        title: block.params.title,
                        subtitle: block.params.subtitle,
                        badge: block.params.badge,
                        content: block.content,
                        embedUrl: block.params.url || block.params.embedUrl,
                        theme: (block.params.theme as DocSection['theme']) || 'base-100',
                    };
                    return (
                        <section key={idx} className="rounded-2xl border border-surface-700 bg-base-200/40 p-6">
                            {section.badge && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-teal">
                                    {section.badge}
                                </span>
                            )}
                            {section.title && (
                                <h3 className="text-xl font-black text-white mt-1 mb-3">{section.title}</h3>
                            )}
                            {section.subtitle && (
                                <p className="text-sm text-base-content/50 mb-4">{section.subtitle}</p>
                            )}
                            {renderSectionBlock(section)}
                        </section>
                    );
                }

                // Unknown directive: render its inner content as plain blocks
                return (
                    <div key={idx} className="space-y-6">
                        {renderBlocks(buildContentBlocks(block.content), new Map())}
                    </div>
                );
            }

            default:
                return <p key={idx}>{renderRichText(block.lines.join(' '))}</p>;
        }
    });
}

const DocMarkdownBody = ({ article }: DocMarkdownBodyProps) => {
    const blocks = useMemo(() => buildContentBlocks(article.body), [article.body]);
    const headingIds = useMemo(() => resolveHeadingIds(blocks, article.toc), [blocks, article.toc]);

    return (
        <div className="flex flex-col gap-6 text-base sm:text-lg leading-relaxed text-base-content/80">
            {renderBlocks(blocks, headingIds)}
        </div>
    );
};

export default DocMarkdownBody;

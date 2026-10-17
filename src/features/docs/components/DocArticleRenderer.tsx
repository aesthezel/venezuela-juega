import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import type { DocArticle } from '../types';
import { getRelatedDocs } from '../registry';
import { DEFAULT_DOC_LAYOUT } from '../parser';
import DocHero from './DocHero';
import DocMetaBar from './DocMetaBar';
import DocMarkdownBody from './DocMarkdownBody';
import DocTableOfContents from './DocTableOfContents';
import DocSources from './DocSources';
import DocRelated from './DocRelated';

interface DocArticleRendererProps {
    article: DocArticle;
}

/**
 * Orquestador del layout de un artículo: hero → meta → toc + body →
 * sources → related. El orden se puede personalizar desde el frontmatter
 * (`layout: [hero, meta, body, sources, related]`).
 */
const DocArticleRenderer = ({ article }: DocArticleRendererProps) => {
    const layout = useMemo(
        () => (article.layout && article.layout.length > 0 ? article.layout : DEFAULT_DOC_LAYOUT),
        [article]
    );
    const layoutKey = layout.join('|');
    const show = (section: string) => layout.includes(section);

    const related = useMemo(
        () => (layoutKey.split('|').includes('related') ? getRelatedDocs(article) : []),
        [article, layoutKey]
    );

    const showToc = show('toc') && article.toc.length > 0;

    const mainColumn = (
        <div className="min-w-0">
            {show('meta') && <DocMetaBar article={article} />}
            {show('body') && <DocMarkdownBody article={article} />}
            {show('sources') && article.sources && article.sources.length > 0 && (
                <DocSources sources={article.sources} />
            )}
            {show('related') && <DocRelated articles={related} />}
        </div>
    );

    return (
        <div className="relative min-h-screen bg-base-100 text-base-content">
            {show('hero') && <DocHero article={article} />}

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-14">
                {showToc && (
                    <div className="mb-8">
                        <DocTableOfContents items={article.toc} variant="mobile" />
                    </div>
                )}

                <div className={showToc ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12 lg:items-start' : ''}>
                    <div className={showToc ? '' : 'max-w-3xl mx-auto'}>{mainColumn}</div>
                    {showToc && (
                        <aside className="hidden lg:block">
                            <DocTableOfContents items={article.toc} variant="desktop" />
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocArticleRenderer;

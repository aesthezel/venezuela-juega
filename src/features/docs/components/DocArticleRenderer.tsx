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
import DocAuthorCard from './DocAuthorCard';
import DocReadingProgress from './DocReadingProgress';
import DocAuthorPanel from './DocAuthorPanel';
import DocRelatedSidebar from './DocRelatedSidebar';
import DocContributions from './DocContributions';
import DocSchemaOrg from './DocSchemaOrg';

interface DocArticleRendererProps {
    article: DocArticle;
}

/**
 * Orquestador del layout de un artículo con diseño de 3 columnas en desktop:
 * [TOC sticky izq. 240px] [Contenido central flexible] [Panel derecho 260px]
 *
 * En mobile: TOC en <details>, panel derecho debajo del contenido.
 * El orden se puede personalizar desde el frontmatter
 * (`layout: [hero, meta, author, body, sources, related]`).
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

    // Mostrar panel de autor en sidebar si el artículo tiene autor con links o URL
    const showAuthorPanel = Boolean(
        article.author && (article.authorLinks?.length || article.authorUrl)
    );

    // Mostrar el DocAuthorCard en mobile o cuando no hay TOC
    const showAuthorCard =
        show('author') ||
        (show('meta') && article.authorLinks && article.authorLinks.length > 0);

    const accentColor = article.accentColor || '#6366f1';

    return (
        <div className="relative min-h-screen bg-base-100 text-base-content">
            {/* Barra de progreso fija en top */}
            <DocReadingProgress accentColor={accentColor} />

            {/* SEO JSON-LD */}
            <DocSchemaOrg article={article} />

            {show('hero') && <DocHero article={article} />}

            <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-10 lg:py-14">
                {/* Mobile TOC — colapsable encima del contenido */}
                {showToc && (
                    <div className="lg:hidden mb-6">
                        <DocTableOfContents items={article.toc} variant="mobile" accentColor={accentColor} />
                    </div>
                )}

                {/* Grid de 3 columnas en desktop */}
                <div
                    className={
                        showToc
                            ? 'lg:grid lg:grid-cols-[250px_minmax(0,1fr)_270px] lg:gap-8 xl:gap-10 lg:items-start'
                            : 'max-w-4xl mx-auto'
                    }
                >
                    {/* Col 1: TOC sticky/fixed izquierdo */}
                    {showToc && (
                        <aside
                            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
                            aria-label="Índice del artículo"
                        >
                            <DocTableOfContents items={article.toc} variant="desktop" accentColor={accentColor} />
                        </aside>
                    )}

                    {/* Col 2: Contenido principal */}
                    <main className="min-w-0">
                        {show('meta') && <DocMetaBar article={article} />}
                        {/* Author card en mobile / sin TOC */}
                        {!showToc && showAuthorCard && <DocAuthorCard article={article} />}
                        {show('body') && <DocMarkdownBody article={article} />}
                        {show('sources') && article.sources && article.sources.length > 0 && (
                            <DocSources sources={article.sources} />
                        )}
                        {/* Sección de erratas y aportes colaborativos */}
                        {show('contributions') && <DocContributions article={article} />}
                        {/* Related en mobile se muestra abajo; en desktop sin TOC va aquí */}
                        {!showToc && show('related') && <DocRelated articles={related} />}
                    </main>

                    {/* Col 3: Panel lateral derecho — sticky/fixed */}
                    {showToc && (
                        <aside
                            className="hidden lg:flex lg:flex-col lg:gap-6 lg:sticky lg:top-24 lg:self-start"
                            aria-label="Información del autor y relacionados"
                        >
                            {showAuthorPanel && <DocAuthorPanel article={article} />}
                            {show('related') && related.length > 0 && (
                                <DocRelatedSidebar articles={related} />
                            )}
                        </aside>
                    )}
                </div>

                {/* Mobile: autor + relacionados al final del contenido */}
                {showToc && (
                    <div className="lg:hidden mt-10 flex flex-col gap-6">
                        {showAuthorCard && <DocAuthorCard article={article} />}
                        {show('related') && <DocRelated articles={related} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocArticleRenderer;

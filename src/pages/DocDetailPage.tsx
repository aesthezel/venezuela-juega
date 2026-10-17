import { useEffect } from 'preact/hooks';
import { RoutableProps } from 'preact-router';
import { getDocBySlug, DocArticleRenderer, getDocCategoryMeta } from '@/features/docs';

interface DocDetailPageProps extends RoutableProps {
    docSlug?: string;
}

const SITE_ORIGIN = 'https://venezuelajuega.com';
const FALLBACK_IMAGE = 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png';

function setMeta(selector: string, attr: string, value: string, createTag?: () => HTMLElement) {
    let el = document.querySelector(selector);
    if (!el && createTag) {
        el = createTag();
        document.head.appendChild(el);
    }
    if (el) {
        el.setAttribute(attr, value);
    }
}

const DocDetailPage = ({ docSlug }: DocDetailPageProps) => {
    const doc = docSlug ? getDocBySlug(docSlug) : undefined;

    useEffect(() => {
        if (!doc) return;

        const pageTitle = `${doc.title} | Venezuela Juega`;
        document.title = pageTitle;

        const description =
            doc.description.length > 155 ? doc.description.slice(0, 152) + '...' : doc.description;
        const imageUrl = doc.coverImage || FALLBACK_IMAGE;
        const canonicalUrl = `${SITE_ORIGIN}/docs/${doc.slug}`;
        const categoryMeta = getDocCategoryMeta(doc.category);

        // Standard Meta
        setMeta('meta[name="description"]', 'content', description, () => {
            const m = document.createElement('meta');
            m.name = 'description';
            return m;
        });

        // Canonical
        setMeta('link[rel="canonical"]', 'href', canonicalUrl, () => {
            const l = document.createElement('link');
            l.rel = 'canonical';
            return l;
        });

        // Open Graph
        const ogTags: Array<[string, string]> = [
            ['og:title', pageTitle],
            ['og:description', description],
            ['og:image', imageUrl],
            ['og:url', canonicalUrl],
            ['og:type', 'article'],
            ['article:section', categoryMeta.label],
        ];
        if (doc.publishedDate) ogTags.push(['article:published_time', doc.publishedDate.toISOString()]);
        if (doc.updatedDate) ogTags.push(['article:modified_time', doc.updatedDate.toISOString()]);
        for (const tag of doc.tags.slice(0, 6)) ogTags.push(['article:tag', tag]);

        for (const [property, content] of ogTags) {
            setMeta(`meta[property="${property}"]`, 'content', content, () => {
                const m = document.createElement('meta');
                m.setAttribute('property', property);
                return m;
            });
        }

        // Twitter Cards
        setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', () => {
            const m = document.createElement('meta');
            m.name = 'twitter:card';
            return m;
        });
        setMeta('meta[name="twitter:title"]', 'content', pageTitle, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:title';
            return m;
        });
        setMeta('meta[name="twitter:description"]', 'content', description, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:description';
            return m;
        });
        setMeta('meta[name="twitter:image"]', 'content', imageUrl, () => {
            const m = document.createElement('meta');
            m.name = 'twitter:image';
            return m;
        });

        // Schema.org Article / TechArticle JSON-LD
        const schemaType = doc.category === 'technical' ? 'TechArticle' : 'Article';
        const schema: Record<string, any> = {
            '@context': 'https://schema.org',
            '@type': schemaType,
            headline: doc.title,
            description,
            image: [imageUrl],
            url: canonicalUrl,
            mainEntityOfPage: canonicalUrl,
            inLanguage: 'es',
            articleSection: categoryMeta.label,
            author: {
                '@type': doc.authorUrl ? 'Person' : 'Organization',
                name: doc.author || 'Venezuela Juega',
                ...(doc.authorUrl ? { url: doc.authorUrl } : {}),
            },
            publisher: {
                '@type': 'Organization',
                name: 'Venezuela Juega',
                url: SITE_ORIGIN,
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_LogoColor.png',
                },
            },
        };

        if (doc.publishedDate) schema.datePublished = doc.publishedDate.toISOString();
        if (doc.updatedDate) schema.dateModified = doc.updatedDate.toISOString();
        if (doc.tags.length > 0) schema.keywords = doc.tags.join(', ');
        if (doc.readingTime) schema.timeRequired = `PT${doc.readingTime}M`;

        let scriptEl = document.getElementById('doc-article-ld') as HTMLScriptElement | null;
        if (!scriptEl) {
            scriptEl = document.createElement('script');
            scriptEl.id = 'doc-article-ld';
            scriptEl.type = 'application/ld+json';
            document.head.appendChild(scriptEl);
        }
        scriptEl.textContent = JSON.stringify(schema, null, 2);

        return () => {
            const existing = document.getElementById('doc-article-ld');
            if (existing) existing.remove();
        };
    }, [doc]);

    if (!doc) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-6 gap-6 pt-24">
                <span className="text-6xl" aria-hidden="true">📚</span>
                <h1 className="text-3xl font-black text-white">Recurso no encontrado</h1>
                <p className="text-base-content/60">
                    El documento <code className="text-secondary">{docSlug}</code> no existe o aún no está publicado.
                </p>
                <a href="/docs" className="btn btn-secondary">Ver todos los recursos</a>
            </div>
        );
    }

    return <DocArticleRenderer article={doc} />;
};

export default DocDetailPage;

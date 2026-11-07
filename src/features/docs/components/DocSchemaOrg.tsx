import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import type { DocArticle } from '../types';
import { buildContentBlocks } from '@/common/markdown';

interface DocSchemaOrgProps {
    article: DocArticle;
}

interface FaqItem {
    question: string;
    answer: string;
}

/** Extrae pares pregunta/respuesta de los bloques del body. */
function extractFaqItems(body: string): FaqItem[] {
    const blocks = buildContentBlocks(body);
    const faqs: FaqItem[] = [];
    let currentQuestion: string | null = null;
    const answerLines: string[] = [];

    const flushFaq = () => {
        if (currentQuestion && answerLines.length > 0) {
            faqs.push({
                question: currentQuestion,
                answer: answerLines.join(' ').trim(),
            });
        }
    };

    for (const block of blocks) {
        if (block.kind === 'header' && block.level === 3 && block.text.startsWith('¿')) {
            flushFaq();
            currentQuestion = block.text;
            answerLines.length = 0;
        } else if (currentQuestion) {
            // Cuando encontramos otro heading (H2 o H3 sin ¿), terminamos la respuesta
            if (block.kind === 'header' && (block.level <= 2 || !block.text.startsWith('¿'))) {
                flushFaq();
                currentQuestion = null;
                answerLines.length = 0;
            } else if (block.kind === 'paragraph') {
                answerLines.push(block.lines.join(' '));
            } else if (block.kind === 'list' || block.kind === 'ordered-list') {
                const textItems = block.items.map((item) => {
                    if (typeof item === 'string') return item;
                    const subText =
                        item.subItems && item.subItems.length > 0
                            ? ` (${item.subItems.map((s) => (typeof s === 'string' ? s : s.text)).join(', ')})`
                            : '';
                    return item.text + subText;
                });
                answerLines.push(textItems.join('. '));
            }
        }
    }
    flushFaq();

    return faqs.slice(0, 10);
}

/**
 * Inyecta JSON-LD schema.org para SEO. Genera un Article base,
 * y un FAQPage si el artículo contiene H3 que comienzan con '¿'.
 */
const DocSchemaOrg = ({ article }: DocSchemaOrgProps) => {
    const schemas = useMemo(() => {
        const result: object[] = [];

        const articleSchema: Record<string, unknown> = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            inLanguage: 'es-VE',
        };

        if (article.author) {
            articleSchema.author = { '@type': 'Person', name: article.author };
        }

        if (article.publishedDate) {
            articleSchema.datePublished = article.publishedDate.toISOString();
        }

        if (article.updatedDate) {
            articleSchema.dateModified = article.updatedDate.toISOString();
        }

        if (article.coverImage) {
            articleSchema.image = article.coverImage;
        }

        result.push(articleSchema);

        // FAQPage si hay preguntas
        const faqs = extractFaqItems(article.body);
        if (faqs.length > 0) {
            result.push({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            });
        }

        return result;
    }, [article]);

    return (
        <>
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
};

export default DocSchemaOrg;

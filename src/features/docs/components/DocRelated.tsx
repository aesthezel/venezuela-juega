import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { DocArticle } from '../types';
import DocCard from './DocCard';

interface DocRelatedProps {
    articles: DocArticle[];
}

const DocRelated = ({ articles }: DocRelatedProps) => {
    if (!articles.length) return null;

    return (
        <section className="mt-16 pt-10 border-t border-surface-700">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-white">Sigue explorando</h2>
                <a
                    href="/docs"
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-teal hover:gap-3 transition-all"
                >
                    Ver todos los recursos
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <DocCard key={article.slug} article={article} />
                ))}
            </div>
        </section>
    );
};

export default DocRelated;

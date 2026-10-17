import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faPenNib, faRotate } from '@fortawesome/free-solid-svg-icons';
import type { DocArticle } from '../types';

interface DocMetaBarProps {
    article: DocArticle;
}

const formatDate = (date?: Date | null): string | null =>
    date
        ? date.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

const MetaItem = ({ icon, children }: { icon: any; children: any }) => (
    <span className="inline-flex items-center gap-2 text-xs text-base-content/50">
        <FontAwesomeIcon icon={icon} className="text-[11px] text-base-content/40" />
        {children}
    </span>
);

const DocMetaBar = ({ article }: DocMetaBarProps) => {
    const published = formatDate(article.publishedDate);
    const updated = formatDate(article.updatedDate);
    const hasMeta = article.author || published || updated || article.readingTime;

    return (
        <div className="flex flex-col gap-4 pb-6 mb-8 border-b border-surface-700">
            {hasMeta && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {article.author && (
                        <MetaItem icon={faPenNib}>
                            {article.authorUrl ? (
                                <a
                                    href={article.authorUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-base-content/70 hover:text-accent-teal transition-colors"
                                >
                                    {article.author}
                                </a>
                            ) : (
                                <span className="font-semibold text-base-content/70">{article.author}</span>
                            )}
                        </MetaItem>
                    )}
                    {published && <MetaItem icon={faCalendarAlt}>{published}</MetaItem>}
                    {updated && updated !== published && (
                        <MetaItem icon={faRotate}>Actualizado el {updated}</MetaItem>
                    )}
                    {article.readingTime ? <MetaItem icon={faClock}>{article.readingTime} min</MetaItem> : null}
                </div>
            )}

            {article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {article.tags.map((tag) => (
                        <a
                            key={tag}
                            href={`/docs?tag=${encodeURIComponent(tag)}`}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-base-300/60 border border-surface-700 text-base-content/60 hover:text-accent-teal hover:border-accent-teal/40 transition-colors"
                        >
                            #{tag}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocMetaBar;

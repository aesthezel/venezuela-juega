import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { DocArticle } from '../types';
import { getDocCategoryMeta } from '../categories';

interface DocCardProps {
    article: DocArticle;
}

const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
};

const DocCard = ({ article }: DocCardProps) => {
    const meta = getDocCategoryMeta(article.category);
    const accent = article.accentColor || meta.color;
    const date = formatDate(article.publishedDate);
    const isDraft = article.status === 'draft';

    return (
        <a
            href={`/docs/${article.slug}`}
            className="group relative flex flex-col gap-4 rounded-2xl border border-surface-700 bg-base-200/60 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-surface-400/40 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]"
            style={{ boxShadow: `inset 0 1px 0 0 ${accent}14` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border"
                    style={{ background: `${accent}1a`, borderColor: `${accent}40` }}
                    aria-hidden="true"
                >
                    {article.icon || meta.icon}
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span
                        className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border"
                        style={{ color: accent, background: `${accent}14`, borderColor: `${accent}35` }}
                    >
                        {meta.label}
                    </span>
                    {isDraft && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold">
                            Borrador
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-lg font-black text-white leading-snug transition-colors group-hover:text-accent-teal">
                    {article.title}
                </h3>
                <p className="text-sm text-base-content/60 leading-relaxed line-clamp-3">
                    {article.description}
                </p>
            </div>

            {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-base-300/70 border border-surface-700 text-base-content/60"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-700/70 text-xs text-base-content/50">
                <span className="flex items-center gap-3">
                    {article.readingTime ? (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                            {article.readingTime} min
                        </span>
                    ) : null}
                    {date && <span>{date}</span>}
                </span>
                <span
                    className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] transition-all group-hover:gap-2.5"
                    style={{ color: accent }}
                >
                    Leer
                    <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
                </span>
            </div>
        </a>
    );
};

export default DocCard;

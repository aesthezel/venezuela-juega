import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import type { DocArticle } from '../types';
import { getDocCategoryMeta } from '../categories';
import DocBreadcrumbs from './DocBreadcrumbs';

interface DocHeroProps {
    article: DocArticle;
}

const formatDate = (date: Date | null): string | null =>
    date
        ? date.toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

const DocHero = ({ article }: DocHeroProps) => {
    const meta = getDocCategoryMeta(article.category);
    const accent = article.accentColor || meta.color;
    const date = formatDate(article.publishedDate);
    const statusLabel = article.status === 'draft' ? 'Borrador' : article.status === 'archived' ? 'Archivado' : null;

    return (
        <section className="relative overflow-hidden border-b border-surface-700">
            {/* Fondo: cover image o glow del color de acento */}
            {article.coverImage ? (
                <>
                    <img
                        src={article.coverImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/85 to-base-100" />
                </>
            ) : (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 70% 60% at 20% 0%, ${accent}22 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 90% 20%, ${accent}11 0%, transparent 70%)`,
                    }}
                />
            )}

            <div className="relative container mx-auto max-w-5xl px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
                <DocBreadcrumbs category={article.category} title={article.title} />

                <div className="mt-8 flex flex-col gap-5 animate-fade-in-up">
                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
                            style={{ color: accent, background: `${accent}16`, borderColor: `${accent}40` }}
                        >
                            <span aria-hidden="true">{meta.icon}</span>
                            {meta.label}
                        </span>
                        {statusLabel && (
                            <span className="inline-flex items-center text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold">
                                {statusLabel}
                            </span>
                        )}
                    </div>

                    <div className="flex items-start gap-4 sm:gap-6">
                        <div
                            className="hidden sm:flex w-16 h-16 lg:w-20 lg:h-20 rounded-3xl items-center justify-center text-3xl lg:text-4xl flex-shrink-0 border"
                            style={{ background: `${accent}18`, borderColor: `${accent}40`, boxShadow: `0 0 42px ${accent}33` }}
                            aria-hidden="true"
                        >
                            {article.icon || meta.icon}
                        </div>

                        <div className="flex flex-col gap-3 min-w-0">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.08] tracking-tight">
                                {article.title}
                            </h1>
                            {article.subtitle && (
                                <p className="text-base sm:text-lg text-base-content/60 leading-relaxed max-w-3xl">
                                    {article.subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-base-content/50">
                        {article.author && (
                            <span className="font-semibold text-base-content/70">{article.author}</span>
                        )}
                        {date && (
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                                {date}
                            </span>
                        )}
                        {article.readingTime ? (
                            <span className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="text-xs" />
                                {article.readingTime} min de lectura
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DocHero;

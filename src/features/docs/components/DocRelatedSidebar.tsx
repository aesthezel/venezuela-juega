import { h } from 'preact';
import type { DocArticle } from '../types';
import { getDocCategoryMeta } from '../categories';

interface DocRelatedSidebarProps {
    articles: DocArticle[];
}

/**
 * Lista compacta de artículos relacionados para el panel lateral derecho.
 * Muestra máximo 4 artículos en formato de fila con ícono, título y badge de categoría.
 */
const DocRelatedSidebar = ({ articles }: DocRelatedSidebarProps) => {
    if (!articles.length) return null;

    const limited = articles.slice(0, 4);

    return (
        <nav aria-label="Documentos relacionados" className="rounded-2xl border border-surface-700 bg-base-200/50 p-4">
            {/* Label de sección */}
            <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-3">
                Relacionados
            </p>

            <ul className="flex flex-col gap-2">
                {limited.map((article) => {
                    const meta = getDocCategoryMeta(article.category);
                    const accent = article.accentColor || meta.color;

                    return (
                        <li key={article.slug}>
                            <a
                                href={`/docs/${article.slug}`}
                                className="group flex items-center gap-2.5 py-2 px-2.5 rounded-xl border border-transparent hover:border-surface-700 hover:bg-base-300/40 transition-all"
                            >
                                {/* Icono/emoji */}
                                <span
                                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm border"
                                    style={{ background: `${accent}1a`, borderColor: `${accent}40` }}
                                    aria-hidden="true"
                                >
                                    {article.icon || meta.icon}
                                </span>

                                {/* Título */}
                                <span className="flex-1 min-w-0">
                                    <span className="block text-xs font-semibold text-base-content/80 group-hover:text-white transition-colors leading-snug line-clamp-2">
                                        {article.title}
                                    </span>
                                </span>

                                {/* Badge de categoría */}
                                <span
                                    className="flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border hidden sm:inline"
                                    style={{ color: accent, background: `${accent}14`, borderColor: `${accent}35` }}
                                >
                                    {meta.label}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-3 pt-3 border-t border-surface-700/60">
                <a
                    href="/docs"
                    className="text-[10px] font-black uppercase tracking-widest text-base-content/40 hover:text-accent-teal transition-colors"
                >
                    Ver todos los recursos →
                </a>
            </div>
        </nav>
    );
};

export default DocRelatedSidebar;

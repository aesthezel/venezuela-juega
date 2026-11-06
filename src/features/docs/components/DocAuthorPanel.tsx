import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenNib,
    faArrowUpRightFromSquare,
    faBookOpen,
    faChevronRight,
    faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import type { DocArticle, DocAuthorLink } from '../types';
import { getDocsByAuthor } from '../registry';
import { getPlatformIcon, getPlatformColor } from './authorSocials';

const SocialIconBadge = ({ link }: { link: DocAuthorLink }) => {
    const icon = getPlatformIcon(link.platform);
    const color = getPlatformColor(link.platform);

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.platform} (abre en nueva pestaña)`}
            title={link.platform}
            className="group relative flex items-center justify-center w-9 h-9 rounded-xl border border-surface-700 bg-base-300/40 transition-all duration-200 hover:scale-105 hover:border-surface-400 hover:bg-base-300/80 focus:outline-none focus:ring-2 focus:ring-accent-teal"
        >
            <FontAwesomeIcon
                icon={icon}
                className="text-base transition-transform group-hover:scale-110"
                style={{ color }}
            />
            {/* Tooltip flotante */}
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-950 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                {link.platform}
            </span>
        </a>
    );
};

interface DocAuthorPanelProps {
    article: DocArticle;
}

/**
 * Panel lateral del autor en el layout de 3 columnas (desktop).
 * Incluye perfil, rol, biografía resumida, iconos de redes y enlaces a otros
 * documentos publicados por el mismo autor.
 */
const DocAuthorPanel = ({ article }: DocAuthorPanelProps) => {
    const {
        author,
        authorId,
        authorRole,
        authorBio,
        authorAvatar,
        authorUrl,
        authorLinks,
        accentColor = '#6366f1',
    } = article;

    if (!author) return null;

    const hasLinks = Boolean(authorLinks && authorLinks.length > 0);

    // Obtener otros documentos del mismo autor (excluyendo el que se está leyendo)
    const authorOtherDocs = useMemo(() => {
        const identifier = authorId || author;
        return getDocsByAuthor(identifier, article.slug);
    }, [author, authorId, article.slug]);

    return (
        <section
            aria-label="Información del autor"
            className="rounded-2xl border border-surface-700/80 bg-base-200/50 backdrop-blur-sm p-4 xl:p-5 flex flex-col gap-4 shadow-sm"
        >
            {/* Header / Etiqueta de Autor */}
            <div className="flex items-center justify-between border-b border-surface-700/60 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent-teal flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPenNib} className="text-xs" />
                    Autor
                </span>
                {authorUrl && (
                    <a
                        href={authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-base-content/40 hover:text-accent-teal flex items-center gap-1 transition-colors"
                        title="Ver perfil del autor"
                    >
                        <span>Perfil</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                    </a>
                )}
            </div>

            {/* Cabecera del Autor: Avatar + Nombre + Rol */}
            <div className="flex items-start gap-3">
                {authorAvatar ? (
                    <img
                        src={authorAvatar}
                        alt={`Foto de ${author}`}
                        className="w-11 h-11 rounded-sm object-cover border border-surface-700 flex-shrink-0"
                    />
                ) : (
                    <div
                        className="w-11 h-11 rounded-sm flex items-center justify-center border text-base flex-shrink-0 font-black shadow-inner"
                        style={{
                            background: `${accentColor}18`,
                            borderColor: `${accentColor}40`,
                            color: accentColor,
                        }}
                        aria-hidden="true"
                    >
                        {author
                            .split(' ')
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join('')}
                    </div>
                )}

                <div className="flex flex-col min-w-0">
                    {authorUrl ? (
                        <a
                            href={authorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-sm text-white hover:text-accent-teal transition-colors leading-tight line-clamp-1"
                        >
                            {author}
                        </a>
                    ) : (
                        <h3 className="font-black text-sm text-white leading-tight line-clamp-1">{author}</h3>
                    )}

                    {authorRole && (
                        <p className="text-[11px] font-medium text-base-content/60 mt-0.5 leading-snug line-clamp-2">
                            {authorRole}
                        </p>
                    )}
                </div>
            </div>

            {/* Biografía / Resumen del autor */}
            {authorBio && (
                <div className="relative rounded-xl border border-surface-700/50 bg-base-300/30 p-3 text-xs leading-relaxed text-base-content/70">
                    <FontAwesomeIcon
                        icon={faQuoteLeft}
                        className="text-[10px] text-accent-teal/40 absolute top-2 right-2.5 pointer-events-none"
                    />
                    <div className="space-y-2 pr-3">
                        {authorBio.split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Iconos de Redes Sociales */}
            {hasLinks && (
                <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                        {authorLinks!.map((link) => (
                            <SocialIconBadge key={link.url} link={link} />
                        ))}
                    </div>
                </div>
            )}

            {/* Otros documentos del mismo autor */}
            {authorOtherDocs.length > 0 && (
                <div className="border-t border-surface-700/60 pt-3 mt-1 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faBookOpen} className="text-[10px] text-accent-teal" />
                        Más de este autor ({authorOtherDocs.length})
                    </span>

                    <ul className="flex flex-col gap-2">
                        {authorOtherDocs.slice(0, 3).map((doc) => (
                            <li key={doc.slug}>
                                <a
                                    href={`/docs/${doc.slug}`}
                                    className="group flex items-start gap-2 text-xs font-semibold text-base-content/80 hover:text-accent-teal transition-colors rounded-lg p-1.5 -mx-1.5 hover:bg-base-300/40"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className="text-[9px] text-base-content/30 group-hover:text-accent-teal group-hover:translate-x-0.5 transition-all mt-1"
                                    />
                                    <span className="line-clamp-2 leading-snug">{doc.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default DocAuthorPanel;

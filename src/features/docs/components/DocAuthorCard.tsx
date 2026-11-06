import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpRightFromSquare,
    faPenNib,
    faBookOpen,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import type { DocArticle, DocAuthorLink } from '../types';
import { getDocsByAuthor } from '../registry';
import { getPlatformIcon, getPlatformColor } from './authorSocials';

interface DocAuthorCardProps {
    article: DocArticle;
}

const SocialLink = ({ link }: { link: DocAuthorLink }) => {
    const icon = getPlatformIcon(link.platform);
    const color = getPlatformColor(link.platform);

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.platform} (abre en nueva pestaña)`}
            title={link.platform}
            className="group flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-surface-700 bg-base-300/40 transition-all hover:border-surface-400 hover:bg-base-300/70"
        >
            <FontAwesomeIcon
                icon={icon}
                className="text-sm transition-transform group-hover:scale-110"
                style={{ color }}
            />
            <span className="text-base-content/80 group-hover:text-white transition-colors">
                {link.platform}
            </span>
        </a>
    );
};

/**
 * Tarjeta de perfil del autor (vista ampliada para mobile o cierre de artículo).
 */
const DocAuthorCard = ({ article }: DocAuthorCardProps) => {
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

    const authorOtherDocs = useMemo(() => {
        const identifier = authorId || author;
        return getDocsByAuthor(identifier, article.slug);
    }, [author, authorId, article.slug]);

    return (
        <aside
            aria-label="Perfil del autor"
            className="flex flex-col gap-5 p-6 sm:p-7 rounded-2xl border border-surface-700 bg-base-200/50 backdrop-blur-sm mb-10 shadow-sm"
        >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar / Iniciales */}
                {authorAvatar ? (
                    <img
                        src={authorAvatar}
                        alt={`Foto de ${author}`}
                        className="w-14 h-14 rounded-sm object-cover border border-surface-700 flex-shrink-0"
                    />
                ) : (
                    <div
                        className="flex-shrink-0 w-14 h-14 rounded-sm flex items-center justify-center border text-lg font-black shadow-inner"
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

                {/* Info del autor */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-teal flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faPenNib} className="text-xs" />
                        Escrito por
                    </span>

                    {authorUrl ? (
                        <a
                            href={authorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black text-white text-lg hover:text-accent-teal transition-colors leading-tight"
                        >
                            {author}
                        </a>
                    ) : (
                        <h3 className="font-black text-white text-lg leading-tight">{author}</h3>
                    )}

                    {authorRole && (
                        <p className="text-xs font-semibold text-base-content/60">{authorRole}</p>
                    )}
                </div>
            </div>

            {/* Biografía */}
            {authorBio && (
                <div className="space-y-2 text-sm leading-relaxed text-base-content/75 rounded-xl border border-surface-700/50 bg-base-300/30 p-4">
                    {authorBio.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>
            )}

            {/* Redes sociales */}
            {hasLinks && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {authorLinks!.map((link) => (
                        <SocialLink key={link.url} link={link} />
                    ))}
                </div>
            )}

            {/* Más documentos del mismo autor */}
            {authorOtherDocs.length > 0 && (
                <div className="border-t border-surface-700/60 pt-4 flex flex-col gap-3">
                    <span className="text-[11px] font-black uppercase tracking-widest text-base-content/60 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBookOpen} className="text-accent-teal" />
                        Otros documentos de {author} ({authorOtherDocs.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {authorOtherDocs.slice(0, 4).map((doc) => (
                            <a
                                key={doc.slug}
                                href={`/docs/${doc.slug}`}
                                className="group flex items-start gap-2 text-xs font-semibold text-base-content/80 hover:text-accent-teal transition-colors rounded-xl p-2.5 border border-surface-700/60 bg-base-300/30 hover:bg-base-300/70"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="text-[10px] text-base-content/40 group-hover:text-accent-teal group-hover:translate-x-0.5 transition-all mt-0.5"
                                />
                                <span className="line-clamp-2 leading-snug">{doc.title}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default DocAuthorCard;

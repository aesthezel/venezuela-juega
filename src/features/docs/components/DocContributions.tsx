import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
    faCodePullRequest,
    faBug,
    faCodeCommit,
    faArrowUpRightFromSquare,
    faBookOpenReader,
    faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import type { DocArticle } from '../types';
import {
    getDocEditUrl,
    getDocSourceUrl,
    getDocHistoryUrl,
    getDocIssueUrl,
    DOCS_REPO,
} from '../constants';

interface DocContributionsProps {
    article: DocArticle;
    className?: string;
}

/**
 * Sección de erratas, correcciones y aportes colaborativos a la documentación.
 *
 * Enlaza dinámicamente al repositorio oficial en GitHub permitiendo:
 * - Sugerir cambios directos mediante Pull Request en el archivo Markdown específico.
 * - Reportar erratas o datos desactualizados abriendo un Issue pre-configurado.
 * - Inspeccionar el código fuente (.md) y el historial de revisiones del documento.
 */
const DocContributions = ({ article, className = '' }: DocContributionsProps) => {
    const editUrl = getDocEditUrl(article.sourcePath, article.slug);
    const issueUrl = getDocIssueUrl(article);
    const sourceUrl = getDocSourceUrl(article.sourcePath, article.slug);
    const historyUrl = getDocHistoryUrl(article.sourcePath, article.slug);

    const relativePath =
        article.sourcePath || `${DOCS_REPO.contentDir}/${article.slug}.md`;

    return (
        <section
            aria-labelledby="contributions-heading"
            className={`mt-14 pt-8 border-t border-surface-700/80 ${className}`}
        >
            <div className="relative overflow-hidden rounded-2xl border border-surface-700/80 bg-gradient-to-br from-base-200/70 via-base-200/40 to-base-300/40 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                {/* Glow decorativo de fondo */}
                <div
                    className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-3xl"
                    style={{ background: article.accentColor || '#6366f1' }}
                    aria-hidden="true"
                />

                <div className="relative flex flex-col gap-6">
                    {/* Encabezado */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent-teal/40 bg-accent-teal/10 text-accent-teal">
                                <FontAwesomeIcon icon={faBookOpenReader} className="text-xs" />
                                Erratas y Colaboración Abierta
                            </span>
                        </div>

                        <h2
                            id="contributions-heading"
                            className="text-xl sm:text-2xl font-black text-white leading-tight"
                        >
                            ¿Encontraste un error o deseas proponer una mejora?
                        </h2>

                        <p className="text-sm text-base-content/70 leading-relaxed max-w-2xl">
                            Este recurso es abierto y construido para la comunidad de videojuegos en
                            Venezuela. Si detectas información desactualizada, erratas en normativas
                            o quieres ampliar un tema, puedes enviar un cambio o reportarlo directamente.
                        </p>
                    </div>

                    {/* Botones de Acción Primaria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Botón 1: Pull Request directo en GitHub */}
                        <a
                            href={editUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3.5 rounded-xl border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 p-4 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                        >
                            <div className="w-10 h-10 rounded-xl bg-accent-teal/20 border border-accent-teal/30 flex items-center justify-center text-accent-teal text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                                <FontAwesomeIcon icon={faCodePullRequest} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-white group-hover:text-accent-teal transition-colors flex items-center gap-1.5">
                                    Sugerir cambio con Pull Request
                                    <FontAwesomeIcon
                                        icon={faArrowUpRightFromSquare}
                                        className="text-[10px] text-accent-teal/70"
                                    />
                                </span>
                                <span className="text-xs text-base-content/60 leading-snug mt-0.5">
                                    Edita este archivo <code className="text-[11px] font-mono text-accent-teal">.md</code> en GitHub y abre tu propuesta.
                                </span>
                            </div>
                        </a>

                        {/* Botón 2: Reportar Errata (Issue) */}
                        <a
                            href={issueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3.5 rounded-xl border border-surface-700 bg-base-300/40 hover:bg-base-300/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-accent-teal"
                        >
                            <div className="w-10 h-10 rounded-xl bg-base-300 border border-surface-700 flex items-center justify-center text-brand-gold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                                <FontAwesomeIcon icon={faBug} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-white group-hover:text-brand-gold transition-colors flex items-center gap-1.5">
                                    Reportar una errata o duda
                                    <FontAwesomeIcon
                                        icon={faArrowUpRightFromSquare}
                                        className="text-[10px] text-base-content/40"
                                    />
                                </span>
                                <span className="text-xs text-base-content/60 leading-snug mt-0.5">
                                    Crea un Issue en GitHub con plantilla pre-llenada sobre este documento.
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Enlaces secundarios: Fuente, Historial, Repositorio */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-700/60 text-xs text-base-content/50 font-medium">
                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                                title="Ver archivo fuente en GitHub"
                            >
                                <FontAwesomeIcon icon={faGithub} className="text-sm" />
                                <span>Ver fuente Markdown</span>
                            </a>

                            <span className="text-surface-700 select-none">•</span>

                            <a
                                href={historyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                                title="Historial de revisiones del documento"
                            >
                                <FontAwesomeIcon icon={faCodeCommit} className="text-xs text-accent-teal" />
                                <span>Historial de cambios</span>
                            </a>
                        </div>

                        <span className="font-mono text-[11px] text-base-content/40 truncate max-w-xs">
                            {relativePath}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DocContributions;


import { useEffect, useState, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game, GameDetailPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faGamepad, faGlobe, faCog, faTimes,
    faChevronLeft, faChevronRight, faShoppingCart,
    faHeart as faHeartSolid, faStar as faStarSolid, faEye
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg, faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { BackButton, LinkIcon, CoverImage, StoreButton, StatusBadge } from "@/src/components";
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { useGameStats, useMeasure, useTextLayout } from '@/src/hooks';
import { updateMetadata, getTrailerInfo } from "@/src/utils";

interface DetailSectionProps {
    title: string;
    children: ComponentChildren;
    icon?: any;
}

const DetailSection = ({ title, children, icon }: DetailSectionProps) => (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl hover:border-cyan-500/20 transition-all duration-500 group overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/5 blur-[80px] pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-700" />
        <h3 className="text-sm font-black text-white mb-8 flex items-center gap-4 uppercase tracking-[0.2em]">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-inner">
                {icon && <FontAwesomeIcon icon={icon} className="text-lg" />}
            </div>
            {title}
        </h3>
        <div className="text-slate-300">
            {children}
        </div>
    </div>
);

const GameDetailPage = ({ gameSlug, games }: GameDetailPageProps) => {
    const normalizedSlug = useMemo(() => gameSlug ? decodeURIComponent(gameSlug).trim().toLowerCase() : '', [gameSlug]);
    const { connection, isConnected } = useSpacetimeDB();

    const {
        totalHearts,
        totalVisits,
        hasLiked,
        isFavorite,
        toggleLike,
        toggleFavorite,
        isReady
    } = useGameStats(normalizedSlug);

    const [game, setGame] = useState<Game | null>(null);

    useEffect(() => {
        if (isConnected && normalizedSlug && connection) {
            connection.reducers.visitGame({ gameSlug: normalizedSlug });
        }
    }, [isConnected, normalizedSlug, connection]);

    const handleToggleLike = () => {
        if (!isReady) return;
        toggleLike();
    };

    const handleToggleFavorite = () => {
        if (!isReady) return;
        toggleFavorite();
    };

    const { ref: descRef, width: descWidth } = useMeasure<HTMLParagraphElement>();
    const { lineCount: descLineCount } = useTextLayout(game?.description, descWidth, {
        fontSize: 18,
        lineHeight: 28
    });

    const { ref: pitchRef, width: pitchWidth } = useMeasure<HTMLParagraphElement>();
    const { lineCount: pitchLineCount } = useTextLayout(game?.pitch, pitchWidth, {
        fontSize: 16,
        lineHeight: 24
    });

    const trailerInfo = useMemo(() => game ? getTrailerInfo(game.trailerUrl) : null, [game?.trailerUrl]);

    // Lightbox state
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentShotIndex, setCurrentShotIndex] = useState(0);

    useEffect(() => {
        if (gameSlug) {
            const normalizedSlug = decodeURIComponent(gameSlug).trim().toLowerCase();
            const foundGame = games.find(g => g.slug.toLowerCase() === normalizedSlug);
            setGame(foundGame || null);

            // Solución de runtime render - Placebo visual - No es solución final
            if (foundGame) {
                document.title = `${foundGame.title} — Venezuela Juega`;

                const pageUrl = window.location.href;
                updateMetadata('link[rel="canonical"]', 'href', pageUrl);
                updateMetadata('meta[property="og:url"]', 'content', pageUrl);

                updateMetadata('meta[property="og:title"]', 'content', foundGame.title);
                updateMetadata('meta[name="twitter:title"]', 'content', foundGame.title);

                const description = foundGame.description.substring(0, 155).trim() + '...';
                updateMetadata('meta[name="description"]', 'content', description);
                updateMetadata('meta[property="og:description"]', 'content', description);
                updateMetadata('meta[name="twitter:description"]', 'content', description);

                const imageUrl = foundGame.imageCover || foundGame.imageHero || foundGame.imageUrl;
                updateMetadata('meta[property="og:image"]', 'content', imageUrl);
                updateMetadata('meta[name="twitter:image"]', 'content', imageUrl);

                updateMetadata('meta[name="twitter:card"]', 'content', 'summary_large_image');
            }

        } else {
            setGame(null);
        }
    }, [gameSlug, games]);

    const handleGoBack = () => {
        route('/');
    };

    // Lightbox helpers
    const openLightbox = (index: number) => {
        setCurrentShotIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const showPrev = () => {
        if (!game?.screenshots?.length) return;
        setCurrentShotIndex(prev => (prev - 1 + game.screenshots.length) % game.screenshots.length);
    };

    const showNext = () => {
        if (!game?.screenshots?.length) return;
        setCurrentShotIndex(prev => (prev + 1) % game.screenshots.length);
    };

    useEffect(() => {
        if (!isLightboxOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', onKey);

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
        };
    }, [isLightboxOpen, game?.screenshots?.length]);

    if (!gameSlug) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Slug de juego inválido</h1>
                    <p className="text-gray-400 mb-6">No se proporcionó un slug de juego válido.</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver al catálogo
                    </button>
                </div>
            </main>
        );
    }

    if (!game) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Juego no encontrado</h1>
                    <p className="text-gray-400 mb-6">El juego que buscas no existe o ha sido eliminado.</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver al catálogo
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 relative">
            {/* Global Decorative Blur Backgrounds */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <BackButton onClick={handleGoBack} className="mb-10 hover:translate-x-[-4px] transition-transform" />
            </div>

            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] mb-12 relative group/hero animate-in zoom-in-95 duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

                <div className="flex flex-col lg:flex-row relative z-10">
                    <div className="lg:w-[60%] relative aspect-video bg-slate-950 overflow-hidden group-hover/hero:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-700">
                        {trailerInfo ? (
                            trailerInfo.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media; fullscreen"
                                    allowFullScreen
                                    title={`${game.title} trailer`}
                                />
                            ) : (
                                <video
                                    src={trailerInfo.url}
                                    controls
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <CoverImage
                                src={game.imageHero || game.imageUrl}
                                alt={game.title}
                                className="absolute inset-0 w-full h-full object-cover scale-105"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 pointer-events-none border-r border-white/5 hidden lg:block" />
                    </div>

                    <div className="lg:w-[40%] p-6 lg:p-10 flex flex-col justify-start relative">
                        {/* Title & Developer */}
                        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-2xl">
                                {game.title}
                            </h1>
                            <p className="text-lg text-cyan-400 font-bold tracking-wide uppercase text-[12px]">
                                {game.developers.join(' • ')}
                            </p>
                        </div>

                        {/* Description with improved contrast */}
                        <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                            <p
                                ref={descRef}
                                className={`text-slate-300 mb-8 leading-relaxed text-base lg:text-lg font-medium opacity-90 ${descLineCount > 10 ? 'line-clamp-[10]' : ''}`}
                            >
                                {game.description}
                            </p>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in duration-1000 delay-300">
                            {game.genre.map(g => (
                                <span key={g} className="bg-white/5 border border-white/10 text-slate-300 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Status & Actions - The new interaction hub */}
                        <div className="mt-auto flex flex-col items-center sm:items-start gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
                            <StatusBadge status={game.status} size="md" variant="soft" className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300" />

                            <div className="flex items-stretch bg-slate-950/40 backdrop-blur-xl rounded-[1.25rem] border border-white/5 divide-x divide-white/10 overflow-hidden shadow-2xl">
                                <button
                                    onClick={handleToggleLike}
                                    title={hasLiked ? "Quitar me gusta" : "Me gusta"}
                                    className={`flex items-center gap-3 px-8 py-4 transition-all duration-300 group/like hover:bg-rose-500/5 ${hasLiked ? 'text-rose-400' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={hasLiked ? faHeartSolid : faHeartReg} className={`transition-transform duration-300 ${hasLiked ? "scale-125 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" : "group-hover/like:scale-110"}`} />
                                    <span className="font-black text-sm tracking-tight">{totalHearts}</span>
                                </button>

                                <button
                                    onClick={handleToggleFavorite}
                                    title={isFavorite ? "Quitar de favoritos" : "Añadir de favoritos"}
                                    className={`flex items-center justify-center px-8 py-4 transition-all duration-300 group/fav hover:bg-amber-500/5 ${isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarReg} className={`transition-transform duration-300 ${isFavorite ? "scale-125 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "group-hover/fav:scale-110"}`} />
                                </button>

                                <div className="flex items-center gap-3 px-8 py-4 bg-white/[0.02] text-slate-400">
                                    <FontAwesomeIcon icon={faEye} className="text-xs opacity-60" />
                                    <span className="font-black text-sm tracking-widest">{totalVisits}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="animate-in slide-in-from-left-8 duration-700 delay-200">
                    <DetailSection title="Información General" icon={faGamepad}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-2 border-b border-white/5 hover:bg-white/5 px-2 rounded-lg transition-colors group">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Lanzamiento</span>
                                <span className="text-slate-100 font-bold group-hover:text-cyan-300 transition-colors">{game.releaseDate}</span>
                            </div>
                            {game.lastUpdateDate && (
                                <div className="flex items-center justify-between py-2 border-b border-white/5 hover:bg-white/5 px-2 rounded-lg transition-colors group">
                                    <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Actualización</span>
                                    <span className="text-slate-100 font-bold group-hover:text-cyan-300 transition-colors">{game.lastUpdateDate}</span>
                                </div>
                            )}
                            <div className="py-2">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-widest block mb-4">Plataformas Disponibles</span>
                                <div className="flex flex-wrap gap-2">
                                    {game.platform.map(platform => (
                                        <span key={platform} className="bg-slate-950/60 border border-white/10 text-slate-300 px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-tight">
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-white/5 hover:bg-white/5 px-2 rounded-lg transition-colors group">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Distribuidores</span>
                                <span className="text-slate-100 font-bold group-hover:text-cyan-300 transition-colors">
                                    {game.publishers.length > 0 ? game.publishers.join(', ') : 'Desarrollo Independiente'}
                                </span>
                            </div>
                        </div>
                    </DetailSection>
                </div>

                <div className="flex flex-col gap-10 animate-in slide-in-from-right-8 duration-700 delay-200">
                    {game.stores.length > 0 && (
                        <DetailSection title="Tiendas Oficiales" icon={faShoppingCart}>
                            <div className="flex flex-wrap gap-4">
                                {game.stores.map(store => (
                                    <div key={store.name} className="hover:scale-105 transition-transform duration-300">
                                        <StoreButton store={store} />
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    )}

                    <DetailSection title="Características" icon={faCog}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-2 border-b border-white/5">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Motor</span>
                                <span className="text-slate-100 font-bold">{game.engine}</span>
                            </div>
                            <div className="py-2">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-widest block mb-4">Idiomas</span>
                                <div className="flex flex-wrap gap-2">
                                    {game.languages.map(language => (
                                        <span key={language} className="bg-slate-950/60 border border-white/10 text-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                                            {language}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {game.funding && (
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-cyan-400 text-xs font-black uppercase tracking-widest">Financiamiento</span>
                                    <span className="text-slate-100 font-bold">{game.funding}</span>
                                </div>
                            )}
                        </div>
                    </DetailSection>
                </div>

                {game.pitch && (
                    <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                        <DetailSection title="Pitch del Proyecto">
                            <p ref={pitchRef} className={`text-slate-300 leading-relaxed text-lg italic opacity-80 ${pitchLineCount > 10 ? 'line-clamp-[12]' : ''}`}>
                                {game.pitch}
                            </p>
                        </DetailSection>
                    </div>
                )}

                {game.links.length > 0 && (
                    <div className="lg:col-span-2 animate-in fade-in duration-1000 delay-500">
                        <DetailSection title="Enlaces y Presencia" icon={faGlobe}>
                            <div className="flex flex-wrap gap-4">
                                {game.links.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-slate-900 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white font-black py-4 px-8 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all duration-300 shadow-xl group/link"
                                    >
                                        {link.name}
                                        <div className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform">
                                            <LinkIcon />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </DetailSection>
                    </div>
                )}
            </div>

            {game.screenshots && game.screenshots.length > 0 && (
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl mt-12 relative overflow-hidden group/gallery animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[120px] pointer-events-none group-hover/gallery:bg-cyan-500/10 transition-all duration-1000" />

                    <h3 className="text-xs font-black text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        Galería de Capturas
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {game.screenshots.map((shot, idx) => (
                            <button
                                key={`${shot}-${idx}`}
                                type="button"
                                onClick={() => openLightbox(idx)}
                                className="relative group/shot focus:outline-none overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:border-cyan-500/40 hover:shadow-cyan-500/10"
                                aria-label={`Abrir captura ${idx + 1}`}
                            >
                                <img
                                    src={shot}
                                    alt={`Screenshot ${idx + 1}`}
                                    className="w-full h-48 lg:h-60 object-cover cursor-zoom-in transition-transform duration-1000 group-hover/shot:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/shot:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                                    <div className="translate-y-4 group-hover/shot:translate-y-0 transition-transform duration-500">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] bg-cyan-500 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                            Ampliar Captura
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isLightboxOpen && game.screenshots && game.screenshots.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeLightbox}
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
                        aria-label="Cerrar"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                    </button>

                    {game.screenshots.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            className="absolute left-2 sm:left-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-colors"
                            aria-label="Anterior"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
                        </button>
                    )}

                    {game.screenshots.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            className="absolute right-2 sm:right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-colors"
                            aria-label="Siguiente"
                        >
                            <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
                        </button>
                    )}

                    <div
                        className="max-w-[95vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={game.screenshots[currentShotIndex]}
                            alt={`Screenshot ampliada ${currentShotIndex + 1}`}
                            className="object-contain max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
                        {currentShotIndex + 1} / {game.screenshots.length}
                    </div>
                </div>
            )}
        </main>
    );
};

export default GameDetailPage;
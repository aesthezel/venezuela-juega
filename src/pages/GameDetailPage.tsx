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
import { faSteam, faItchIo, faPlaystation, faXbox, faGooglePlay, faApple, faMeta } from '@fortawesome/free-brands-svg-icons';
import { BackButton, LinkIcon, CoverImage, StoreButton, StatusBadge, PageTransition, ScreenshotLightbox } from "@/src/components";
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { useGameStats, useMeasure, useTextLayout } from '@/src/hooks';
import { updateMetadata, getTrailerInfo } from "@/src/utils";

interface DetailSectionProps {
    title: string;
    children: ComponentChildren;
    icon?: any;
}

const DetailSection = ({ title, children, icon }: DetailSectionProps) => (
    <div className="card bg-base-200 shadow-xl border border-base-content/5 overflow-hidden">
        <div className="card-body">
            <h3 className="card-title text-sm uppercase tracking-widest text-base-content mb-6 flex items-center gap-3">
                {icon && <FontAwesomeIcon icon={icon} className="text-primary text-lg" />}
                {title}
            </h3>
            <div className="text-base-content/80">
                {children}
            </div>
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

    const primaryStore = useMemo(() => {
        if (!game?.stores || game.stores.length === 0) return null;
        const priority = ['steam', 'epic', 'gog', 'playstation', 'xbox', 'nintendo', 'google play', 'app store', 'itch.io', 'itch'];
        for (const p of priority) {
            const found = game.stores.find(s => s.name.toLowerCase().includes(p));
            if (found) return found;
        }
        return game.stores[0];
    }, [game?.stores]);

    const primaryStoreIcon = useMemo(() => {
        if (!primaryStore) return faShoppingCart;
        const name = primaryStore.name.toLowerCase();
        if (name.includes('steam')) return faSteam;
        if (name.includes('itch')) return faItchIo;
        if (name.includes('playstation')) return faPlaystation;
        if (name.includes('xbox') || name.includes('microsoft')) return faXbox;
        if (name.includes('play store') || name.includes('google')) return faGooglePlay;
        if (name.includes('app store') || name.includes('apple')) return faApple;
        if (name.includes('meta')) return faMeta;
        if (name.includes('nintendo') || name.includes('gog')) return faGamepad;
        return faShoppingCart;
    }, [primaryStore]);

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



    if (!gameSlug) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Slug de juego inválido</h1>
                    <p className="text-base-content/70 mb-6">No se proporcionó un slug de juego válido.</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-accent-teal-dark hover:bg-accent-teal-dark text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
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
                    <p className="text-base-content/70 mb-6">El juego que buscas no existe o ha sido eliminado.</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-accent-teal-dark hover:bg-accent-teal-dark text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver al catálogo
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
            <PageTransition>
                <main className="container mx-auto px-4 py-8 relative z-10">
                    {/* Global Decorative Blur Backgrounds */}
                    <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-accent-teal-dark/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
                    <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <BackButton onClick={handleGoBack} className="mb-10 hover:translate-x-[-4px] transition-transform" />
                    </div>

                    <div className="card lg:card-side bg-base-200 shadow-2xl border border-base-content/5 mb-12 animate-in zoom-in-95 duration-700">
                        <figure className="lg:w-[60%] relative aspect-video bg-base-300">
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
                        </figure>

                        <div className="card-body lg:w-[40%] p-6 lg:p-10 flex flex-col justify-start">
                            {/* Title & Developer */}
                            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h1 className="card-title text-4xl lg:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
                                    {game.title}
                                </h1>
                                <p className="text-primary font-bold tracking-wide uppercase text-xs">
                                    {game.developers.join(' • ')}
                                </p>
                            </div>

                            {primaryStore && (
                                <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                                    <a href={primaryStore.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary shadow-xl shadow-primary/20 text-[11px] font-black uppercase tracking-widest px-8 hover:scale-105 transition-transform flex items-center gap-2 w-fit">
                                        <FontAwesomeIcon icon={primaryStoreIcon} className="text-lg" />
                                        Jugar / Obtener en {primaryStore.name}
                                    </a>
                                </div>
                            )}

                            {/* Description with improved contrast */}
                            <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                                <p
                                    ref={descRef}
                                    className={`text-base-content/80 mb-8 leading-relaxed text-base lg:text-lg font-medium opacity-90 ${descLineCount > 10 ? 'line-clamp-[10]' : ''}`}
                                >
                                    {game.description}
                                </p>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-8 animate-in fade-in duration-1000 delay-300">
                                {game.genre.map(g => (
                                    <div key={g} className="badge badge-outline badge-lg uppercase text-xs tracking-wider font-bold opacity-80 hover:opacity-100 transition-opacity">
                                        {g}
                                    </div>
                                ))}
                            </div>

                            {/* Status & Actions - The new interaction hub */}
                            <div className="mt-auto flex flex-col items-center sm:items-start gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
                                <StatusBadge status={game.status} size="md" variant="soft" className="uppercase tracking-widest text-xs font-bold" />

                                <div className="join shadow-xl self-start bg-base-300">
                                    <button
                                        onClick={handleToggleLike}
                                        title={hasLiked ? "Quitar me gusta" : "Me gusta"}
                                        className="btn join-item btn-ghost border-none hover:bg-base-200"
                                    >
                                        <FontAwesomeIcon icon={hasLiked ? faHeartSolid : faHeartReg} className={`text-lg transition-transform ${hasLiked ? "text-error scale-110" : ""}`} />
                                        <span className="font-bold">{totalHearts}</span>
                                    </button>

                                    <button
                                        onClick={handleToggleFavorite}
                                        title={isFavorite ? "Quitar de favoritos" : "Añadir de favoritos"}
                                        className="btn join-item btn-ghost border-none hover:bg-base-200"
                                    >
                                        <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarReg} className={`text-lg transition-transform ${isFavorite ? "text-warning scale-110" : ""}`} />
                                    </button>

                                    <div className="btn join-item btn-ghost border-none no-animation pointer-events-none text-base-content/70">
                                        <FontAwesomeIcon icon={faEye} />
                                        <span className="font-bold">{totalVisits}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="animate-in slide-in-from-left-8 duration-700 delay-200">
                            <DetailSection title="Información General" icon={faGamepad}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-3 border-b border-base-content/10 px-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider">Lanzamiento</span>
                                        <span className="text-base-content font-bold">{game.releaseDate}</span>
                                    </div>
                                    {game.lastUpdateDate && (
                                        <div className="flex items-center justify-between py-3 border-b border-base-content/10 px-2">
                                            <span className="text-primary text-xs font-bold uppercase tracking-wider">Actualización</span>
                                            <span className="text-base-content font-bold">{game.lastUpdateDate}</span>
                                        </div>
                                    )}
                                    <div className="py-3 px-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-4">Plataformas Disponibles</span>
                                        <div className="flex flex-wrap gap-2">
                                            {game.platform.map(platform => (
                                                <div key={platform} className="badge badge-neutral font-bold uppercase tracking-tight">
                                                    {platform}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-base-content/10 px-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider">Distribuidores</span>
                                        <span className="text-base-content font-bold">
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
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between py-3 border-b border-base-content/10 px-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider">Motor</span>
                                        <span className="text-base-content font-bold">{game.engine}</span>
                                    </div>
                                    <div className="py-3 px-2">
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider block mb-4">Idiomas</span>
                                        <div className="flex flex-wrap gap-2">
                                            {game.languages.map(language => (
                                                <div key={language} className="badge badge-neutral font-bold uppercase tracking-tight">
                                                    {language}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {game.funding && (
                                        <div className="flex items-center justify-between py-3 border-b border-base-content/10 px-2">
                                            <span className="text-primary text-xs font-bold uppercase tracking-wider">Financiamiento</span>
                                            <span className="text-base-content font-bold">{game.funding}</span>
                                        </div>
                                    )}
                                </div>
                            </DetailSection>
                        </div>

                        {game.pitch && (
                            <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                                <DetailSection title="Pitch del Proyecto">
                                    <p ref={pitchRef} className={`text-base-content/70 leading-relaxed text-lg italic opacity-80 ${pitchLineCount > 10 ? 'line-clamp-[12]' : ''}`}>
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
                                                className="btn btn-outline hover:btn-primary text-xs uppercase tracking-wider"
                                            >
                                                {link.name}
                                                <LinkIcon />
                                            </a>
                                        ))}
                                    </div>
                                </DetailSection>
                            </div>
                        )}
                    </div>

                    {game.screenshots && game.screenshots.length > 0 && (
                        <div className="card bg-base-200 shadow-xl border border-base-content/5 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
                            <div className="card-body p-8 lg:p-12">
                                <h3 className="card-title text-sm uppercase tracking-widest text-base-content mb-8">
                                    Galería de Capturas
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {game.screenshots.map((shot, idx) => (
                                        <button
                                            key={`${shot}-${idx}`}
                                            type="button"
                                            onClick={() => openLightbox(idx)}
                                            className="relative group/shot focus:outline-none overflow-hidden rounded-box border border-base-content/10 shadow-lg hover:shadow-xl transition-all"
                                            aria-label={`Abrir captura ${idx + 1}`}
                                        >
                                            <img
                                                src={shot}
                                                alt={`Screenshot ${idx + 1}`}
                                                className="w-full h-48 lg:h-60 object-cover cursor-zoom-in transition-transform group-hover/shot:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/shot:opacity-100 transition-all flex flex-col justify-end p-4">
                                                <div className="badge badge-primary mx-auto">
                                                    Ampliar
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </PageTransition>

            <ScreenshotLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                screenshots={game.screenshots || []}
                initialIndex={currentShotIndex}
            />
        </>
    );
};

export default GameDetailPage;
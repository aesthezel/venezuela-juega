import { useEffect, useState, useMemo } from 'preact/hooks';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGamepad, faGlobe, faCog, faTimes, faChevronLeft, faChevronRight, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {BackButton, LinkIcon, CoverImage, StoreButton, StatusBadge} from "@/src/components";
import { GameDetailPageProps } from "@/src/types";
import { updateMetadata, getTrailerInfo } from "@/src/utils";

interface DetailSectionProps {
    title: string;
    children: ComponentChildren;
    icon?: any;
}

const DetailSection = ({ title, children, icon }: DetailSectionProps) => (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon} className="text-cyan-400" />}
            {title}
        </h3>
        {children}
    </div>
);

const GameDetailPage = ({ gameSlug, games }: GameDetailPageProps) => {
    const [game, setGame] = useState<Game | null>(null);
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
        <main className="container mx-auto px-4 py-8">
            <BackButton onClick={handleGoBack} className="mb-8" />

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl mb-8 relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/20 to-transparent pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row relative z-10">
                    <div className="lg:w-[60%] relative aspect-video bg-black">
                        {trailerInfo ? (
                            trailerInfo.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
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
                                    muted={false}
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <CoverImage
                                src={game.imageHero || game.imageUrl}
                                alt={game.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="lg:w-[40%] p-6 lg:p-8 flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 leading-tight">
                            {game.title}
                        </h1>
                        <p className="text-xl text-cyan-400 font-medium mb-6">
                            {game.developers.join(', ')}
                        </p>
                        
                        <p 
                            ref={descRef}
                            className={`text-gray-300 mb-8 leading-relaxed text-lg ${descLineCount > 10 ? 'line-clamp-[12]' : ''}`}
                        >
                            {game.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {game.genre.map(g => (
                                <span key={g} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <div>
                            <StatusBadge status={game.status} size="md" variant="solid" className="rounded-full shadow-md shadow-cyan-500/20" />
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <DetailSection title="Información General" icon={faGamepad}>
                    <div className="space-y-4">
                        <div>
                            <span className="text-cyan-400 font-semibold">Fecha de Lanzamiento:</span>
                            <span className="ml-2 text-gray-300">{game.releaseDate}</span>
                        </div>
                        {game.lastUpdateDate && (
                            <div>
                                <span className="text-cyan-400 font-semibold">Última Actualización:</span>
                                <span className="ml-2 text-gray-300">{game.lastUpdateDate}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-cyan-400 font-semibold">Plataformas:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {game.platform.map(platform => (
                                    <span key={platform} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm">
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-cyan-400 font-semibold">Distribuidores:</span>
                            <span className="ml-2 text-gray-300">
                                {game.publishers.length > 0 ? game.publishers.join(', ') : 'N/A'}
                            </span>
                        </div>
                    </div>
                </DetailSection>

                {game.stores.length > 0 && (
                    <DetailSection title="Disponible en Tiendas" icon={faShoppingCart}>
                        <div className="flex flex-wrap gap-3">
                            {game.stores.map(store => (
                                <StoreButton key={store.name} store={store} />
                            ))}
                        </div>
                    </DetailSection>
                )}

                <DetailSection title="Detalles Técnicos" icon={faCog}>
                    <div className="space-y-4">
                        <div>
                            <span className="text-cyan-400 font-semibold">Motor de Juego:</span>
                            <span className="ml-2 text-gray-300">{game.engine}</span>
                        </div>
                        <div>
                            <span className="text-cyan-400 font-semibold">Idiomas Disponibles:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {game.languages.map(language => (
                                    <span key={language} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm">
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {game.funding && (
                            <div>
                                <span className="text-cyan-400 font-semibold">Financiamiento:</span>
                                <span className="ml-2 text-gray-300">{game.funding}</span>
                            </div>
                        )}
                    </div>
                </DetailSection>

                {game.pitch && (
                    <div className="lg:col-span-2">
                        <DetailSection title="Pitch del Proyecto">
                            <p ref={pitchRef} className={`text-gray-300 leading-relaxed ${pitchLineCount > 10 ? 'line-clamp-[12]' : ''}`}>
                                {game.pitch}
                            </p>
                        </DetailSection>
                    </div>
                )}

                {game.links.length > 0 && (
                    <DetailSection title="Enlaces y Redes Sociales" icon={faGlobe}>
                        <div className="flex flex-wrap gap-3">
                            {game.links.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                >
                                    {link.name}
                                    <LinkIcon />
                                </a>
                            ))}
                        </div>
                    </DetailSection>
                )}
            </div>

            {game.screenshots && game.screenshots.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-6 shadow-lg mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Galería de Capturas</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {game.screenshots.map((shot, idx) => (
                            <button
                                key={`${shot}-${idx}`}
                                type="button"
                                onClick={() => openLightbox(idx)}
                                className="relative group focus:outline-none"
                                aria-label={`Abrir captura ${idx + 1}`}
                                title="Ampliar"
                            >
                                <img
                                    src={shot}
                                    alt={`Screenshot ${idx + 1}`}
                                    className="w-full h-40 sm:h-44 lg:h-48 object-cover rounded-lg border border-slate-700 cursor-zoom-in"
                                    loading="lazy"
                                />
                                <span className="pointer-events-none absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors" />
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
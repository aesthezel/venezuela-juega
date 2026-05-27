import { useEffect, useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game } from '@/types';
import { useMeasure } from '@/hooks/useMeasure';
import { useTextLayout } from '@/hooks/useTextLayout';
import { CloseIcon, LinkIcon } from '@/components/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart as faHeartSolid, faStar as faStarSolid, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg, faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import StoreButton from './StoreButton';
import ScreenshotLightbox from './ScreenshotLightbox';
import { trackEvent } from '@/utils/analytics';
import { generateSlug } from '@/utils';
import { useGameStats } from '@/hooks/useGameStats';
import { useSpacetimeDB } from '@/spacetimedb/connection';

interface ModalProps {
    game: Game;
    onClose: () => void;
}

interface DetailItemProps {
    label: string;
    children: ComponentChildren;
}

const DetailItem = ({ label, children }: DetailItemProps) => (
    <div className="flex flex-col">
        <dt className="text-xs font-bold text-base-content/70 uppercase tracking-wider">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-base-content">{children}</dd>
    </div>
);

const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
        // ignore invalid urls
    }
    return null;
}

const Modal = ({ game, onClose }: ModalProps) => {
    const { connection, isConnected } = useSpacetimeDB();
    const {
        totalHearts,
        totalVisits,
        hasLiked,
        isFavorite,
        toggleLike,
        toggleFavorite,
        isReady
    } = useGameStats(game.slug);

    const handleToggleLike = () => {
        if (!isReady) return;
        toggleLike();
    };

    const handleToggleFavorite = () => {
        if (!isReady) return;
        toggleFavorite();
    };

    const { ref: pitchRef, width: pitchWidth } = useMeasure<HTMLDivElement>();
    const { lineCount: pitchLineCount } = useTextLayout(game.pitch, pitchWidth, {
        fontSize: 16,
        lineHeight: 28
    });
    const [isPitchExpanded, setIsPitchExpanded] = useState(false);

    const { ref: descRef, width: descWidth } = useMeasure<HTMLDivElement>();
    const { lineCount: descLineCount } = useTextLayout(game.description, descWidth, {
        fontSize: 16,
        lineHeight: 24
    });
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentShotIndex, setCurrentShotIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentShotIndex(index);
        setIsLightboxOpen(true);
    };

    useEffect(() => {
        if (isConnected && game.slug && connection) {
            connection.reducers.visitGame({ gameSlug: game.slug });
        }
    }, [isConnected, game.slug, connection]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleViewFullInfo = () => {
        onClose();
        route(`/game/${game.slug}`);
    };

    const embedUrl = getYoutubeEmbedUrl(game.trailerUrl);

    return (
        <dialog className="modal modal-open z-[100] bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="modal-box p-0 bg-base-200 shadow-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden relative">
                <form method="dialog">
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-ghost absolute top-3 right-3 md:top-4 md:right-4 z-20 h-10 w-10 min-h-0 bg-base-100/60 text-base-content/70 hover:text-white hover:bg-error/80 backdrop-blur-md border border-base-content/10 hover:border-transparent flex items-center justify-center"
                        title="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </form>

                <div className="overflow-y-auto flex-1 w-full relative custom-scrollbar">

                    <div className="relative w-full h-56 md:h-80 flex-shrink-0 bg-base-100">
                        <img
                            src={game.imageHero || game.imageCover || game.imageUrl}
                            alt={game.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/60 to-transparent"></div>

                        <button
                            onClick={handleViewFullInfo}
                            className="hidden md:flex absolute bottom-0 right-10 translate-y-1/2 z-20 btn btn-primary border-none shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:translate-y-[40%] transition-transform duration-300 items-center gap-2"
                        >
                            <span>Ver más sobre el juego</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>

                    <div className="px-6 md:px-10 pb-10 -mt-16 md:-mt-32 relative z-10 w-full flex flex-col gap-6 md:gap-8">

                        <div className="flex flex-col md:pr-56">
                            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-xl tracking-tight leading-tight">{game.title}</h2>
                            <p className="text-primary font-bold tracking-wide uppercase text-xs mt-2">
                                {game.developers.map((dev, i) => (
                                    <span key={dev}>
                                        <a
                                            href={`/developer/${generateSlug(dev)}`}
                                            onClick={(e) => { e.preventDefault(); onClose(); route(`/developer/${generateSlug(dev)}`); }}
                                            className="hover:underline hover:text-white transition-colors cursor-pointer"
                                        >
                                            {dev}
                                        </a>
                                        {i < game.developers.length - 1 && ' • '}
                                    </span>
                                ))}
                            </p>
                        </div>

                        <div className="join shadow-xl self-start animate-in fade-in slide-in-from-left-4 duration-500 delay-200 mt-2 md:mt-6 bg-base-300">
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

                        {/* Botón "Ver más" exclusivo para móviles */}
                        <div className="md:hidden w-full mt-2">
                            <button
                                onClick={handleViewFullInfo}
                                className="w-full btn btn-primary border-none shadow-lg shadow-primary/25 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold active:scale-[0.98] transition-all"
                            >
                                <span>Ver más sobre el juego</span>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-4">

                            <div className="lg:col-span-2 flex flex-col gap-6">
                                {game.pitch && (
                                    <div className="card bg-base-300 shadow-sm border border-base-content/5" ref={pitchRef}>
                                        <div className="card-body p-5 md:p-6">
                                            <h3 className="card-title text-sm font-bold text-primary uppercase tracking-wider mb-2">Acerca del juego</h3>
                                            <p className={`text-base-content/80 text-base md:text-lg leading-relaxed whitespace-pre-wrap transition-all ${!isPitchExpanded && pitchLineCount > 6 ? 'line-clamp-6' : ''}`}>
                                                {game.pitch}
                                            </p>
                                            {pitchLineCount > 6 && (
                                                <button
                                                    onClick={() => setIsPitchExpanded(!isPitchExpanded)}
                                                    className="text-primary hover:brightness-125 text-sm font-bold mt-3 transition-colors flex items-center gap-1 self-start"
                                                >
                                                    {isPitchExpanded ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!embedUrl && game.description && (
                                    <div className="card bg-base-300 shadow-sm border border-base-content/5" ref={descRef}>
                                        <div className="card-body p-5 md:p-6">
                                            <h3 className="card-title text-sm font-bold text-base-content/70 uppercase tracking-wider mb-3">Descripción General</h3>
                                            <div className={`text-base-content/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-all ${!isDescExpanded && descLineCount > 6 ? 'line-clamp-6' : ''}`}>
                                                {game.description}
                                            </div>
                                            {descLineCount > 6 && (
                                                <button
                                                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                                                    className="text-primary hover:brightness-125 text-sm font-bold mt-3 transition-colors flex items-center gap-1 self-start"
                                                >
                                                    {isDescExpanded ? 'Ver menos' : 'Ver más'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {embedUrl && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            Trailer
                                        </h3>
                                        <div className="aspect-video w-full rounded-box overflow-hidden border border-base-content/10 shadow-xl bg-base-300">
                                            <iframe
                                                src={embedUrl}
                                                title={`${game.title} Trailer`}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {game.screenshots && game.screenshots.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            Capturas
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {game.screenshots.slice(0, 6).map((shot, idx) => (
                                                <button
                                                    key={`${shot}-${idx}`}
                                                    onClick={() => openLightbox(idx)}
                                                    className="relative group/shot overflow-hidden rounded-box border border-base-content/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
                                                >
                                                    <img
                                                        src={shot}
                                                        alt={`Screenshot ${idx + 1}`}
                                                        className="w-full h-24 md:h-32 object-cover cursor-zoom-in group-hover/shot:scale-110 transition-transform duration-700"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/shot:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-6">

                                {game.stores.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-1">Disponible en</h3>
                                        <div className="flex flex-col gap-2">
                                            {game.stores.map(store => (
                                                <StoreButton key={store.name} store={store} gameSlug={game.slug} gameTitle={game.title} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {game.links.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-1">Enlaces y Redes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {game.links.map(link => (
                                                <a
                                                    key={link.name}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-sm hover:btn-primary gap-2"
                                                    onClick={() => trackEvent('game_external_click', { game_slug: game.slug, game_title: game.title, link_name: link.name, url: link.url })}
                                                >
                                                    {link.name} <LinkIcon />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="card bg-base-300 shadow-sm border border-base-content/5">
                                    <div className="card-body p-5 md:p-6">
                                        <dl className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-4">
                                            <DetailItem label="Estado">{game.status}</DetailItem>
                                            <DetailItem label="Lanzamiento">{game.releaseDate}</DetailItem>
                                            <DetailItem label="Géneros">{game.genre.join(', ')}</DetailItem>
                                            <DetailItem label="Plataformas">{game.platform.join(', ')}</DetailItem>
                                            <DetailItem label="Motor">{game.engine}</DetailItem>
                                            <DetailItem label="Idiomas">{game.languages.join(', ')}</DetailItem>
                                            <DetailItem label="Distribuidores">{game.publishers.length > 0 ? game.publishers.join(', ') : 'N/A'}</DetailItem>
                                            {game.funding && <DetailItem label="Financiamiento">{game.funding}</DetailItem>}
                                            {game.lastUpdateDate && <DetailItem label="Última Actualización">{game.lastUpdateDate}</DetailItem>}
                                        </dl>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>

            <ScreenshotLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                screenshots={game.screenshots || []}
                initialIndex={currentShotIndex}
            />
        </dialog>
    );
};

export default Modal;
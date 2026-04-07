import { useEffect, useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { CloseIcon, LinkIcon } from '@/src/components/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StoreButton } from '@/src/components';
import { trackEvent } from '@/src/utils/analytics';

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
        <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-slate-200">{children}</dd>
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
        <div
            className="fixed inset-0 z-[100] flex justify-center items-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden relative animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-slate-950/60 text-slate-300 hover:text-white hover:bg-red-500/80 backdrop-blur-md transition-all border border-slate-700/50 hover:border-transparent"
                    title="Cerrar"
                >
                    <CloseIcon />
                </button>

                {/* Scrollable Container */}
                <div className="overflow-y-auto flex-1 w-full relative custom-scrollbar">

                    {/* Hero Section */}
                    <div className="relative w-full h-56 md:h-80 flex-shrink-0 bg-slate-950">
                        <img
                            src={game.imageHero || game.imageCover || game.imageUrl}
                            alt={game.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                    </div>

                    {/* Content Area */}
                    <div className="px-6 md:px-10 pb-10 -mt-20 md:-mt-24 relative z-10 w-full flex flex-col gap-8">

                        {/* Header (Title & Buttons) */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-xl tracking-tight leading-tight">{game.title}</h2>
                                <p className="text-cyan-400 font-medium md:text-lg mt-1">{game.developers.join(', ')}</p>
                            </div>
                            <button
                                onClick={handleViewFullInfo}
                                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2 flex-shrink-0"
                            >
                                <span>Ver más sobre el juego</span>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                            {/* Left Column: Media & Pitch */}
                            <div className="lg:col-span-2 flex flex-col gap-8">
                                {game.pitch && (
                                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/40" ref={pitchRef}>
                                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Acerca del juego</h3>
                                        <p className={`text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap transition-all ${!isPitchExpanded && pitchLineCount > 6 ? 'line-clamp-6' : ''}`}>
                                            {game.pitch}
                                        </p>
                                        {pitchLineCount > 6 && (
                                            <button 
                                                onClick={() => setIsPitchExpanded(!isPitchExpanded)} 
                                                className="text-cyan-400 hover:text-cyan-300 text-sm font-bold mt-3 transition-colors flex items-center gap-1"
                                            >
                                                {isPitchExpanded ? 'Ver menos' : 'Ver más'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Descripción completa */}
                                {!embedUrl && game.description && (
                                    <div className="bg-slate-800/20 p-6 rounded-2xl border border-slate-700/30" ref={descRef}>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Descripción General</h3>
                                        <div className={`text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-all ${!isDescExpanded && descLineCount > 6 ? 'line-clamp-6' : ''}`}>
                                            {game.description}
                                        </div>
                                        {descLineCount > 6 && (
                                            <button 
                                                onClick={() => setIsDescExpanded(!isDescExpanded)} 
                                                className="text-cyan-400 hover:text-cyan-300 text-sm font-bold mt-3 transition-colors flex items-center gap-1"
                                            >
                                                {isDescExpanded ? 'Ver menos' : 'Ver más'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Trailer */}
                                {embedUrl && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            Trailer
                                        </h3>
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-950">
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

                                {/* Screenshots */}
                                {game.screenshots && game.screenshots.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            Capturas
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {game.screenshots.slice(0, 6).map((shot, idx) => (
                                                <img
                                                    key={`${shot}-${idx}`}
                                                    src={shot}
                                                    alt={`Screenshot ${idx + 1}`}
                                                    className="w-full h-24 md:h-32 object-cover rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
                                                    loading="lazy"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Metadata */}
                            <div className="flex flex-col gap-6">

                                {/* Stores */}
                                {game.stores.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Disponible en</h3>
                                        <div className="flex flex-col gap-2">
                                            {game.stores.map(store => (
                                                <StoreButton key={store.name} store={store} gameSlug={game.slug} gameTitle={game.title} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {game.links.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Enlaces y Redes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {game.links.map(link => (
                                                <a
                                                    key={link.name}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white py-2 px-3 rounded-lg text-sm transition-all shadow-sm"
                                                    onClick={() => trackEvent('game_external_click', { game_slug: game.slug, game_title: game.title, link_name: link.name, url: link.url })}
                                                >
                                                    {link.name} <LinkIcon />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Game Meta Detail List */}
                                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/40">
                                    <dl className="grid grid-cols-1 gap-y-4">
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

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes slide-up {
                    from { transform: translateY(20px) scale(0.98); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                /* Custom Scrollbar specifically for the modal body */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 138, 157, 0.3); /* slate-400 with opacity */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 138, 157, 0.6);
                }
            `}</style>
        </div>
    );
};

export default Modal;
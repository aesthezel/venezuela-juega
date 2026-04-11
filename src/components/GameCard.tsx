import { useState, useRef, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { useMeasure, useTextLayout, useGameStats } from '@/src/hooks';
import { useFireflyPresence } from '@/src/hooks/FireflyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWindows,
    faLinux,
    faAndroid,
    faApple,
    faPlaystation,
    faXbox
} from '@fortawesome/free-brands-svg-icons';
import {
    faDesktop,
    faGamepad,
    faMobile,
    faGlobe,
    faHeart as faHeartSolid
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg } from '@fortawesome/free-regular-svg-icons';
import { CoverImage, StatusBadge } from '@/src/components';
import { getTrailerInfo } from '@/src/utils';

interface GameCardProps {
    game: Game;
    onClick: () => void;
    layout?: 'grid' | 'masonry';
}

const platformIconMap: Record<string, any> = {
    'Windows': faWindows,
    'PC': faWindows,
    'Linux': faLinux,
    'Android': faAndroid,
    'iOS': faApple,
    'iPhone': faApple,
    'iPad': faApple,
    'Apple': faApple,
    'Mac': faApple,
    'macOS': faApple,
    'PlayStation': faPlaystation,
    'PS4': faPlaystation,
    'PS5': faPlaystation,
    'PlayStation 4': faPlaystation,
    'PlayStation 5': faPlaystation,
    'Xbox': faXbox,
    'Xbox One': faXbox,
    'Xbox Series': faXbox,
    'Nintendo Switch': faGamepad,
    'Switch': faGamepad,
    'Nintendo': faGamepad,
    'Meta Quest': faDesktop,
    'Meta': faDesktop,
    'VR': faDesktop,
    'Web': faGlobe,
    'Browser': faGlobe,
    'Navegador': faGlobe,
    'Steam': faDesktop,
    'Epic Games': faDesktop,
    'Itch.io': faDesktop,
    'GOG': faDesktop,
    'Mobile': faMobile,
    'Móvil': faMobile,
};

const getPlatformIcon = (platform: string) => {
    if (platformIconMap[platform]) {
        return platformIconMap[platform];
    }
    const platformLower = platform.toLowerCase();
    for (const [key, icon] of Object.entries(platformIconMap)) {
        if (key.toLowerCase().includes(platformLower) || platformLower.includes(key.toLowerCase())) {
            return icon;
        }
    }
    return faDesktop;
};

const GameCard = ({ game, onClick, layout = 'grid' }: GameCardProps) => {
    // Real-time stats and activity via custom hook (prevents memory leaks and handles sync)
    const { totalHearts, hasLiked, toggleLike, isReady } = useGameStats(game.slug);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const trailerInfo = useMemo(() => getTrailerInfo(game.trailerUrl), [game.trailerUrl]);
    const fireflyCount = useFireflyPresence(game.slug);

    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLDivElement>();
    
    const { lineCount } = useTextLayout(game.description, containerWidth - 40, { // -40 for p-5 padding
        fontSize: 14,
        lineHeight: 20
    });

    const maskLines = layout === 'masonry' ? 6 : 2;
    const needsExpansion = lineCount > maskLines;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleReadMoreClick = (e: MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    const handleToggleLike = (e: MouseEvent) => {
        e.stopPropagation();
        toggleLike();
    };

    const hasImage = !!(game.imageUrl && game.imageUrl.trim() !== '');

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className={`bg-slate-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col relative ${
                fireflyCount > 0
                    ? 'ring-1 ring-cyan-400/40 hover:shadow-cyan-500/50'
                    : 'hover:shadow-cyan-500/50'
            }`}
            style={{
                contain: 'layout paint',
                contentVisibility: 'auto',
                containIntrinsicSize: '600px',
                ...(fireflyCount > 0 ? {
                    boxShadow: `0 0 ${Math.min(fireflyCount * 8, 30)}px rgba(34, 211, 238, ${Math.min(fireflyCount * 0.08, 0.3)})`,
                } : {})
            }}
        >
            {/* Firefly presence indicator */}
            {fireflyCount > 0 && (
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm rounded-full pl-1.5 pr-2.5 py-1 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    </span>
                    <span className="text-[10px] font-bold text-cyan-300 tracking-wide">{fireflyCount}</span>
                </div>
            )}
            {layout === 'masonry' ? (
                <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <CoverImage
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-[250px] object-cover block"
                        imgClassName="w-full h-[250px] object-cover block"
                    />
                    {isHovered && trailerInfo && (
                        trailerInfo.type === 'youtube' ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-0 transition-opacity duration-700"
                                style={{ zIndex: 5, maxWidth: 'none' }}
                                allow="autoplay; encrypted-media"
                                title={`${game.title} trailer`}
                                onLoad={(e) => {
                                    if (e.target instanceof HTMLIFrameElement) {
                                        e.target.classList.remove('opacity-0');
                                        e.target.classList.add('opacity-100');
                                    }
                                }}
                            />
                        ) : (
                            <video
                                src={trailerInfo.url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700"
                                style={{ zIndex: 5 }}
                                onCanPlay={(e) => {
                                    if (e.target instanceof HTMLVideoElement) {
                                        e.target.classList.remove('opacity-0');
                                        e.target.classList.add('opacity-100');
                                    }
                                }}
                            />
                        )
                    )}
                    <div className="absolute top-2 right-2" style={{ zIndex: 10 }}>
                        <StatusBadge status={game.status} size="xs" variant="solid" className="px-2 py-1" />
                    </div>
                </div>
            ) : (
                <div className={`relative overflow-hidden ${hasImage ? 'aspect-[16/9]' : 'h-[250px]'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <CoverImage
                        src={game.imageUrl}
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                    />
                    {isHovered && trailerInfo && (
                        trailerInfo.type === 'youtube' ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-0 transition-opacity duration-700"
                                style={{ zIndex: 5, maxWidth: 'none' }}
                                allow="autoplay; encrypted-media"
                                title={`${game.title} trailer`}
                                onLoad={(e) => {
                                    if (e.target instanceof HTMLIFrameElement) {
                                        e.target.classList.remove('opacity-0');
                                        e.target.classList.add('opacity-100');
                                    }
                                }}
                            />
                        ) : (
                            <video
                                src={trailerInfo.url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700"
                                style={{ zIndex: 5 }}
                                onCanPlay={(e) => {
                                    if (e.target instanceof HTMLVideoElement) {
                                        e.target.classList.remove('opacity-0');
                                        e.target.classList.add('opacity-100');
                                    }
                                }}
                            />
                        )
                    )}
                    <div className="absolute top-2 right-2" style={{ zIndex: 10 }}>
                        <StatusBadge status={game.status} size="xs" variant="solid" className="rounded-full px-2 py-1" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" style={{ zIndex: 10, pointerEvents: 'none' }} />
                </div>
            )}

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-white truncate flex-1">{game.title}</h3>
                    <button
                        onClick={handleToggleLike}
                        disabled={!isReady}
                        className={`flex items-center gap-1.5 transition-all duration-300 group/like ${
                            hasLiked ? 'text-rose-400' : 'text-slate-500 hover:text-white'
                        } ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={!isReady ? "Iniciando conexión..." : (hasLiked ? "Quitar me gusta" : "Me gusta")}
                    >
                        <span className="text-xs font-bold">{totalHearts > 0 ? totalHearts : ''}</span>
                        <FontAwesomeIcon 
                            icon={hasLiked ? faHeartSolid : faHeartReg} 
                            className={`text-lg transition-transform duration-300 ${hasLiked ? "scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "group-hover/like:scale-110"}`} 
                        />
                    </button>
                </div>
                
                <p
                    className={`text-gray-400 mt-2 text-sm transition-all duration-300 ease-in-out ${isExpanded ? '' : (layout === 'masonry' ? 'line-clamp-[6]' : 'line-clamp-2')}`}
                >
                    {game.description}
                </p>

                <div className="mt-2 min-h-6">
                    {needsExpansion && (
                        <button
                            onClick={handleReadMoreClick}
                            className="text-cyan-400 hover:underline text-sm self-start focus:outline-none"
                        >
                            {isExpanded ? 'Leer menos' : 'Leer más'}
                        </button>
                    )}
                </div>

                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {game.genre.slice(0, 2).map(g => (
                        <span key={g} className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full">{g}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameCard;
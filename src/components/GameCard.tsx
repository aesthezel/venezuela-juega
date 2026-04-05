// noinspection JSNonASCIINames
import { useState, useRef, useEffect, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { JSX } from 'preact/jsx-runtime';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
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
    faGlobe
} from '@fortawesome/free-solid-svg-icons';
import {CoverImage, StatusBadge} from '@/src/components';
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const trailerInfo = useMemo(() => getTrailerInfo(game.trailerUrl), [game.trailerUrl]);

    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLDivElement>();
    
    // We add a small buffer for padding/margins if needed, 
    // but here the containerRef will be on the main card or description wrapper.
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

    const hasImage = !!(game.imageUrl && game.imageUrl.trim() !== '');

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col"
            style={{
                contain: 'layout paint',
                contentVisibility: 'auto',
                containIntrinsicSize: '600px'
            }}
        >
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
                    <div className="absolute bottom-2 left-2 flex gap-1" style={{ zIndex: 10 }}>
                        {game.platform.slice(0, 4).map((platform, index) => (
                            <div
                                key={`${platform}-${index}`}
                                className="w-6 h-6 bg-black/70 rounded-full backdrop-blur-sm flex items-center justify-center"
                                title={platform}
                            >
                                <FontAwesomeIcon icon={getPlatformIcon(platform)} className="text-white text-xs" />
                            </div>
                        ))}
                        {game.platform.length > 4 && (
                            <div
                                className="w-6 h-6 bg-black/70 rounded-full backdrop-blur-sm flex items-center justify-center"
                                title={`+${game.platform.length - 4} más`}
                            >
                                <span className="text-white text-xs font-bold">+{game.platform.length - 4}</span>
                            </div>
                        )}
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
                    <div className="absolute bottom-2 left-2 flex gap-1" style={{ zIndex: 10 }}>
                        {game.platform.slice(0, 4).map((platform, index) => (
                            <div
                                key={`${platform}-${index}`}
                                className="w-6 h-6 bg-black/70 rounded-full backdrop-blur-sm flex items-center justify-center"
                                title={platform}
                            >
                                <FontAwesomeIcon icon={getPlatformIcon(platform)} className="text-white text-xs" />
                            </div>
                        ))}
                        {game.platform.length > 4 && (
                            <div
                                className="w-6 h-6 bg-black/70 rounded-full backdrop-blur-sm flex items-center justify-center"
                                title={`+${game.platform.length - 4} más`}
                            >
                                <span className="text-white text-xs font-bold">+{game.platform.length - 4}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" style={{ zIndex: 10, pointerEvents: 'none' }} />
                </div>
            )}

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>
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
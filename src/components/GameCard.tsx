// noinspection JSNonASCIINames
import { useState, useRef, useEffect } from 'preact/hooks';
import { Game } from '@/src/types';
import { JSX } from 'preact/jsx-runtime';
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
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const element = descriptionRef.current;
        const id = requestAnimationFrame(() => {
            if (element && element.scrollHeight > element.clientHeight) {
                setNeedsExpansion(true);
            } else {
                setNeedsExpansion(false);
            }
        });
        return () => cancelAnimationFrame(id);
    }, [game.description]);

    const handleReadMoreClick = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsExpanded(prev => !prev);
    };

    const hasImage = !!(game.imageUrl && game.imageUrl.trim() !== '');

    return (
        <div
            onClick={onClick}
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col"
            style={{
                contain: 'layout paint',
                contentVisibility: 'auto',
                containIntrinsicSize: '600px'
            }}
        >
            {layout === 'masonry' ? (
                <div className="relative">
                    <CoverImage
                        src={game.imageUrl}
                        alt={game.title}
                        className={hasImage ? 'w-full h-auto block' : 'w-full h-[150px] object-cover block'}
                        imgClassName={hasImage ? 'w-full h-auto block' : 'w-full h-[150px] object-cover block'}
                    />
                    <div className="absolute top-2 right-2">
                        <StatusBadge status={game.status} size="xs" variant="solid" className="px-2 py-1" />
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
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
                <div className={`relative ${hasImage ? 'aspect-[16/9]' : 'h-[250px]'}`}>
                    <CoverImage
                        src={game.imageUrl}
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                        <StatusBadge status={game.status} size="xs" variant="solid" className="rounded-full px-2 py-1" />
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                </div>
            )}

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>
                <p
                    ref={descriptionRef}
                    className={`text-gray-400 mt-2 text-sm transition-all duration-300 ease-in-out ${isExpanded ? '' : 'line-clamp-2'}`}
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
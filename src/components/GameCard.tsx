// noinspection JSNonASCIINames

import { useState, useRef, useEffect } from 'preact/hooks';
import { Game, GameStatus } from '@/src/types';
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

interface GameCardProps {
    game: Game;
    onClick: () => void;
}

const statusColorMap: Record<GameStatus, string> = {
    [GameStatus.RELEASED]: "bg-green-500",
    [GameStatus.IN_DEVELOPMENT]: "bg-yellow-500",
    [GameStatus.ON_HOLD]: "bg-gray-500",
    [GameStatus.CANCELED]: "bg-red-600",
    [GameStatus.RELEASED_DEMO]: 'bg-green-200',
    [GameStatus.PROTOTYPE]: 'bg-gray-200',
    [GameStatus.LOST_MEDIA]: 'bg-red-200',
    [GameStatus.EARLY_ACCESS]: 'bg-cyan-500',
    [GameStatus.RECOVERED]: 'bg-blue-500',
    [GameStatus.UNKNOWN]: 'bg-gray-900'
};

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

const GameCard = ({ game, onClick }: GameCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const element = descriptionRef.current;
        // Medición tras layout estable
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
            <div className="relative aspect-[16/9]">
                <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />

                <div className={`absolute top-2 right-2 px-2 py-1 text-xs text-white font-bold rounded-full ${statusColorMap[game.status]}`}>
                    {game.status}
                </div>

                <div className="absolute bottom-2 left-2 flex gap-1">
                    {game.platform.slice(0, 4).map((platform, index) => (
                        <div
                            key={`${platform}-${index}`}
                            className="w-6 h-6 bg-black bg-opacity-70 rounded-full backdrop-blur-sm flex items-center justify-center"
                            title={platform}
                        >
                            <FontAwesomeIcon
                                icon={getPlatformIcon(platform)}
                                className="text-white text-xs"
                            />
                        </div>
                    ))}
                    {game.platform.length > 4 && (
                        <div
                            className="w-6 h-6 bg-black bg-opacity-70 rounded-full backdrop-blur-sm flex items-center justify-center"
                            title={`+${game.platform.length - 4} más`}
                        >
                            <span className="text-white text-xs font-bold">+{game.platform.length - 4}</span>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>
                <p
                    ref={descriptionRef}
                    className={`text-gray-400 mt-2 text-sm transition-all duration-300 ease-in-out ${isExpanded ? '' : 'line-clamp-2'}`}
                >
                    {game.description}
                </p>

                {/* Reservar altura para evitar saltos del layout cuando aparece el botón */}
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
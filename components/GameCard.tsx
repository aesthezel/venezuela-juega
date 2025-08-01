import { useState, useRef, useEffect } from 'preact/hooks';
import { Game, GameStatus } from '../types';
import { JSX } from 'preact/jsx-runtime';

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

const GameCard = ({ game, onClick }: GameCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const element = descriptionRef.current;
        setTimeout(() => {
            if (element && element.scrollHeight > element.clientHeight) {
                setNeedsExpansion(true);
            }
        }, 100);
    }, [game.description]);

    const handleReadMoreClick = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Previene que el clic en el botón abra el modal.
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            onClick={onClick}
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col"
        >
            <div className="relative">
                <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs text-white font-bold rounded-full ${statusColorMap[game.status]}`}>
                    {game.status}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>

                {/* La descripción ahora usa line-clamp para un corte de texto limpio */}
                <p
                    ref={descriptionRef}
                    className={`text-gray-400 mt-2 text-sm transition-all duration-300 ease-in-out ${isExpanded ? '' : 'line-clamp-2'}`}
                >
                    {game.description}
                </p>

                {/* El botón "Leer más" solo aparece si el texto se desborda */}
                {needsExpansion && (
                    <button
                        onClick={handleReadMoreClick}
                        className="text-cyan-400 hover:underline text-sm mt-2 self-start focus:outline-none"
                    >
                        {isExpanded ? 'Leer menos' : 'Leer más'}
                    </button>
                )}

                {/* El div de géneros ahora está correctamente espaciado */}
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
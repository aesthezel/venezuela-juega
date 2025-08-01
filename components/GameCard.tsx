import { Game, GameStatus } from '../types';

interface GameCardProps {
    game: Game;
    onClick: () => void;
}

const statusColorMap: Record<GameStatus, string> = {
    [GameStatus.RELEASED]: "bg-green-500",
    [GameStatus.IN_DEVELOPMENT]: "bg-yellow-500",
    [GameStatus.ON_HOLD]: "bg-gray-500",
    [GameStatus.CANCELED]: "bg-red-600",
};

const GameCard = ({ game, onClick }: GameCardProps) => {
    return (
        <div
            onClick={onClick}
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group"
        >
            <div className="relative">
                <img src={game.imageUrl} alt={game.title} className="w-full h-48 object-cover" />
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs text-white font-bold rounded-full ${statusColorMap[game.status]}`}>
                    {game.status}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-bg-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>
                <p className="text-gray-400 mt-2 text-sm h-10 overflow-hidden">{game.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {game.genre.slice(0, 2).map(g => (
                        <span key={g} className="bg-slate-700 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full">{g}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameCard;
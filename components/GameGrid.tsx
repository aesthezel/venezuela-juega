import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const GameGrid = ({ games, onGameClick }: GameGridProps) => {
    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h2>
                <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {games.map(game => (
                <GameCard key={game.id} game={game} onClick={() => onGameClick(game)} />
            ))}
        </div>
    );
};

export default GameGrid;
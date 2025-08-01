import { Game } from '../types';

interface HighlightCardProps {
    game: Game;
    onClick: (game: Game) => void;
    fullWidth?: boolean;
}

const HighlightCard = ({ game, onClick, fullWidth = false } : HighlightCardProps) => {
    return (
        <div
            onClick={() => onClick(game)}
            className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer group h-full flex-shrink-0 snap-start ${fullWidth ? 'w-full' : 'w-80'}`}
            aria-label={`Ver detalles de ${game.title}`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(game)}
        >
            <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-xl font-bold text-white truncate">{game.title}</h3>
                <p className="text-sm text-cyan-300 truncate">{game.developers.join(', ')}</p>
            </div>
        </div>
    );
};

export default HighlightCard;

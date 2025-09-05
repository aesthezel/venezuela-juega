import { Game } from '@/src/types';

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
            <img src={game.imageHero} alt={game.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            {/* Estado actual del juego */}
            <div className="absolute top-3 left-3 z-10">
                <span className="inline-block bg-cyan-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
                    {game.status}
                </span>
            </div>
            <div className="absolute bottom-0 left-0 p-4 w-full text-center">
                <h3 className="text-2xl md:text-4xl font-bold text-white truncate drop-shadow">
                    {game.title}
                </h3>
                <p className="text-base md:text-lg text-cyan-200 truncate drop-shadow">
                    Realizado por {game.developers.join(', ')}
                </p>
                {game.highlightReason && (
                    <p className="mt-2 text-base md:text-lg font-semibold text-amber-300 line-clamp-3 drop-shadow">
                        {game.highlightReason}
                    </p>
                )}
                {game.platform?.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {game.platform.map((p) => (
                            <span
                                key={p}
                                className="text-xs bg-black/40 text-gray-200 border border-white/10 px-2 py-0.5 rounded"
                                title={`Disponible en ${p}`}
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HighlightCard;


import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { Game, GameOrigin } from '@/src/types';
import { route } from 'preact-router';

interface GameJamPlusSectionProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

/**
 * GameJamPlusSection component
 *
 * Displays a bento-style section showcasing games developed during GameJam+ 25/26.
 * Similar to Highlights, but specifically filters games by origin.
 *
 * @param {GameJamPlusSectionProps} props - Component props
 */
const GameJamPlusSection = ({ games, onGameClick }: GameJamPlusSectionProps) => {
    const gameJamPlusGames = useMemo(() => {
        return games.filter(game => game.origin === GameOrigin.GAME_JAM_PLUS_25_26);
    }, [games]);

    if (gameJamPlusGames.length === 0) {
        return null;
    }

    const displayGames = gameJamPlusGames.slice(0, 6);

    return (
        <section className="mb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        GameJam+ 25/26
                    </h2>
                    <p className="text-gray-400">
                        Todos los juegos creados en 48H durante la gamejam de Venezuela
                    </p>
                </div>
                {gameJamPlusGames.length > 6 && (
                    <button
                        onClick={() => route('/gamejam-gallery')}
                        className="hidden md:block px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30
                                 text-orange-400 rounded-lg transition-colors border border-orange-500/30"
                    >
                        Ver todos ({gameJamPlusGames.length})
                    </button>
                )}
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayGames.map((game, index) => {
                    const isMainCard = index === 0;
                    const gridClass = isMainCard
                        ? 'md:col-span-2 md:row-span-2'
                        : 'md:col-span-1';

                    return (
                        <div
                            key={game.id}
                            onClick={() => onGameClick(game)}
                            className={`${gridClass} group relative overflow-hidden rounded-xl 
                                      bg-slate-800 cursor-pointer border border-slate-700 
                                      hover:border-orange-500 transition-all duration-300 
                                      transform hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                {game.imageHero || game.imageCover || game.imageUrl ? (
                                    <img
                                        src={game.imageHero || game.imageCover || game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-900/40 to-slate-900/80" />
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className={`relative h-full flex flex-col justify-end p-6 ${isMainCard ? 'md:p-8' : ''}`}>
                                {/* Status Badge */}
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded
                                                   bg-orange-700/30 text-orange-200 border border-orange-500/50">
                                        GameJam+ 25/26
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className={`font-bold text-white mb-2 group-hover:text-orange-400 transition-colors 
                                              ${isMainCard ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                                    {game.title}
                                </h3>

                                {/* Developers */}
                                <p className="text-sm text-gray-300 mb-3">
                                    Por {game.developers.join(', ')}
                                </p>

                                {/* Pitch - Only show on main card */}
                                {isMainCard && game.pitch && (
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                        {game.pitch}
                                    </p>
                                )}

                                {/* Genres */}
                                <div className="flex flex-wrap gap-2">
                                    {game.genre.slice(0, isMainCard ? 4 : 2).map((genre, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 text-xs bg-slate-900/60 text-gray-300
                                                     rounded backdrop-blur-sm border border-slate-700"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile "See All" button */}
            {gameJamPlusGames.length > 6 && (
                <div className="md:hidden mt-6 text-center">
                    <button
                        onClick={() => route('/gamejam-gallery')}
                        className="px-6 py-3 bg-orange-500/20 hover:bg-orange-500/30
                                 text-orange-400 rounded-lg transition-colors border border-orange-500/30
                                 font-semibold"
                    >
                        Ver todos los juegos ({gameJamPlusGames.length})
                    </button>
                </div>
            )}
        </section>
    );
};

export default GameJamPlusSection;
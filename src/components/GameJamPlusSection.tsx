import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Game, GameOrigin } from '@/src/types';
import { route } from 'preact-router';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';

interface GameJamPlusSectionProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

/**
 * Función para barajar un array (Fisher-Yates shuffle)
 * Crea una copia del array para no mutar el original.
 */
const shuffleArray = (array: Game[]) => {
    const shuffled = [...array]; // 1. Crear una copia
    let currentIndex = shuffled.length;
    let randomIndex : number;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffled[currentIndex], shuffled[randomIndex]] = [
            shuffled[randomIndex], shuffled[currentIndex]
        ];
    }
    return shuffled;
};

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
        const filtered = games.filter(game => game.origin === GameOrigin.GAME_JAM_PLUS_25_26);

        return shuffleArray(filtered);

    }, [games]);

    if (gameJamPlusGames.length === 0) {
        return null;
    }

    const displayGames = gameJamPlusGames.slice(0, 6);

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        GameJam+ 25/26
                    </h2>
                    <p className="text-base-content/70">
                        Todos los juegos creados en 48H durante la gamejam de Venezuela
                    </p>
                </div>
                {gameJamPlusGames.length > 6 && (
                    <button
                        onClick={() => route('/gamejam-gallery')}
                        className="hidden md:block px-4 py-2 bg-accent-orange/20 hover:bg-accent-orange/30
                                 text-accent-orange rounded-lg transition-colors border border-accent-orange/30"
                    >
                        Ver todos ({gameJamPlusGames.length})
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayGames.map((game, index) => (
                    <GameJamPlusCard 
                        key={game.id} 
                        game={game} 
                        isMainCard={index === 0} 
                        onGameClick={onGameClick} 
                    />
                ))}
            </div>

            {gameJamPlusGames.length > 6 && (
                <div className="md:hidden mt-6 text-center">
                    <button
                        onClick={() => route('/gamejam-gallery')}
                        className="px-6 py-3 bg-accent-orange/20 hover:bg-accent-orange/30
                                 text-accent-orange rounded-lg transition-colors border border-accent-orange/30
                                 font-semibold"
                    >
                        Ver todos los juegos ({gameJamPlusGames.length})
                    </button>
                </div>
            )}
        </section>
    );
};

const GameJamPlusCard = ({ game, isMainCard, onGameClick }: { game: Game; isMainCard: boolean; onGameClick: (game: Game) => void }) => {
    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLDivElement>();
    const { lineCount } = useTextLayout(game.pitch, containerWidth - 64, { // -64 for padding
        fontSize: 14,
        lineHeight: 20
    });

    const gridClass = isMainCard ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1';

    return (
        <div
            ref={containerRef}
            onClick={() => onGameClick(game)}
            className={`${gridClass} group relative overflow-hidden rounded-xl 
                        bg-base-300 cursor-pointer border border-surface-700 
                        hover:border-accent-orange transition-all duration-300 
                        transform hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-orange/20`}
        >
            <div className="absolute inset-0">
                {game.imageHero || game.imageCover || game.imageUrl ? (
                    <img
                        src={game.imageHero || game.imageCover || game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-orange/40 to-surface-900/80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
            </div>

            <div className={`relative h-full flex flex-col justify-end p-6 ${isMainCard ? 'md:p-8' : ''}`}>
                <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded
                                    bg-accent-orange/30 text-accent-orange border border-accent-orange/50">
                        GameJam+ 25/26
                    </span>
                </div>

                <h3 className={`font-bold text-white mb-2 group-hover:text-accent-orange transition-colors 
                                ${isMainCard ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {game.title}
                </h3>

                <p className="text-sm text-base-content/70 mb-3">
                    Por {game.developers.join(', ')}
                </p>

                {isMainCard && game.pitch && (
                    <p className={`text-sm text-base-content/70 mb-4 ${lineCount > 2 ? 'line-clamp-2' : ''}`}>
                        {game.pitch}
                    </p>
                )}

                <div className="flex flex-wrap gap-2">
                    {game.genre.slice(0, isMainCard ? 4 : 2).map((genre, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-base-200/60 text-base-content/70
                                        rounded backdrop-blur-sm border border-surface-700"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameJamPlusSection;

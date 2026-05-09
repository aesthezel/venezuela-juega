import { useEffect, useState, useMemo } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';
import { PageTransition, BackButton, GameCard } from '@/src/components';
import { Game } from '@/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faDice, faGhost, faHouse } from '@fortawesome/free-solid-svg-icons';

interface NotFoundPageProps extends RoutableProps {
    games?: Game[];
    onGameClick?: (game: Game) => void;
}

const NotFoundPage = ({ games = [], onGameClick }: NotFoundPageProps) => {
    const [randomGame, setRandomGame] = useState<Game | null>(null);

    const pickRandomGame = () => {
        CC
        if (games.length > 0) {
            const randomIndex = Math.floor(Math.random() * games.length);
            setRandomGame(games[randomIndex]);
        }
    };

    useEffect(() => {
        pickRandomGame();
    }, [games]);

    const handleNavigateHome = () => {
        route('/');
    };

    return (
        <PageTransition>
            <div className="hero min-h-[70vh] relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-teal-dark/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-mauve-dark/5 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" />

                <div className="hero-content text-center flex-col w-full max-w-2xl gap-8">
                    {/* Error Message Section */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-base-200 rounded-3xl flex items-center justify-center text-primary shadow-2xl border border-surface-700 relative group">
                            <FontAwesomeIcon icon={faGhost} className="text-4xl group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-black text-base-content tracking-tight">
                                Ups... Esta ubicación <span className="text-primary">no existe</span>
                            </h1>
                            <p className="text-base-content/70 text-lg max-w-md mx-auto leading-relaxed">
                                Parece que te has perdido de camino a Delta Amacuro. Pero no te preocupes, hay muchos juegos más por explorar.
                            </p>
                        </div>
                    </div>

                    {/* Suggestion Section */}
                    {randomGame && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="divider text-xs font-black uppercase tracking-[0.2em] text-primary/70 mb-6">
                                ¿Qué tal si pruebas este?
                            </div>

                            <div className="max-w-sm mx-auto group">
                                <GameCard
                                    game={randomGame}
                                    onClick={() => onGameClick?.(randomGame)}
                                />
                                {/* <button
                                    onClick={pickRandomGame}
                                    className="mt-4 flex items-center gap-2 mx-auto text-base-content/70 hover:text-accent-teal transition-colors text-sm font-bold bg-base-300/50 hover:bg-base-300 px-4 py-2 rounded-full border border-surface-700"
                                >
                                    <FontAwesomeIcon icon={faDice} className="text-xs" />
                                    <span>Sugerir otro juego</span>
                                </button> */}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-4">
                        <button
                            onClick={handleNavigateHome}
                            className="btn btn-primary btn-lg"
                        >
                            <FontAwesomeIcon icon={faHouse} />
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default NotFoundPage;

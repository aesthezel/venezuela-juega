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
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" />

                <div className="max-w-2xl w-full text-center space-y-12">
                    {/* Error Message Section */}
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/5 relative group">
                                <FontAwesomeIcon icon={faGhost} className="text-4xl group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                Ups... Esta ubicación <span className="text-cyan-400">no existe</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                                Parece que te has perdido de camino a Delta Amacuro. Pero no te preocupes, hay muchos juegos más por explorar.
                            </p>
                        </div>
                    </div>

                    {/* Suggestion Section */}
                    {randomGame && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-500/70">
                                <div className="w-8 h-[1px] bg-cyan-500/30" />
                                ¿Qué tal si pruebas este?
                                <div className="w-8 h-[1px] bg-cyan-500/30" />
                            </div>

                            <div className="max-w-sm mx-auto group">
                                <GameCard
                                    game={randomGame}
                                    onClick={() => onGameClick?.(randomGame)}
                                />
                                {/* <button
                                    onClick={pickRandomGame}
                                    className="mt-4 flex items-center gap-2 mx-auto text-slate-500 hover:text-cyan-400 transition-colors text-sm font-bold bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-white/5"
                                >
                                    <FontAwesomeIcon icon={faDice} className="text-xs" />
                                    <span>Sugerir otro juego</span>
                                </button> */}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={handleNavigateHome}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group"
                        >
                            <FontAwesomeIcon icon={faHouse} className="group-hover:-translate-y-0.5 transition-transform" />
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default NotFoundPage;

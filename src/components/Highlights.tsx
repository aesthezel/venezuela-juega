import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { HighlightCard } from '@/src/components';
import { IndicatorLeftIcon, IndicatorRightIcon } from '@/src/components/icons';

interface HighlightsProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const Highlights = ({ games, onGameClick }: HighlightsProps) => {
    const highlightedGames = useMemo(() =>
            games.filter(game => game.isHighlighted === true),
        [games]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultipleGames = highlightedGames.length > 1;

    const goToNext = useCallback(() => {
        if (!hasMultipleGames) return;
        setCurrentIndex(prevIndex => (prevIndex === highlightedGames.length - 1 ? 0 : prevIndex + 1));
    }, [highlightedGames.length, hasMultipleGames]);

    const goToPrevious = () => {
        if (!hasMultipleGames) return;
        setCurrentIndex(prevIndex => (prevIndex === 0 ? highlightedGames.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        if (!hasMultipleGames) return;
        const timer = setTimeout(goToNext, 5000); // Auto-slide every 5 seconds
        return () => clearTimeout(timer);
    }, [currentIndex, hasMultipleGames, goToNext]);

    if (highlightedGames.length === 0) {
        return null;
    }

    return (
        <section className="mb-12" aria-labelledby="highlights-title">
            <div className="relative group">
                <div className="w-full h-56 overflow-hidden rounded-lg">
                    <div
                        className="flex h-full transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {highlightedGames.map(game => (
                            <div key={game.id} className="w-full h-full flex-shrink-0">
                                <HighlightCard game={game} onClick={() => onGameClick(game)} fullWidth />
                            </div>
                        ))}
                    </div>
                </div>

                {hasMultipleGames && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute top-1/2 left-0 md:-left-4 transform -translate-y-1/2 z-10 bg-slate-800/60 hover:bg-slate-800/90 rounded-full p-2 transition-all text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Juego anterior"
                        >
                            <IndicatorLeftIcon />
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute top-1/2 right-0 md:-right-4 transform -translate-y-1/2 z-10 bg-slate-800/60 hover:bg-slate-800/90 rounded-full p-2 transition-all text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Siguiente juego"
                        >
                            <IndicatorRightIcon />
                        </button>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                            {highlightedGames.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-cyan-400' : 'bg-slate-500/80 hover:bg-slate-400'}`}
                                    aria-current={currentIndex === index}
                                    aria-label={`Ir al juego ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Highlights;
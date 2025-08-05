import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Game } from '../types';
import GameCard from './GameCard';

// Declaración para que TypeScript reconozca la librería global de GSAP
declare var gsap: any;

interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const INITIAL_GAMES_TO_SHOW = 12;
const GAMES_TO_LOAD_ON_SCROLL = 8;

const GameGrid = ({ games, onGameClick }: GameGridProps) => {
    const [displayedCount, setDisplayedCount] = useState(INITIAL_GAMES_TO_SHOW);
    const observer = useRef<IntersectionObserver | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const prevGamesRef = useRef<Game[]>([]);

    // Resetea la vista cuando los filtros cambian
    useEffect(() => {
        setDisplayedCount(INITIAL_GAMES_TO_SHOW);
    }, [games]);

    const gamesToShow = games.slice(0, displayedCount);

    // Hook para animar las tarjetas cuando la lista visible cambia
    useEffect(() => {
        if (!gridRef.current) return;

        const cards = Array.from(gridRef.current.querySelectorAll('.game-card-wrapper'));

        // Si la lista de juegos base ha cambiado (por un filtro), anima todo
        if (prevGamesRef.current !== games) {
            gsap.fromTo(cards,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }
            );
        }
        // Si solo se han añadido más juegos (lazy load), anima solo los nuevos
        else if (cards.length > prevGamesRef.current.length) {
            const newCards = cards.slice(prevGamesRef.current.length);
            gsap.fromTo(newCards,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }
            );
        }

        prevGamesRef.current = gamesToShow;

    }, [gamesToShow, games]);

    const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && displayedCount < games.length) {
                setDisplayedCount(prevCount => prevCount + GAMES_TO_LOAD_ON_SCROLL);
            }
        });
        if (node) observer.current.observe(node);
    }, [displayedCount, games.length]);

    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h2>
                <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        );
    }

    const hasMoreGames = displayedCount < games.length;

    return (
        <>
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {gamesToShow.map(game => (
                    <div key={game.id} className="game-card-wrapper">
                        <GameCard game={game} onClick={() => onGameClick(game)} />
                    </div>
                ))}
            </div>

            {hasMoreGames && (
                <div ref={loadMoreRef} className="text-center p-8">
                    <p className="text-cyan-400 animate-pulse">Cargando más juegos...</p>
                </div>
            )}
        </>
    );
};

export default GameGrid;
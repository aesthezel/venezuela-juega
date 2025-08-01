import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
    games: Game[]; // Recibe la lista COMPLETA de juegos filtrados
    onGameClick: (game: Game) => void;
}

const INITIAL_GAMES_TO_SHOW = 12; // Cantidad de juegos al cargar la página
const GAMES_TO_LOAD_ON_SCROLL = 8; // Cantidad de juegos a cargar cada vez que se hace scroll

const GameGrid = ({ games, onGameClick }: GameGridProps) => {
    // Estado para controlar cuántos juegos se muestran
    const [displayedCount, setDisplayedCount] = useState(INITIAL_GAMES_TO_SHOW);
    const observer = useRef<IntersectionObserver | null>(null);

    // Si los filtros cambian (la lista de `games` es diferente), reseteamos la vista
    useEffect(() => {
        setDisplayedCount(INITIAL_GAMES_TO_SHOW);
    }, [games]);

    // Este es el "observador" que se activará cuando el usuario llegue al final de la lista
    const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
        // Si ya hay un observador, lo desconectamos para evitar duplicados
        if (observer.current) observer.current.disconnect();

        // Creamos un nuevo IntersectionObserver
        observer.current = new IntersectionObserver(entries => {
            // Si el elemento "trigger" está visible y hay más juegos por mostrar...
            if (entries[0].isIntersecting && displayedCount < games.length) {
                // ...cargamos un nuevo lote de juegos.
                setDisplayedCount(prevCount => prevCount + GAMES_TO_LOAD_ON_SCROLL);
            }
        });

        // Si el nodo del "trigger" existe, lo empezamos a observar
        if (node) observer.current.observe(node);
    }, [displayedCount, games.length]);


    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h2>
                <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        )
    }

    // Cortamos la lista de juegos para mostrar solo la cantidad necesaria
    const gamesToShow = games.slice(0, displayedCount);
    const hasMoreGames = displayedCount < games.length;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gamesToShow.map(game => (
                    <GameCard key={game.id} game={game} onClick={() => onGameClick(game)} />
                ))}
            </div>

            {/* Este elemento invisible se coloca al final de la lista.
                Cuando aparece en pantalla, el IntersectionObserver lo detecta. */}
            {hasMoreGames && (
                <div ref={loadMoreRef} className="text-center p-8">
                    <p className="text-cyan-400 animate-pulse">Cargando más juegos...</p>
                </div>
            )}
        </>
    );
};

export default GameGrid;
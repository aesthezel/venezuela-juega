import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { useMeasure } from '@/hooks/useMeasure';
import { Game } from '@/types';
import { GameCard } from '@/components';
import { trackGameCardClick } from '@/utils/analytics';

interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const INITIAL_GAMES_TO_SHOW = 12;
const GAMES_TO_LOAD_ON_SCROLL = 8;

/** On phones the grid is single-column, so fewer cards are needed above the fold. */
const getInitialGamesToShow = () =>
    typeof window !== 'undefined' && window.innerWidth < 640
        ? 6
        : INITIAL_GAMES_TO_SHOW;

const MasonryItem = ({ children }: { children: any }) => {
    const { ref, height } = useMeasure<HTMLDivElement>();
    // Usamos un incremento de 10px para las filas del grid.
    const span = height > 0 ? Math.ceil((height + 24) / 10) : 1;

    return (
        <div 
            ref={ref} 
            className="game-card-wrapper h-fit animate-fade-in-up [content-visibility:auto] [contain-intrinsic-size:0_360px]"
            style={{ gridRowEnd: `span ${span}` }}
        >
            {children}
        </div>
    );
};

const GameGrid = ({ games, onGameClick }: GameGridProps) => {
    const [displayedCount, setDisplayedCount] = useState(getInitialGamesToShow);

    const gridRef = useRef<HTMLDivElement | null>(null);
    const prevGamesSignatureRef = useRef<string>('');
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingMoreRef = useRef<boolean>(false);

    useEffect(() => {
        const signature = games.map(g => g.id).join('|');
        if (signature !== prevGamesSignatureRef.current) {
            prevGamesSignatureRef.current = signature;
            setDisplayedCount(getInitialGamesToShow());
        }
    }, [games]);

    const gamesToShow = games.slice(0, displayedCount);

    const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
        if (observer.current) {
            observer.current.disconnect();
            observer.current = null;
        }
        if (!node) return;

        observer.current = new IntersectionObserver(
            entries => {
                const visible = entries.some(e => e.isIntersecting);
                if (!visible) return;

                if (!loadingMoreRef.current && displayedCount < games.length) {
                    loadingMoreRef.current = true;
                    setDisplayedCount(prev => Math.min(prev + GAMES_TO_LOAD_ON_SCROLL, games.length));
                }
            },
            {
                root: null,
                rootMargin: '0px 0px 400px 0px',
                threshold: 0.01
            }
        );
        observer.current.observe(node);
    }, [displayedCount, games.length]);

    useEffect(() => {
        loadingMoreRef.current = false;
    }, [displayedCount]);

    if (games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-base-300 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h2>
                <p className="text-base-content/70">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        );
    }

    const hasMoreGames = displayedCount < games.length;

    return (
        <>
            <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-0 auto-rows-[10px] items-start"
            >
                {gamesToShow.map((game, idx) => (
                    <MasonryItem key={game.id}>
                        <GameCard
                            game={game}
                            onClick={() => { trackGameCardClick({ slug: game.slug, title: game.title }, idx, 'grid'); onGameClick(game); }}
                            layout="masonry"
                        />
                    </MasonryItem>
                ))}
            </div>

            {hasMoreGames && (
                <div ref={loadMoreRef} className="text-center p-8">
                    <p className="text-accent-teal">Cargando más juegos...</p>
                </div>
            )}
        </>
    );
};

export default GameGrid;
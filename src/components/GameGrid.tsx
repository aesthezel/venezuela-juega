import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { Game } from '@/src/types';
import { GameCard } from '@/src/components';
import { gsap } from 'gsap';

interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const INITIAL_GAMES_TO_SHOW = 12;
const GAMES_TO_LOAD_ON_SCROLL = 8;

const GameGrid = ({ games, onGameClick }: GameGridProps) => {
    const [displayedCount, setDisplayedCount] = useState(INITIAL_GAMES_TO_SHOW);

    const gridRef = useRef<HTMLDivElement | null>(null);
    const prevCountRef = useRef(0);
    const prevGamesSignatureRef = useRef<string>('');
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingMoreRef = useRef<Boolean>(false);

    useEffect(() => {
        const signature = games.map(g => g.id).join('|');
        if (signature !== prevGamesSignatureRef.current) {
            prevGamesSignatureRef.current = signature;
            prevCountRef.current = 0;
            setDisplayedCount(INITIAL_GAMES_TO_SHOW);
        }
    }, [games]);

    const gamesToShow = games.slice(0, displayedCount);

    // Animar solo las nuevas tarjetas
    useEffect(() => {
        const container = gridRef.current;
        if (!container) return;

        const cards = Array.from(container.querySelectorAll('.game-card-wrapper')) as HTMLElement[];
        const prev = prevCountRef.current;
        const curr = displayedCount;

        if (curr <= prev) {
            prevCountRef.current = curr;
            return;
        }

        const newCards = cards.slice(prev, curr);
        if (newCards.length === 0) {
            prevCountRef.current = curr;
            return;
        }

        let ctx: gsap.Context | null = null;
        ctx = gsap.context(() => {
            gsap.fromTo(
                newCards,
                { opacity: 0, y: 16, willChange: 'transform, opacity' },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', clearProps: 'will-change' }
            );
        }, container);

        prevCountRef.current = curr;

        return () => {
            if (ctx) ctx.revert();
            gsap.killTweensOf(newCards);
        };
    }, [displayedCount]);

    // IntersectionObserver para carga incremental
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
            <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h2>
                <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
        );
    }

    const hasMoreGames = displayedCount < games.length;

    return (
        <>
            <div
                ref={gridRef}
                className="columns-1 sm:columns-2 xl:columns-3 gap-6 [column-fill:balance] [&>*]:break-inside-avoid"
            >
                {gamesToShow.map(game => (
                    <div key={game.id} className="game-card-wrapper mb-6 break-inside-avoid">
                        <GameCard
                            game={game}
                            onClick={() => onGameClick(game)}
                            layout="masonry"
                        />
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
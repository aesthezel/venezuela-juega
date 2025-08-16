import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { h } from 'preact';
import { Game } from '@/src/types';
import { gsap } from 'gsap';

interface GameListProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}

const INITIAL_GAMES_TO_SHOW = 12;
const GAMES_TO_LOAD_ON_SCROLL = 10;

const GameList = ({ games, onGameClick }: GameListProps) => {
  const [displayedCount, setDisplayedCount] = useState(INITIAL_GAMES_TO_SHOW);

  const listRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(0);
  const prevGamesSignatureRef = useRef<string>('');
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingMoreRef = useRef<boolean>(false);

  useEffect(() => {
    const signature = games.map(g => g.id).join('|');
    if (signature !== prevGamesSignatureRef.current) {
      prevGamesSignatureRef.current = signature;
      prevCountRef.current = 0;
      setDisplayedCount(INITIAL_GAMES_TO_SHOW);
    }
  }, [games]);

  const gamesToShow = games.slice(0, displayedCount);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll('.game-list-row')) as HTMLElement[];
    const prev = prevCountRef.current;
    const curr = displayedCount;

    if (curr <= prev) {
      prevCountRef.current = curr;
      return;
    }

    const newRows = rows.slice(prev, curr);
    if (newRows.length === 0) {
      prevCountRef.current = curr;
      return;
    }

    let ctx: gsap.Context | null = null;
    ctx = gsap.context(() => {
      gsap.fromTo(
        newRows,
        { opacity: 0, y: 10, willChange: 'transform, opacity' },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power3.out', clearProps: 'will-change' }
      );
    }, container);

    prevCountRef.current = curr;

    return () => {
      if (ctx) ctx.revert();
      gsap.killTweensOf(newRows);
    };
  }, [displayedCount]);

  // Carga incremental con IntersectionObserver
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
    if (!node) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.some(e => e.isIntersecting);
        if (!visible) return;
        if (!loadingMoreRef.current && displayedCount < games.length) {
          loadingMoreRef.current = true;
          setDisplayedCount(prev => Math.min(prev + GAMES_TO_LOAD_ON_SCROLL, games.length));
        }
      },
      { root: null, rootMargin: '0px 0px 400px 0px', threshold: 0.01 }
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
      <div ref={listRef} className="space-y-3">
        {gamesToShow.map(game => (
          <button
            key={game.id}
            onClick={() => onGameClick(game)}
            className="game-list-row w-full text-left bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg p-3 flex gap-3 items-center"
          >
            <img
              src={game.imageUrl}
              alt={game.title}
              className="h-16 w-28 object-cover rounded-md flex-shrink-0"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-semibold text-white truncate">{game.title}</h3>
                {game.isHighlighted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Destacado
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-300 truncate">
                {game.genre?.join(' • ') || 'Género no especificado'}
              </div>
              <div className="mt-0.5 text-xs text-gray-400 truncate">
                {(game.platform?.length ? game.platform : ['Plataforma no especificada']).join(' • ')}
              </div>
            </div>
            <div className="ml-3">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-cyan-300 border border-slate-600">
                {game.status}
              </span>
            </div>
          </button>
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

export default GameList;
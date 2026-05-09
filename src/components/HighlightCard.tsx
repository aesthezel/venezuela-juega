import { useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { StatusBadge } from "@/src/components/index.ts";
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';

interface HighlightCardProps {
    game: Game;
    onClick: (game: Game) => void;
    fullWidth?: boolean;
}

const HighlightCard = ({ game, onClick, fullWidth = false }: HighlightCardProps) => {
    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLDivElement>();

    // Measure highlightReason if it exists
    const { lineCount } = useTextLayout(game.highlightReason, containerWidth * 0.92, {
        fontSize: 16, // Approx text-base
        lineHeight: 24
    });

    return (
        <div
            ref={containerRef}
            onClick={() => onClick(game)}
            className={`card shadow-xl cursor-pointer group h-full flex-shrink-0 snap-start overflow-hidden rounded-lg relative ${fullWidth ? 'w-full' : 'w-80'}`}
            aria-label={`Ver detalles de ${game.title}`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(game)}
        >
            <figure className="absolute inset-0 m-0 p-0 z-0 w-full h-full">
                <img src={game.imageHero || game.imageCover || game.imageUrl} alt={game.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-900/40 to-transparent pointer-events-none"></div>
            </figure>

            <div className="card-body p-0 justify-end relative z-10 h-full">
                <div className="absolute top-3 left-3 z-10">
                    <StatusBadge status={game.status} size="md" variant="outline" className="bg-base-100/90" />
                </div>
                <div className="w-full px-4 pb-14 md:pb-16 text-center">
                    <div className="flex flex-col items-center gap-1.5 md:gap-1 max-w-[92%] mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-white truncate drop-shadow">
                            {game.title}
                        </h3>
                        <p className="text-base md:text-lg text-accent-teal truncate drop-shadow">
                            Realizado por {game.developers.join(', ')}
                        </p>
                        {game.highlightReason && (
                            <p className="mt-1 text-base md:text-lg font-semibold text-amber-300 line-clamp-3 drop-shadow">
                                {game.highlightReason}
                            </p>
                        )}
                        {game.platform?.length > 0 && (
                            <div className="mt-2 flex flex-wrap justify-center gap-1 max-h-12 md:max-h-14 overflow-hidden">
                                {game.platform.map((p) => (
                                    <span
                                        key={p}
                                        className="badge badge-sm bg-black/40 text-base-content border-surface-700"
                                        title={`Disponible en ${p}`}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightCard;

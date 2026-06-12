import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import type { Game } from '@/types';
import { GameStatus } from '@/types';

interface MiniGameCardProps {
    game: Game;
    onClick: (game: Game) => void;
}

const STATUS_BADGE: Record<string, string> = {
    [GameStatus.RELEASED]: 'bg-emerald-500/85 text-emerald-50',
    [GameStatus.RELEASED_DEMO]: 'bg-sky-500/85 text-sky-50',
    [GameStatus.PROTOTYPE]: 'bg-amber-500/85 text-amber-50',
    [GameStatus.IN_DEVELOPMENT]: 'bg-amber-500/85 text-amber-50',
    [GameStatus.ON_HOLD]: 'bg-slate-500/85 text-slate-50',
    [GameStatus.CANCELED]: 'bg-rose-500/85 text-rose-50',
    [GameStatus.LOST_MEDIA]: 'bg-zinc-500/85 text-zinc-50',
    [GameStatus.EARLY_ACCESS]: 'bg-violet-500/85 text-violet-50',
    [GameStatus.RECOVERED]: 'bg-teal-500/85 text-teal-50',
    [GameStatus.UNKNOWN]: 'bg-base-300/85 text-base-content/70',
};

const STATUS_SHORT: Record<string, string> = {
    [GameStatus.IN_DEVELOPMENT]: 'En dev',
    [GameStatus.RELEASED]: 'Lanzado',
    [GameStatus.RELEASED_DEMO]: 'Demo',
    [GameStatus.EARLY_ACCESS]: 'EA',
};

/** Paletas para fallback sin cover — determinista por slug. */
const FALLBACK_PALETTES = [
    'from-accent-teal-dark via-base-300 to-base-200',
    'from-violet-700 via-base-300 to-base-200',
    'from-rose-700 via-base-300 to-base-200',
    'from-emerald-700 via-base-300 to-base-200',
    'from-amber-700 via-base-300 to-base-200',
    'from-sky-700 via-base-300 to-base-200',
    'from-fuchsia-700 via-base-300 to-base-200',
    'from-cyan-700 via-base-300 to-base-200',
];

const hashSlug = (slug: string): number => {
    let h = 0;
    for (let i = 0; i < slug.length; i++) {
        h = (h * 31 + slug.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
};

const MiniGameCard = ({ game, onClick }: MiniGameCardProps) => {
    const cover = game.imageCover || game.imageUrl || game.imageHero;
    const badgeClass = STATUS_BADGE[game.status] || STATUS_BADGE[GameStatus.UNKNOWN];
    const statusLabel = STATUS_SHORT[game.status] || game.status;
    const palette = FALLBACK_PALETTES[hashSlug(game.slug) % FALLBACK_PALETTES.length];

    return (
        <button
            type="button"
            onClick={() => onClick(game)}
            className="group relative shrink-0 snap-start w-44 sm:w-48 md:w-52 lg:w-56 rounded-xl overflow-hidden border border-surface-700 bg-base-300 shadow-lg transition-all duration-200 hover:scale-[1.03] hover:border-accent-teal-dark/60 hover:shadow-accent-teal-dark/20 focus-visible:ring-2 focus-visible:ring-accent-teal-dark focus-visible:outline-none text-left"
            aria-label={`Ver detalles de ${game.title}`}
        >
            <div className="relative aspect-video w-full bg-base-100 overflow-hidden">
                {cover ? (
                    <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${palette}`}>
                        {/* Ornamento gamepad muy sutil al fondo */}
                        <FontAwesomeIcon
                            icon={faGamepad}
                            className="absolute -right-4 -bottom-4 text-white/5 text-[7rem] rotate-12 pointer-events-none select-none"
                        />
                        {/* Título grande centrado */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight line-clamp-3 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300">
                                {game.title}
                            </h4>
                        </div>
                    </div>
                )}

                {/* Gradiente para legibilidad del título inferior (solo si hay cover) */}
                {cover && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                )}

                {/* Status badge */}
                <span className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm shadow-md ${badgeClass}`}>
                    {statusLabel}
                </span>

                {/* Título sobre gradient (solo si hay cover; sin cover el título ya está dentro) */}
                {cover && (
                    <div className="absolute inset-x-0 bottom-0 p-3">
                        <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 drop-shadow-lg">
                            {game.title}
                        </h4>
                    </div>
                )}
            </div>
        </button>
    );
};

export default MiniGameCard;

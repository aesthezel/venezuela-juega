import { useState, useMemo } from 'preact/hooks';
import { Game } from '@/types';
import { useMeasure } from '@/hooks/useMeasure';
import { useTextLayout } from '@/hooks/useTextLayout';
import { CoverImage } from '@/components';
import { getTrailerInfo } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faUsers } from '@fortawesome/free-solid-svg-icons';

interface JamGameCardProps {
    game: Game;
    onGameClick?: (game: Game) => void;
    /** Solid accent color used for the title on hover and the bottom bar */
    accentColor?: string;
}

/**
 * Compact card used to showcase games made in a jam. Shared by the jam venue
 * listings and the "Juegos de esta edición" section on jam detail pages.
 */
const JamGameCard = ({ game, onGameClick, accentColor = '#f97316' }: JamGameCardProps) => {
    const [hovered, setHovered] = useState(false);
    const trailerInfo = useMemo(() => getTrailerInfo(game.trailerUrl), [game.trailerUrl]);
    const { ref: containerRef, width: containerWidth } = useMeasure<HTMLElement>();

    // Title measurement (14px, tight line height)
    const { lineCount: titleLineCount } = useTextLayout(game.title, containerWidth - 32, {
        fontSize: 14,
        lineHeight: 18
    });

    // Description measurement (12px, tight line height)
    const descriptionText = game.pitch || game.description;
    const { lineCount: descLineCount } = useTextLayout(descriptionText, containerWidth - 32, {
        fontSize: 12,
        lineHeight: 16
    });

    return (
        <article
            ref={containerRef}
            onClick={() => onGameClick?.(game)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative bg-base-300/60 rounded-xl overflow-hidden border border-surface-700 hover:border-surface-700 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
        >
            {/* Cover image */}
            <div className="relative aspect-video overflow-hidden bg-base-200/80 flex-shrink-0">
                <CoverImage
                    src={game.imageHero || game.imageCover || game.imageUrl}
                    alt={game.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {hovered && trailerInfo && (
                    trailerInfo.type === 'youtube' ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] pointer-events-none opacity-0 transition-opacity duration-700 z-5 max-w-none"
                            allow="autoplay; encrypted-media"
                            title={`${game.title} trailer`}
                            onLoad={(e) => {
                                if (e.target instanceof HTMLIFrameElement) {
                                    e.target.classList.remove('opacity-0');
                                    e.target.classList.add('opacity-100');
                                }
                            }}
                        />
                    ) : (
                        <video
                            src={trailerInfo.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700 z-5"
                            onCanPlay={(e) => {
                                if (e.target instanceof HTMLVideoElement) {
                                    e.target.classList.remove('opacity-0');
                                    e.target.classList.add('opacity-100');
                                }
                            }}
                        />
                    )
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface-800/80 via-transparent to-transparent z-10 pointer-events-none" />

                {game.isHighlighted && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white shadow-lg z-10">
                        <FontAwesomeIcon icon={faTrophy} className="text-[10px]" />
                        Destacado
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3
                    className={`text-sm font-bold leading-tight transition-colors duration-200 ${titleLineCount > 2 ? 'line-clamp-2' : ''}`}
                    style={{ color: hovered ? accentColor : '#ffffff' }}
                >
                    {game.title}
                </h3>

                {game.developers?.length > 0 && (
                    <div className="flex items-center gap-1.5 min-w-0">
                        <FontAwesomeIcon icon={faUsers} className="text-base-content/70 text-[10px] flex-shrink-0" />
                        <p className="text-xs text-base-content/70 truncate">
                            {Array.isArray(game.developers) ? game.developers.join(', ') : game.developers}
                        </p>
                    </div>
                )}

                {descriptionText ? (
                    <p className={`text-xs text-base-content/70 leading-relaxed flex-1 ${descLineCount > 2 ? 'line-clamp-2' : ''}`}>
                        {descriptionText}
                    </p>
                ) : <div className="flex-1" />}

                {game.genre?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {game.genre.slice(0, 3).map((genre) => (
                            <span key={genre} className="text-[10px] px-1.5 py-0.5 bg-base-300/50 text-base-content/70 rounded border border-surface-700">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Accent bar at bottom */}
            <div
                className="h-0.5 transition-all duration-500 ease-out"
                style={{
                    width: hovered ? '100%' : '0%',
                    background: `linear-gradient(to right, ${accentColor}, transparent)`,
                }}
            />
        </article>
    );
};

export default JamGameCard;

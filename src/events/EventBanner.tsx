import { useMemo, useState, useCallback, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck, faArrowRight, faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MiniGameCard from './MiniGameCard';
import type { Game } from '@/types';
import { useEventsData } from './useEventsData';
import { computeStatus, pickBannerEvents, statusLabel } from './eventUtils';
import type { EventStatus, VjEvent } from './types';

/** Local accessor — avoids importing JamGame from the prod data hook (isolation rule). */
type WithJamEdition = { Jam_Edition?: string };

interface EventBannerProps {
    games: Game[];
    jamGames: Game[];
    onGameClick: (game: Game) => void;
}

const STATUS_ICON: Record<EventStatus, typeof faCircle> = {
    live: faCircle,
    upcoming: faClock,
    finished: faCheck,
};

const STATUS_STYLE: Record<EventStatus, string> = {
    live: 'bg-rose-500/20 border-rose-400/40 text-rose-200',
    upcoming: 'bg-accent-teal-dark/25 border-accent-teal-dark/50 text-accent-teal',
    finished: 'bg-base-300/70 border-surface-700 text-base-content/70',
};

const AUTO_ADVANCE_MS = 8000;

const formatRange = (start: Date, end: Date): string => {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const s = start.toLocaleDateString('es-ES', opts);
    const e = end.toLocaleDateString('es-ES', { ...opts, year: 'numeric' });
    return `${s} – ${e}`;
};

const matchEventGames = (event: VjEvent | undefined, jamGames: Game[]): Game[] => {
    if (!event?.jamEdition) return [];
    const target = event.jamEdition.trim().toLowerCase();
    return jamGames.filter(g => (g as unknown as WithJamEdition).Jam_Edition?.trim().toLowerCase() === target);
};

const EventBanner = ({ jamGames, onGameClick }: EventBannerProps) => {
    const { events, loading } = useEventsData();
    const now = useMemo(() => new Date(), []);
    const eligible = useMemo(() => pickBannerEvents(events, now), [events, now]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [userInteracted, setUserInteracted] = useState(false);
    const [gameIdx, setGameIdx] = useState(0);

    // Si la lista cambia (refetch), volver al primero.
    useEffect(() => { setActiveIndex(0); }, [eligible.length]);

    // Reset índice de juego cuando cambia el evento activo.
    useEffect(() => { setGameIdx(0); }, [activeIndex]);

    // Auto-advance solo si hay >1 evento y el usuario no ha interactuado.
    useEffect(() => {
        if (eligible.length <= 1 || userInteracted) return;
        const id = setInterval(() => {
            setActiveIndex(i => (i + 1) % eligible.length);
        }, AUTO_ADVANCE_MS);
        return () => clearInterval(id);
    }, [eligible.length, userInteracted]);

    const goPrev = useCallback(() => {
        setUserInteracted(true);
        setActiveIndex(i => (i - 1 + eligible.length) % eligible.length);
    }, [eligible.length]);

    const goNext = useCallback(() => {
        setUserInteracted(true);
        setActiveIndex(i => (i + 1) % eligible.length);
    }, [eligible.length]);

    const goTo = useCallback((i: number) => {
        setUserInteracted(true);
        setActiveIndex(i);
    }, []);

    const event = eligible[activeIndex];
    const eventGames = useMemo(() => matchEventGames(event, jamGames), [event, jamGames]);

    if (loading || !event) return null;

    const status = computeStatus(event.startDate, event.endDate, event.statusOverride, now);
    const goToEvent = () => route(`/events/${event.eventId}`);
    const hasMultiple = eligible.length > 1;

    return (
        <section
            className="relative w-full bg-base-100 mb-6 md:mb-10"
            aria-label={`Evento destacado: ${event.name}`}
            aria-roledescription="carousel"
        >
            {/* Hero strip estilo Steam: imagen full-bleed con overlays cinematográficos */}
            <div className="relative w-full min-h-[38vh] md:min-h-[48vh] overflow-hidden">
                {event.imageBanner ? (
                    <img
                        key={event.eventId}
                        src={event.imageBanner}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 animate-fade-in"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-teal-dark/40 via-base-200 to-base-100" />
                )}

                {/* Gradientes: top fade, bottom legibilidad, lateral profundidad. */}
                <div className="absolute inset-0 bg-gradient-to-b from-base-100/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/70 to-base-100/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-base-100/80 via-base-100/20 to-transparent pointer-events-none" />

                {/* Arrows del carrusel (solo si hay >1 evento) */}
                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-base-100/70 hover:bg-base-100 backdrop-blur-md border border-surface-700 text-white items-center justify-center shadow-lg transition-all hover:scale-110"
                            aria-label="Evento anterior"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-base-100/70 hover:bg-base-100 backdrop-blur-md border border-surface-700 text-white items-center justify-center shadow-lg transition-all hover:scale-110"
                            aria-label="Siguiente evento"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </>
                )}

                {/* Contenido alineado abajo-izquierda */}
                <div className="absolute inset-x-0 bottom-0">
                    <div className="container mx-auto px-6 md:px-10 pb-8 md:pb-12 flex flex-col gap-3 max-w-5xl">
                        <div className={`inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[status]}`}>
                            <FontAwesomeIcon icon={STATUS_ICON[status]} className={status === 'live' ? 'animate-pulse text-[8px]' : 'text-[10px]'} />
                            {statusLabel(status)}
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                            {event.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-base-content/85">
                            <span className="inline-flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-accent-teal" />
                                {formatRange(event.startDate, event.endDate)}
                            </span>
                            {event.location && <span>· {event.location}</span>}
                            {event.hostOrg && <span>· {event.hostOrg}</span>}
                        </div>

                        {event.description && (
                            <p className="text-sm md:text-base text-base-content/85 max-w-2xl line-clamp-2 md:line-clamp-3">
                                {event.description}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={goToEvent}
                            className="btn bg-accent hover:bg-accent/90 text-accent-content font-bold gap-2 rounded-2xl h-12 px-6 w-fit mt-2 shadow-lg shadow-accent/30"
                        >
                            Ver evento
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Dots indicator (solo si hay >1 evento) */}
            {hasMultiple && (
                <div className="flex justify-center gap-2 pt-3" role="tablist" aria-label="Selector de evento">
                    {eligible.map((e, i) => (
                        <button
                            key={e.eventId}
                            type="button"
                            role="tab"
                            aria-selected={i === activeIndex}
                            aria-label={`Ver ${e.name}`}
                            onClick={() => goTo(i)}
                            className={`h-2 rounded-full transition-all ${i === activeIndex
                                ? 'w-8 bg-accent'
                                : 'w-2 bg-base-content/30 hover:bg-base-content/60'}`}
                        />
                    ))}
                </div>
            )}

            {/* Strip de juegos del evento activo (carrusel Steam: 1 visible centrado + peek lateral). */}
            {eventGames.length > 0 && (() => {
                const total = eventGames.length;
                const safeIdx = ((gameIdx % total) + total) % total;
                const prevGame = total > 1 ? eventGames[(safeIdx - 1 + total) % total] : null;
                const currentGame = eventGames[safeIdx];
                const nextGame = total > 1 ? eventGames[(safeIdx + 1) % total] : null;
                const goPrevGame = () => setGameIdx(i => (i - 1 + total) % total);
                const goNextGame = () => setGameIdx(i => (i + 1) % total);

                return (
                    <div className="container mx-auto px-4 md:px-6 py-5">
                        <div className="flex items-baseline justify-between mb-4">
                            <h3 className="text-[10px] font-black text-base-content/60 uppercase tracking-widest">
                                Juegos del evento
                            </h3>
                            <span className="text-[10px] font-bold text-base-content/40">
                                {safeIdx + 1} / {total}
                            </span>
                        </div>

                        <div className="relative">
                            {/* Track con peek dimmed a los lados */}
                            <div className="flex items-center justify-center gap-2 md:gap-6 px-10 md:px-16 min-h-[180px]">
                                {prevGame && (
                                    <div
                                        className="hidden sm:block opacity-30 scale-75 -mr-8 md:-mr-12 transition-all duration-300 pointer-events-none select-none"
                                        aria-hidden="true"
                                    >
                                        <MiniGameCard game={prevGame} onClick={() => { }} />
                                    </div>
                                )}

                                <div key={currentGame.slug} className="z-10 animate-fade-in">
                                    <MiniGameCard game={currentGame} onClick={onGameClick} />
                                </div>

                                {nextGame && (
                                    <div
                                        className="hidden sm:block opacity-30 scale-75 -ml-8 md:-ml-12 transition-all duration-300 pointer-events-none select-none"
                                        aria-hidden="true"
                                    >
                                        <MiniGameCard game={nextGame} onClick={() => { }} />
                                    </div>
                                )}
                            </div>

                            {/* Arrows */}
                            {total > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goPrevGame}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-base-200/80 hover:bg-base-300 backdrop-blur-md border border-surface-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                        aria-label="Juego anterior"
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goNextGame}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-base-200/80 hover:bg-base-300 backdrop-blur-md border border-surface-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                                        aria-label="Siguiente juego"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })()}
        </section>
    );
};

export default EventBanner;

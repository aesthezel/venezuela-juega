import { route } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck, faCalendarAlt, faArrowRight, faGamepad, faStar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { computeStatus, statusLabel } from './eventUtils';
import type { EventStatus, VjEvent } from './types';

interface EventSpotlightProps {
    event: VjEvent;
    now?: Date;
    gamesCount?: number;
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

const formatRange = (start: Date, end: Date): string => {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const s = start.toLocaleDateString('es-ES', opts);
    const e = end.toLocaleDateString('es-ES', { ...opts, year: 'numeric' });
    return `${s} – ${e}`;
};

const EventSpotlight = ({ event, now = new Date(), gamesCount = 0 }: EventSpotlightProps) => {
    const status = computeStatus(event.startDate, event.endDate, event.statusOverride, now);
    const goToEvent = () => route(`/events/${event.eventId}`);

    return (
        <section
            className="relative w-full rounded-3xl overflow-hidden border border-surface-700 shadow-2xl bg-base-200 mb-10"
            aria-label={`Evento destacado: ${event.name}`}
        >
            <div className="relative w-full min-h-[44vh] md:min-h-[52vh]">
                {event.imageBanner ? (
                    <img
                        src={event.imageBanner}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-teal-dark/40 via-base-200 to-base-100" />
                )}

                {/* Gradientes para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/70 to-base-200/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-base-200/85 via-base-200/30 to-transparent pointer-events-none" />

                {/* Tag "Destacado" top-left */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-accent/20 border border-accent/40 text-accent-content backdrop-blur-md">
                    <FontAwesomeIcon icon={faStar} className="text-[9px]" />
                    Destacado
                </div>

                {/* Games count top-right */}
                {gamesCount > 0 && (
                    <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-base-100/70 backdrop-blur-md border border-surface-700 text-white">
                        <FontAwesomeIcon icon={faGamepad} className="text-accent-teal" />
                        {gamesCount} {gamesCount === 1 ? 'juego' : 'juegos'}
                    </div>
                )}

                {/* Contenido inferior */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                    <div className="max-w-3xl flex flex-col gap-3">
                        <div className={`inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLE[status]}`}>
                            <FontAwesomeIcon icon={STATUS_ICON[status]} className={status === 'live' ? 'animate-pulse text-[8px]' : 'text-[10px]'} />
                            {statusLabel(status)}
                        </div>

                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                            {event.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-base-content/85">
                            <span className="inline-flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-accent-teal" />
                                {formatRange(event.startDate, event.endDate)}
                            </span>
                            {event.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-accent-teal" />
                                    {event.location}
                                </span>
                            )}
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
                            Ver detalles
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventSpotlight;

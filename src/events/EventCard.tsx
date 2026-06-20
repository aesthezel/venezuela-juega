import { route } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck, faCalendarAlt, faGamepad, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computeStatus, statusLabel } from './eventUtils';
import type { EventStatus, VjEvent } from './types';

interface EventCardProps {
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
    live: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    upcoming: 'bg-accent-teal-dark/20 border-accent-teal-dark/40 text-accent-teal',
    finished: 'bg-base-300 border-surface-700 text-base-content/60',
};

const formatRange = (start: Date, end: Date): string => {
    const s = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const e = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} – ${e}`;
};

const EventCard = ({ event, now = new Date(), gamesCount = 0 }: EventCardProps) => {
    const status = computeStatus(event.startDate, event.endDate, event.statusOverride, now);
    const cover = event.imageThumb || event.imageBanner;
    const topTags = event.tags.slice(0, 3);

    return (
        <button
            type="button"
            onClick={() => route(`/events/${event.eventId}`)}
            className="group relative text-left bg-base-200/60 border border-surface-700 rounded-2xl overflow-hidden hover:border-accent-teal-dark/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full flex flex-col"
            aria-label={`Ver evento ${event.name}`}
        >
            <div className="relative aspect-[16/9] bg-base-300 overflow-hidden">
                {cover && (
                    <img
                        src={cover}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        loading="lazy"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-base-200/95 via-base-200/40 to-transparent" />

                {/* Status badge */}
                <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${STATUS_STYLE[status]}`}>
                    <FontAwesomeIcon icon={STATUS_ICON[status]} className={status === 'live' ? 'animate-pulse text-[8px]' : 'text-[10px]'} />
                    {statusLabel(status)}
                </div>

                {/* Games count badge top-right */}
                {gamesCount > 0 && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-base-100/80 backdrop-blur-md border border-surface-700 text-white">
                        <FontAwesomeIcon icon={faGamepad} className="text-[9px] text-accent-teal" />
                        {gamesCount}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="text-base font-black text-white truncate group-hover:text-accent-teal transition-colors">
                    {event.name}
                </h3>

                <div className="text-[11px] text-base-content/70 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-accent-teal text-[9px]" />
                    {formatRange(event.startDate, event.endDate)}
                </div>

                {event.hostOrg && (
                    <div className="text-[11px] text-base-content/60 flex items-center gap-1.5 truncate">
                        <FontAwesomeIcon icon={faBuilding} className="text-base-content/40 text-[9px]" />
                        <span className="truncate">{event.hostOrg}</span>
                        {event.location && <span className="text-base-content/40">· {event.location}</span>}
                    </div>
                )}

                {topTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                        {topTags.map(t => (
                            <span
                                key={t}
                                className="text-[9px] uppercase tracking-widest font-bold bg-base-300/70 border border-surface-700 text-base-content/60 px-2 py-0.5 rounded-full"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </button>
    );
};

export default EventCard;

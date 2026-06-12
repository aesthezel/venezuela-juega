import { useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import type { RoutableProps } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck, faCalendarAlt, faArrowLeft, faExternalLinkAlt, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { BackButton, PageTransition, LoadingSpinner, GameCard } from '@/components';
import type { Game } from '@/types';
import { useEventsData } from './useEventsData';
import { computeStatus, statusLabel } from './eventUtils';
import type { EventStatus } from './types';
import StreamPlayer from './StreamPlayer';
import MiniGameCard from './MiniGameCard';

type WithJamEdition = { Jam_Edition?: string };

interface EventDetailPageProps extends RoutableProps {
    eventId?: string;
    games?: Game[];
    jamGames?: Game[];
    onGameClick?: (g: Game) => void;
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
    const s = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    const e = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${s} – ${e}`;
};

const EventDetailPage = ({ eventId, games = [], jamGames = [], onGameClick }: EventDetailPageProps) => {
    const { events, loading, error } = useEventsData();
    const now = useMemo(() => new Date(), []);
    const event = useMemo(() => {
        if (!eventId) return null;
        const id = decodeURIComponent(eventId).trim().toLowerCase();
        return events.find(e => e.eventId.toLowerCase() === id) ?? null;
    }, [events, eventId]);

    // Juegos del evento: cruza event.jamEdition contra jamGames.Jam_Edition.
    const eventGames = useMemo(() => {
        if (!event?.jamEdition) return [];
        const target = event.jamEdition.trim().toLowerCase();
        return jamGames.filter(g => (g as unknown as WithJamEdition).Jam_Edition?.trim().toLowerCase() === target);
    }, [event, jamGames]);

    // Sugeridos: 4 del catálogo prod como cross-promo.
    const recommendedGames = useMemo(() => games.slice(0, 4), [games]);

    const goBack = () => route('/events');

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <PageTransition>
                <main className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-white">No se pudo cargar el evento</h1>
                    <p className="text-sm text-base-content/70 mt-2">{error}</p>
                    <BackButton onClick={goBack} className="mt-6" />
                </main>
            </PageTransition>
        );
    }

    if (!event) {
        return (
            <PageTransition>
                <main className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-white">Evento no encontrado</h1>
                    <p className="text-sm text-base-content/70 mt-2">Revisa el enlace o vuelve al listado.</p>
                    <button onClick={goBack} className="btn bg-accent text-accent-content mt-6 gap-2">
                        <FontAwesomeIcon icon={faArrowLeft} /> Ver eventos
                    </button>
                </main>
            </PageTransition>
        );
    }

    const status = computeStatus(event.startDate, event.endDate, event.statusOverride, now);
    const isLive = status === 'live';

    return (
        <PageTransition>
            <main className="container mx-auto px-4 py-8">
                <BackButton onClick={goBack} className="mb-6" />

                {/* Hero strip del evento */}
                <header className="relative overflow-hidden rounded-[2rem] border border-surface-700 shadow-2xl bg-base-200/60 backdrop-blur-xl mb-8">
                    {event.imageBanner && (
                        <div
                            className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
                            style={{ backgroundImage: `url(${event.imageBanner})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-base-200/95 via-base-200/70 to-base-200/30 pointer-events-none" />
                    <div className="relative p-6 md:p-8">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-3 ${STATUS_STYLE[status]}`}>
                            <FontAwesomeIcon icon={STATUS_ICON[status]} className={status === 'live' ? 'animate-pulse text-[8px]' : 'text-[10px]'} />
                            {statusLabel(status)}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{event.name}</h1>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-content/70 mt-2">
                            <span className="inline-flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-accent-teal text-xs" />
                                {formatRange(event.startDate, event.endDate)}
                            </span>
                            {event.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faLocationDot} className="text-accent-teal text-xs" />
                                    {event.location}
                                </span>
                            )}
                            {event.hostOrg && <span>· {event.hostOrg}</span>}
                        </div>
                        {event.description && (
                            <p className="text-base text-base-content/80 mt-4 max-w-3xl">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-5">
                            {event.externalUrl && (
                                <a
                                    href={event.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-white/5 hover:bg-white/10 border border-surface-700 text-white gap-2 rounded-xl"
                                >
                                    Sitio del evento <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                            )}
                            {event.hostUrl && (
                                <a
                                    href={event.hostUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-white/5 hover:bg-white/10 border border-surface-700 text-white gap-2 rounded-xl"
                                >
                                    {event.hostOrg || 'Organizador'} <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stream */}
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Transmisión</h2>
                    <StreamPlayer
                        twitchChannel={event.twitchChannel}
                        youtubeVideoId={event.youtubeVideoId}
                        youtubePlaylistId={event.youtubePlaylistId}
                        isLive={isLive}
                    />
                </section>

                {/* Tags (justo debajo de la transmisión) */}
                {event.tags.length > 0 && (
                    <section className="mb-12">
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map(t => (
                                <span key={t} className="text-[10px] uppercase tracking-widest font-bold bg-base-300 border border-surface-700 text-base-content/70 px-3 py-1 rounded-full">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Juegos del evento (MiniGameCard para coherencia con banner home) */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Juegos del evento {eventGames.length > 0 && <span className="text-base-content/50 text-sm font-normal">({eventGames.length})</span>}
                    </h2>
                    {eventGames.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {eventGames.map(g => (
                                <MiniGameCard key={g.slug} game={g} onClick={() => onGameClick?.(g)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-base-content/60 italic">Aún sin juegos asociados a este evento.</p>
                    )}
                </section>

                {/* Sugeridos del catálogo */}
                {recommendedGames.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Mientras tanto, descubre estos juegos</h2>
                                <p className="text-xs text-base-content/60 mt-1">Selección del catálogo de Venezuela Juega.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {recommendedGames.map(g => (
                                <GameCard key={g.slug} game={g} onClick={() => onGameClick?.(g)} />
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </PageTransition>
    );
};

export default EventDetailPage;

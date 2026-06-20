import { useMemo } from 'preact/hooks';
import type { RoutableProps } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { PageTransition, LoadingSpinner } from '@/components';
import type { Game } from '@/types';
import { useEventsData } from './useEventsData';
import { computeStatus } from './eventUtils';
import type { EventStatus, VjEvent } from './types';
import EventCard from './EventCard';
import EventSpotlight from './EventSpotlight';

type WithJamEdition = { Jam_Edition?: string };

interface EventsListPageProps extends RoutableProps {
    jamGames?: Game[];
}

const SECTIONS: { status: EventStatus; title: string; subtitle: string; icon: typeof faCircle }[] = [
    { status: 'live', title: 'En vivo ahora', subtitle: 'Eventos transmitiendo actualmente', icon: faCircle },
    { status: 'upcoming', title: 'Próximos', subtitle: 'Por arrancar', icon: faClock },
    { status: 'finished', title: 'Finalizados', subtitle: 'Para revivir', icon: faCheck },
];

const STATUS_ICON_STYLE: Record<EventStatus, string> = {
    live: 'text-rose-400 animate-pulse',
    upcoming: 'text-accent-teal',
    finished: 'text-base-content/40',
};

const countGamesForEvent = (event: VjEvent, jamGames: Game[]): number => {
    if (!event.jamEdition) return 0;
    const target = event.jamEdition.trim().toLowerCase();
    return jamGames.filter(g => (g as unknown as WithJamEdition).Jam_Edition?.trim().toLowerCase() === target).length;
};

const EventsListPage = ({ jamGames = [] }: EventsListPageProps) => {
    const { events, loading, error } = useEventsData();
    const now = useMemo(() => new Date(), []);

    // Spotlight: featured primero, fallback al próximo live/upcoming, fallback al más reciente finalizado.
    const spotlight = useMemo<VjEvent | null>(() => {
        const featured = events.find(e => e.isFeatured);
        if (featured) return featured;
        const live = events.filter(e => computeStatus(e.startDate, e.endDate, e.statusOverride, now) === 'live');
        if (live.length) return [...live].sort((a, b) => a.endDate.getTime() - b.endDate.getTime())[0];
        const upcoming = events.filter(e => computeStatus(e.startDate, e.endDate, e.statusOverride, now) === 'upcoming');
        if (upcoming.length) return [...upcoming].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
        const finished = events.filter(e => computeStatus(e.startDate, e.endDate, e.statusOverride, now) === 'finished');
        if (finished.length) return [...finished].sort((a, b) => b.endDate.getTime() - a.endDate.getTime())[0];
        return null;
    }, [events, now]);

    const groups = useMemo(() => {
        const map: Record<EventStatus, VjEvent[]> = { live: [], upcoming: [], finished: [] };
        for (const e of events) {
            if (spotlight && e.eventId === spotlight.eventId) continue; // evita duplicar
            map[computeStatus(e.startDate, e.endDate, e.statusOverride, now)].push(e);
        }
        map.live.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        map.upcoming.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        map.finished.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
        return map;
    }, [events, now, spotlight]);

    const stats = useMemo(() => {
        const map: Record<EventStatus, number> = { live: 0, upcoming: 0, finished: 0 };
        for (const e of events) {
            map[computeStatus(e.startDate, e.endDate, e.statusOverride, now)]++;
        }
        return map;
    }, [events, now]);

    if (loading) return <LoadingSpinner />;

    return (
        <PageTransition>
            <main className="container mx-auto px-4 py-10">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Eventos</h1>
                    <p className="text-sm text-base-content/70 mt-2 max-w-2xl">
                        Game jams, showcases y transmisiones de la industria venezolana.
                    </p>

                    {/* Stats chips */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {SECTIONS.map(s => (
                            <div
                                key={s.status}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200/70 border border-surface-700 text-xs"
                            >
                                <FontAwesomeIcon icon={s.icon} className={`text-[9px] ${STATUS_ICON_STYLE[s.status]}`} />
                                <span className="font-bold text-white">{stats[s.status]}</span>
                                <span className="text-base-content/60">{s.title.toLowerCase()}</span>
                            </div>
                        ))}
                    </div>
                </header>

                {error && (
                    <div className="mb-6 text-sm text-secondary bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                {/* Spotlight */}
                {spotlight && (
                    <EventSpotlight
                        event={spotlight}
                        now={now}
                        gamesCount={countGamesForEvent(spotlight, jamGames)}
                    />
                )}

                {/* Secciones por status */}
                {SECTIONS.map(({ status, title, subtitle, icon }) => {
                    const list = groups[status];
                    if (!list.length) return null;
                    return (
                        <section key={status} className="mb-12">
                            <div className="flex items-baseline gap-3 mb-4">
                                <FontAwesomeIcon icon={icon} className={`text-sm ${STATUS_ICON_STYLE[status]}`} />
                                <h2 className="text-xl font-bold text-white">{title}</h2>
                                <span className="text-xs text-base-content/50">· {subtitle}</span>
                                <span className="ml-auto text-xs font-black text-base-content/40">{list.length}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {list.map(e => (
                                    <EventCard
                                        key={e.eventId}
                                        event={e}
                                        now={now}
                                        gamesCount={countGamesForEvent(e, jamGames)}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}

                {!loading && events.length === 0 && !error && (
                    <p className="text-sm text-base-content/60 italic">Aún no hay eventos publicados.</p>
                )}
            </main>
        </PageTransition>
    );
};

export default EventsListPage;

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Game } from "@/src/types";
import { BackButton, CoverImage } from "@/src/components";
import { CalendarPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGamepad, 
    faCalendarDays, 
    faUsers, 
    faClock,
    faCalendarWeek,
    faChartLine,
    faTrophy,
    faRocket,
    faFire,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
// @ts-ignore
import { CalendarOptions } from '@fullcalendar/core';

const parseDate = (dateString: string): string | null => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
        return null;
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (year < 1980 || year > new Date().getFullYear() + 20) {
        return null;
    }

    return `${year}-${month}-${day}`;
};

const CalendarTooltip = ({ game, position }: { game: Game; position: { top: number; left: number } }) => {
    if (!game) return null;

    return (
        <div
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
            className="absolute z-50 w-72 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-4 pointer-events-none animate-fade-in-fast backdrop-blur-sm"
        >
            <div className="relative overflow-hidden rounded-lg mb-3">
                <CoverImage
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105"
                    imgClassName="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <h3 className="font-bold text-white text-lg mb-1 leading-tight">{game.title}</h3>
            <p className="text-sm text-cyan-300 mb-2">{game.developers.join(', ')}</p>
            {game.releaseDate && (
                <p className="text-xs text-slate-400 flex items-center">
                    <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3 mr-1" />
                    {new Date(game.releaseDate).toLocaleDateString('es-ES')}
                </p>
            )}
        </div>
    );
};

const CalendarStats = ({ games }: { games: Game[] }) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    // Métricas existentes
    const totalGames = games.length;
    const gamesThisMonth = games.filter(game => {
        if (!game.releaseDate) return false;
        const gameDate = new Date(game.releaseDate);
        return gameDate.getMonth() === currentMonth && gameDate.getFullYear() === currentYear;
    }).length;

    // Nuevas métricas del año
    const gamesThisYear = games.filter(game => {
        if (!game.releaseDate) return false;
        const gameDate = new Date(game.releaseDate);
        return gameDate.getFullYear() === currentYear;
    }).length;

    const gamesThisQuarter = games.filter(game => {
        if (!game.releaseDate) return false;
        const gameDate = new Date(game.releaseDate);
        const gameQuarter = Math.floor(gameDate.getMonth() / 3) + 1;
        return gameDate.getFullYear() === currentYear && gameQuarter === currentQuarter;
    }).length;

    const upcomingThisYear = games.filter(game => {
        if (!game.releaseDate) return false;
        const gameDate = new Date(game.releaseDate);
        return gameDate > now && gameDate.getFullYear() === currentYear;
    }).length;

    // Corregir el cálculo del promedio mensual
    const monthsElapsed = currentMonth + 1; // +1 porque los meses van de 0-11
    const monthlyAverage = monthsElapsed > 0 && gamesThisYear >= 0 
        ? Math.round((gamesThisYear / monthsElapsed) * 10) / 10 
        : 0;

    // Buscar el mes con más lanzamientos este año
    const monthCounts = Array.from({ length: 12 }, (_, i) => {
        return games.filter(game => {
            if (!game.releaseDate) return false;
            const gameDate = new Date(game.releaseDate);
            return gameDate.getFullYear() === currentYear && gameDate.getMonth() === i;
        }).length;
    });
    
    const maxCount = Math.max(...monthCounts);
    const peakMonth = maxCount > 0 ? monthCounts.indexOf(maxCount) : currentMonth;
    const peakMonthName = new Date(2024, peakMonth, 1).toLocaleDateString('es-ES', { month: 'long' });
    const peakMonthCount = maxCount;

    // Años más activos
    const yearCounts = games.reduce((acc, game) => {
        if (!game.releaseDate) return acc;
        const gameYear = new Date(game.releaseDate).getFullYear();
        if (!isNaN(gameYear) && gameYear > 1980 && gameYear <= currentYear + 5) { // Validar año razonable
            acc[gameYear] = (acc[gameYear] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);
    
    const yearEntries = Object.entries(yearCounts);
    const mostActiveYear = yearEntries.length > 0 
        ? yearEntries.sort(([,a], [,b]) => b - a)[0] 
        : [currentYear.toString(), 0];
    
    const mostActiveYearCount = mostActiveYear[1];
    const mostActiveYearLabel = mostActiveYear[0];
    const currentYearLabel = currentYear.toString();

    const statItems = [
        { icon: faGamepad, value: totalGames, label: 'Total de Juegos', color: '#06b6d4' },
        { icon: faCalendarWeek, value: gamesThisYear, label: `Lanzamientos ${currentYear}`, color: '#a855f7' },
        { icon: faCalendarCheck, value: gamesThisQuarter, label: `Trimestre Q${currentQuarter}`, color: '#10b981' },
        { icon: faCalendarDays, value: gamesThisMonth, label: 'Eventos este mes', color: '#f97316' },
        { icon: faRocket, value: upcomingThisYear, label: `Próximos ${currentYear}`, color: '#f43f5e' },
        { icon: faChartLine, value: monthlyAverage, label: 'Promedio mensual', color: '#6366f1' },
        { icon: faFire, value: peakMonthCount, label: `Mes pico (${peakMonthName})`, color: '#ec4899' },
        { icon: faTrophy, value: mostActiveYearLabel, label: 'Año más activo', color: '#14b8a6', subValue: `(${mostActiveYearCount} juegos)` },
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {statItems.map(({ icon, value, label, color, subValue }) => (
                <div
                    key={label}
                    className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl px-4 py-2.5"
                >
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}1a` }}
                    >
                        <FontAwesomeIcon icon={icon} style={{ color }} className="text-xs" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-white font-black text-lg leading-none">{value}</p>
                            {subValue && <span className="text-[10px] text-slate-500 font-medium">{subValue}</span>}
                        </div>
                        <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CalendarPage = ({ games, onNavigateToCatalog, onEventClick }: CalendarPageProps) => {
    const calendarRef = useRef<HTMLDivElement>(null);
    const [previewGame, setPreviewGame] = useState<Game | null>(null);
    const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });

    const events = useMemo(() => {
        return games
            .map(game => {
                const formattedDate = parseDate(game.releaseDate);
                if (formattedDate) {
                    return {
                        title: game.title,
                        start: formattedDate,
                        allDay: true,
                        extendedProps: { game }
                    };
                }
                return null;
            })
            .filter((event): event is NonNullable<typeof event> => event !== null);
    }, [games]);

    return (
        <main className="container mx-auto px-4 py-8">
            {previewGame && <CalendarTooltip game={previewGame} position={previewPosition} />}

            <BackButton onClick={onNavigateToCatalog} className="mb-6" />

            {/* Page header */}
            <header className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
                            Calendario de
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Eventos</span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                            Explora las fechas de lanzamiento de los juegos venezolanos, eventos importantes de la industria, y todo el historial que ha acontecido sobre videojuegos en el país.
                        </p>
                    </div>
                </div>

                <CalendarStats games={games} />
            </header>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-cyan-500/20 via-slate-700/30 to-transparent mb-12" />

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            locale={esLocale}
                            height="auto"
                            aspectRatio={1.8}
                            dayHeaderFormat={{ weekday: 'short' }}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek,dayGridDay'
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día'
                            }}
                            eventClick={(info) => {
                                info.jsEvent.preventDefault();
                                const game = info.event.extendedProps.game;
                                if (game) onEventClick(game);
                            }}
                            eventMouseEnter={(info) => {
                                const rect = info.el.getBoundingClientRect();
                                let top = rect.bottom + window.scrollY + 15;
                                let left = rect.left + window.scrollX;
                                if (left + 288 > window.innerWidth) left = window.innerWidth - 298;
                                if (top + 200 > window.innerHeight + window.scrollY) top = rect.top + window.scrollY - 210;
                                setPreviewPosition({ top, left });
                                setPreviewGame(info.event.extendedProps.game);
                            }}
                            eventMouseLeave={() => setPreviewGame(null)}
                            dayMaxEvents={3}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                :root {
                    --fc-border-color: #475569;
                    --fc-daygrid-event-dot-width: 8px;
                    --fc-list-event-dot-width: 10px;
                    --fc-event-text-color: #ffffff;
                    --fc-more-link-bg-color: #334155;
                    --fc-more-link-text-color: #cbd5e1;
                    --fc-today-bg-color: rgba(6, 182, 212, 0.1);
                    --fc-page-bg-color: transparent;
                    --fc-neutral-bg-color: transparent;
                    --fc-list-day-text-color: #ffffff;
                    --fc-list-day-side-text-color: #ffffff;
                }

                .calendar-container .fc {
                    background: transparent;
                }

                .fc .fc-toolbar {
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                }

                .fc .fc-toolbar-title { 
                    color: #ffffff;
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .fc .fc-event {
                    border-radius: 6px !important;
                    border: none !important;
                    background: linear-gradient(135deg, #0891b2, #06b6d4) !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
                    transition: all 0.2s ease !important;
                    font-weight: 500 !important;
                }

                .fc .fc-event:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 8px rgba(6, 182, 212, 0.3) !important;
                    background: linear-gradient(135deg, #0e7490, #0891b2) !important;
                }

                .fc .fc-event-title {
                    font-size: 0.875rem;
                    color: #ffffff;
                    padding: 2px 6px;
                }

                .fc .fc-more-link {
                    color: #06b6d4;
                    background: rgba(6, 182, 212, 0.1);
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .fc .fc-more-link:hover {
                    background: rgba(6, 182, 212, 0.2);
                    transform: translateY(-1px);
                }

                .fc .fc-button {
                    font-size: 0.875rem;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-transform: none;
                }

                .fc .fc-daygrid-day-number { 
                    color: #cbd5e1; 
                    font-weight: 500;
                }

                .fc .fc-col-header-cell-cushion { 
                    color: #e2e8f0; 
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .fc .fc-button-primary {
                    background: linear-gradient(135deg, #0891b2, #06b6d4) !important;
                    border: none !important;
                    color: #ffffff !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }

                .fc .fc-button-primary:hover {
                    background: linear-gradient(135deg, #0e7490, #0891b2) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 8px rgba(6, 182, 212, 0.2) !important;
                }

                .fc .fc-button-primary:active {
                    background: linear-gradient(135deg, #155e75, #0e7490) !important;
                    transform: translateY(0) !important;
                }

                .fc .fc-button-primary:disabled {
                    background: #475569 !important;
                    transform: none !important;
                    box-shadow: none !important;
                }

                .fc .fc-daygrid-day {
                    transition: background-color 0.2s ease;
                }

                .fc .fc-daygrid-day:hover {
                    background-color: rgba(6, 182, 212, 0.05);
                }

                .fc .fc-day-today {
                    background-color: rgba(6, 182, 212, 0.08) !important;
                    border: 1px solid rgba(6, 182, 212, 0.2) !important;
                }

                .fc .fc-scrollgrid {
                    border: 1px solid #475569;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .fc .fc-col-header-cell {
                    background: rgba(51, 65, 85, 0.8);
                    border-bottom: 2px solid #475569;
                }

                .fc .fc-daygrid-day-frame {
                    min-height: 80px;
                }

                @keyframes fade-in-fast {
                    from { 
                        opacity: 0; 
                        transform: translateY(10px) scale(0.95); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }

                .animate-fade-in-fast { 
                    animation: fade-in-fast 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
                }

                @media (max-width: 768px) {
                    .fc .fc-toolbar {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .fc .fc-toolbar-chunk {
                        display: flex;
                        justify-content: center;
                    }
                    
                    .fc .fc-button-group {
                        gap: 0.25rem;
                    }
                    
                    .fc .fc-button {
                        padding: 0.375rem 0.75rem;
                        font-size: 0.8rem;
                    }

                    .grid {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }

                    @media (min-width: 640px) {
                        .grid {
                            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                        }
                    }
                }
            `}</style>
        </main>
    );
};

export default CalendarPage;
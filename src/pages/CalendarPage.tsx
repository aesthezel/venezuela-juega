import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Game } from "@/src/types";
import { BackButton, CoverImage, PageTransition } from "@/src/components";
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
    faCalendarCheck,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import '@/src/styles/fullcalendar-theme.css';

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
            className="absolute z-50 w-72 bg-gradient-to-br from-surface-800 to-surface-900 border border-accent-teal-dark/30 rounded-xl shadow-2xl p-4 pointer-events-none animate-fade-in-fast backdrop-blur-sm"
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
            <p className="text-sm text-accent-teal mb-2">{game.developers.join(', ')}</p>
            {game.releaseDate && (
                <p className="text-xs text-base-content/70 flex items-center">
                    <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3 mr-1" />
                    {new Date(game.releaseDate).toLocaleDateString('es-ES')}
                </p>
            )}
        </div>
    );
};

const CalendarStats = ({ games, viewYear }: { games: Game[], viewYear: number }) => {
    const now = new Date();

    const isCurrentYear = viewYear === now.getFullYear();
    const isPastYear = viewYear < now.getFullYear();

    const currentMonthForStats = isCurrentYear ? now.getMonth() : (isPastYear ? 11 : 0);
    const currentQuarterForStats = Math.floor(currentMonthForStats / 3) + 1;

    // Métricas globales
    const totalGames = games.length;

    // Métricas del año en vista
    const gamesInViewYear = games.filter(game => {
        if (!game.releaseDate) return false;
        return new Date(game.releaseDate).getFullYear() === viewYear;
    });

    const gamesThisYear = gamesInViewYear.length;

    const gamesThisQuarter = gamesInViewYear.filter(game => {
        const gameQuarter = Math.floor(new Date(game.releaseDate!).getMonth() / 3) + 1;
        return gameQuarter === currentQuarterForStats;
    }).length;

    const gamesThisMonth = gamesInViewYear.filter(game => {
        return new Date(game.releaseDate!).getMonth() === currentMonthForStats;
    }).length;

    const upcomingThisYear = gamesInViewYear.filter(game => {
        const gameDate = new Date(game.releaseDate!);
        return isPastYear ? false : gameDate > now;
    }).length;

    const monthsElapsed = isCurrentYear ? (now.getMonth() + 1) : (isPastYear ? 12 : 1);
    const monthlyAverage = monthsElapsed > 0 && gamesThisYear > 0
        ? Math.round((gamesThisYear / monthsElapsed) * 10) / 10
        : 0;

    const monthCounts = Array.from({ length: 12 }, (_, i) => {
        return gamesInViewYear.filter(game => {
            return new Date(game.releaseDate!).getMonth() === i;
        }).length;
    });

    const maxCount = Math.max(...monthCounts);
    const peakMonth = maxCount > 0 ? monthCounts.indexOf(maxCount) : currentMonthForStats;
    const peakMonthName = new Date(2024, peakMonth, 1).toLocaleDateString('es-ES', { month: 'long' });
    const peakMonthCount = maxCount;

    // Años más activos (basado en todos los juegos)
    const yearCounts = games.reduce((acc, game) => {
        if (!game.releaseDate) return acc;
        const gameYear = new Date(game.releaseDate).getFullYear();
        if (!isNaN(gameYear) && gameYear > 1980 && gameYear <= now.getFullYear() + 5) {
            acc[gameYear] = (acc[gameYear] || 0) + 1;
        }
        return acc;
    }, {} as Record<number, number>);

    const yearEntries = Object.entries(yearCounts);
    const mostActiveYear = yearEntries.length > 0
        ? yearEntries.sort(([, a], [, b]) => b - a)[0]
        : [now.getFullYear().toString(), 0];

    const monthLabel = isCurrentYear ? 'Eventos este mes' : isPastYear ? 'Eventos en Dic' : 'Eventos en Ene';
    const quarterLabel = `Trimestre Q${currentQuarterForStats}`;
    const upcomingLabel = isCurrentYear ? `Próximos ${viewYear}` : isPastYear ? `Pendientes ${viewYear}` : `Programados ${viewYear}`;

    const statItems = [
        { icon: faGamepad, value: totalGames, label: 'Total Histórico', color: '#06b6d4' },
        { icon: faCalendarWeek, value: gamesThisYear, label: `Lanzamientos ${viewYear}`, color: '#a855f7' },
        { icon: faCalendarCheck, value: gamesThisQuarter, label: quarterLabel, color: '#10b981' },
        { icon: faCalendarDays, value: gamesThisMonth, label: monthLabel, color: '#f97316' },
        { icon: faRocket, value: upcomingThisYear, label: upcomingLabel, color: '#f43f5e' },
        { icon: faChartLine, value: monthlyAverage, label: 'Promedio mensual', color: '#6366f1' },
        { icon: faFire, value: peakMonthCount, label: `Mes pico (${peakMonthName})`, color: '#ec4899' },
        { icon: faTrophy, value: mostActiveYear[0], label: 'Año más activo', color: '#14b8a6', subValue: `(${mostActiveYear[1]} juegos)` },
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {statItems.map(({ icon, value, label, color, subValue }) => (
                <div
                    key={label}
                    className="flex items-center gap-2.5 bg-base-300/60 border border-surface-700 rounded-xl px-4 py-2.5"
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
                            {subValue && <span className="text-[10px] text-base-content/70 font-medium">{subValue}</span>}
                        </div>
                        <p className="text-base-content/70 text-[10px] font-medium uppercase tracking-wide">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CalendarPage = ({ games, onNavigateToCatalog, onEventClick }: CalendarPageProps) => {
    const calendarRef = useRef<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [previewGame, setPreviewGame] = useState<Game | null>(null);
    const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
    const [viewYear, setViewYear] = useState<number>(new Date().getFullYear());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { availableYears, yearCountsMap } = useMemo(() => {
        const years = new Set<number>();
        const counts: Record<number, number> = {};
        const currentYear = new Date().getFullYear();

        years.add(currentYear);

        games.forEach(game => {
            if (game.releaseDate) {
                const year = new Date(game.releaseDate).getFullYear();
                if (!isNaN(year) && year > 1980 && year <= currentYear + 20) {
                    years.add(year);
                    counts[year] = (counts[year] || 0) + 1;
                }
            }
        });
        return {
            availableYears: Array.from(years).sort((a, b) => b - a),
            yearCountsMap: counts
        };
    }, [games]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        <PageTransition>
            <main className="container mx-auto px-4 py-8 relative z-10">
            {previewGame && <CalendarTooltip game={previewGame} position={previewPosition} />}

            <BackButton onClick={onNavigateToCatalog} className="mb-6" />

            {/* Page header */}
            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
                            Calendario de
                            <span className="bg-gradient-to-r from-accent-teal to-brand-blue bg-clip-text text-transparent"> Eventos</span>
                        </h1>
                        <p className="text-base-content/70 text-base md:text-lg max-w-2xl leading-relaxed">
                            Explora las fechas de lanzamiento de los juegos venezolanos, eventos importantes de la industria, y todo el historial que ha acontecido sobre videojuegos en el país.
                        </p>
                    </div>

                    {/* Selector de Año Estilo Dropdown Avanzado */}
                    <div className="flex items-center gap-3 self-start md:self-auto relative z-20" ref={dropdownRef}>
                        <FontAwesomeIcon icon={faCalendarDays} className="text-accent-teal hidden sm:block" />
                        <span className="text-white font-medium text-sm hidden sm:block">Año:</span>

                        <div className="relative">
                            {/* Dropdown Trigger */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center justify-between min-w-[210px] bg-base-300/80 hover:bg-base-300/90 border border-accent-teal-dark/30 hover:border-accent-teal/50 outline-none rounded-xl px-4 py-2 text-white font-bold transition-all shadow-lg backdrop-blur-md"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{viewYear}</span>
                                    {yearCountsMap[viewYear] > 0 && (
                                        <span className="bg-accent-teal-dark/20 text-accent-teal text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border border-accent-teal-dark/30">
                                            {yearCountsMap[viewYear]} Juegos
                                        </span>
                                    )}
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`text-accent-teal-dark transition-transform duration-300 ml-3 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    strokeWidth={3}
                                />
                            </button>

                            {/* Dropdown Menu List */}
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-full min-w-[220px] max-h-[350px] overflow-y-auto bg-base-300/95 backdrop-blur-xl border border-surface-700 rounded-xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.6)] z-50 animate-fade-in-fast scrollbar-thin scrollbar-thumb-surface-600 scrollbar-track-transparent">
                                    <div className="p-1.5 flex flex-col gap-1">
                                        {availableYears.map(year => {
                                            const count = yearCountsMap[year] || 0;
                                            const isActive = viewYear === year;

                                            return (
                                                <button
                                                    key={year}
                                                    onClick={() => {
                                                        setViewYear(year);
                                                        setIsDropdownOpen(false);
                                                        if (calendarRef.current) {
                                                            calendarRef.current.getApi().gotoDate(`${year}-01-01`);
                                                        }
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${isActive
                                                            ? 'bg-gradient-to-r from-accent-teal-dark/20 to-brand-blue/10 border border-accent-teal-dark/30 text-white'
                                                            : 'text-base-content/70 hover:bg-base-300/50 hover:text-white border border-transparent'
                                                        }`}
                                                >
                                                    <span className={`font-semibold ${isActive ? 'text-accent-teal' : ''}`}>
                                                        {year}
                                                    </span>

                                                    {count > 0 ? (
                                                        <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${isActive
                                                                ? 'bg-accent-teal-dark text-white shadow-md'
                                                                : 'bg-base-200/80 text-base-content/70 border border-surface-700'
                                                            }`}>
                                                            {count} {count === 1 ? 'juego' : 'juegos'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-base-content/70 font-medium px-2 py-1">
                                                            Sin reg.
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <CalendarStats games={games} viewYear={viewYear} />
            </header>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-accent-teal-dark/20 via-surface-700/30 to-transparent mb-12" />

            <div className="bg-base-300/30 backdrop-blur-sm border border-surface-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-8">

                    <div className="calendar-container">
                        {/* @ts-ignore - Preact compatibility typing issue */}
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            locale={esLocale}
                            height="auto"
                            datesSet={(arg) => {
                                const currentMidDate = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
                                setViewYear(currentMidDate.getFullYear());
                            }}
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


            </main>
        </PageTransition>
    );
};

export default CalendarPage;
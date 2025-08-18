import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Game } from "@/src/types";
import { BackButton, CoverImage } from "@/src/components";
import { CalendarPageProps } from "@/src/types";

declare var FullCalendar: any;

const parseDate = (dateString: string): string | null => {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateString || !dateRegex.test(dateString)) {
        return null;
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error(`Error al parsear la fecha: ${dateString}`, error);
        return null;
    }
};

const CalendarTooltip = ({ game, position }: { game: Game; position: { top: number; left: number } }) => {
    if (!game) return null;

    return (
        <div
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
            className="absolute z-50 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 pointer-events-none animate-fade-in-fast"
        >
            <CoverImage
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-32 object-cover rounded-md mb-2"
                imgClassName="w-full h-32 object-cover rounded-md mb-2"
            />
            <h3 className="font-bold text-white truncate">{game.title}</h3>
            <p className="text-sm text-gray-400 truncate">{game.developers.join(', ')}</p>
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

    useEffect(() => {
        if (!calendarRef.current) return;

        const calendar = new FullCalendar.Calendar(calendarRef.current, {
            initialView: 'dayGridMonth',
            events: events,
            locale: 'es',
            height: 'auto',
            dayHeaderFormat: { weekday: 'short' },
            eventDisplay: 'list-item',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,multiMonthYear,listWeek'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                year: 'Años',
                list: 'Lista'
            },
            eventColor: '#0e7490',
            eventBackgroundColor: '#0e7490',
            eventBorderColor: '#22d3ee',

            eventClick: (info: any) => {
                info.jsEvent.preventDefault();
                const game = info.event.extendedProps.game;
                if (game) {
                    onEventClick(game);
                }
            },

            eventMouseEnter: (info: any) => {
                const rect = info.el.getBoundingClientRect();
                let top = rect.bottom + window.scrollY + 10;
                let left = rect.left + window.scrollX;

                if (left + 256 > window.innerWidth) {
                    left = window.innerWidth - 266;
                }

                setPreviewPosition({ top, left });
                setPreviewGame(info.event.extendedProps.game);
            },
            eventMouseLeave: () => {
                setPreviewGame(null);
            },
        });

        calendar.render();

        return () => {
            calendar.destroy();
        };
    }, [events, onEventClick]);

    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
            {previewGame && <CalendarTooltip game={previewGame} position={previewPosition} />}

            <BackButton onClick={onNavigateToCatalog} className="mb-8" />

            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <div ref={calendarRef} id="calendar"></div>
            </div>
            <style>{`
                :root {
                    --fc-border-color: #334155;
                    --fc-daygrid-event-dot-width: 8px;
                    --fc-list-event-dot-width: 10px;
                    --fc-event-text-color: #ffffff;
                    --fc-more-link-bg-color: #1e293b;
                    --fc-more-link-text-color: #94a3b8;
                    --fc-today-bg-color: rgba(34, 211, 238, 0.15);
                    --fc-page-bg-color: #1e293b;
                    --fc-neutral-bg-color: #1e293b;
                    --fc-list-day-text-color: #ffffff;
                    --fc-list-day-side-text-color: #ffffff;
                }
                .fc .fc-toolbar-title { 
                    color: #ffffff;
                    font-size: 1.25rem;
                }
                .fc .fc-button {
                    font-size: 0.875rem;
                    padding: 0.4em 0.8em;
                }
                .fc .fc-daygrid-day-number { color: #94a3b8; }
                .fc .fc-col-header-cell-cushion { color: #cbd5e1; }
                .fc .fc-button-primary {
                    background-color: #0e7490 !important;
                    border-color: #0e7490 !important;
                    color: #ffffff !important;
                }
                .fc .fc-button-primary:hover {
                    background-color: #155e75 !important;
                    border-color: #155e75 !important;
                }
                .fc .fc-button-primary:active {
                    background-color: #164e63 !important;
                    border-color: #164e63 !important;
                }
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
            `}</style>
        </main>
    );
};

export default CalendarPage;
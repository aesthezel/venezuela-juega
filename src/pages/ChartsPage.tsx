import { useEffect, useRef, useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { Game, GameStatus, GameOrigin } from "@/src/types";
import { BackButton, Modal } from "@/src/components";
import { ChartsPageProps } from "@/src/types";
import { Chart, registerables } from 'chart.js/auto';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad,
    faDesktop,
    faLayerGroup,
    faCodeBranch
} from '@fortawesome/free-solid-svg-icons';

Chart.register(...registerables);

const countItems = (data: Game[], key: 'platform' | 'genre' | 'engine' | 'origin') => {
    const counts = new Map<string, number>();
    data.forEach(game => {
        let itemOrItems = game[key];

        // Handle "Desconocido" mapping for missing fields
        if (key === 'origin' && !itemOrItems) {
            counts.set('Desconocido', (counts.get('Desconocido') || 0) + 1);
            return;
        }
        if (key === 'engine' && !itemOrItems) {
            counts.set('Motor Propio / Desconocido', (counts.get('Motor Propio / Desconocido') || 0) + 1);
            return;
        }

        if (Array.isArray(itemOrItems)) {
            itemOrItems.forEach(item => {
                if (item) counts.set(item, (counts.get(item) || 0) + 1);
            });
        } else if (typeof itemOrItems === 'string' && itemOrItems.trim() !== '') {
            counts.set(itemOrItems, (counts.get(itemOrItems) || 0) + 1);
        }
    });
    return Object.fromEntries(counts);
};

const countStatuses = (data: Game[]) => {
    const counts = new Map<string, number>();
    data.forEach(game => {
        const status = game.status;
        counts.set(status, (counts.get(status) || 0) + 1);
    });
    return Object.fromEntries(counts);
}

const countByYear = (data: Game[]) => {
    const counts = new Map<string, number>();
    data.forEach(game => {
        if (game.releaseDate) {
            const y = new Date(game.releaseDate).getFullYear();
            if (!isNaN(y) && y >= 1980 && y <= new Date().getFullYear() + 5) {
                const ys = y.toString();
                counts.set(ys, (counts.get(ys) || 0) + 1);
            }
        }
    });
    return Object.fromEntries([...counts.entries()].sort(([a], [b]) => parseInt(a) - parseInt(b)));
};

interface ChartCardProps {
    title: string;
    children: ComponentChildren;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/40 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            {children}
        </div>
    </div>
);

const ChartsStats = ({ games }: { games: Game[] }) => {
    const totalGames = games.length;

    const platforms = countItems(games, 'platform');
    const platformEntries = Object.entries(platforms);
    const topPlatform = platformEntries.length > 0 ? platformEntries.sort((a, b) => b[1] - a[1])[0] : ['N/A', 0];

    const genres = countItems(games, 'genre');
    const genreEntries = Object.entries(genres);
    const topGenre = genreEntries.length > 0 ? genreEntries.sort((a, b) => b[1] - a[1])[0] : ['N/A', 0];

    const engines = countItems(games, 'engine');
    const engineEntries = Object.entries(engines);
    const validEngines = engineEntries.filter(([k]) => !k.includes('Desconocido') && k.trim() !== '');
    const topEngine = validEngines.length > 0 ? validEngines.sort((a, b) => b[1] - a[1])[0] : ['N/A', 0];

    const statItems = [
        { icon: faGamepad, value: totalGames, label: 'Juegos Indexados', color: '#06b6d4' },
        { icon: faDesktop, value: topPlatform[0], label: 'Plataforma Frecuente', color: '#a855f7', subValue: `(${topPlatform[1]})` },
        { icon: faLayerGroup, value: topGenre[0], label: 'Género Popular', color: '#10b981', subValue: `(${topGenre[1]})` },
        { icon: faCodeBranch, value: topEngine[0], label: 'Motor Preferido', color: '#f97316', subValue: `(${topEngine[1]})` },
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {statItems.map(({ icon, value, label, color, subValue }, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-5 py-3 transition-transform duration-300 hover:scale-105 hover:bg-slate-700/60 shadow-lg"
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}22` }}
                    >
                        <FontAwesomeIcon icon={icon} style={{ color }} className="text-lg" />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-white font-black text-xl leading-none">{value.toString().length > 15 ? value.toString().substring(0, 15) + '...' : value}</p>
                            {subValue && <span className="text-[11px] text-cyan-300 font-semibold">{subValue}</span>}
                        </div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const RealtimeTopVisitsChart = ({ games, onSelectGame }: { games: Game[], onSelectGame: (game: Game) => void }) => {
    const { gameStatsMap } = useSpacetimeDB();
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);
    const gamesDataRef = useRef<Game[]>([]);

    useEffect(() => {
        const statsArray = Object.values(gameStatsMap).sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 10);

        const labelsData: string[] = [];
        const visitsData: number[] = [];
        const heartsData: number[] = [];
        const currentGamesData: Game[] = [];

        statsArray.forEach(stat => {
            const game = games.find(g => g.slug === stat.gameSlug);
            if (game || stat.gameSlug) {
                const title = game ? game.title : stat.gameSlug;
                labelsData.push(title.length > 20 ? title.substring(0, 20) + '...' : title);
                visitsData.push(stat.totalVisits);
                heartsData.push(stat.totalHearts);
                currentGamesData.push(game as Game);
            }
        });

        gamesDataRef.current = currentGamesData;

        if (!chartInstanceRef.current && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labelsData,
                        datasets: [
                            {
                                label: 'Visitas',
                                data: visitsData,
                                backgroundColor: '#457cd6', // blue-500 from global.css palette for visits
                                borderRadius: 4,
                            },
                            {
                                label: 'Me gusta',
                                data: heartsData,
                                backgroundColor: '#e34262', // red-500 from global.css palette for hearts
                                borderRadius: 4,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        onClick: (event, elements) => {
                            if (elements && elements.length > 0) {
                                const index = elements[0].index;
                                const game = gamesDataRef.current[index];
                                if (game) {
                                    onSelectGame(game);
                                }
                            }
                        },
                        onHover: (event, elements) => {
                            if (event.native && event.native.target) {
                                const target = event.native.target as HTMLElement;
                                target.style.cursor = elements && elements.length > 0 ? 'pointer' : 'default';
                            }
                        },
                        plugins: {
                            legend: { position: 'top', labels: { color: '#d4cfd6', padding: 20 } }
                        },
                        scales: {
                            x: { grid: { display: false } },
                            y: { grid: { color: 'rgba(59, 42, 61, 0.5)' }, beginAtZero: true }
                        }
                    }
                });
            }
        } else if (chartInstanceRef.current) {
            chartInstanceRef.current.data.labels = labelsData;
            chartInstanceRef.current.data.datasets[0].data = visitsData;
            chartInstanceRef.current.data.datasets[1].data = heartsData;
            chartInstanceRef.current.update('none'); // Update smoothly without animation restarting
        }
    }, [gameStatsMap, games]);

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <ChartCard title="Juegos más visitados">
            <div className="w-full h-full min-h-[350px]">
                <canvas ref={chartRef}></canvas>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Esta información está siendo tomada en tiempo real
            </div>
        </ChartCard>
    );
};

const ChartsPage = ({ games, onNavigateToCatalog }: ChartsPageProps) => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const platformChartRef = useRef<HTMLCanvasElement>(null);
    const genreChartRef = useRef<HTMLCanvasElement>(null);
    const statusChartRef = useRef<HTMLCanvasElement>(null);
    const timelineChartRef = useRef<HTMLCanvasElement>(null);
    const engineChartRef = useRef<HTMLCanvasElement>(null);
    const originChartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const chartInstances: any[] = [];

        Chart.defaults.color = '#9c8a9d';
        Chart.defaults.font.family = "'Inter', 'SF Pro', system-ui, sans-serif";

        const platformData = countItems(games, 'platform');
        const genreData = countItems(games, 'genre');
        const engineData = countItems(games, 'engine');
        const originData = countItems(games, 'origin');
        const yearData = countByYear(games);
        const statusData = countStatuses(games);

        const chartColors = ['#457cd6', '#449489', '#f2b63d', '#e34262', '#b4ba47', '#d46e33', '#9c656c', '#4b3b9c', '#6d8c32', '#2f2b5c'];
        const chartBorders = '#18131e'; // bg-slate-900

        const statusColors = {
            [GameStatus.RELEASED]: '#16a34a',
            [GameStatus.IN_DEVELOPMENT]: '#f2b63d',
            [GameStatus.ON_HOLD]: '#71717a',
            [GameStatus.CANCELED]: '#94353d',
            [GameStatus.RELEASED_DEMO]: '#4ade80',
            [GameStatus.PROTOTYPE]: '#e4e4e7',
            [GameStatus.LOST_MEDIA]: '#fecaca',
            [GameStatus.EARLY_ACCESS]: '#449489',
            [GameStatus.RECOVERED]: '#457cd6',
            [GameStatus.UNKNOWN]: '#18181b'
        };

        const gridConfig = { color: 'rgba(59, 42, 61, 0.5)' }; // slate-600 with opacity

        // 1. Timeline Chart (Line)
        if (timelineChartRef.current) {
            const ctx = timelineChartRef.current.getContext('2d');
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Object.keys(yearData),
                        datasets: [{
                            label: 'Juegos por Año',
                            data: Object.values(yearData),
                            borderColor: '#449489',
                            backgroundColor: 'rgba(68, 148, 137, 0.15)',
                            fill: true,
                            tension: 0.3,
                            pointBackgroundColor: '#f2b63d',
                            pointBorderColor: '#18131e',
                            pointHoverRadius: 6,
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { grid: { display: false } },
                            y: { grid: gridConfig, beginAtZero: true, ticks: { stepSize: 1 } }
                        }
                    }
                }));
            }
        }

        // 2. Engines Chart (Horizontal Bar)
        if (engineChartRef.current) {
            const ctx = engineChartRef.current.getContext('2d');
            const sortedEngines = Object.entries(engineData).sort((a, b) => b[1] - a[1]).slice(0, 10);
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: sortedEngines.map(e => e[0].length > 15 ? e[0].substring(0, 15) + '...' : e[0]),
                        datasets: [{
                            label: 'Usos',
                            data: sortedEngines.map(e => e[1]),
                            backgroundColor: chartColors[5],
                            borderRadius: 4,
                            borderWidth: 0
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { grid: gridConfig, beginAtZero: true },
                            y: { grid: { display: false } }
                        }
                    }
                }));
            }
        }

        // 3. Platform Chart (Bar)
        if (platformChartRef.current) {
            const ctx = platformChartRef.current.getContext('2d');
            const sortedPlat = Object.entries(platformData).sort((a, b) => b[1] - a[1]);
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: sortedPlat.map(e => e[0]),
                        datasets: [{
                            label: 'Lanzamientos',
                            data: sortedPlat.map(e => e[1]),
                            backgroundColor: chartColors,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: chartBorders
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { grid: { display: false } },
                            y: { grid: gridConfig, beginAtZero: true }
                        }
                    }
                }));
            }
        }

        // 4. Status Chart (Pie)
        if (statusChartRef.current) {
            const ctx = statusChartRef.current.getContext('2d');
            const sortedStatusLabels = Object.keys(statusData).sort((a, b) => Object.values(GameStatus).indexOf(a as GameStatus) - Object.values(GameStatus).indexOf(b as GameStatus));
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: sortedStatusLabels,
                        datasets: [{
                            data: sortedStatusLabels.map(label => statusData[label]),
                            backgroundColor: sortedStatusLabels.map(label => statusColors[label as GameStatus] || '#ffffff'),
                            borderColor: chartBorders,
                            borderWidth: 3,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right', labels: { color: '#d4cfd6', padding: 20 } }
                        }
                    }
                }));
            }
        }

        // 5. Genre Chart (Doughnut)
        if (genreChartRef.current) {
            const ctx = genreChartRef.current.getContext('2d');
            const sortedGenres = Object.entries(genreData).sort((a, b) => b[1] - a[1]).slice(0, 15); // limit somewhat
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: sortedGenres.map(x => x[0]),
                        datasets: [{
                            data: sortedGenres.map(x => x[1]),
                            backgroundColor: chartColors,
                            borderColor: chartBorders,
                            borderWidth: 3,
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: { position: 'right', labels: { color: '#d4cfd6', padding: 20 } }
                        }
                    }
                }));
            }
        }

        // 6. Origin Chart (Pie)
        if (originChartRef.current) {
            const ctx = originChartRef.current.getContext('2d');
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'polarArea',
                    data: {
                        labels: Object.keys(originData),
                        datasets: [{
                            data: Object.values(originData),
                            backgroundColor: chartColors.map(c => c + 'CC'), // slight transparency
                            borderColor: chartBorders,
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: { grid: { color: gridConfig.color }, ticks: { display: false } }
                        },
                        plugins: {
                            legend: { position: 'bottom', labels: { color: '#d4cfd6' } }
                        }
                    }
                }));
            }
        }

        return () => {
            chartInstances.forEach(chart => chart.destroy());
        };
    }, [games]);

    return (
        <>
            <main className="container mx-auto px-4 py-8 animate-fade-in">
            <BackButton onClick={onNavigateToCatalog} className="mb-6" />

            {/* Page Header */}
            <header className="mb-10">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
                            Métricas y
                            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent"> Estadísticas</span>
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                            Analíticas extraídas directamente del catálogo de juegos. Observa las preferencias en plataformas, motores gráficos y el ritmo de publicación a lo largo de los años.
                        </p>
                    </div>
                </div>

                <ChartsStats games={games} />
            </header>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-yellow-500/20 via-slate-700/30 to-transparent mb-12" />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Juegos más visitados en tiempo real */}
                <div className="xl:col-span-3">
                    <RealtimeTopVisitsChart games={games} onSelectGame={setSelectedGame} />
                </div>

                {/* Timeline */}
                <div className="xl:col-span-2">
                    <ChartCard title="Evolución de los lanzamientos por año">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={timelineChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

                {/* Motores Graficos */}
                <div className="xl:col-span-1">
                    <ChartCard title="Motores de videojuegos más utilizados">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={engineChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

                {/* Plataformas */}
                <div className="xl:col-span-2">
                    <ChartCard title="Lanzamientos por plataforma">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={platformChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

                {/* Estados */}
                <div className="xl:col-span-1">
                    <ChartCard title="Estados de desarrollo">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={statusChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

                {/* Generos */}
                <div className="xl:col-span-2 lg:col-span-1">
                    <ChartCard title="Distribución por géneros">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={genreChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

                {/* Origenes */}
                <div className="xl:col-span-1 lg:col-span-1">
                    <ChartCard title="Orígen de los videojuegos">
                        <div className="w-full h-full min-h-[350px]">
                            <canvas ref={originChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>

            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            `}</style>
            </main>
            {selectedGame && (
                <Modal game={selectedGame} onClose={() => setSelectedGame(null)} />
            )}
        </>
    );
};

export default ChartsPage;

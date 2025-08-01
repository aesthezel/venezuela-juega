import { useEffect, useRef } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { Game, GameStatus } from '@/types.ts';
import ArrowLeftIcon from '../icons/ArrowLeftIcon.tsx';

declare var Chart: any;

interface ChartsPageProps {
    games: Game[];
    onNavigateToCatalog: () => void;
}

const countItems = (data: Game[], key: 'platform' | 'genre') => {
    const counts = new Map<string, number>();
    data.forEach(game => {
        const items = game[key];
        if (Array.isArray(items)) {
            items.forEach(item => {
                counts.set(item, (counts.get(item) || 0) + 1);
            });
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

interface ChartCardProps {
    title: string;
    children: ComponentChildren;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
        {children}
    </div>
);

const ChartsPage = ({ games, onNavigateToCatalog }: ChartsPageProps) => {
    const platformChartRef = useRef<HTMLCanvasElement>(null);
    const genreChartRef = useRef<HTMLCanvasElement>(null);
    const statusChartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const chartInstances: any[] = [];

        const platformData = countItems(games, 'platform');
        const genreData = countItems(games, 'genre');
        const statusData = countStatuses(games);

        const chartColors = ['#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe', '#0e7490', '#155e75', '#164e63'];
        const statusColors = {
            [GameStatus.RELEASED]: '#22c55e',
            [GameStatus.IN_DEVELOPMENT]: '#eab308',
            [GameStatus.ON_HOLD]: '#6b7280',
            [GameStatus.CANCELED]: '#ef4444',
            [GameStatus.RELEASED_DEMO]: '#bbf7d0',
            [GameStatus.PROTOTYPE]: '#e5e7eb',
            [GameStatus.LOST_MEDIA]: '#fecaca',
            [GameStatus.EARLY_ACCESS]: '#06b6d4',
            [GameStatus.RECOVERED]: '#3b82f6',
            [GameStatus.UNKNOWN]: '#111827'
        };

        if (platformChartRef.current) {
            const ctx = platformChartRef.current.getContext('2d');
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(platformData),
                        datasets: [{
                            label: 'Nº de Juegos',
                            data: Object.values(platformData),
                            backgroundColor: chartColors,
                            borderColor: '#0f172a',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, title: { display: false } },
                        scales: {
                            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                            y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                        }
                    }
                }));
            }
        }

        if (genreChartRef.current) {
            const ctx = genreChartRef.current.getContext('2d');
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(genreData),
                        datasets: [{
                            data: Object.values(genreData),
                            backgroundColor: chartColors,
                            borderColor: '#1e293b',
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                    }
                }));
            }
        }

        if (statusChartRef.current) {
            const ctx = statusChartRef.current.getContext('2d');
            const sortedStatusLabels = Object.keys(statusData).sort((a,b) => Object.values(GameStatus).indexOf(a as GameStatus) - Object.values(GameStatus).indexOf(b as GameStatus));
            if (ctx) {
                chartInstances.push(new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: sortedStatusLabels,
                        datasets: [{
                            data: sortedStatusLabels.map(label => statusData[label]),
                            backgroundColor: sortedStatusLabels.map(label => statusColors[label as GameStatus]),
                            borderColor: '#1e293b',
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
                    }
                }));
            }
        }

        return () => {
            chartInstances.forEach(chart => chart.destroy());
        };
    }, [games]);

    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
            <button onClick={onNavigateToCatalog} className="flex items-center gap-2 mb-8 bg-slate-800 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                <ArrowLeftIcon />
                Volver al Catálogo
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                    <ChartCard title="Juegos por Plataforma">
                        <div className="relative h-96">
                            <canvas ref={platformChartRef}></canvas>
                        </div>
                    </ChartCard>
                </div>
                <ChartCard title="Juegos por Género">
                    <div className="relative h-80">
                        <canvas ref={genreChartRef}></canvas>
                    </div>
                </ChartCard>
                <ChartCard title="Juegos por Estado">
                    <div className="relative h-80">
                        <canvas ref={statusChartRef}></canvas>
                    </div>
                </ChartCard>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
            `}</style>
        </main>
    );
};

export default ChartsPage;

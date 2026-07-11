import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';
import { getActiveJams } from '@/jam/registry';
import type { JamEvent } from '@/jam/types';

const statusLabel: Record<string, string> = {
    upcoming: 'Próximamente',
    open: 'Inscripciones Abiertas',
    active: 'En Curso',
    voting: 'Votación',
    ended: 'Finalizado',
    draft: 'Borrador',
};

const statusBadge: Record<string, string> = {
    upcoming: 'badge-warning',
    open: 'badge-success',
    active: 'badge-success',
    voting: 'badge-info',
    ended: 'badge-neutral',
    draft: 'badge-ghost',
};

interface JamListPageProps extends RoutableProps {}

const JamListPage = (_props: JamListPageProps) => {
    const activeJams = getActiveJams();

    // If only one jam, redirect directly to it
    useEffect(() => {
        if (activeJams.length === 1) {
            route(`/jam/${activeJams[0].slug}`, true);
        }
    }, []);

    useEffect(() => {
        document.title = 'Game Jams | Venezuela Juega';
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content = 'Todas las jams benéficas y promocionales de Venezuela Juega. Crea juegos. Cambia vidas.';
    }, []);

    if (activeJams.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-6 gap-6">
                <span className="text-6xl">🎮</span>
                <h1 className="text-3xl font-black text-white">No hay jams activas</h1>
                <p className="text-base-content/60">Vuelve pronto, se vienen cosas increíbles.</p>
                <a href="/" className="btn btn-secondary">Volver al catálogo</a>
            </div>
        );
    }

    if (activeJams.length === 1) {
        // Show loading while redirect happens
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-secondary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl sm:text-5xl font-black text-white text-center mb-4 uppercase tracking-tight">
                    Game Jams
                </h1>
                <p className="text-base-content/50 text-center text-sm uppercase tracking-widest mb-16">
                    Eventos activos y próximos
                </p>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {activeJams.map((jam: JamEvent) => (
                        <div
                            key={`${jam.slug}-${jam.edition}`}
                            className="card bg-base-200 border border-base-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            onClick={() => route(`/jam/${jam.slug}`)}
                        >
                            <div className="card-body gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="card-title text-white font-black text-lg leading-tight flex-1">
                                        {jam.name}
                                    </h2>
                                    <span className={`badge ${statusBadge[jam.status] ?? 'badge-neutral'} text-xs font-bold shrink-0`}>
                                        {statusLabel[jam.status] ?? jam.status}
                                    </span>
                                </div>

                                {jam.tagline && (
                                    <p className="text-base-content/60 text-sm leading-relaxed">
                                        {jam.tagline}
                                    </p>
                                )}

                                <div className="text-xs text-base-content/40 font-mono">
                                    Edición {jam.edition.toUpperCase()} · {jam.platform ?? 'Itch.io'}
                                </div>

                                {jam.startDate ? (
                                    <div className="text-secondary text-xs font-bold uppercase tracking-widest">
                                        Inicia: {new Date(jam.startDate).toLocaleDateString('es-VE')}
                                    </div>
                                ) : (
                                    <div className="text-warning text-xs font-bold uppercase tracking-widest">
                                        Fechas: TBA
                                    </div>
                                )}

                                <div className="card-actions mt-2">
                                    <button
                                        className="btn btn-secondary btn-sm font-black w-full"
                                        onClick={(e) => { e.stopPropagation(); route(`/jam/${jam.slug}`); }}
                                    >
                                        Ver detalles →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JamListPage;

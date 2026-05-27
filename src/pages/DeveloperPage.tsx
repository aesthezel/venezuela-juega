import { useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import { DeveloperPageProps } from '@/types';
import { useDevelopers } from '@/hooks';
import { generateSlug } from '@/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faGamepad, faCode, faCubes, faCalendarAlt,
    faUsers, faLayerGroup, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { BackButton, GameCard, PageTransition } from '@/components';

/**
 * Generates a deterministic HSL color from a string (developer name).
 * Used for the hero gradient background.
 */
const nameToHue = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
};

const DeveloperPage = ({ devSlug, games, jamGames, onGameClick }: DeveloperPageProps) => {
    const { getDeveloperBySlug } = useDevelopers(games, jamGames);

    const developer = useMemo(() => {
        if (!devSlug) return undefined;
        return getDeveloperBySlug(devSlug);
    }, [devSlug, getDeveloperBySlug]);

    const hue = useMemo(() => developer ? nameToHue(developer.name) : 220, [developer?.name]);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            route('/');
        }
    };

    // ── Error states ────────────────────────────────────────────────────

    if (!devSlug) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Desarrollador inválido</h1>
                    <p className="text-base-content/70 mb-6">No se proporcionó un slug de desarrollador válido.</p>
                    <button onClick={handleGoBack} className="btn btn-primary">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver
                    </button>
                </div>
            </main>
        );
    }

    if (!developer) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Desarrollador no encontrado</h1>
                    <p className="text-base-content/70 mb-6">El desarrollador que buscas no existe en el catálogo.</p>
                    <button onClick={handleGoBack} className="btn btn-primary">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver
                    </button>
                </div>
            </main>
        );
    }

    // ── Main render ─────────────────────────────────────────────────────

    const hasCatalogGames = developer.games.length > 0;
    const hasJamGames = developer.jamGames.length > 0;

    return (
        <PageTransition>
            <main className="container mx-auto px-4 py-8 relative z-10">

                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <BackButton onClick={handleGoBack} className="mb-10 hover:translate-x-[-4px] transition-transform" />
                </div>

                {/* ── Hero Header ─────────────────────────────────────────── */}
                <div
                    className="card shadow-2xl border border-base-content/5 mb-12 animate-in zoom-in-95 duration-700 overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, hsl(${hue}, 50%, 12%) 0%, hsl(${(hue + 40) % 360}, 40%, 8%) 50%, hsl(${(hue + 80) % 360}, 30%, 6%) 100%)`
                    }}
                >
                    <div className="card-body p-8 lg:p-12">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            {/* Name & Badges */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                                        style={{ background: `hsl(${hue}, 60%, 35%)` }}
                                    >
                                        {developer.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">Desarrollador</p>
                                        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                            {developer.name}
                                        </h1>
                                    </div>
                                </div>

                                {/* Genre & Platform badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {developer.genres.slice(0, 6).map(genre => (
                                        <div key={genre} className="badge badge-outline badge-sm uppercase text-xs tracking-wider font-bold opacity-70">
                                            {genre}
                                        </div>
                                    ))}
                                    {developer.genres.length > 6 && (
                                        <div className="badge badge-ghost badge-sm text-xs font-bold opacity-50">
                                            +{developer.genres.length - 6}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-4 lg:gap-6">
                                <StatCard icon={faGamepad} value={developer.gameCount.toString()} label="Juegos" hue={hue} />
                                <StatCard icon={faLayerGroup} value={developer.platforms.length.toString()} label="Plataformas" hue={hue} />
                                <StatCard icon={faCubes} value={developer.engines.length.toString()} label="Motores" hue={hue} />
                                {developer.coDevs.length > 0 && (
                                    <StatCard icon={faUsers} value={developer.coDevs.length.toString()} label="Co-devs" hue={hue} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Info Cards ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    {/* Platforms */}
                    <InfoCard title="Plataformas" icon={faGlobe}>
                        <div className="flex flex-wrap gap-2">
                            {developer.platforms.map(platform => (
                                <div key={platform} className="badge badge-neutral font-bold uppercase tracking-tight text-xs">
                                    {platform}
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    {/* Engines */}
                    <InfoCard title="Motores" icon={faCode}>
                        <div className="flex flex-wrap gap-2">
                            {developer.engines.length > 0 ? developer.engines.map(engine => (
                                <div key={engine} className="badge badge-neutral font-bold uppercase tracking-tight text-xs">
                                    {engine}
                                </div>
                            )) : (
                                <span className="text-base-content/50 text-sm">No especificado</span>
                            )}
                        </div>
                    </InfoCard>

                    {/* Timeline */}
                    <InfoCard title="Trayectoria" icon={faCalendarAlt}>
                        <div className="space-y-2">
                            {developer.firstRelease && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Primer juego</span>
                                    <span className="text-sm font-bold text-base-content">{developer.firstRelease}</span>
                                </div>
                            )}
                            {developer.latestRelease && (
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Más reciente</span>
                                    <span className="text-sm font-bold text-base-content">{developer.latestRelease}</span>
                                </div>
                            )}
                            {!developer.firstRelease && !developer.latestRelease && (
                                <span className="text-base-content/50 text-sm">Fechas no disponibles</span>
                            )}
                        </div>
                    </InfoCard>
                </div>

                {/* ── Games Grid: Catalog ─────────────────────────────────── */}
                {hasCatalogGames && (
                    <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faGamepad} className="text-primary text-lg" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                Catálogo
                            </h2>
                            <span className="badge badge-primary badge-sm font-bold">{developer.games.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {developer.games.map(game => (
                                <GameCard
                                    key={game.slug}
                                    game={game}
                                    onClick={() => onGameClick(game)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Games Grid: Game Jams ───────────────────────────────── */}
                {hasJamGames && (
                    <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faCubes} className="text-secondary text-lg" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                Game Jams
                            </h2>
                            <span className="badge badge-secondary badge-sm font-bold">{developer.jamGames.length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {developer.jamGames.map(game => (
                                <GameCard
                                    key={game.slug}
                                    game={game}
                                    onClick={() => onGameClick(game)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Co-Developers ───────────────────────────────────────── */}
                {developer.coDevs.length > 0 && (
                    <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faUsers} className="text-accent text-lg" />
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">
                                Estudios Relacionados
                            </h2>
                        </div>
                        <p className="text-base-content/60 text-sm mb-6">
                            Estos estudios o desarrolladores han colaborado en juegos junto a {developer.name}.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {developer.coDevs.map(coDevName => {
                                const coDevSlug = generateSlug(coDevName);
                                const coDevHue = nameToHue(coDevName);
                                return (
                                    <a
                                        key={coDevName}
                                        href={`/developer/${coDevSlug}`}
                                        className="card bg-base-200 shadow-md border border-base-content/5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="card-body p-5 flex-row items-center gap-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white shrink-0 group-hover:scale-110 transition-transform"
                                                style={{ background: `hsl(${coDevHue}, 55%, 35%)` }}
                                            >
                                                {coDevName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                                                    {coDevName}
                                                </h3>
                                                <p className="text-xs text-base-content/50 uppercase tracking-wider font-bold">
                                                    Desarrollador
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </PageTransition>
    );
};

// ── Sub-components ─────────────────────────────────────────────────────────

interface StatCardProps {
    icon: any;
    value: string;
    label: string;
    hue: number;
}

const StatCard = ({ icon, value, label, hue }: StatCardProps) => (
    <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/90 shrink-0"
            style={{ background: `hsl(${hue}, 50%, 30%)` }}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
        <div>
            <p className="text-2xl font-black text-white leading-tight">{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">{label}</p>
        </div>
    </div>
);

interface InfoCardProps {
    title: string;
    icon: any;
    children: any;
}

const InfoCard = ({ title, icon, children }: InfoCardProps) => (
    <div className="card bg-base-200 shadow-xl border border-base-content/5">
        <div className="card-body p-6">
            <h3 className="card-title text-sm uppercase tracking-widest text-base-content mb-4 flex items-center gap-3">
                <FontAwesomeIcon icon={icon} className="text-primary text-lg" />
                {title}
            </h3>
            <div className="text-base-content/80">
                {children}
            </div>
        </div>
    </div>
);

export default DeveloperPage;

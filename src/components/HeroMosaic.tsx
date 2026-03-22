import { h } from 'preact';
import { useMemo, useEffect, useRef } from 'preact/hooks';
import { Game } from '@/src/types';
import { CoverImage } from '@/src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUsers, faCodeBranch, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroMosaicProps {
    games: Game[];
    jamGames?: Game[];
    onGameClick: (game: Game) => void;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
    value: string | number;
    label: string;
    icon: typeof faGamepad;
    iconClass: string;
    subValue?: string;
}

const StatCard = ({ value, label, icon, iconClass, subValue }: StatCardProps) => (
    <div className="flex flex-col items-center px-8 py-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm min-w-[160px] shadow-lg transition-transform duration-300 hover:scale-105 group">
        <span className="text-4xl font-bold text-white mb-1">{value}</span>
        <span className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-slate-400 md:text-sm mb-1">
            <FontAwesomeIcon icon={icon} className={iconClass} />
            {label}
        </span>
        {subValue && (
            <span className="text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                {subValue}
            </span>
        )}
    </div>
);

// ─── HeroMosaic ──────────────────────────────────────────────────────────────
const HeroMosaic = ({ games, jamGames = [] }: HeroMosaicProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // ── Stats ──────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const uniqueDevs = new Set(games.flatMap(g => g.developers));
        const years = games
            .map(g => parseInt(g.releaseDate.match(/\d{4}/)?.[0] || '0'))
            .filter(y => y > 1900 && y < 2999);

        const minYear = years.length ? Math.min(...years) : 2999;
        const historyYears = new Date().getFullYear() - minYear;

        return {
            gameCount: games.length,
            jamCount: jamGames.length,
            totalCount: games.length + jamGames.length,
            devs: uniqueDevs.size,
            history: Math.max(1, historyYears),
        };
    }, [games, jamGames]);

    // ... (mosaicGames and other logic stays same)
    // I'll need to keep the intermediate parts to ensure a clean replace.
    // Mosaic images
    const mosaicGames = useMemo(() => {
        const withImages = games.filter(g => {
            const src = g.imageCover || g.imageUrl;
            return src && src.length > 5;
        });
        return [...withImages].sort(() => 0.5 - Math.random()).slice(0, 28);
    }, [games]);

    // GSAP animations
    useEffect(() => {
        const el = gridRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { opacity: 0, scale: 1.1 },
                { opacity: 0.4, scale: 1, duration: 1.5, ease: 'power2.out' },
            );

            ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                animation: gsap.to(el, { y: 150, ease: 'none' }),
            });
        }, container);

        return () => ctx.revert();
    }, []);

    // Scroll to catalog
    const scrollDown = () => {
        const el = document.getElementById('catalog-content');
        if (el) {
            window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset, behavior: 'smooth' });
        }
    };

    // Render
    return (
        <div
            ref={containerRef}
            className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center overflow-hidden bg-slate-950"
        >
            {/* Background mosaic grid */}
            <div
                ref={gridRef}
                className="pointer-events-none absolute inset-[-10%] -rotate-3 grid h-[120%] w-[120%] select-none grid-cols-4 gap-4 opacity-0 md:grid-cols-7"
            >
                {mosaicGames.map((game) => (
                    <div
                        key={game.id}
                        className="relative h-full w-full overflow-hidden rounded-lg bg-slate-800 shadow-xl"
                    >
                        <CoverImage
                            src={game.imageCover || game.imageUrl}
                            alt=""
                            className="h-full w-full object-cover brightness-75 grayscale transition-all duration-700 hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />
                    </div>
                ))}
            </div>

            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950" />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />

            {/* Hero content */}
            <div className="relative z-10 mx-auto max-w-6xl animate-fade-in-up px-4 text-center -mt-60">

                {/* Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 backdrop-blur-md md:text-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Base de datos colaborativa
                </div>

                {/* Title */}
                <h1 
                    className="mb-4 text-6xl font-extrabold leading-none tracking-tight drop-shadow-2xl md:text-8xl bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #FCD34D 0%, #3B82F6 50%, #EF4444 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                    }}
                >
                    VENEZUELA
                    <br className="md:hidden" />
                    <span className="ml-0 md:ml-4">JUEGA</span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
                    La documentación digital que preserva y conecta la historia del desarrollo de videojuegos en el país
                </p>

                {/* Stats */}
                <div className="flex w-full flex-wrap justify-center gap-6 md:gap-8">
                    <StatCard 
                        value={stats.totalCount} 
                        label="Juegos" 
                        icon={faGamepad} 
                        iconClass="text-yellow-300"
                        subValue={`${stats.gameCount} estándar + ${stats.jamCount} de jams`}
                    />
                    <StatCard value={stats.devs} label="Estudios" icon={faUsers} iconClass="text-blue-300" />
                    <StatCard value={`${stats.history}+`} label="Años de historia" icon={faCodeBranch} iconClass="text-red-300" />
                </div>
            </div>

            {/* ── Scroll-down button ── */}
            <button
                onClick={scrollDown}
                className="absolute bottom-60 z-20 p-4 text-slate-500 transition-all duration-300 hover:-translate-y-1 hover:text-white"
                aria-label="Desplazar hacia abajo"
            >
                <FontAwesomeIcon icon={faArrowDown} className="animate-bounce text-2xl opacity-80" />
            </button>

            <style>{`
                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                @keyframes fadeInUp {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HeroMosaic;
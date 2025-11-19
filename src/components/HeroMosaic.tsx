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
    onGameClick: (game: Game) => void;
}

const HeroMosaic = ({ games }: HeroMosaicProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const stats = useMemo(() => {
        const uniqueDevs = new Set(games.flatMap(g => g.developers));
        const years = games
            .map(g => parseInt(g.releaseDate.match(/\d{4}/)?.[0] || '0'))
            .filter(y => y > 1900 && y < 2999);

        const minYear = years.length ? Math.min(...years) : 2999;
        const historyYears = new Date().getFullYear() - minYear;

        return {
            count: games.length,
            devs: uniqueDevs.size,
            history: Math.max(1, historyYears)
        };
    }, [games]);

    const mosaicGames = useMemo(() => {
        // Filtrar juegos que tengan imagen válida
        const withImages = games.filter(g => {
            const src = g.imageCover || g.imageUrl;
            return src && src.length > 5;
        });

        return [...withImages].sort(() => 0.5 - Math.random()).slice(0, 28);
    }, [games]);

    useEffect(() => {
        const el = gridRef.current;
        const container = containerRef.current;

        if (!el || !container) return;

        gsap.fromTo(el,
            { opacity: 0, scale: 1.1 },
            { opacity: 0.4, scale: 1, duration: 1.5, ease: "power2.out" }
        );

        const st = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: true,
            animation: gsap.to(el, {
                y: 150,
                ease: "none"
            })
        });

        return () => {
            st.kill();
            gsap.killTweensOf(el);
        };
    }, []);

    const scrollDown = () => {
        const el = document.getElementById('catalog-content');
        const yOffset = 0;
        if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen min-h-[700px] overflow-hidden bg-slate-950 flex flex-col justify-center items-center"
        >
            <div
                ref={gridRef}
                className="absolute inset-[-10%] w-[120%] h-[120%] grid grid-cols-4 md:grid-cols-7 gap-4 opacity-0 select-none pointer-events-none transform -rotate-3"
            >
                {mosaicGames.map((game, idx) => (
                    <div
                        key={game.id}
                        className="relative w-full h-full overflow-hidden rounded-lg bg-slate-800 shadow-xl"
                    >
                        <CoverImage
                            src={game.imageCover || game.imageUrl}
                            alt=""
                            className="w-full h-full object-cover filter grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-slate-950/20"></div>
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950 z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] z-0 pointer-events-none" />

            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-8 animate-fade-in-up">

                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-400 text-xs md:text-sm font-bold tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Base de datos colaborativa
                </div>

                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-none drop-shadow-2xl">
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, #ffcd75 0%, #41a6f6 60%, #b13e53 80%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        VENEZUELA
                    </span>
                    <br className="md:hidden" />
                    <span className="text-white ml-0 md:ml-4">
                        JUEGA
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-16 leading-relaxed">
                    La documentación digital que preserva y conecta la historia del desarrollo de videojuegos en el país
                </p>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full">
                    <div className="flex flex-col items-center px-8 py-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm min-w-[160px] transition-transform hover:scale-105 shadow-lg">
                        <span className="text-4xl font-bold text-white mb-1">{stats.count}</span>
                        <span className="text-xs md:text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                            <FontAwesomeIcon icon={faGamepad} className="text-cyan-500" /> Juegos
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-8 py-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm min-w-[160px] transition-transform hover:scale-105 shadow-lg">
                        <span className="text-4xl font-bold text-white mb-1">{stats.devs}</span>
                        <span className="text-xs md:text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                            <FontAwesomeIcon icon={faUsers} className="text-purple-500" /> Estudios
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-8 py-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm min-w-[160px] transition-transform hover:scale-105 shadow-lg">
                        <span className="text-4xl font-bold text-white mb-1">{stats.history}+</span>
                        <span className="text-xs md:text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2 font-semibold">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-rose-500" /> Años de historia
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={scrollDown}
                className="absolute bottom-28 text-slate-600 hover:text-white transition-all duration-300 p-4 hover:-translate-y-1 z-20"
                aria-label="Desplazar hacia abajo"
            >
                <FontAwesomeIcon icon={faArrowDown} className="text-2xl opacity-80 animate-bounce" />
            </button>

            <style>{`
                .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; opacity: 0; transform: translateY(20px); }
                @keyframes fadeInUp {
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HeroMosaic;
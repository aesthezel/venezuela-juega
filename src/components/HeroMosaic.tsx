import { h } from 'preact';
import { useMemo, useEffect, useRef, useState, useCallback } from 'preact/hooks';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { CoverImage } from '@/src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad, faUsers, faArrowDown,
    faChartBar, faCompass, faChevronLeft, faChevronRight,
    faArrowRight, faClock, faTrophy, faDatabase
} from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CategoryCard, TabButton, ProgressDots, CompactStat, CATEGORY_PRESETS } from './hero';
import type { CategoryPreset } from './hero';

gsap.registerPlugin(ScrollTrigger);

// ─── HeroMosaic ──────────────────────────────────────────────────────────────
interface HeroMosaicProps {
    games: Game[];
    jamGames?: Game[];
    onGameClick: (game: Game) => void;
    onCategorySelect?: (categoryId: string, preset: CategoryPreset) => void;
}

const AUTO_ROTATE_MS = 10000;

const HeroMosaic = ({ games, jamGames = [], onCategorySelect }: HeroMosaicProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const [showHint, setShowHint] = useState(false);
    const [showcaseTab, setShowcaseTab] = useState<'stats' | 'explore'>('explore');
    const [statIndex, setStatIndex] = useState(0); // For mobile stat carousel
    const [progress, setProgress] = useState(0);
    const progressStartRef = useRef(Date.now());
    const isPausedRef = useRef(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // ── Category scroll helpers ─────────────────────────────────────────
    const updateScrollArrows = useCallback(() => {
        const el = categoryScrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    const scrollCategories = useCallback((dir: 'left' | 'right') => {
        const el = categoryScrollRef.current;
        if (!el) return;
        const amount = dir === 'left' ? -260 : 260;
        el.scrollBy({ left: amount, behavior: 'smooth' });
        setTimeout(updateScrollArrows, 350);
    }, [updateScrollArrows]);

    useEffect(() => {
        const el = categoryScrollRef.current;
        if (!el) return;
        updateScrollArrows();
        el.addEventListener('scroll', updateScrollArrows, { passive: true });
        return () => el.removeEventListener('scroll', updateScrollArrows);
    }, [showcaseTab, updateScrollArrows]);

    const allGames = useMemo(() => [...games, ...jamGames], [games, jamGames]);

    // ── Stats ──────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const uniqueDevs = new Set(games.flatMap(g => g.developers));
        const years = allGames
            .map(g => parseInt(g.releaseDate.match(/\d{4}/)?.[0] || '0'))
            .filter(y => y > 1900 && y < 2999);
        const minYear = years.length ? Math.min(...years) : 2999;
        const historyYears = new Date().getFullYear() - minYear;

        return [
            { id: 'total', value: games.length + jamGames.length, label: 'Juegos lanzados', icon: faDatabase, color: '#10b981' },
            { id: 'games', value: games.length, label: 'Publicados en tiendas', icon: faGamepad, color: '#457cd6' },
            { id: 'jams', value: jamGames.length, label: 'Creados en Jams', icon: faTrophy, color: '#e34262' },
            { id: 'devs', value: uniqueDevs.size, label: 'Estudios y desarrolladores', icon: faUsers, color: '#f2b63d' },
            { id: 'history', value: `${Math.max(1, historyYears)}+`, label: 'Años de historia', icon: faClock, color: '#8b5cf6' },
        ];
    }, [games, jamGames, allGames]);

    // ── Category data ──────────────────────────────────────────────────────
    const categoryData = useMemo(() => {
        return CATEGORY_PRESETS.map(preset => {
            // Pick correct data pool based on preset.dataSource
            const pool = preset.dataSource === 'jams'
                ? jamGames
                : preset.dataSource === 'games'
                    ? games
                    : allGames;

            let matchingGames: Game[];
            if (preset.filterFn) {
                matchingGames = pool.filter(preset.filterFn);
            } else if (preset.filterRecord) {
                matchingGames = pool.filter(g =>
                    Object.entries(preset.filterRecord!).every(([key, values]) => {
                        const gameVal = (g as any)[key];
                        if (Array.isArray(gameVal)) return values.some(v => gameVal.includes(v));
                        return values.includes(gameVal);
                    })
                );
            } else {
                matchingGames = [];
            }

            // Pick representative background image
            const withCover = matchingGames.filter(g => {
                const src = g.imageHero || g.imageCover || g.imageUrl;
                return src && src.length > 5;
            });
            const bgGame = withCover.length > 0
                ? withCover[Math.floor(Math.random() * Math.min(withCover.length, 8))]
                : null;

            return {
                preset,
                count: matchingGames.length,
                backgroundSrc: bgGame ? (bgGame.imageHero || bgGame.imageCover || bgGame.imageUrl) : undefined,
            };
        }).filter(c => c.count > 0);
    }, [games, jamGames, allGames]);

    // ── Mosaic background games ────────────────────────────────────────────
    const mosaicGames = useMemo(() => {
        const withImages = games.filter(g => {
            const src = g.imageCover || g.imageUrl;
            return src && src.length > 5;
        });
        return [...withImages].sort(() => 0.5 - Math.random()).slice(0, 28);
    }, [games]);

    // ── GSAP background animation ──────────────────────────────────────────
    useEffect(() => {
        const el = gridRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(el,
                { opacity: 0, scale: 1.1 },
                { opacity: 0.35, scale: 1, duration: 1.5, ease: 'power2.out' },
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



    // ── Auto-rotate tabs ───────────────────────────────────────────────────
    useEffect(() => {
        progressStartRef.current = Date.now();
        setProgress(0);

        const progressInterval = setInterval(() => {
            if (isPausedRef.current) return;
            const elapsed = Date.now() - progressStartRef.current;
            const pct = Math.min((elapsed / AUTO_ROTATE_MS) * 100, 100);
            setProgress(pct);

            if (pct >= 100) {
                setShowcaseTab(prev => prev === 'stats' ? 'explore' : 'stats');
                progressStartRef.current = Date.now();
                setProgress(0);
            }
        }, 50);

        return () => clearInterval(progressInterval);
    }, [showcaseTab]);

    const handleTabChange = useCallback((tab: 'stats' | 'explore') => {
        setShowcaseTab(tab);
        progressStartRef.current = Date.now();
        setProgress(0);
    }, []);

    const handleShowcaseHover = useCallback((paused: boolean) => {
        isPausedRef.current = paused;
        if (!paused) {
            progressStartRef.current = Date.now() - (progress / 100) * AUTO_ROTATE_MS;
        }
    }, [progress]);

    // ── Scroll hint ────────────────────────────────────────────────────────
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        const startTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => setShowHint(true), 2000);
        };
        startTimer();

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowHint(false);
                if (timer) { clearTimeout(timer); timer = null; }
            } else if (window.scrollY < 10) {
                setShowHint(prev => { if (!prev && !timer) startTimer(); return prev; });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => { if (timer) clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
    }, []);

    const scrollDown = () => {
        setShowHint(false);
        const el = document.getElementById('catalog-content');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 20, behavior: 'smooth' });
    };

    // ── Category click handler ─────────────────────────────────────────────
    const handleCategoryClick = useCallback((preset: CategoryPreset) => {
        if (preset.dataSource === 'jams') {
            route('/game-jams');
            return;
        }

        onCategorySelect?.(preset.id, preset);
        setTimeout(() => {
            const el = document.getElementById('catalog-content');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 20, behavior: 'smooth' });
        }, 100);
    }, [onCategorySelect]);

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-screen overflow-hidden bg-slate-950"
        >
            {/* Background mosaic grid */}
            <div
                ref={gridRef}
                className="pointer-events-none absolute inset-[-10%] -rotate-3 grid h-[120%] w-[120%] select-none grid-cols-4 gap-4 opacity-0 md:grid-cols-7"
            >
                {mosaicGames.map((game) => (
                    <div key={game.id} className="relative h-full w-full overflow-hidden rounded-lg bg-slate-800 shadow-xl">
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
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d0a11_100%)]" />

            {/* Hero content */}
            <div className="relative z-10 w-full flex flex-col items-center px-4 pt-24 pb-8 md:pt-28 md:pb-12 mx-auto max-w-6xl hero-fade-in">

                {/* Badge */}
                <div className="mb-3 md:mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 backdrop-blur-md md:text-sm shadow-xl">
                    <span className="h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse rounded-full bg-emerald-500" />
                    Base de datos colaborativa
                </div>

                {/* Title */}
                <h1
                    className="mb-2 md:mb-4 text-center text-4xl sm:text-6xl md:text-8xl font-extrabold leading-[1.1] md:leading-none tracking-tight drop-shadow-2xl bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #f2b63d 0%, #457cd6 50%, #e34262 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                    }}
                >
                    VENEZUELA
                    <br className="md:hidden" />
                    <span className="ml-0 md:ml-4">JUEGA</span>
                </h1>

                {/* Subtitle */}
                <p className="mb-6 md:mb-8 text-center max-w-[280px] sm:max-w-2xl text-sm sm:text-base font-light leading-relaxed text-slate-400 md:text-xl drop-shadow-lg">
                    La documentación digital que preserva y conecta la historia del desarrollo de videojuegos en el país
                </p>

                {/* ── Showcase Tabs ── */}
                <div className="flex items-center gap-1 mb-5 md:mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <TabButton
                        icon={faCompass}
                        label="Explorar"
                        isActive={showcaseTab === 'explore'}
                        onClick={() => handleTabChange('explore')}
                    />
                    <TabButton
                        icon={faChartBar}
                        label="Métricas"
                        isActive={showcaseTab === 'stats'}
                        onClick={() => handleTabChange('stats')}
                    />
                </div>

                <div
                    className="relative w-full max-w-5xl"
                    onMouseEnter={() => handleShowcaseHover(true)}
                    onMouseLeave={() => handleShowcaseHover(false)}
                    style={{ minHeight: showcaseTab === 'explore' ? '460px' : '280px', transition: 'min-height 0.4s ease' }}
                >
                    {/* Stats Panel */}
                    <div className={`
                        w-full transition-transform duration-500 ease-out
                        ${showcaseTab === 'stats'
                            ? 'opacity-100 translate-y-0 relative'
                            : 'opacity-0 -translate-y-4 absolute inset-x-0 top-0 pointer-events-none'
                        }
                    `}>
                        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
                            {/* Responsive Stats Container */}
                            <div className="relative w-full p-4">
                                <div className="relative">
                                    {/* Mobile Arrows */}
                                    <div className="sm:hidden absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 z-20 pointer-events-none">
                                        <button
                                            onClick={() => setStatIndex(prev => (prev - 1 + stats.length) % stats.length)}
                                            className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
                                        >
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button
                                            onClick={() => setStatIndex(prev => (prev + 1) % stats.length)}
                                            className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
                                        >
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                    </div>

                                    {/* Stats Display Grid */}
                                    <div
                                        className="grid transition-all duration-500 gap-4
                                                   grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
                                    >
                                        {/* Mobile/Carouselled items */}
                                        {stats.map((stat, i) => {
                                            const isVisibleMobile = i === statIndex;
                                            return (
                                                <div key={stat.id} className={`
                                                    ${isVisibleMobile ? 'block' : 'hidden sm:block'}
                                                    ${i >= 3 ? 'sm:hidden lg:block' : ''}
                                                    transition-all duration-300
                                                `}>
                                                    <CompactStat
                                                        value={stat.value}
                                                        label={stat.label}
                                                        icon={stat.icon}
                                                        accentColor={stat.color}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Mobile Pagination Dots */}
                                <div className="flex sm:hidden justify-center gap-2 mt-4">
                                    {stats.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === statIndex ? 'w-4 bg-white/40' : 'w-1.5 bg-white/10'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* CTA to Charts */}
                            <button
                                onClick={() => route('/charts')}
                                className="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl
                                           bg-gradient-to-r from-yellow-500/10 via-blue-500/10 to-rose-500/10
                                           border border-white/[0.08] hover:border-white/[0.2]
                                           backdrop-blur-sm shadow-lg
                                           transition-all duration-300 hover:scale-[1.03] hover:shadow-xl
                                           cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faChartBar} className="text-yellow-400 text-base md:text-lg" />
                                <div className="flex flex-col items-start">
                                    <span className="text-white font-bold text-sm md:text-base tracking-wide">Explorar métricas completas</span>
                                    <span className="text-slate-400 text-[10px] md:text-xs">Plataformas, motores, géneros y más estadísticas</span>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 text-sm md:text-base ml-2" />
                            </button>
                        </div>
                    </div>

                    {/* Categories Panel */}
                    <div className={`
                        w-full transition-transform duration-500 ease-out
                        ${showcaseTab === 'explore'
                            ? 'opacity-100 translate-y-0 relative'
                            : 'opacity-0 translate-y-4 absolute inset-x-0 top-0 pointer-events-none'
                        }
                    `}>
                        <div className="relative">
                            {/* Left arrow */}
                            {canScrollLeft && (
                                <button
                                    onClick={() => scrollCategories('left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                                               w-10 h-10 md:w-12 md:h-12 rounded-full
                                               bg-slate-900/90 border border-white/10
                                               flex items-center justify-center
                                               text-white/70 hover:text-white hover:bg-slate-800
                                               transition-all duration-200 shadow-xl
                                               backdrop-blur-md cursor-pointer"
                                    aria-label="Scroll left"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )}
                            {/* Right arrow */}
                            {canScrollRight && (
                                <button
                                    onClick={() => scrollCategories('right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                                               w-10 h-10 md:w-12 md:h-12 rounded-full
                                               bg-slate-900/90 border border-white/10
                                               flex items-center justify-center
                                               text-white/70 hover:text-white hover:bg-slate-800
                                               transition-all duration-200 shadow-xl
                                               backdrop-blur-md cursor-pointer"
                                    aria-label="Scroll right"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            )}

                            {/* Scrollable row */}
                            <div
                                ref={categoryScrollRef}
                                className="flex gap-4 md:gap-5 overflow-x-auto
                                           scrollbar-hide scroll-smooth
                                           snap-x snap-mandatory
                                           px-6 md:px-8 py-6"
                            >
                                {categoryData.map((cat, i) => (
                                    <div key={cat.preset.id} className="snap-center">
                                        <CategoryCard
                                            preset={cat.preset}
                                            gameCount={cat.count}
                                            backgroundSrc={cat.backgroundSrc}
                                            onClick={() => handleCategoryClick(cat.preset)}
                                            index={i}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Fade edges */}
                            {canScrollLeft && (
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-950/80 to-transparent z-10" />
                            )}
                            {canScrollRight && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-950/80 to-transparent z-10" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress dots */}
                <ProgressDots
                    activeTab={showcaseTab}
                    onTabChange={handleTabChange}
                    progress={progress}
                />

                {/* ── Scroll Hint ── */}
                <div className={`mt-6 md:mt-8 transition-all duration-1000 ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <button
                        onClick={scrollDown}
                        className="group flex flex-col items-center gap-2 p-2 transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                        aria-label="Desplazar hacia abajo"
                    >
                        <span className="text-slate-500 text-xs md:text-sm font-medium tracking-wide transition-colors group-hover:text-slate-300">
                            Descubre el catálogo completo
                        </span>
                        <FontAwesomeIcon icon={faArrowDown} className="animate-bounce text-slate-600 group-hover:text-slate-400 md:text-xl transition-colors mt-1" />
                    </button>
                </div>
            </div>

            <style>{`
                .hero-fade-in {
                    animation: heroFadeIn 1s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                @keyframes heroFadeIn {
                    to { opacity: 1; transform: translateY(0); }
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .snap-x {
                    scroll-snap-type: x mandatory;
                }
                .snap-center {
                    scroll-snap-align: center;
                }
            `}</style>
        </div>
    );
};

export { CATEGORY_PRESETS };
export type { CategoryPreset };
export default HeroMosaic;
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
import { useTheme } from '@/src/hooks/ThemeContext';

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
    const [statIndex, setStatIndex] = useState(0); 
    const [progress, setProgress] = useState(0);
    const progressStartRef = useRef(Date.now());
    const isPausedRef = useRef(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const { theme } = useTheme();

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
        const amount = dir === 'left' ? -280 : 280;
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
            const pool = preset.dataSource === 'jams' ? jamGames : preset.dataSource === 'games' ? games : allGames;
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
            const withCover = matchingGames.filter(g => {
                const src = g.imageHero || g.imageCover || g.imageUrl;
                return src && src.length > 5;
            });
            const bgGame = withCover.length > 0 ? withCover[Math.floor(Math.random() * Math.min(withCover.length, 8))] : null;
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
            gsap.fromTo(el, { opacity: 0, scale: 1.1 }, { opacity: 0.35, scale: 1, duration: 1.5, ease: 'power2.out' });
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

    const handleCategoryClick = useCallback((preset: CategoryPreset) => {
        if (preset.dataSource === 'jams') { route('/game-jams'); return; }
        onCategorySelect?.(preset.id, preset);
        setTimeout(() => {
            const el = document.getElementById('catalog-content');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 20, behavior: 'smooth' });
        }, 100);
    }, [onCategorySelect]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full min-h-screen overflow-hidden transition-colors duration-700
                       ${theme === 'dark' ? 'bg-slate-950 hero-always-dark' : 'bg-slate-50'}`}
        >
            {/* Background grid */}
            <div ref={gridRef} className="pointer-events-none absolute inset-[-10%] -rotate-3 grid h-[120%] w-[120%] select-none grid-cols-4 gap-4 opacity-0 md:grid-cols-7">
                {mosaicGames.map((game) => (
                    <div key={game.id} className="relative h-full w-full overflow-hidden rounded-lg bg-slate-800 shadow-xl">
                        <CoverImage
                            src={game.imageCover || game.imageUrl}
                            alt=""
                            className={`h-full w-full object-cover transition-all duration-700
                                       ${theme === 'dark' ? 'brightness-75 grayscale' : 'brightness-110 opacity-30 grayscale'}`}
                        />
                    </div>
                ))}
            </div>

            {/* Overlays */}
            <div className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000
                            ${theme === 'dark' 
                                ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950' 
                                : 'bg-gradient-to-b from-slate-50/80 via-white/40 to-slate-50'}`} />
            
            <div className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000
                            ${theme === 'dark' 
                                ? 'bg-[radial-gradient(circle_at_center,transparent_0%,#0d0a11_100%)]' 
                                : 'bg-[radial-gradient(circle_at_center,transparent_0%,#f8f7f9_100%)]'}`} />

            <div className="relative z-10 w-full flex flex-col items-center px-4 pt-24 pb-8 md:pt-28 md:pb-12 mx-auto max-w-6xl hero-fade-in">
                {/* Badge */}
                <div className="mb-3 md:mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 backdrop-blur-md md:text-sm shadow-sm dark:shadow-xl transition-colors">
                    <span className="h-1.5 w-1.5 md:h-2 md:w-2 animate-pulse rounded-full bg-emerald-500" />
                    Base de datos colaborativa
                </div>

                {/* Title */}
                <h1
                    className="mb-2 md:mb-4 text-center text-4xl sm:text-6xl md:text-8xl font-extrabold leading-[1.1] md:leading-none tracking-tight drop-shadow-2xl bg-clip-text text-transparent"
                    style={{
                        backgroundImage: theme === 'dark' 
                            ? 'linear-gradient(to right, #f2b63d 0%, #457cd6 50%, #e34262 100%)'
                            : 'linear-gradient(to right, #d46e33 0%, #4b3b9c 50%, #94353d 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                    }}
                >
                    VENEZUELA<br className="md:hidden" /><span className="ml-0 md:ml-4">JUEGA</span>
                </h1>

                {/* Subtitle */}
                <p className="mb-6 md:mb-8 text-center max-w-[280px] sm:max-w-2xl text-sm sm:text-base font-medium md:font-light leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl drop-shadow-lg transition-colors">
                    La documentación digital que preserva y conecta la historia del desarrollo de videojuegos en el país
                </p>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-5 md:mb-6 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] transition-colors">
                    <TabButton icon={faCompass} label="Explorar" isActive={showcaseTab === 'explore'} onClick={() => handleTabChange('explore')} />
                    <TabButton icon={faChartBar} label="Métricas" isActive={showcaseTab === 'stats'} onClick={() => handleTabChange('stats')} />
                </div>

                <div className="relative w-full max-w-5xl" style={{ minHeight: showcaseTab === 'explore' ? '460px' : '280px', transition: 'min-height 0.4s ease' }}>
                    
                    {/* Stats Panel */}
                    <div className={`w-full transition-all duration-500 ${showcaseTab === 'stats' ? 'opacity-100 translate-y-0 relative' : 'opacity-0 -translate-y-4 absolute inset-x-0 top-0 pointer-events-none'}`}>
                        <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full px-4">
                                {stats.map((stat) => (
                                    <div key={stat.id} className="transition-all duration-300">
                                        <CompactStat value={stat.value} label={stat.label} icon={stat.icon} accentColor={stat.color} />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => route('/charts')} className="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-xl transition-all hover:scale-[1.03] cursor-pointer">
                                <FontAwesomeIcon icon={faChartBar} className="text-yellow-600 dark:text-yellow-400" />
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-slate-800 dark:text-white font-bold text-sm">Explorar métricas completas</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Plataformas, motores y más estadísticas</span>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} className="text-slate-400 ml-2" />
                            </button>
                        </div>
                    </div>

                    {/* Explore Panel */}
                    <div className={`w-full transition-all duration-500 ${showcaseTab === 'explore' ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-4 absolute inset-x-0 top-0 pointer-events-none'}`}>
                         <div className="relative group/scroll">
                            {canScrollLeft && (
                                <button onClick={() => scrollCategories('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white shadow-xl cursor-pointer">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )}
                            {canScrollRight && (
                                <button onClick={() => scrollCategories('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white shadow-xl cursor-pointer">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            )}
                            <div ref={categoryScrollRef} className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide px-8 py-6 snap-x">
                                {categoryData.map((cat, i) => (
                                    <div key={cat.preset.id} className="snap-center">
                                        <CategoryCard preset={cat.preset} gameCount={cat.count} backgroundSrc={cat.backgroundSrc} onClick={() => handleCategoryClick(cat.preset)} index={i} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <ProgressDots activeTab={showcaseTab} onTabChange={handleTabChange} progress={progress} />

                {/* Scroll Hint */}
                <div className={`mt-6 md:mt-8 transition-all duration-1000 ${showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <button onClick={scrollDown} className="group flex flex-col items-center gap-2 p-2 cursor-pointer">
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Descubre el catálogo completo</span>
                        <FontAwesomeIcon icon={faArrowDown} className="animate-bounce text-slate-400 dark:text-slate-600" />
                    </button>
                </div>
            </div>

            <style>{`
                .hero-fade-in { animation: heroFadeIn 1s ease-out forwards; opacity: 0; transform: translateY(20px); }
                @keyframes heroFadeIn { to { opacity: 1; transform: translateY(0); } }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export { CATEGORY_PRESETS };
export type { CategoryPreset };
export default HeroMosaic;
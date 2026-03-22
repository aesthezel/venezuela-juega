import { useRef, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt, faBars, faXmark, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { route } from 'preact-router';
import { trackNav } from '@/src/utils/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
    currentPath?: string;
}

const LOGO_URL = "https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_White.png";

const Header = ({ currentPath = '/' }: HeaderProps) => {
    const headerRef = useRef<HTMLElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigateTo = (path: string) => {
        trackNav(path, 'header');
        route(path);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const showHeader = () => gsap.to(el, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
            const hideHeader = () => gsap.to(el, { y: -100, opacity: 0, duration: 0.4, ease: 'power3.out' });

            ScrollTrigger.create({
                start: 'top top',
                onUpdate: (self) => {
                    if (self.direction === 1 && self.scroll() > 50) {
                        hideHeader();
                    } else if (self.direction === -1) {
                        showHeader();
                    }
                },
            });
        }, el);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = overflow; };
    }, [isMenuOpen]);

    return (
        <>
            <header
                ref={headerRef}
                className="fixed top-0 left-0 right-0 z-50 h-20 w-full pointer-events-none transition-transform will-change-transform"
            >
                <div className="relative w-full flex justify-center">
                    <div
                        className="absolute top-0 h-20 w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-2xl"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                        }}
                    />
                    <div
                        className="absolute inset-x-0 top-0 h-20 pointer-events-none opacity-70"
                        style={{
                            background: 'radial-gradient(800px circle at 50% 0%, rgba(34,211,238,0.12), transparent 55%)'
                        }}
                    />

                    <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10 pointer-events-auto">
                        <button
                            onClick={() => navigateTo('/')}
                            className="group flex-shrink-0 hover:opacity-90 transition-opacity"
                            aria-label="Ir al inicio"
                        >
                            <img
                                src={LOGO_URL}
                                alt="Venezuela Juega"
                                className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.10)]"
                            />
                        </button>

                        <nav className="hidden md:flex items-center gap-2">
                            {[
                                { path: '/game-jams', label: 'Game Jams', icon: faGamepad },
                                { path: '/calendar', label: 'Calendario', icon: faCalendarAlt },
                                { path: '/charts', label: 'Estadísticas', icon: faChartBar },
                                { path: '/about', label: 'Créditos', icon: faInfoCircle },
                            ].map((item) => {
                                const active = currentPath === item.path;
                                const isGameJamsOnHome = item.path === '/game-jams' && (currentPath === '/' || currentPath === '');
                                return (
                                    <div key={item.path} className="relative">
                                        <button
                                            onClick={() => navigateTo(item.path)}
                                            className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${active
                                                ? 'text-cyan-200 bg-cyan-950/30 border-cyan-500/25 shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                                                : 'text-slate-300 border-transparent hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={item.icon} className={active ? "animate-pulse" : ""} />
                                            <span>{item.label}</span>
                                            {active && (
                                                <span className="absolute inset-x-3 -bottom-[9px] h-[2px] bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 rounded-full" />
                                            )}
                                        </button>

                                        {/* Animated Tooltip Bubble */}
                                        {isGameJamsOnHome && (
                                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-400 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-bounce pointer-events-none z-50">
                                                <span>¡Revisa los juegos de este año!</span>
                                                <div
                                                    className="absolute -top-[6px] left-1/2 -translate-x-1/2"
                                                    style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid #50a2ff' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-200 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-white/5"
                                aria-label="Abrir menú"
                            >
                                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        className="fixed left-0 right-0 z-40 md:hidden px-4"
                        style={{ top: 'var(--header-height)' }}
                    >
                        <div className="container mx-auto">
                            <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                <div className="p-3 flex flex-col gap-2">
                                    {[
                                        { path: '/game-jams', label: 'Game Jams', icon: faGamepad, color: 'text-orange-300', bg: 'bg-orange-500/10' },
                                        { path: '/calendar', label: 'Calendario', icon: faCalendarAlt, color: 'text-purple-300', bg: 'bg-purple-500/10' },
                                        { path: '/charts', label: 'Estadísticas', icon: faChartBar, color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
                                        { path: '/about', label: 'Créditos', icon: faInfoCircle, color: 'text-emerald-300', bg: 'bg-emerald-500/10' },
                                    ].map((item) => {
                                        const isGameJamsOnHome = item.path === '/game-jams' && (currentPath === '/' || currentPath === '');
                                        return (
                                            <button
                                                key={item.path}
                                                onClick={() => navigateTo(item.path)}
                                                className="w-full flex items-center justify-between text-base font-semibold text-slate-100 p-4 rounded-xl hover:bg-white/5 border border-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color} border border-white/10`}>
                                                        <FontAwesomeIcon icon={item.icon} />
                                                    </div>
                                                    {item.label}
                                                </div>
                                                {isGameJamsOnHome && (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                                                        ¡NUEVO!
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Header;
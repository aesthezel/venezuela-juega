import { useRef, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt, faBars, faXmark, faGamepad, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { Game } from '@/types';
import { route } from 'preact-router';
import { trackNav } from '@/utils/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UserProfile from './UserProfile';

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
    currentPath?: string;
    games?: Game[];
    jamGames?: Game[];
}

const LOGO_URL = "https://venezuela-juega.s3.us-east-005.dream.io/brand/VenezuelaJuega_White.png";

const Header = ({ currentPath = '/', games = [], jamGames = [] }: HeaderProps) => {
    const isVisibleRef = useRef(true);
    const headerRef = useRef<HTMLElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navigateTo = (path: string) => {
        trackNav(path, 'header');
        route(path);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const direction = currentScrollY > lastScrollY ? 1 : -1;

                    setIsScrolled(currentScrollY > 20);

                    if (currentScrollY <= 50) {
                        if (!isVisibleRef.current) {
                            gsap.to(el, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
                            isVisibleRef.current = true;
                        }
                    } else if (direction === 1 && currentScrollY > 200) {
                        if (isVisibleRef.current) {
                            gsap.to(el, { y: -100, opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: true });
                            isVisibleRef.current = false;
                        }
                    } else if (direction === -1) {
                        if (!isVisibleRef.current) {
                            gsap.to(el, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
                            isVisibleRef.current = true;
                        }
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = overflow; };
    }, [isMenuOpen]);

    const navItems = [
        { path: '/jam', label: 'Jam Benéfica', icon: faHandHoldingHeart, badge: 'NUEVO' },
        { path: '/game-jams', label: 'Game Jams', icon: faGamepad, badge: null },
        { path: '/calendar', label: 'Calendario', icon: faCalendarAlt, badge: null },
        { path: '/charts', label: 'Métricas', icon: faChartBar, badge: null },
        { path: '/about', label: 'Créditos', icon: faInfoCircle, badge: null },
    ];

    return (
        <>
            <header
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-[60] h-20 w-full will-change-transform transition-[background-color,border-color,padding,backdrop-filter] duration-500 ${isScrolled
                    ? 'bg-base-100/80 backdrop-blur-lg border-b border-surface-700 shadow-xl py-0'
                    : 'bg-transparent border-b border-transparent py-2'
                    }`}
            >
                <div className="container mx-auto px-6 h-full flex items-center justify-between relative">
                    {/* Logo Section */}
                    <button
                        onClick={() => navigateTo('/')}
                        className="group flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
                        aria-label="Ir al inicio"
                    >
                        <img
                            src={LOGO_URL}
                            alt="Venezuela Juega"
                            className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-7 md:h-8' : 'h-8 md:h-10'
                                } drop-shadow-lg`}
                        />
                    </button>

                    {/* Desktop Navigation & Profile */}
                    <div className="flex items-center gap-6 lg:gap-10">
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const active = currentPath === item.path;
                                const isGameJamsOnHome = item.path === '/game-jams' && (currentPath === '/' || currentPath === '');
                                return (
                                    <div key={item.path} className="relative group/nav">
                                        <button
                                            onClick={() => navigateTo(item.path)}
                                            className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${active
                                                ? 'text-white bg-accent-teal-dark/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-accent-teal-dark/40'
                                                : 'text-base-content/70 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={item.icon} className={`text-xs ${active ? 'text-accent-teal' : 'text-base-content/70 group-hover/nav:text-base-content/70 transition-colors'}`} />
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="badge badge-xs badge-secondary font-black text-[9px] px-1.5 py-0.5">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>

                                        {/* Tooltip Bubble for Home page */}
                                        {isGameJamsOnHome && !isScrolled && (
                                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl animate-bounce z-50 pointer-events-none">
                                                ¡Nuevos juegos!
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-3">
                            <UserProfile games={games} jamGames={jamGames} />

                            {/* Mobile Hamburger Trigger */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden p-2.5 text-base-content hover:text-white transition-all rounded-xl hover:bg-white/5 border border-surface-700 cursor-pointer"
                                aria-label="Abrir menú"
                            >
                                <FontAwesomeIcon icon={faBars} size="lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar (Right Side) */}
            <div
                className={`fixed inset-0 z-[110] transition-all duration-300 md:hidden ${isMenuOpen ? 'visible' : 'invisible'
                    }`}
            >
                {/* Backdrop Overlay */}
                <div
                    className={`absolute inset-0 bg-base-100/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Sidebar Panel */}
                <div
                    className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-base-200 border-l border-surface-700 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 flex items-center justify-between border-b border-surface-700">
                        <button onClick={() => navigateTo('/')} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <img src={LOGO_URL} alt="Logo" className="h-6 w-auto" />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-300 text-base-content/70 hover:text-white transition-colors"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    {/* Sidebar Nav */}
                    <nav className="p-4 flex flex-col gap-2">
                        {navItems.map((item) => {
                            const active = currentPath === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigateTo(item.path)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border cursor-pointer ${active
                                        ? 'bg-accent-teal-dark/20 border-accent-teal-dark/40 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                        : 'bg-white/5 border-transparent text-base-content/70'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-accent-teal-dark text-base-100' : 'bg-base-300 text-base-content/70'
                                        }`}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <span className="font-bold flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="badge badge-xs badge-secondary font-black text-[9px]">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer Info */}
                    <div className="mt-auto p-8 border-t border-surface-700 bg-base-100/30">
                        <p className="text-[10px] text-base-content/70 uppercase font-black tracking-widest text-center">
                            Hecho con ❤️ en Venezuela
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
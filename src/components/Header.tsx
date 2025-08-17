import { useRef, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { route } from 'preact-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
    currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
    const headerRef = useRef<HTMLElement | null>(null);
    const hideTimeout = useRef<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigateTo = (path: string) => {
        route(path);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;

        const setHeaderHeightVar = () => {
            try {
                const rect = el.getBoundingClientRect();
                const height = Math.ceil(rect.height);
                document.documentElement.style.setProperty('--header-height', `${height}px`);
            } catch (e) {
                console.error('Error al establecer la altura del header:', e);
            }
        };

        setHeaderHeightVar();

        let resizeObserver: ResizeObserver | null = null;
        try {
            resizeObserver = new ResizeObserver(setHeaderHeightVar);
            resizeObserver.observe(el);
        } catch (e) {
            window.addEventListener('resize', setHeaderHeightVar);
        }

        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        el.style.willChange = 'transform, opacity';

        const clearHideTimeout = () => {
            if (hideTimeout.current != null) {
                window.clearTimeout(hideTimeout.current);
                hideTimeout.current = null;
            }
        };

        const showHeader = (immediate = false) => {
            clearHideTimeout();
            if (prefersReducedMotion) {
                el.style.transform = 'translateY(0)';
                el.style.opacity = '1';
                return;
            }
            gsap.to(el, { y: 0, opacity: 1, duration: immediate ? 0 : 0.35, ease: 'power2.out' });
        };

        const hideHeader = (immediate = false) => {
            clearHideTimeout();
            if (prefersReducedMotion) {
                el.style.transform = 'translateY(-80px)';
                el.style.opacity = '0';
                return;
            }
            gsap.to(el, { y: -80, opacity: 0, duration: immediate ? 0 : 0.35, ease: 'power2.out' });
        };

        const st = ScrollTrigger.create({
            start: 'top top',
            onUpdate: (self) => {
                if (self.direction === 1) {
                    hideHeader();
                } else if (self.direction === -1) {
                    showHeader();
                }
                clearHideTimeout();
                hideTimeout.current = window.setTimeout(() => {
                    showHeader();
                }, 600);
            },
        });

        setHeaderHeightVar();
        showHeader(true);

        return () => {
            clearHideTimeout();
            st.kill();
            gsap.killTweensOf(el);
            el.style.willChange = '';

            try {
                if (resizeObserver) resizeObserver.disconnect();
                else window.removeEventListener('resize', setHeaderHeightVar);
            } catch {}
        };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        const onResize = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <header ref={headerRef} className="bg-slate-800/95 backdrop-blur shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 md:py-5">
                <div className="flex items-center justify-between gap-4">

                    <button
                        onClick={() => navigateTo('/')}
                        className="group flex items-center gap-3 cursor-pointer select-none"
                        aria-label="Ir al inicio"
                    >
                        <div className="flex flex-col text-left leading-tight">
                            <h1
                                className="
                                    font-extrabold tracking-tight text-white
                                    text-[clamp(1.25rem,3.3vw,1.875rem)]
                                    [text-wrap:balance]
                                    drop-shadow-sm
                                    group-hover:opacity-95 transition-opacity
                                "
                                style={{
                                    fontFeatureSettings: '"ss01","ss02","cv01"',
                                }}
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-blue-300 to-red-300">
                                    Venezuela Juega
                                </span>
                            </h1>
                            <p
                                className="
                                    text-white-400/90
                                    text-[clamp(0.75rem,1.8vw,0.95rem)]
                                    md:text-base
                                    leading-snug
                                "
                            >
                                Explora la industria del gaming en el pais
                            </p>
                        </div>
                    </button>

                    <nav className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => navigateTo('/calendar')}
                            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                                currentPath === '/calendar'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Ver calendario de juegos"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>Calendario</span>
                        </button>
                        <button
                            onClick={() => navigateTo('/charts')}
                            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                                currentPath === '/charts'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Ver estadísticas"
                        >
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Estadísticas</span>
                        </button>
                        <button
                            onClick={() => navigateTo('/about')}
                            className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                                currentPath === '/about'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Acerca de Venezuela Juega"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>Acerca de</span>
                        </button>
                    </nav>

                    <div className="md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg p-2 text-white bg-slate-700 hover:bg-cyan-600 transition-colors"
                            aria-label="Abrir menú"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((v) => !v)}
                        >
                            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div
                    id="mobile-menu"
                    className={`
                        md:hidden overflow-hidden transition-all duration-300 ease-out
                        ${isMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="flex flex-col gap-2 bg-slate-800/90 rounded-lg p-3 shadow-md">
                        <button
                            onClick={() => navigateTo('/calendar')}
                            className={`w-full justify-start flex items-center gap-2 font-semibold py-2 px-3 rounded-md transition-colors duration-200 ${
                                currentPath === '/calendar'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Ver calendario de juegos"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>Calendario</span>
                        </button>
                        <button
                            onClick={() => navigateTo('/charts')}
                            className={`w-full justify-start flex items-center gap-2 font-semibold py-2 px-3 rounded-md transition-colors duration-200 ${
                                currentPath === '/charts'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Ver estadísticas"
                        >
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Estadísticas</span>
                        </button>
                        <button
                            onClick={() => navigateTo('/about')}
                            className={`w-full justify-start flex items-center gap-2 font-semibold py-2 px-3 rounded-md transition-colors duration-200 ${
                                currentPath === '/about'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-cyan-600 text-white'
                            }`}
                            aria-label="Acerca de Venezuela Juega"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>Acerca de</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
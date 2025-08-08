import { useRef, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
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

    const navigateTo = (path: string) => {
        route(path);
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

        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

        // Asegurar estado inicial visible y variable inicial
        setHeaderHeightVar();
        showHeader(true);

        return () => {
            clearHideTimeout();
            st.kill();
            gsap.killTweensOf(el);
            el.style.willChange = '';
            // limpiar observadores
            try {
                if (resizeObserver) resizeObserver.disconnect();
                else window.removeEventListener('resize', setHeaderHeightVar);
            } catch {}
        };
    }, []);

    return (
        <header ref={headerRef} className="bg-slate-800 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigateTo('/')} 
                        className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-white">Venezuela Juega</h1>
                            <p className="text-cyan-400">Explora la creciente industria del gaming en Venezuela</p>
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateTo('/calendar')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/calendar' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Ver calendario de juegos"
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span className="hidden sm:inline">Calendario</span>
                    </button>
                    <button
                        onClick={() => navigateTo('/charts')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/charts' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Ver estadísticas"
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span className="hidden sm:inline">Estadísticas</span>
                    </button>
                    <button
                        onClick={() => navigateTo('/about')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/about' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Acerca de Venezuela Juega"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <span className="hidden sm:inline">Acerca de</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
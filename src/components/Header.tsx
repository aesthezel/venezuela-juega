import { useRef, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
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

        // Animación simple: desaparece hacia arriba al bajar, aparece al subir
        const showHeader = () => gsap.to(el, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
        const hideHeader = () => gsap.to(el, { y: -100, opacity: 0, duration: 0.4, ease: 'power3.out' });

        const st = ScrollTrigger.create({
            start: 'top top',
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 50) {
                    hideHeader();
                } else if (self.direction === -1) {
                    showHeader();
                }
            },
        });

        return () => {
            st.kill();
            gsap.killTweensOf(el);
        };
    }, []);

    return (
        <>
            <header
                ref={headerRef}
                className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none transition-transform will-change-transform"
            >
                <div className="relative w-full flex justify-center">
                    <div
                        className="absolute top-0 h-20 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                        }}
                    />

                    <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10 pointer-events-auto">

                        <button
                            onClick={() => navigateTo('/')}
                            className="group flex-shrink-0 hover:opacity-80 transition-opacity"
                            aria-label="Ir al inicio"
                        >
                            <img
                                src={LOGO_URL}
                                alt="Venezuela Juega"
                                className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                            />
                        </button>

                        <nav className="hidden md:flex items-center gap-2">
                            {[
                                { path: '/calendar', label: 'Calendario', icon: faCalendarAlt },
                                { path: '/charts', label: 'Estadísticas', icon: faChartBar },
                                { path: '/about', label: 'Créditos', icon: faInfoCircle },
                            ].map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigateTo(item.path)}
                                    className={`flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-all duration-300 border border-transparent ${
                                        currentPath === item.path
                                            ? 'text-cyan-400 bg-cyan-950/30 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className={currentPath === item.path ? "animate-pulse" : ""} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-slate-300 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl pt-24 px-6 animate-fade-in md:hidden flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {[
                            { path: '/calendar', label: 'Calendario', icon: faCalendarAlt, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { path: '/charts', label: 'Estadísticas', icon: faChartBar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                            { path: '/about', label: 'Créditos', icon: faInfoCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        ].map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigateTo(item.path)}
                                className="flex items-center gap-4 text-lg font-medium text-slate-200 p-4 rounded-xl hover:bg-white/5 border border-white/5 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>
        </>
    );
};

export default Header;
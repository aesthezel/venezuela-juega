import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

const SCROLL_SHOW_THRESHOLD = 300;

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const lastScrollY = useRef(0);
    const desktopBtnRef = useRef<HTMLButtonElement | null>(null);
    const mobileBtnRef = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            setVisible(y > SCROLL_SHOW_THRESHOLD);

            // Detectamos dirección del scroll para mover el botón si el footer aparece
            const currentY = window.scrollY || document.documentElement.scrollTop;
            const currentDirection = currentY < lastScrollY.current ? 'up' : 'down';

            // Solo nos importa el estado "subiendo" si hemos pasado el umbral de visibilidad
            if (y > SCROLL_SHOW_THRESHOLD) {
                setIsScrollingUp(currentDirection === 'up');
            } else {
                setIsScrollingUp(false);
            }

            lastScrollY.current = currentY <= 0 ? 0 : currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const desktopEl = desktopBtnRef.current;
        const mobileEl = mobileBtnRef.current;

        const elements = [desktopEl, mobileEl].filter(Boolean) as HTMLElement[];
        if (elements.length === 0) return;

        if (prefersReducedMotion) {
            elements.forEach(el => {
                el.style.opacity = visible ? '1' : '0';
                el.style.transform = visible ? 'translateY(0)' : 'translateY(20px)';
                el.style.pointerEvents = visible ? 'auto' : 'none';
            });
            return;
        }

        if (visible) {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'back.out(1.7)',
                pointerEvents: 'auto'
            });
        } else {
            gsap.to(elements, {
                opacity: 0,
                y: 20,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                pointerEvents: 'none'
            });
        }
    }, [visible, prefersReducedMotion]);

    // Efecto específico para el ajuste de posición móvil cuando aparece el Footer
    useEffect(() => {
        const mobileEl = mobileBtnRef.current;
        if (!mobileEl || prefersReducedMotion) return;

        if (visible) {
            // Si scrolleamos hacia arriba, el footer se vuelve visible (sticky bottom-0)
            // Por lo que subimos la barra para evitar que se solapen.
            // bottom-38 (9.5rem) vs bottom-6 (1.5rem)
            gsap.to(mobileEl, {
                bottom: isScrollingUp ? '9.5rem' : '1.5rem',
                duration: 0.4,
                ease: 'power3.out'
            });
        }
    }, [isScrollingUp, visible, prefersReducedMotion]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* ── Desktop Version (Circular) ── */}
            <button
                ref={desktopBtnRef}
                onClick={scrollToTop}
                aria-label="Ir arriba"
                className="hidden md:flex fixed right-10 bottom-10 z-[70] w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-2xl items-center justify-center transition-all duration-300 group hover:border-cyan-500/50 hover:bg-slate-700/90 focus:outline-none"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.95)', pointerEvents: 'none' }}
            >
                <FontAwesomeIcon
                    icon={faChevronUp}
                    className="text-slate-100 text-lg group-hover:text-cyan-400 group-hover:-translate-y-1 transition-all duration-300"
                />
            </button>

            {/* ── Mobile Version (Horizontal Bar) ── */}
            <div
                ref={mobileBtnRef}
                className="md:hidden fixed left-4 right-4 z-[70]"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.95)', pointerEvents: 'none' }}
            >
                <button
                    onClick={scrollToTop}
                    className="flex items-center justify-between w-full px-6 py-4 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30 transition-colors">
                            <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-50/90">
                            Ir hacia arriba
                        </span>
                    </div>

                    {/* Decorative line/indicator */}
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-cyan-600 to-cyan-400 animate-pulse" />
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
};

export default ScrollToTop;

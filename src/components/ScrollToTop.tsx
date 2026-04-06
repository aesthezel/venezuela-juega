import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

const SCROLL_SHOW_THRESHOLD = 300;
const FOOTER_OFFSET = 128; // Diferencia en px entre bottom-6 (24px) y bottom-38 (152px)

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const lastScrollY = useRef(0);
    const desktopBtnRef = useRef<HTMLButtonElement | null>(null);
    const mobileBtnRef = useRef<HTMLDivElement | null>(null);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

            // Umbral de visibilidad
            const isVisibleNow = y > SCROLL_SHOW_THRESHOLD;
            setVisible(isVisibleNow);

            // Dirección del scroll
            if (isVisibleNow) {
                const currentDirection = y < lastScrollY.current ? 'up' : 'down';
                const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 60;

                setIsAtBottom(atBottom);

                // Solo cambiamos el estado si la diferencia es significativa para evitar jitter
                if (Math.abs(y - lastScrollY.current) > 5) {
                    setIsScrollingUp(currentDirection === 'up');
                }
            } else {
                setIsScrollingUp(false);
                setIsAtBottom(false);
            }

            lastScrollY.current = y <= 0 ? 0 : y;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Efecto coordinado de animación (Visibilidad + Posición de evitación del Footer)
    useEffect(() => {
        const desktopEl = desktopBtnRef.current;
        const mobileEl = mobileBtnRef.current;
        if (!desktopEl || !mobileEl) return;

        if (prefersReducedMotion) {
            desktopEl.style.opacity = visible ? '1' : '0';
            desktopEl.style.transform = visible ? 'translateY(0)' : 'translateY(20px)';
            desktopEl.style.pointerEvents = visible ? 'auto' : 'none';

            mobileEl.style.opacity = visible ? '1' : '0';
            // En modo reducido, simplemente saltamos a la posición sin animación
            const targetY = visible ? (isScrollingUp ? -FOOTER_OFFSET : 0) : 20;
            mobileEl.style.transform = `translateY(${targetY}px)`;
            mobileEl.style.pointerEvents = visible ? 'auto' : 'none';
            return;
        }

        // ── Animación Desktop ──
        gsap.to(desktopEl, {
            opacity: visible ? 1 : 0,
            y: visible ? 0 : 20,
            scale: visible ? 1 : 0.95,
            duration: visible ? 0.5 : 0.3,
            ease: visible ? 'back.out(1.7)' : 'power2.in',
            pointerEvents: visible ? 'auto' : 'none'
        });

        // ── Animación Mobile ──
        // El botón sube si estamos haciendo scroll up (aparece el footer) o si estamos al final de la página
        const shouldMoveUp = isScrollingUp || isAtBottom;
        const targetY = visible ? (shouldMoveUp ? -FOOTER_OFFSET : 0) : 20;

        gsap.to(mobileEl, {
            opacity: visible ? 1 : 0,
            y: targetY,
            scale: visible ? 1 : 0.95,
            duration: 0.5,
            ease: shouldMoveUp ? 'power3.out' : 'power2.out',
            pointerEvents: visible ? 'auto' : 'none',
            force3D: true
        });

    }, [visible, isScrollingUp, isAtBottom, prefersReducedMotion]);

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
                className="hidden md:flex fixed right-10 bottom-30 z-[70] w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 shadow-2xl items-center justify-center transition-all duration-300 group hover:border-cyan-500/50 hover:bg-slate-700/90 focus:outline-none"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.95)', pointerEvents: 'none' }}
            >
                <FontAwesomeIcon
                    icon={faChevronUp}
                    className="text-slate-100 text-lg group-hover:text-cyan-400 group-hover:-translate-y-1 transition-all duration-300"
                />
            </button>

            {/* ── Mobile Version (Horizontal Bar) ── */}
            {/* Mantenemos bottom-6 fijo y usamos GSAP 'y' para desplazarlo hacia arriba si hace falta */}
            <div
                ref={mobileBtnRef}
                className="md:hidden fixed bottom-6 left-4 right-4 z-[10]"
                style={{ opacity: 0, transform: 'translateY(20px) scale(0.95)', pointerEvents: 'none', bottom: '1.5rem' }}
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

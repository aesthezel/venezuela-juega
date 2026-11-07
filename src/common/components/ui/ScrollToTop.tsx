import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const SCROLL_SHOW_THRESHOLD = 300;
const FOOTER_OFFSET = 128; // Diferencia en px entre bottom-6 (24px) y bottom-38 (152px)

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const lastScrollY = useRef(0);

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

    // El botón sube si estamos haciendo scroll up (aparece el footer) o al final de la página
    const shouldMoveUp = isScrollingUp || isAtBottom;
    const mobileTargetY = visible ? (shouldMoveUp ? -FOOTER_OFFSET : 0) : 20;

    const desktopStyle = {
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 20}px) scale(${visible ? 1 : 0.95})`,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms ease, transform 300ms ease',
    } as const;

    const mobileStyle = {
        opacity: visible ? 1 : 0,
        transform: `translateY(${mobileTargetY}px) scale(${visible ? 1 : 0.95})`,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 300ms ease, transform 300ms ease',
    } as const;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* ── Desktop Version (Circular) ── */}
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Ir arriba"
                className="hidden md:flex fixed right-10 bottom-30 z-[70] w-14 h-14 rounded-full bg-base-300/80 backdrop-blur-md border border-surface-700 shadow-2xl items-center justify-center group hover:border-accent-teal-dark/50 hover:bg-base-300/90"
                style={desktopStyle}
            >
                <FontAwesomeIcon
                    icon={faChevronUp}
                    className="text-base-content text-lg group-hover:text-accent-teal group-hover:-translate-y-1 transition-all duration-300"
                />
            </button>

            {/* ── Mobile Version (Horizontal Bar) ── */}
            {/* Mantenemos bottom-6 fijo y usamos GSAP 'y' para desplazarlo hacia arriba si hace falta */}
            <div
                className="md:hidden fixed bottom-6 left-4 right-4 z-[10]"
                style={mobileStyle}
            >
                <button
                    type="button"
                    onClick={scrollToTop}
                    className="flex items-center justify-between w-full px-6 py-4 bg-base-200/95 backdrop-blur-2xl border border-surface-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-transform duration-200 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent-teal-dark/20 text-accent-teal group-hover:bg-accent-teal-dark/30 transition-colors">
                            <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-base-content/90">
                            Ir hacia arriba
                        </span>
                    </div>

                    {/* Decorative line/indicator */}
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 rounded-full bg-base-300 overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-accent-teal-dark to-accent-teal animate-pulse" />
                        </div>
                    </div>
                </button>
            </div>
        </>
    );
};

export default ScrollToTop;

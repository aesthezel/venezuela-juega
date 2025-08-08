import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

const SCROLL_SHOW_THRESHOLD = 300;

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            setVisible(y > SCROLL_SHOW_THRESHOLD);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const el = btnRef.current;
        if (!el) return;

        if (prefersReducedMotion) {
            el.style.opacity = visible ? '1' : '0';
            el.style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)';
            el.style.pointerEvents = visible ? 'auto' : 'none';
            return;
        }

        if (visible) {
            gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out', pointerEvents: 'auto' });
        } else {
            gsap.to(el, { opacity: 0, y: 10, scale: 0.95, duration: 0.25, ease: 'power3.in', pointerEvents: 'none' });
        }
    }, [visible, prefersReducedMotion]);

    const scrollToTop = () => {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            try {
                gsap.to(window, { scrollTo: 0, duration: 0.6, ease: 'power2.out' });
            } catch {
                window.scrollTo(0, 0);
            }
        }
    };

    return (
        <button
            ref={btnRef}
            onClick={scrollToTop}
            aria-label="Ir arriba"
            className="fixed right-6 bottom-20 z-60 w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg flex items-center justify-center hover:bg-cyan-400 focus:outline-none"
            style={{ opacity: 0, transform: 'translateY(10px) scale(0.95)', pointerEvents: 'none' }}
        >
            <FontAwesomeIcon icon={faChevronUp} />
        </button>
    );
};

export default ScrollToTop;
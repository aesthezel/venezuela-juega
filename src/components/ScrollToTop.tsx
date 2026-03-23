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
            el.style.transform = visible ? 'translateY(0)' : 'translateY(15px)';
            el.style.pointerEvents = visible ? 'auto' : 'none';
            return;
        }

        if (visible) {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
                pointerEvents: 'auto'
            });
        } else {
            gsap.to(el, {
                opacity: 0,
                y: 15,
                scale: 0.9,
                duration: 0.3,
                ease: 'power2.in',
                pointerEvents: 'none'
            });
        }
    }, [visible, prefersReducedMotion]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            ref={btnRef}
            onClick={scrollToTop}
            aria-label="Ir arriba"
            className="fixed right-20 bottom-30 z-[70] w-14 h-14 rounded-full bg-slate-600/60 border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 group hover:border-blue-600/60 focus:outline-none"
            style={{ opacity: 0, transform: 'translateY(15px) scale(0.9)', pointerEvents: 'none' }}
        >
            <FontAwesomeIcon
                icon={faChevronUp}
                className="text-slate-100 text-lg group-hover:text-blue-600 group-hover:-translate-y-1 transition-all duration-300"
            />
        </button>
    );
};

export default ScrollToTop;

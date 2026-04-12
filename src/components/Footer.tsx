import { useRef, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { gsap } from 'gsap';

const Footer = () => {
    const footerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = footerRef.current;
        if (!el) return;

        el.style.willChange = 'transform, opacity';
        
        // Initial state: hide off-screen only if we have a Hero to prevent overlap
        const initialPath = window.location.pathname;
        const hasHero = initialPath === '/' || initialPath === '/game' || initialPath === '/games';
        if (hasHero) {
            gsap.set(el, { y: 150, opacity: 0 });
        } else {
            // Otherwise start visible (default state)
            gsap.set(el, { y: 0, opacity: 1 });
        }

        let lastScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

            // Check if we are at the bottom of the page (with a small 80px threshold)
            const isAtBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
            
            // Check if we are on a page that contains the fullscreen Hero
            const path = window.location.pathname;
            const hasHero = path === '/' || path === '/game' || path === '/games';
            // Only hide the footer near the top if we actually have a Hero to protect
            const isAtTop = hasHero && y < window.innerHeight * 0.5;

            // Determine scroll direction
            // Only update direction if we scrolled a bit to avoid jitter
            let direction = 0;
            if (y > lastScrollY + 5) {
                direction = 1; // Down
            } else if (y < lastScrollY - 5) {
                direction = -1; // Up
            }

            if (isAtTop) {
                // Siempre ocultar cuando estamos al principio de la página (Hero view)
                gsap.to(el, { y: 150, opacity: 0, duration: 0.35, pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
            } else if (direction !== 0 || isAtBottom) {
                // Cuando el usuario hace scroll hacia abajo, ocultamos el footer
                if (direction === 1 && !isAtBottom) {
                    gsap.to(el, { y: 150, opacity: 0, duration: 0.35, pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
                } else if (direction === -1 || isAtBottom) {
                    // Al hacer scroll hacia arriba, o al llegar al final, lo mostramos
                    gsap.to(el, { y: 0, opacity: 1, duration: 0.35, pointerEvents: 'auto', ease: 'power2.out', overwrite: 'auto' });
                }
            }

            if (Math.abs(y - lastScrollY) > 5) {
                lastScrollY = y <= 0 ? 0 : y;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            gsap.killTweensOf(el);
            el.style.willChange = '';
        };
    }, []);

    return (
        <footer ref={footerRef} className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-gray-400 py-6 shadow-inner sticky bottom-0 z-40">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex space-x-6 mb-4 sm:mb-0">
                    <a href="https://github.com/aesthezel/venezuela-juega" target="_blank" rel="noopener noreferrer" aria-label="Repositorio en GitHub">
                        <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
                    </a>
                    <a href="https://x.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Twitter/X">
                        <FontAwesomeIcon icon={faTwitter} className="h-6 w-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.youtube.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube">
                        <FontAwesomeIcon icon={faYoutube} className="h-6 w-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.instagram.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram">
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.tiktok.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok">
                        <FontAwesomeIcon icon={faTiktok} className="h-6 w-6 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors" />
                    </a>
                </div>
                <div className="text-center sm:text-right">
                    <p className="text-sm">
                        Desarrollado con ❤️ por <a href="https://github.com/aesthezel" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">David Pino</a>
                    </p>
                    <p className="text-xs mt-2">
                        Venezuela Juega, documenta la industria de videojuegos en Venezuela desde el año 2020
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
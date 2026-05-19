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

        // Initial state: always start hidden (translated below the viewport)
        gsap.set(el, { yPercent: 100, opacity: 0 });

        let lastScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        let ticking = false;

        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const isAtBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;

                    const path = window.location.pathname;
                    const hasHero = path === '/' || path === '/game' || path === '/games';
                    const isAtTop = hasHero && y < window.innerHeight * 0.5;

                    let direction = 0;
                    if (y > lastScrollY + 5) {
                        direction = 1; // Down
                    } else if (y < lastScrollY - 5) {
                        direction = -1; // Up
                    }

                    if (isAtTop) {
                        gsap.to(el, { yPercent: 100, opacity: 0, duration: 0.35, pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
                    } else if (direction !== 0 || isAtBottom) {
                        if (direction === 1 && !isAtBottom) {
                            gsap.to(el, { yPercent: 100, opacity: 0, duration: 0.35, pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
                        } else if (direction === -1 || isAtBottom) {
                            gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.35, pointerEvents: 'auto', ease: 'power2.out', overwrite: 'auto' });
                        }
                    }

                    if (Math.abs(y - lastScrollY) > 5) {
                        lastScrollY = y <= 0 ? 0 : y;
                    }
                    ticking = false;
                });
                ticking = true;
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
        <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 bg-base-300 text-base-content/70 py-6 shadow-inner z-40">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex space-x-6 mb-4 sm:mb-0">
                    <a href="https://github.com/aesthezel/venezuela-juega" target="_blank" rel="noopener noreferrer" aria-label="Repositorio en GitHub">
                        <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-base-content/70 hover:text-white transition-colors" />
                    </a>
                    <a href="https://x.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Twitter/X">
                        <FontAwesomeIcon icon={faTwitter} className="h-6 w-6 text-base-content/70 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.youtube.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube">
                        <FontAwesomeIcon icon={faYoutube} className="h-6 w-6 text-base-content/70 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.instagram.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram">
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-base-content/70 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.tiktok.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok">
                        <FontAwesomeIcon icon={faTiktok} className="h-6 w-6 text-base-content/70 hover:text-white transition-colors" />
                    </a>
                </div>
                <div className="text-center sm:text-right">
                    <p className="text-sm">
                        Desarrollado con ❤️ por <a href="https://github.com/aesthezel" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-teal hover:underline">David Pino</a>
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
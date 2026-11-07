import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const UP_SCROLL_THRESHOLD = window.innerHeight * 0.75;

        let lastScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        let upScrollAccumulated = 0;
        let footerVisible = false;
        let ticking = false;

        const setFooter = (visible: boolean) => {
            if (footerVisible === visible) return;
            footerVisible = visible;
            setIsVisible(visible);
        };

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
                        upScrollAccumulated = 0;
                        setFooter(false);
                    } else if (isAtBottom) {
                        setFooter(true);
                    } else if (direction === 1) {
                        upScrollAccumulated = 0;
                        setFooter(false);
                    } else if (direction === -1) {
                        upScrollAccumulated += lastScrollY - y;
                        if (upScrollAccumulated >= UP_SCROLL_THRESHOLD) {
                            setFooter(true);
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
        };
    }, []);

    return (
        <footer
            className={`fixed bottom-0 left-0 right-0 bg-base-300 text-base-content/80 py-6 shadow-inner z-40 will-change-transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
        >
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                    <a href="https://github.com/aesthezel/venezuela-juega" target="_blank" rel="noopener noreferrer" aria-label="Repositorio en GitHub" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/5">
                        <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-base-content/80 hover:text-white transition-colors" />
                    </a>
                    <a href="https://x.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Twitter/X" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/5">
                        <FontAwesomeIcon icon={faTwitter} className="h-6 w-6 text-base-content/80 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.youtube.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/5">
                        <FontAwesomeIcon icon={faYoutube} className="h-6 w-6 text-base-content/80 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.instagram.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/5">
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-base-content/80 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.tiktok.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-white/5">
                        <FontAwesomeIcon icon={faTiktok} className="h-6 w-6 text-base-content/80 hover:text-white transition-colors" />
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
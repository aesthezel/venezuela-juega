import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-gray-400 py-6 shadow-inner sticky bottom-0 z-50">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex space-x-6 mb-4 sm:mb-0">
                    <a href="https://github.com/aesthezel/venezuela-juega" target="_blank" rel="noopener noreferrer" aria-label="Repositorio en GitHub">
                        <FontAwesomeIcon icon={faGithub} className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    </a>
                    <a href="https://x.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Twitter/X">
                        <FontAwesomeIcon icon={faTwitter} className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.youtube.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Canal de YouTube">
                        <FontAwesomeIcon icon={faYoutube} className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.instagram.com/venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de Instagram">
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    </a>
                    <a href="https://www.tiktok.com/@venezuelajuega" target="_blank" rel="noopener noreferrer" aria-label="Perfil de TikTok">
                        <FontAwesomeIcon icon={faTiktok} className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    </a>
                </div>
                <div className="text-center sm:text-right">
                    <p className="text-sm">
                        Desarrollado con ❤️ por <a href="https://github.com/aesthezel" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:underline">David Pino</a>
                    </p>
                    <p className="text-xs mt-2">
                        Venezuela Juega, documenta la industria de Venezuela desde el año 2020
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
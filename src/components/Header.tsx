import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { route } from 'preact-router';

interface HeaderProps {
    currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
    const navigateTo = (path: string) => {
        route(path);
    };

    return (
        <header className="bg-slate-800 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigateTo('/')} 
                        className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-white">Venezuela Juega</h1>
                            <p className="text-cyan-400">Explora la creciente industria del gaming en Venezuela</p>
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateTo('/calendar')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/calendar' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Ver calendario de juegos"
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span className="hidden sm:inline">Calendario</span>
                    </button>
                    <button
                        onClick={() => navigateTo('/charts')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/charts' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Ver estadísticas"
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span className="hidden sm:inline">Estadísticas</span>
                    </button>
                    <button
                        onClick={() => navigateTo('/about')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPath === '/about' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Acerca de Venezuela Juega"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <span className="hidden sm:inline">Acerca de</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
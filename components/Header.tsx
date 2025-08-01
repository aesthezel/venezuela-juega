import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export type Page = 'catalog' | 'charts' | 'add-game' | 'about';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

const Header = ({ onNavigate, currentPage }: HeaderProps) => {
    return (
        <header className="bg-slate-800 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={() => onNavigate('catalog')} className="flex items-center space-x-4">
                        {/*
                        <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-2xl">
                            -
                        </div>
                        */}
                        <div>
                            <h1 className="text-3xl font-bold text-white">Venezuela Juega</h1>
                            <p className="text-cyan-400">Explora la creciente industria del gaming en Venezuela</p>
                        </div>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {/*
                    <button
                        onClick={() => onNavigate('add-game')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPage === 'add-game' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Añadir nuevo juego"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="hidden sm:inline">Añadir Juego</span>
                    </button>
                    */}
                    <button
                        onClick={() => onNavigate('charts')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPage === 'charts' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
                        }`}
                        aria-label="Ver estadísticas"
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span className="hidden sm:inline">Estadísticas</span>
                    </button>
                    <button
                        onClick={() => onNavigate('about')}
                        className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors duration-300 ${
                            currentPage === 'about' ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-cyan-600 text-white'
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
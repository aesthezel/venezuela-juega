import { useEffect } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { CloseIcon, LinkIcon } from '@/src/components/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
    game: Game;
    onClose: () => void;
}

interface DetailItemProps {
    label: string;
    children: ComponentChildren;
}

const DetailItem = ({ label, children }: DetailItemProps) => (
    <div>
        <dt className="text-sm font-medium text-cyan-400">{label}</dt>
        <dd className="mt-1 text-md text-gray-300">{children}</dd>
    </div>
);

const Modal = ({ game, onClose }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleViewFullInfo = () => {
        onClose();
        route(`/game/${game.slug}`);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <img src={game.imageUrl} alt={game.title} className="w-full md:w-1/3 h-64 md:h-auto object-cover"/>
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <h2 className="text-3xl font-bold text-white">{game.title}</h2>
                            <p className="text-cyan-400">{game.developers.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleViewFullInfo}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
                                title="Ver información completa"
                            >
                                <span className="hidden sm:inline">Ver más</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                        <DetailItem label="Estado">{game.status}</DetailItem>
                        <DetailItem label="Fecha de Lanzamiento">{game.releaseDate}</DetailItem>
                        {game.lastUpdateDate && <DetailItem label="Última Actualización">{game.lastUpdateDate}</DetailItem>}
                        <DetailItem label="Géneros">{game.genre.join(', ')}</DetailItem>
                        <DetailItem label="Plataformas">{game.platform.join(', ')}</DetailItem>
                        <DetailItem label="Distribuidores">{game.publishers.length > 0 ? game.publishers.join(', ') : 'N/A'}</DetailItem>
                        <DetailItem label="Motor">{game.engine}</DetailItem>
                        <DetailItem label="Idiomas">{game.languages.join(', ')}</DetailItem>
                        {game.funding && <DetailItem label="Financiamiento">{game.funding}</DetailItem>}
                        {game.pitch && <div className="sm:col-span-2"><DetailItem label="Pitch">{game.pitch}</DetailItem></div>}

                        {game.stores.length > 0 && (
                            <div className="sm:col-span-2">
                                <DetailItem label="Tiendas">
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {game.stores.map(store => (
                                            <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-700 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors">
                                                {store.name} <LinkIcon />
                                            </a>
                                        ))}
                                    </div>
                                </DetailItem>
                            </div>
                        )}
                        {game.links.length > 0 && (
                            <div className="sm:col-span-2">
                                <DetailItem label="Enlaces y Redes">
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {game.links.map(link => (
                                            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-700 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors">
                                                {link.name} <LinkIcon />
                                            </a>
                                        ))}
                                    </div>
                                </DetailItem>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Modal;
import { useState } from 'preact/hooks';
import { ComponentChildren, ComponentProps } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { Game, GameStatus } from '../../types.ts';
import CloseIcon from '../icons/CloseIcon.tsx';

interface AddGamePageProps {
    onAddNewGame: (game: Omit<Game, 'id'>) => void;
    onNavigateToCatalog: () => void;
}

const initialGameState: Omit<Game, 'id'> = {
    title: '',
    platform: [],
    genre: [],
    developers: [],
    publishers: [],
    releaseDate: '',
    status: GameStatus.IN_DEVELOPMENT,
    stores: [],
    links: [],
    engine: '',
    languages: [],
    imageUrl: '',
    description: '',
    pitch: '',
    funding: '',
    presskitUrl: '',
};

interface FormCardProps {
    title: string;
    children: ComponentChildren;
}

const FormCard = ({ title, children }: FormCardProps) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-cyan-400 mb-4 border-l-4 border-cyan-400 pl-3">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

type FormInputProps = { label: string } & ComponentProps<'input'>;

const FormInput = ({ label, ...props }: FormInputProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            {...props}
            className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors duration-300"
        />
    </div>
);

type FormTextareaProps = { label: string } & ComponentProps<'textarea'>;

const FormTextarea = ({ label, ...props }: FormTextareaProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea
            {...props}
            className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors duration-300"
        ></textarea>
    </div>
);

type FormSelectProps = { label: string } & ComponentProps<'select'>;

const FormSelect = ({ label, children, ...props }: FormSelectProps) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            {...props}
            className="w-full bg-slate-700 border-2 border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors duration-300"
        >
            {children}
        </select>
    </div>
);

const AddGamePage = ({ onAddNewGame, onNavigateToCatalog }: AddGamePageProps) => {
    const [game, setGame] = useState(initialGameState);
    const [linkName, setLinkName] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [storeName, setStoreName] = useState('');
    const [storeUrl, setStoreUrl] = useState('');

    const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        setGame(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setGame(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()).filter(Boolean) }));
    };

    const handleAddLink = () => {
        if (linkName && linkUrl) {
            setGame(prev => ({ ...prev, links: [...prev.links, { name: linkName, url: linkUrl }] }));
            setLinkName('');
            setLinkUrl('');
        }
    };

    const handleRemoveLink = (index: number) => {
        setGame(prev => ({...prev, links: prev.links.filter((_, i) => i !== index)}));
    };

    const handleAddStore = () => {
        if (storeName && storeUrl) {
            setGame(prev => ({ ...prev, stores: [...prev.stores, { name: storeName, url: storeUrl }] }));
            setStoreName('');
            setStoreUrl('');
        }
    };

    const handleRemoveStore = (index: number) => {
        setGame(prev => ({...prev, stores: prev.stores.filter((_, i) => i !== index)}));
    };

    const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!game.title || !game.description || !game.imageUrl) {
            console.warn('Por favor, completa los campos obligatorios: Título, Descripción e URL de la Imagen.');
            return;
        }
        onAddNewGame(game);
    };

    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-white">Añadir Nuevo Juego</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <FormCard title="Información Básica">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Título del Juego" name="title" value={game.title} onInput={handleChange} required />
                        <FormSelect label="Estado Actual" name="status" value={game.status} onInput={handleChange}>
                            {Object.values(GameStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </FormSelect>
                    </div>
                    <FormTextarea label="Descripción Corta" name="description" value={game.description} onInput={handleChange} required />
                    <FormTextarea label="Pitch del Juego" name="pitch" value={game.pitch || ''} onInput={handleChange} />
                </FormCard>

                <FormCard title="Detalles de Desarrollo">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="Desarrolladores (separados por coma)" name="developers" value={game.developers.join(', ')} onInput={handleArrayChange} />
                        <FormInput label="Distribuidores (separados por coma)" name="publishers" value={game.publishers.join(', ')} onInput={handleArrayChange} />
                        <FormInput label="Géneros (separados por coma)" name="genre" value={game.genre.join(', ')} onInput={handleArrayChange} />
                        <FormInput label="Plataformas (separadas por coma)" name="platform" value={game.platform.join(', ')} onInput={handleArrayChange} />
                        <FormInput label="Motor de Juego" name="engine" value={game.engine} onInput={handleChange} />
                        <FormInput label="Idiomas (separados por coma)" name="languages" value={game.languages.join(', ')} onInput={handleArrayChange} />
                        <FormInput label="Fecha de Lanzamiento (texto)" name="releaseDate" value={game.releaseDate} onInput={handleChange} />
                        <FormInput label="Financiamiento" name="funding" value={game.funding || ''} onInput={handleChange} />
                    </div>
                </FormCard>

                <FormCard title="Enlaces y Multimedia">
                    <FormInput label="URL de la Imagen Principal" name="imageUrl" value={game.imageUrl} onInput={handleChange} required />
                    <FormInput label="URL del Presskit" name="presskitUrl" value={game.presskitUrl || ''} onInput={handleChange} />

                    <div>
                        <h4 className="text-lg font-semibold text-gray-300 mb-2">Tiendas</h4>
                        <div className="space-y-2">
                            {game.stores.map((store, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                                    <span className="flex-1 text-white truncate">{store.name}: {store.url}</span>
                                    <button type="button" onClick={() => handleRemoveStore(index)} className="text-red-400 hover:text-red-300"><CloseIcon /></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-4 mt-2">
                            <FormInput label="Nombre de Tienda" value={storeName} onInput={(e) => setStoreName(e.currentTarget.value)} />
                            <FormInput label="URL de Tienda" value={storeUrl} onInput={(e) => setStoreUrl(e.currentTarget.value)} />
                            <button type="button" onClick={handleAddStore} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors h-12">Añadir</button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-300 mb-2">Enlaces y Redes</h4>
                        <div className="space-y-2">
                            {game.links.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                                    <span className="flex-1 text-white truncate">{link.name}: {link.url}</span>
                                    <button type="button" onClick={() => handleRemoveLink(index)} className="text-red-400 hover:text-red-300"><CloseIcon/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-4 mt-2">
                            <FormInput label="Nombre del Enlace" value={linkName} onInput={(e) => setLinkName(e.currentTarget.value)} />
                            <FormInput label="URL del Enlace" value={linkUrl} onInput={(e) => setLinkUrl(e.currentTarget.value)} />
                            <button type="button" onClick={handleAddLink} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors h-12">Añadir</button>
                        </div>
                    </div>
                </FormCard>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onNavigateToCatalog} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Guardar Juego
                    </button>
                </div>
            </form>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .form-input-sm { padding: 0.5rem; }
                .btn-sm { padding: 0.5rem 1rem; }
            `}</style>
        </main>
    );
};

export default AddGamePage;
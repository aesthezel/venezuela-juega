import { useState } from 'preact/hooks';
import { ComponentChildren, ComponentProps } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { Game, GameStatus } from "@/src/types";
import CloseIcon from '../components/icons/CloseIcon.tsx';
import { AddGamePageProps } from "@/src/types";
import { PageTransition } from '@/src/components';

const initialGameState: Omit<Game, 'id'> = {
    title: '',
    platform: [],
    slug: '',
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
    imageCover: '',
    imageHero: '',
    description: '',
    pitch: '',
    funding: '',
    pressKitUrl: '',
};

interface FormCardProps {
    title: string;
    children: ComponentChildren;
}

const FormCard = ({ title, children }: FormCardProps) => (
    <div className="card bg-base-200 shadow-xl border border-surface-700 mb-8">
        <div className="card-body">
            <h3 className="card-title text-primary border-l-4 border-primary pl-3 mb-2">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    </div>
);

type FormInputProps = { label: string } & ComponentProps<'input'>;

const FormInput = ({ label, ...props }: FormInputProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <input
            {...props}
            className="input input-bordered w-full focus:input-primary transition-colors duration-300"
        />
    </label>
);

type FormTextareaProps = { label: string } & ComponentProps<'textarea'>;

const FormTextarea = ({ label, ...props }: FormTextareaProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <textarea
            {...props}
            className="textarea textarea-bordered w-full focus:textarea-primary transition-colors duration-300 min-h-[100px]"
        ></textarea>
    </label>
);

type FormSelectProps = { label: string } & ComponentProps<'select'>;

const FormSelect = ({ label, children, ...props }: FormSelectProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <select
            {...props}
            className="select select-bordered w-full focus:select-primary transition-colors duration-300"
        >
            {children}
        </select>
    </label>
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
        <PageTransition>
            <main className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-base-content">Añadir Nuevo Juego</h2>
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
                    <FormInput label="URL del Presskit" name="presskitUrl" value={game.pressKitUrl || ''} onInput={handleChange} />

                    <div>
                        <h4 className="text-lg font-semibold text-base-content mb-2 mt-4">Tiendas</h4>
                        <div className="space-y-2 mb-4">
                            {game.stores.map((store, index) => (
                                <div key={index} className="flex items-center gap-2 bg-base-300 p-3 rounded-lg border border-surface-700">
                                    <span className="flex-1 text-base-content truncate">{store.name}: {store.url}</span>
                                    <button type="button" onClick={() => handleRemoveStore(index)} className="btn btn-error btn-sm btn-ghost btn-square">
                                        <CloseIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col md:flex-row items-end gap-4 mt-2">
                            <FormInput label="Nombre de Tienda" value={storeName} onInput={(e) => setStoreName(e.currentTarget.value)} />
                            <FormInput label="URL de Tienda" value={storeUrl} onInput={(e) => setStoreUrl(e.currentTarget.value)} />
                            <button type="button" onClick={handleAddStore} className="btn btn-primary">Añadir</button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-base-content mb-2">Enlaces y Redes</h4>
                        <div className="space-y-2 mb-4">
                            {game.links.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 bg-base-300 p-3 rounded-lg border border-surface-700">
                                    <span className="flex-1 text-base-content truncate">{link.name}: {link.url}</span>
                                    <button type="button" onClick={() => handleRemoveLink(index)} className="btn btn-error btn-sm btn-ghost btn-square">
                                        <CloseIcon/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col md:flex-row items-end gap-4 mt-2">
                            <FormInput label="Nombre del Enlace" value={linkName} onInput={(e) => setLinkName(e.currentTarget.value)} />
                            <FormInput label="URL del Enlace" value={linkUrl} onInput={(e) => setLinkUrl(e.currentTarget.value)} />
                            <button type="button" onClick={handleAddLink} className="btn btn-primary">Añadir</button>
                        </div>
                    </div>
                </FormCard>

                <div className="flex justify-end gap-4 mb-12">
                    <button type="button" onClick={onNavigateToCatalog} className="btn btn-ghost">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success">
                        Guardar Juego
                    </button>
                </div>
            </form>
        </main>
        </PageTransition>
    );
};

export default AddGamePage;
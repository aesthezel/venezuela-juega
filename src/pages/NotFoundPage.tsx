import { RoutableProps, route } from 'preact-router';

const NotFoundPage = (_props: RoutableProps) => (
    <section className="fixed inset-0 z-10 flex items-center justify-center px-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Página no encontrada</h1>
            <p className="text-gray-400 mb-6">La ruta que intentaste abrir no existe.</p>
            <button
                onClick={() => route('/')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Ir al catálogo
            </button>
        </div>
    </section>
);

export default NotFoundPage;

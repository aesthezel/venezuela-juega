import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { GameOrigin } from '@/src/types/enums';
import { RoutableProps, route } from 'preact-router';

// Mantén el componente con props tipadas para Router
interface GameJamPlusGalleryProps extends RoutableProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}

const GameJamPlusGallery = ({ games, onGameClick }: GameJamPlusGalleryProps) => {
    // Filtrar solo los juegos de GameJamPlus 25/26
    const gameJamPlusGames = useMemo(
        () => games.filter(g => g.origin === GameOrigin.GAME_JAM_PLUS_25_26),
        [games]
    );

    if (gameJamPlusGames.length === 0) {
        return (
            <section className="p-6 text-center text-gray-400">
                No hay juegos GameJamPlus para mostrar en este momento.
            </section>
        );
    }

    return (
        <section className="my-8">
            {/* Encabezado consistente con GameJamPage.tsx */}
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">GameJam+ 25/26</h2>
                    <p className="text-gray-400">
                        Todos los juegos creados en 48H durante la gamejam de Venezuela
                    </p>
                </div>
            </div>

            {/* Lista estilizada al estilo del sitio (espaciado y presentation) */}
            <ul className="list-none p-0 m-0 space-y-6 px-4 md:px-0">
                {gameJamPlusGames.map((game) => (
                    <li key={game.id} className="group flex flex-col md:flex-row items-start gap-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-orange-500 transition-colors">
                        {/* Imagen de miniatura izquierda (o superior en móvil) */}
                        <div className="w-full md:w-48 h-28 md:h-40 flex-shrink-0 rounded overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                            {game.imageHero || game.imageCover || game.imageUrl ? (
                                <img
                                    src={game.imageHero || game.imageCover || game.imageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full" />
                            )}
                        </div>

                        {/* Contenido a la derecha (o debajo en móvil) */}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">{game.title}</h3>
                            <p className="text-sm text-gray-300">
                                {game.highlightReason || game.pitch || game.description}
                            </p>
                        </div>

                        {/* Acciones rápidas (opcional, solo en pantallas medianas hacia arriba) */}
                        <button
                            onClick={() => onGameClick(game)}
                            className="mt-2 md:mt-0 hidden md:inline-block px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded"
                        >
                            Detalles
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default GameJamPlusGallery;
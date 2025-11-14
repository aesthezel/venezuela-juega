import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { GameOrigin } from '@/src/types/enums';
import { RoutableProps, route } from 'preact-router';
import {LinkIcon, CoverImage, BackButton, PromoHeader} from '@/src/components';
import { trackEvent } from '@/src/utils/analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

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

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200">
            {/* 1. Encabezado Reutilizado de GameJamPage.tsx */}
            <PromoHeader
                title="GameJamPlus 10th Edition - 25/26"
                subtitle="¡Resultado de los juegos creados durante la jam de 48 horas!"
                subtitleMobile="Juegos realizados en menos de 48 horas"
            >
                <BackButton
                    onClick={() => route('/')}
                    className="bg-white/20 backdrop-blur hover:bg-white/30 text-white shadow-sm font-medium transition-all"
                >
                    Volver al catálogo
                </BackButton>
            </PromoHeader>

            <main className="max-w-6xl mx-auto py-10 px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <aside className="md:col-span-1">
                        <div className="sticky top-20 space-y-6">

                            <section className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl shadow-xl border border-slate-600/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                        Resultados del Jam
                                    </h3>
                                </div>
                                <div className="p-4 bg-slate-700/50 rounded-lg text-center border border-slate-600">
                                    <div className="text-5xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                                        {gameJamPlusGames.length}
                                    </div>
                                    <div className="text-sm text-gray-300">Juegos Creados</div>
                                </div>
                                <p className="text-gray-300 text-sm mt-4 opacity-90">
                                    Estos son los proyectos desarrollados durante las 48 horas del evento en la sede de Venezuela.
                                </p>
                            </section>

                            <section className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl shadow-xl border border-slate-600/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                        Únete a la comunidad
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <a
                                        href="http://link.venezuelajuega.com/discord"
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-3 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-sm group-hover:bg-indigo-400 transition-colors">💬</div>
                                        <div>
                                            <p className="text-indigo-300 font-medium text-sm">Discord</p>
                                            <p className="text-gray-400 text-xs">Únete a la conversación</p>
                                        </div>
                                    </a>
                                    <a
                                        href="https://instagram.com/venezuelajuega"
                                        target="_blank"
                                        rel="noopener"
                                        className="flex items-center gap-3 px-3 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-sm group-hover:scale-105 transition-transform">📸</div>
                                        <div>
                                            <p className="text-pink-300 font-medium text-sm">Instagram</p>
                                            <p className="text-gray-400 text-xs">Síguenos para updates</p>
                                        </div>
                                    </a>
                                </div>
                            </section>
                        </div>
                    </aside>

                    <section className="md:col-span-2">
                        <ul className="list-none p-0 m-0 space-y-6">
                            {gameJamPlusGames.map((game) => (
                                <li
                                    key={game.id}
                                    onClick={() => onGameClick(game)}
                                    className="group flex flex-col md:flex-row items-start gap-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-orange-500 transition-all duration-300 cursor-pointer hover:bg-slate-800 shadow-lg"
                                >
                                    {/* Imagen (Miniatura) */}
                                    <div className="w-full md:w-48 h-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                                        <CoverImage
                                            src={game.imageHero || game.imageCover || game.imageUrl}
                                            alt={game.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            imgClassName="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Contenido (Info, Equipo, Links) */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-2xl font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                            {game.title}
                                        </h3>

                                        {game.developers && game.developers.length > 0 && (
                                            <p className="text-sm text-orange-300 mb-3 font-medium">
                                                Por: {game.developers.join(', ')}
                                            </p>
                                        )}

                                        {game.highlightReason && (
                                            <p className="text-sm text-amber-300 italic bg-slate-700/50 p-3 rounded-lg mb-3 border-l-4 border-amber-400">
                                                "{game.highlightReason}"
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                                            {game.pitch || game.description || "Este juego aún no tiene una descripción."}
                                        </p>

                                        {game.links && game.links.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {game.links.map(link => (
                                                    <a
                                                        key={link.name}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            trackEvent('game_external_click', {
                                                                game_slug: game.slug,
                                                                game_title: game.title,
                                                                link_name: link.name,
                                                                url: link.url
                                                            });
                                                        }}
                                                        className="flex items-center gap-1.5 bg-slate-700 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors z-10 relative"
                                                        title={`Ir a ${link.name}`}
                                                    >
                                                        {link.name} <LinkIcon />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default GameJamPlusGallery;
import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import type { Game } from '@/types';
import type { JamEvent } from '../types';
import { resolveJamGames } from '../resolveJamGames';
import { JAM_GAMES_SECTION_ID } from '../scrollToJamGames';
import JamGameCard from './JamGameCard';

interface JamGamesProps {
    jam: JamEvent;
    /** Juegos de la hoja `Games` del spreadsheet de jams. */
    games?: Game[];
    onGameClick?: (game: Game) => void;
}

const JamGames = ({ jam, games = [], onGameClick }: JamGamesProps) => {
    const jamGames = useMemo(() => resolveJamGames(jam, games), [jam, games]);

    if (jamGames.length === 0) return null;

    const accentColor = jam.accentColor || '#f97316';

    const handleGameClick = (game: Game) => {
        if (onGameClick) {
            onGameClick(game);
            return;
        }

        // Fallback when the page is rendered without a modal handler:
        // go straight to the detail page remembering where we came from.
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('game_return_to', window.location.pathname);
        }
        route(`/game/${game.slug}`);
    };

    return (
        <section id={JAM_GAMES_SECTION_ID} className="py-20 px-6 bg-base-200/50 border-y border-base-300">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                        {jam.gamesTitle || 'Juegos de esta edición'}
                    </h2>
                    <p className="text-base-content/50 text-sm uppercase tracking-widest mt-2">
                        {jam.gamesSubtitle || 'Prototipos creados durante la jam'}
                    </p>
                    <span
                        className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                            color: accentColor,
                            background: `${accentColor}1a`,
                            border: `1px solid ${accentColor}35`,
                        }}
                    >
                        {jamGames.length} {jamGames.length === 1 ? 'juego' : 'juegos'}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {jamGames.map((game) => (
                        <JamGameCard
                            key={game.id}
                            game={game}
                            onGameClick={handleGameClick}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JamGames;

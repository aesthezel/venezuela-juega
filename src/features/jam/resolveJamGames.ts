import type { Game } from '@/types';
import type { JamEvent } from './types';

/**
 * Resolves the games of a jam edition from the IDs declared in its content
 * (`gameIds`), preserving the author-defined order and dropping unknown IDs.
 */
export function resolveJamGames(
    jam: Pick<JamEvent, 'gameIds'>,
    games: Game[] = []
): Game[] {
    if (!jam.gameIds?.length || games.length === 0) return [];

    const gamesById = new Map<number, Game>();
    for (const game of games) {
        gamesById.set(game.id, game);
    }

    const resolved: Game[] = [];
    for (const id of jam.gameIds) {
        const game = gamesById.get(id);
        if (game) resolved.push(game);
    }

    return resolved;
}

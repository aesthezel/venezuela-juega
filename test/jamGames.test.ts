import { describe, it, expect } from 'vitest';
import { resolveJamGames } from '../src/features/jam/resolveJamGames';
import { Game, GameStatus } from '../src/types';

const makeGame = (id: number, title = `Game ${id}`): Game => ({
    id,
    slug: `game-${id}`,
    title,
    platform: ['PC'],
    genre: ['Action'],
    developers: ['Dev'],
    publishers: [],
    releaseDate: '2026',
    status: GameStatus.RELEASED,
    stores: [],
    links: [],
    engine: 'Godot',
    languages: ['Español'],
    imageUrl: '',
    imageHero: '',
    imageCover: '',
    description: '',
});

describe('resolveJamGames', () => {
    const games = [makeGame(1), makeGame(2), makeGame(3), makeGame(4)];

    it('returns the games in the order declared by the jam', () => {
        const resolved = resolveJamGames({ gameIds: [3, 1, 2] }, games);
        expect(resolved.map(g => g.id)).toEqual([3, 1, 2]);
    });

    it('ignores IDs that are not present in the dataset', () => {
        const resolved = resolveJamGames({ gameIds: [2, 999, 4] }, games);
        expect(resolved.map(g => g.id)).toEqual([2, 4]);
    });

    it('returns an empty list when the jam declares no games', () => {
        expect(resolveJamGames({ gameIds: [] }, games)).toEqual([]);
        expect(resolveJamGames({}, games)).toEqual([]);
    });

    it('returns an empty list while game data is still loading', () => {
        expect(resolveJamGames({ gameIds: [1, 2] }, [])).toEqual([]);
    });
});

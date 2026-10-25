import { describe, it, expect } from 'vitest';
import { resolveJamGames, resolveJamEdition, type JamGameData } from '../src/features/jam/resolveJamGames';
import { Game, GameStatus } from '../src/types';

const makeGame = (
    id: number,
    uid: string | undefined,
    edition: string | undefined,
    title = `Game ${id}`
): JamGameData => ({
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
    Jam_Org_UID: uid,
    Jam_Edition: edition,
});

describe('resolveJamEdition', () => {
    it('uses the numeric edition when available', () => {
        expect(resolveJamEdition({ edition: '2026', startDate: new Date('2026-10-16T00:00:00Z') })).toBe('2026');
    });

    it('falls back to the start date year for non-numeric editions', () => {
        expect(resolveJamEdition({ edition: 'i', startDate: new Date('2026-07-24T00:00:00Z') })).toBe('2026');
    });

    it('returns an empty string when there is no edition nor start date', () => {
        expect(resolveJamEdition({ edition: '', startDate: null })).toBe('');
    });
});

describe('resolveJamGames', () => {
    const games: JamGameData[] = [
        makeGame(12, '8', '2026', 'Women Game'),
        makeGame(10, '8', '2025', 'Old Women Game'),
        makeGame(3, '6', '2026', 'GameJam+ 2026'),
        makeGame(9, '6', '2025', 'GameJam+ 2025'),
        makeGame(20, '9', '2026', 'Juntos 2026'),
        makeGame(21, '9', undefined, 'Juntos unpublished edition'),
        makeGame(1, undefined, '2026', 'No venue'),
    ];

    it('filters by venue UID and edition year, sorted by sheet id', () => {
        const resolved = resolveJamGames({ jamUid: '8', edition: '2026' }, games);
        expect(resolved.map(g => g.title)).toEqual(['Women Game']);
    });

    it('keeps games whose edition is empty (unknown edition)', () => {
        const resolved = resolveJamGames(
            { jamUid: '9', edition: 'i', startDate: new Date('2026-07-24T00:00:00Z') },
            games
        );
        expect(resolved.map(g => g.id)).toEqual([20, 21]);
    });

    it('does not mix editions of the same venue', () => {
        const resolved = resolveJamGames({ jamUid: '6', edition: '2026' }, games);
        expect(resolved.map(g => g.title)).toEqual(['GameJam+ 2026']);
    });

    it('sorts results by id regardless of the source order', () => {
        const shuffled = [makeGame(4, '6', '2026'), makeGame(2, '6', '2026'), makeGame(3, '6', '2026')];
        const resolved = resolveJamGames({ jamUid: '6', edition: '2026' }, shuffled);
        expect(resolved.map(g => g.id)).toEqual([2, 3, 4]);
    });

    it('returns an empty list without a venue UID or without games', () => {
        expect(resolveJamGames({ jamUid: undefined, edition: '2026' }, games)).toEqual([]);
        expect(resolveJamGames({ jamUid: '8', edition: '2026' }, [])).toEqual([]);
    });

    it('returns Game objects ready for the cards', () => {
        const resolved: Game[] = resolveJamGames({ jamUid: '8', edition: '2026' }, games);
        expect(resolved[0].slug).toBe('game-12');
    });
});

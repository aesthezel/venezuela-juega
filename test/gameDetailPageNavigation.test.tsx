// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/preact';
import { GameDetailPage } from '../src/pages';
import { Game, GameStatus, GameOrigin } from '../src/types';
import * as preactRouter from 'preact-router';

// Mock preact-router
vi.mock('preact-router', async () => {
    const actual = await vi.importActual<typeof preactRouter>('preact-router');
    return {
        ...actual,
        route: vi.fn(),
    };
});

// Mock hooks and SpacetimeDB
vi.mock('@/spacetimedb/connection', () => ({
    useSpacetimeDB: () => ({ connection: null, isConnected: false }),
}));

vi.mock('@/hooks', () => ({
    useGameStats: () => ({
        totalHearts: 0,
        totalVisits: 0,
        hasLiked: false,
        isFavorite: false,
        toggleLike: vi.fn(),
        toggleFavorite: vi.fn(),
        isReady: true,
    }),
    useMeasure: () => ({ ref: { current: null }, width: 800 }),
    useTextLayout: () => ({ lineCount: 2 }),
}));

describe('GameDetailPage navigation', () => {
    const catalogGame: Game = {
        id: 1,
        slug: 'catalog-game',
        title: 'Catalog Game',
        platform: ['PC'],
        genre: ['Action'],
        developers: ['Dev One'],
        publishers: [],
        releaseDate: '2024',
        status: GameStatus.RELEASED,
        stores: [],
        links: [],
        engine: 'Godot',
        languages: ['Spanish'],
        imageUrl: '',
        imageHero: '',
        imageCover: '',
        description: 'Catalog game description',
        origin: GameOrigin.FROM_HOME,
    };

    const jamGame: Game = {
        id: 2,
        slug: 'jam-game',
        title: 'Jam Game',
        platform: ['Web'],
        genre: ['Puzzle'],
        developers: ['Jam Dev'],
        publishers: [],
        releaseDate: '2024',
        status: GameStatus.PROTOTYPE,
        stores: [],
        links: [],
        engine: 'Unity',
        languages: ['Spanish'],
        imageUrl: '',
        imageHero: '',
        imageCover: '',
        description: 'Jam game description',
        origin: GameOrigin.GAME_JAM,
        Jam_Org_UID: 'GJ2024',
        Jam_Edition: '2024',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('navigates to /jams when "Volver a la lista" is clicked on a jam game', () => {
        const { getByRole } = render(
            <GameDetailPage gameSlug="jam-game" games={[catalogGame, jamGame]} />
        );

        const backButton = getByRole('button', { name: /Volver a la lista/i });
        fireEvent.click(backButton);

        expect(preactRouter.route).toHaveBeenCalledWith('/jams');
    });

    it('navigates to / when "Volver a la lista" is clicked on a catalog game', () => {
        const { getByRole } = render(
            <GameDetailPage gameSlug="catalog-game" games={[catalogGame, jamGame]} />
        );

        const backButton = getByRole('button', { name: /Volver a la lista/i });
        fireEvent.click(backButton);

        expect(preactRouter.route).toHaveBeenCalledWith('/');
    });

    it('prioritizes stored return route in sessionStorage when available', () => {
        sessionStorage.setItem('game_return_to', '/jams');

        const { getByRole } = render(
            <GameDetailPage gameSlug="catalog-game" games={[catalogGame, jamGame]} />
        );

        const backButton = getByRole('button', { name: /Volver a la lista/i });
        fireEvent.click(backButton);

        expect(preactRouter.route).toHaveBeenCalledWith('/jams');
        expect(sessionStorage.getItem('game_return_to')).toBeNull();
    });
});

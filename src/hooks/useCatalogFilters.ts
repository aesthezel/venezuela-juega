import { useReducer, useMemo } from 'preact/hooks';
import { Game, ViewMode } from '@/types';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface FilterState {
    searchTerm: string;
    activeFilters: Record<string, string[]>;
    yearRange: { min: number; max: number } | null;
    isYearFilterManuallySet: boolean;
}

export type FilterAction =
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'TOGGLE_FILTER'; category: string; value: string }
    | { type: 'CLEAR_CATEGORY'; category: string }
    | { type: 'CLEAR_ALL' }
    | { type: 'SET_YEAR_RANGE'; range: { min: number; max: number } };

// ─── Reducer ────────────────────────────────────────────────────────────────

const INITIAL_FILTERS: Record<string, string[]> = {
    status: [], genre: [], platform: [], stores: [], origin: [], highlighted: [],
};

export const INITIAL_FILTER_STATE: FilterState = {
    searchTerm: '',
    activeFilters: INITIAL_FILTERS,
    yearRange: null,
    isYearFilterManuallySet: false,
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, searchTerm: action.payload };

        case 'TOGGLE_FILTER': {
            const current = state.activeFilters[action.category] ?? [];
            const next = current.includes(action.value)
                ? current.filter(v => v !== action.value)
                : [...current, action.value];
            return { ...state, activeFilters: { ...state.activeFilters, [action.category]: next } };
        }

        case 'CLEAR_CATEGORY':
            return { ...state, activeFilters: { ...state.activeFilters, [action.category]: [] } };

        case 'CLEAR_ALL':
            return {
                ...state,
                activeFilters: { ...INITIAL_FILTERS },
                yearRange: null,
                isYearFilterManuallySet: false,
            };

        case 'SET_YEAR_RANGE':
            return { ...state, yearRange: action.range, isYearFilterManuallySet: true };

        default:
            return state;
    }
}

// ─── Pure filtering logic ────────────────────────────────────────────────────

function applyFilters(games: Game[], state: FilterState): Game[] {
    const { searchTerm, activeFilters, yearRange, isYearFilterManuallySet } = state;

    return games.filter((game: Game) => {
        const s = searchTerm.toLowerCase();
        const searchMatch = s === '' ||
            game.title.toLowerCase().includes(s) ||
            game.developers.some((dev: string) => dev.toLowerCase().includes(s)) ||
            game.description.toLowerCase().includes(s);

        const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(game.status);
        const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.some((f: string) => game.genre.includes(f));
        const platformMatch = activeFilters.platform.length === 0 || activeFilters.platform.some((f: string) => game.platform.includes(f));
        const storeMatch = activeFilters.stores.length === 0 || activeFilters.stores.some((f: string) => game.stores.some((s: any) => s.name === f));
        const originMatch = activeFilters.origin.length === 0 || (!!game.origin && activeFilters.origin.includes(game.origin));
        const highlightedMatch = activeFilters.highlighted.length === 0 || (activeFilters.highlighted.includes('true') && !!game.isHighlighted);

        const releaseYearMatch = game.releaseDate.match(/\b\d{4}\b/);
        const releaseYear = releaseYearMatch ? parseInt(releaseYearMatch[0], 10) : null;
        const yearMatch = !isYearFilterManuallySet || !yearRange || (
            releaseYear !== null && releaseYear >= yearRange.min && releaseYear <= yearRange.max
        );

        return searchMatch && statusMatch && genreMatch && platformMatch && storeMatch && originMatch && yearMatch && highlightedMatch;
    });
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface CatalogFiltersResult {
    filteredGames: Game[];
    state: FilterState;
    dispatch: (action: FilterAction) => void;
    // Derived catalog-page props
    allGenres: string[];
    allPlatforms: string[];
    allStores: string[];
    allOrigins: string[];
    minYear: number;
    maxYear: number;
    // Convenience handlers (stable references via dispatch)
    handleSearchChange: (value: string) => void;
    handleFilterChange: (category: string, value: string) => void;
    handleClearCategory: (category: string) => void;
    handleClearAll: () => void;
    handleYearRangeChange: (range: { min: number; max: number }) => void;
}

export function useCatalogFilters(games: Game[]): CatalogFiltersResult {
    const [state, dispatch] = useReducer(filterReducer, INITIAL_FILTER_STATE);

    const filteredGames = useMemo(() => applyFilters(games, state), [games, state]);

    const allGenres = useMemo(
        () => Array.from(new Set(games.flatMap((g: Game) => g.genre))),
        [games]
    );
    const allPlatforms = useMemo(
        () => Array.from(new Set(games.flatMap((g: Game) => g.platform))),
        [games]
    );
    const allStores = useMemo(
        () => Array.from(new Set(games.flatMap((g: Game) => g.stores.map((s: any) => s.name)))),
        [games]
    );
    const allOrigins = useMemo(
        () => Array.from(new Set(games.map((g: Game) => g.origin).filter(Boolean) as string[])),
        [games]
    );

    const { minYear, maxYear } = useMemo(() => {
        if (games.length === 0) return { minYear: 1980, maxYear: new Date().getFullYear() };
        const years = games
            .map(g => { const m = g.releaseDate.match(/\b\d{4}\b/); return m ? parseInt(m[0], 10) : null; })
            .filter((y): y is number => y !== null);
        return {
            minYear: years.length > 0 ? Math.min(...years) : 1980,
            maxYear: years.length > 0 ? Math.max(...years, new Date().getFullYear()) : new Date().getFullYear(),
        };
    }, [games]);

    // Stable handler references (dispatch identity is stable)
    const handleSearchChange = (value: string) => dispatch({ type: 'SET_SEARCH', payload: value });
    const handleFilterChange = (category: string, value: string) => dispatch({ type: 'TOGGLE_FILTER', category, value });
    const handleClearCategory = (category: string) => dispatch({ type: 'CLEAR_CATEGORY', category });
    const handleClearAll = () => dispatch({ type: 'CLEAR_ALL' });
    const handleYearRangeChange = (range: { min: number; max: number }) => dispatch({ type: 'SET_YEAR_RANGE', range });

    return {
        filteredGames,
        state,
        dispatch,
        allGenres,
        allPlatforms,
        allStores,
        allOrigins,
        minYear,
        maxYear,
        handleSearchChange,
        handleFilterChange,
        handleClearCategory,
        handleClearAll,
        handleYearRangeChange,
    };
}

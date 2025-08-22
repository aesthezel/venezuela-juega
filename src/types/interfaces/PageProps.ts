import { Game } from './Game';

export interface CatalogPageProps {
    /** The path for routing purposes */
    path?: string;
}

export interface CalendarPageProps {
    /** The path for routing purposes */
    path?: string;
    /** List of games to display in the calendar */
    games: Game[];
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
    /** Function to handle clicking on a calendar event */
    onEventClick: (game: Game) => void;
}

export interface ChartsPageProps {
    /** The path for routing purposes */
    path?: string;
    /** List of games to display in the charts */
    games: Game[];
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}

export interface AboutPageProps {
    /** The path for routing purposes */
    path?: string;
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}

export interface GameDetailPageProps {
    /** The path for routing purposes */
    path?: string;
    /** List of all games */
    games: Game[];
    /** The slug of the game to display */
    gameSlug?: string;
}

export interface AddGamePageProps {
    /** The path for routing purposes */
    path?: string;
    /** Function to handle adding a new game */
    onAddNewGame: (newGameData: Omit<Game, 'id' | 'slug'>) => void;
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}

export interface CatalogPageProps {
    path?: string;
    games: Game[];
    filteredGames: Game[];
    allGenres: string[];
    allPlatforms: string[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeFilters: Record<string, string[]>;
    onFilterChange: (category: string, value: string) => void;
    onClearCategory: (category: string) => void;
    onClearAllFilters: () => void;
    onGameClick: (game: Game) => void;
    minYear: number;
    maxYear: number;
    yearRange: { min: number; max: number } | null;
    onYearRangeChange: (range: { min: number; max: number }) => void;
}
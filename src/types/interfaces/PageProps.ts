import { Game } from './Game';

/**
 * Props for the Catalog Page component.
 * 
 * This interface defines the properties that can be passed to the Catalog Page component.
 */
export interface CatalogPageProps {
    /** The path for routing purposes */
    path?: string;
}

/**
 * Props for the Calendar Page component.
 * 
 * This interface defines the properties that can be passed to the Calendar Page component.
 */
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

/**
 * Props for the Charts Page component.
 * 
 * This interface defines the properties that can be passed to the Charts Page component.
 */
export interface ChartsPageProps {
    /** The path for routing purposes */
    path?: string;
    /** List of games to display in the charts */
    games: Game[];
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}

/**
 * Props for the About Page component.
 * 
 * This interface defines the properties that can be passed to the About Page component.
 */
export interface AboutPageProps {
    /** The path for routing purposes */
    path?: string;
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}

/**
 * Props for the Game Detail Page component.
 * 
 * This interface defines the properties that can be passed to the Game Detail Page component.
 */
export interface GameDetailPageProps {
    /** The path for routing purposes */
    path?: string;
    /** List of all games */
    games: Game[];
    /** The slug of the game to display */
    gameSlug?: string;
}

/**
 * Props for the Add Game Page component.
 * 
 * This interface defines the properties that can be passed to the Add Game Page component.
 */
export interface AddGamePageProps {
    /** The path for routing purposes */
    path?: string;
    /** Function to handle adding a new game */
    onAddNewGame: (newGameData: Omit<Game, 'id' | 'slug'>) => void;
    /** Function to handle navigation back to the catalog */
    onNavigateToCatalog: () => void;
}
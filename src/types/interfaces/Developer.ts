import { Game } from './Game';

/**
 * Represents a game developer or studio in the Venezuela Juega catalog.
 *
 * This interface is derived at runtime from the `developers` field of each game.
 * It aggregates all games associated with a given developer name.
 */
export interface Developer {
    /** Developer/studio name as it appears in the spreadsheet */
    name: string;

    /** URL-friendly version of the developer name */
    slug: string;

    /** Games from the main catalog */
    games: Game[];

    /** Games from Game Jam events */
    jamGames: Game[];

    /** Combined list of all games (catalog + jams) */
    allGames: Game[];

    /** Names of other developers who share games with this developer */
    coDevs: string[];

    /** Unique platforms across all games */
    platforms: string[];

    /** Unique genres across all games */
    genres: string[];

    /** Unique engines used across all games */
    engines: string[];

    /** Total number of games */
    gameCount: number;

    /** Earliest release date among all games */
    firstRelease?: string;

    /** Most recent release date among all games */
    latestRelease?: string;
}

import { GameStatus } from '../enums';

/**
 * Represents a video game in the Venezuela Juega catalog.
 * 
 * This interface defines the structure of a game object, including all its properties
 * such as title, platform, genre, and development status.
 */
export interface Game {
    /** Unique identifier for the game */
    id: number;

    /** URL-friendly version of the game title */
    slug: string;

    /** The title of the game */
    title: string;

    /** List of platforms the game is available on */
    platform: string[];

    /** List of genres the game belongs to */
    genre: string[];

    /** List of developers who created the game */
    developers: string[];

    /** List of publishers who distribute the game */
    publishers: string[];

    /** Release date of the game */
    releaseDate: string;

    /** Date of the last update to the game */
    lastUpdateDate?: string;

    /** Current development status of the game */
    status: GameStatus;

    /** List of stores where the game can be purchased */
    stores: { name: string; url: string }[];

    /** List of related links for the game */
    links: { name: string; url: string }[];

    /** URL to the game's press kit */
    pressKitUrl?: string;

    /** Short description or tagline for the game */
    pitch?: string;

    /** Information about how the game was funded */
    funding?: string;

    /** Game engine used to develop the game */
    engine: string;

    /** Languages the game is available in */
    languages: string[];

    /** URL to the game's cover image */
    imageUrl: string;
    imageHero: string;
    imageCover: string;

    /** Detailed description of the game */
    description: string;

    /** Whether the game is featured in the highlights section */
    isHighlighted?: boolean;

    /** Screenshots URLs for the game (empty if none) */
    screenshots?: string[];
}
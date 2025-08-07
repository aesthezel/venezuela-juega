import {GameStatus} from "@/types.ts";

export interface Game {
    id: number;
    slug: string;
    title: string;
    platform: string[];
    genre: string[];
    developers: string[];
    publishers: string[];
    releaseDate: string;
    lastUpdateDate?: string;
    status: GameStatus;
    stores: { name: string; url: string }[];
    links: { name: string; url: string }[];
    pressKitUrl?: string;
    pitch?: string;
    funding?: string;
    engine: string;
    languages: string[];
    imageUrl: string;
    description: string;
    isHighlighted?: boolean;
}
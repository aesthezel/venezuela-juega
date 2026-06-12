/** Event lifecycle stage (computed from dates unless overridden by the sheet). */
export type EventStatus = 'upcoming' | 'live' | 'finished';

/**
 * Event row from the `events` Google Sheet, normalized.
 * Sheet headers are snake_case; here we expose camelCase to the TS app.
 */
export interface VjEvent {
    eventId: string;            // PK / route segment
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    isFeatured: boolean;
    statusOverride?: EventStatus;

    twitchChannel?: string;
    youtubeVideoId?: string;
    youtubePlaylistId?: string;

    imageBanner: string;
    imageThumb?: string;

    jamEdition?: string;        // matches JamGame.Jam_Edition to pick participating games

    hostOrg?: string;
    hostUrl?: string;
    location?: string;
    externalUrl?: string;
    tags: string[];

    createdAt?: string;
    updatedAt?: string;
}

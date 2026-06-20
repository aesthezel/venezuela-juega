import { useEffect, useState } from 'preact/hooks';
import Papa from 'papaparse';
import type { VjEvent, EventStatus } from './types';
import { normalizeNull, parseBool, parseTags, parseISODate } from './eventUtils';

interface EventsState {
    events: VjEvent[];
    loading: boolean;
    error: string | null;
}

// ─── Cache singleton — evita fetches duplicados entre múltiples consumidores ───
// El hook puede llamarse desde Header, EventBanner, EventsListPage, EventDetailPage
// simultáneamente. Sin cache, cada uno dispara su propio fetch CSV.
let cachedEvents: VjEvent[] | null = null;
let cachedError: string | null = null;
let inFlight: Promise<void> | null = null;
const subscribers = new Set<() => void>();

const parseRows = (rows: Record<string, string>[]): VjEvent[] => {
    const parsed: VjEvent[] = [];
    for (const row of rows) {
        const eventId = normalizeNull(row['event_id']);
        const name = normalizeNull(row['name']);
        if (!eventId || !name) continue;

        const start = parseISODate(row['start_date']);
        const end = parseISODate(row['end_date']);
        if (!start || !end) continue;

        const overrideRaw = normalizeNull(row['status_override'])?.toLowerCase();
        const statusOverride = (overrideRaw === 'upcoming' || overrideRaw === 'live' || overrideRaw === 'finished')
            ? (overrideRaw as EventStatus)
            : undefined;

        parsed.push({
            eventId,
            name,
            description: normalizeNull(row['description']) ?? '',
            startDate: start,
            endDate: end,
            isFeatured: parseBool(row['is_featured']),
            statusOverride,
            twitchChannel: normalizeNull(row['twitch_channel']),
            youtubeVideoId: normalizeNull(row['youtube_video_id']),
            youtubePlaylistId: normalizeNull(row['youtube_playlist_id']),
            imageBanner: normalizeNull(row['image_banner']) ?? '',
            imageThumb: normalizeNull(row['image_thumb']),
            jamEdition: normalizeNull(row['jam_edition']),
            hostOrg: normalizeNull(row['host_org']),
            hostUrl: normalizeNull(row['host_url']),
            location: normalizeNull(row['location']),
            externalUrl: normalizeNull(row['external_url']),
            tags: parseTags(row['tags']),
            createdAt: normalizeNull(row['created_at']),
            updatedAt: normalizeNull(row['updated_at']),
        });
    }
    return parsed;
};

const fetchOnce = (): Promise<void> => {
    if (cachedEvents !== null || cachedError !== null) return Promise.resolve();
    if (inFlight) return inFlight;

    const SHEET_ID = import.meta.env.VITE_EVENTSSHEET_ID;
    const SHEET_NAME = import.meta.env.VITE_EVENTSSHEET_NAME || 'events';
    if (!SHEET_ID) {
        cachedError = 'Events sheet ID not configured (VITE_EVENTSSHEET_ID).';
        subscribers.forEach(cb => cb());
        return Promise.resolve();
    }
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

    inFlight = new Promise<void>((resolve) => {
        Papa.parse<Record<string, string>>(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                cachedEvents = parseRows(results.data || []);
                subscribers.forEach(cb => cb());
                resolve();
            },
            error: (err: unknown) => {
                cachedError = err instanceof Error ? err.message : 'No se pudo cargar la hoja de eventos.';
                subscribers.forEach(cb => cb());
                resolve();
            },
        });
    });
    return inFlight;
};

/**
 * Reads the `events` Google Sheet (CSV).
 * Module-level cache: el primer consumidor monta el fetch; los demás reusan.
 */
export const useEventsData = (): EventsState => {
    const [, tick] = useState(0);

    useEffect(() => {
        const cb = () => tick(n => n + 1);
        subscribers.add(cb);
        fetchOnce();
        return () => { subscribers.delete(cb); };
    }, []);

    return {
        events: cachedEvents ?? [],
        loading: cachedEvents === null && cachedError === null,
        error: cachedError,
    };
};

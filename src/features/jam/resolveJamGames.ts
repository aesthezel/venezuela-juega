import type { Game } from '@/types';
import type { JamEvent } from './types';

/** Minimal shape of a jam game row (hoja `Games`). */
export interface JamGameData extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}

/**
 * Edition year used to filter a jam's games:
 * - the jam `edition` when it is a four-digit year (e.g. "2026");
 * - otherwise the year of the jam start date (e.g. Juntos, `edition: i`).
 */
export function resolveJamEdition(
    jam: Pick<JamEvent, 'edition' | 'startDate'>
): string {
    const edition = String(jam.edition ?? '').trim();
    if (/^\d{4}$/.test(edition)) return edition;

    if (jam.startDate) {
        const year = new Date(jam.startDate).getFullYear();
        if (!Number.isNaN(year)) return String(year);
    }

    return '';
}

/**
 * Resolves the games of a jam edition from its venue UID (`JamSettings` sheet)
 * and edition year. Games without `Jam_Edition` are kept since the sheet does
 * not always fill that column.
 *
 * @param jam Jam content definition (needs `jamUid`, `edition` and `startDate`).
 * @param games Games parsed from the jam spreadsheet.
 */
export function resolveJamGames(
    jam: Pick<JamEvent, 'jamUid' | 'edition' | 'startDate'>,
    games: JamGameData[] = []
): Game[] {
    const uid = String(jam.jamUid ?? '').trim();
    if (!uid || games.length === 0) return [];

    const edition = resolveJamEdition(jam);

    return games
        .filter((game) => {
            if (String(game.Jam_Org_UID ?? '').trim() !== uid) return false;

            const gameEdition = String(game.Jam_Edition ?? '').trim();
            return !edition || !gameEdition || gameEdition === edition;
        })
        .sort((a, b) => a.id - b.id);
}

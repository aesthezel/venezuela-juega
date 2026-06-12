import type { EventStatus, VjEvent } from './types';

/** Treat empty / "null" / "NULL" strings as undefined. */
export const normalizeNull = (s: string | undefined | null): string | undefined => {
    if (s == null) return undefined;
    const t = String(s).trim();
    if (!t || t.toLowerCase() === 'null') return undefined;
    return t;
};

export const parseBool = (s: string | undefined): boolean => {
    const v = normalizeNull(s)?.toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
};

/** Tags column is `;`-separated to avoid clashing with CSV commas. */
export const parseTags = (s: string | undefined): string[] => {
    const v = normalizeNull(s);
    if (!v) return [];
    return v.split(';').map(x => x.trim()).filter(Boolean);
};

/** Parse `YYYY-MM-DD` (sheet ISO) into a UTC-midnight Date; returns null if invalid. */
export const parseISODate = (s: string | undefined): Date | null => {
    const v = normalizeNull(s);
    if (!v) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
    if (!m) {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    return isNaN(d.getTime()) ? null : d;
};

/** Status from dates, unless sheet provides an explicit override. */
export const computeStatus = (
    start: Date,
    end: Date,
    override: EventStatus | undefined,
    now: Date,
): EventStatus => {
    if (override) return override;
    // Treat end as inclusive (end of that day).
    const endInclusive = new Date(end.getTime() + 24 * 60 * 60 * 1000 - 1);
    if (now < start) return 'upcoming';
    if (now <= endInclusive) return 'live';
    return 'finished';
};

/**
 * Banner rule: event qualifies if it's currently live OR starts within the next 7 days.
 */
export const isWithinNextWeek = (event: VjEvent, now: Date = new Date()): boolean => {
    const status = computeStatus(event.startDate, event.endDate, event.statusOverride, now);
    if (status === 'live') return true;
    if (status !== 'upcoming') return false;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    return event.startDate.getTime() - now.getTime() <= sevenDaysMs;
};

/**
 * Pick the event to show in the home banner: featured first, else the soonest active.
 * Returns null if none qualify.
 */
export const pickBannerEvent = (events: VjEvent[], now: Date = new Date()): VjEvent | null => {
    const eligible = events.filter(e => isWithinNextWeek(e, now));
    if (!eligible.length) return null;
    const featured = eligible.find(e => e.isFeatured);
    if (featured) return featured;
    // Soonest start as tiebreaker.
    return [...eligible].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
};

/**
 * Return ALL eligible events for the home banner carousel.
 * Order: featured first (in start-date order), then non-featured by start-date asc.
 */
export const pickBannerEvents = (events: VjEvent[], now: Date = new Date()): VjEvent[] => {
    const eligible = events.filter(e => isWithinNextWeek(e, now));
    const byStart = (a: VjEvent, b: VjEvent) => a.startDate.getTime() - b.startDate.getTime();
    const featured = eligible.filter(e => e.isFeatured).sort(byStart);
    const rest = eligible.filter(e => !e.isFeatured).sort(byStart);
    return [...featured, ...rest];
};

export const statusLabel = (s: EventStatus): string => {
    if (s === 'live') return 'EN VIVO';
    if (s === 'upcoming') return 'PRÓXIMO';
    return 'FINALIZADO';
};

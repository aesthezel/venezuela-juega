/**
 * Anchor id of the "Juegos de esta edición" section rendered on jam pages.
 */
export const JAM_GAMES_SECTION_ID = 'juegos';

function scrollToSection(): boolean {
    if (typeof document === 'undefined') return false;

    const section = document.getElementById(JAM_GAMES_SECTION_ID);
    if (!section) return false;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
}

/**
 * Smooth-scrolls to the jam games section.
 *
 * The section only exists once the jam games data is available, so when it is
 * not mounted yet we retry for a short period (e.g. slow spreadsheet fetch).
 *
 * @returns `true` when the section was found on the first attempt.
 */
export function scrollToJamGames(retryMs = 2500): boolean {
    if (scrollToSection()) return true;

    if (typeof window === 'undefined') return false;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
        if (scrollToSection() || Date.now() - startedAt > retryMs) {
            window.clearInterval(timer);
        }
    }, 200);

    return false;
}

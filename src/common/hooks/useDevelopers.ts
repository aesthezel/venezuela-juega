import { useMemo } from 'preact/hooks';
import { Game, Developer } from '@/types';
import { generateSlug } from '@/utils';

/**
 * Normalizes a developer name for grouping purposes.
 * Trims whitespace and lowercases to avoid duplicates from casing differences.
 */
const normalizeName = (name: string): string => name.trim().toLowerCase();

/**
 * Parses a date string and returns a sortable timestamp.
 * Returns NaN for unparseable dates so they can be filtered out.
 */
const parseDate = (dateStr?: string): number => {
    if (!dateStr || dateStr === 'No especificada') return NaN;
    return new Date(dateStr).getTime();
};

/**
 * Hook that derives developer/studio data from the existing game lists.
 *
 * Groups games by developer name (normalized with trim + lowercase),
 * computes co-developers, aggregated stats, and generates URL slugs.
 *
 * @param games - Main catalog games
 * @param jamGames - Game Jam games
 */
export const useDevelopers = (games: Game[], jamGames: Game[]) => {
    const developers = useMemo<Developer[]>(() => {
        // Map: normalized name → { originalName, catalogGames, jamGames }
        const devMap = new Map<string, {
            displayName: string;
            catalogGames: Game[];
            jamGames: Game[];
        }>();

        const addGame = (game: Game, isJam: boolean) => {
            for (const rawName of game.developers) {
                const key = normalizeName(rawName);
                if (!key) continue;

                let entry = devMap.get(key);
                if (!entry) {
                    // Use the first occurrence as the display name
                    entry = { displayName: rawName.trim(), catalogGames: [], jamGames: [] };
                    devMap.set(key, entry);
                }

                if (isJam) {
                    entry.jamGames.push(game);
                } else {
                    entry.catalogGames.push(game);
                }
            }
        };

        // Process all games
        for (const game of games) addGame(game, false);
        for (const game of jamGames) addGame(game, true);

        // Build Developer objects
        const result: Developer[] = [];

        for (const [, entry] of devMap) {
            const allGames = [...entry.catalogGames, ...entry.jamGames];

            // Compute co-developers: other dev names that appear on the same games
            const coDevSet = new Set<string>();
            for (const game of allGames) {
                for (const rawName of game.developers) {
                    const normalized = normalizeName(rawName);
                    if (normalized !== normalizeName(entry.displayName)) {
                        coDevSet.add(rawName.trim());
                    }
                }
            }

            // Unique platforms, genres, engines
            const platforms = [...new Set(allGames.flatMap(g => g.platform))];
            const genres = [...new Set(allGames.flatMap(g => g.genre))];
            const engines = [...new Set(allGames.map(g => g.engine).filter(e => e && e !== 'No especificado'))];

            // Date range
            const dates = allGames
                .map(g => parseDate(g.releaseDate))
                .filter(d => !isNaN(d));
            const firstRelease = dates.length > 0
                ? new Date(Math.min(...dates)).toLocaleDateString('es-VE')
                : undefined;
            const latestRelease = dates.length > 0
                ? new Date(Math.max(...dates)).toLocaleDateString('es-VE')
                : undefined;

            result.push({
                name: entry.displayName,
                slug: generateSlug(entry.displayName),
                games: entry.catalogGames,
                jamGames: entry.jamGames,
                allGames,
                coDevs: [...coDevSet],
                platforms,
                genres,
                engines,
                gameCount: allGames.length,
                firstRelease,
                latestRelease,
            });
        }

        // Sort by game count descending, then alphabetically
        result.sort((a, b) => b.gameCount - a.gameCount || a.name.localeCompare(b.name));

        return result;
    }, [games, jamGames]);

    const getDeveloperBySlug = useMemo(() => {
        const slugMap = new Map<string, Developer>();
        for (const dev of developers) {
            slugMap.set(dev.slug, dev);
        }
        return (slug: string): Developer | undefined => {
            const normalized = decodeURIComponent(slug).trim().toLowerCase();
            return slugMap.get(normalized);
        };
    }, [developers]);

    return { developers, getDeveloperBySlug };
};

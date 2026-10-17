import type { JamObjective, JamSponsor, JamPhase, JamFAQ, JamPrize } from '../types';
import { parseH3Sections } from '@/common/markdown/blockParser';

export {
    extractDirectiveBlocks,
    parseBlockParams,
    stripDirectiveBlocks,
    parseH3Sections,
} from '@/common/markdown/blockParser';
export type { DirectiveBlock } from '@/common/markdown/blockParser';

import type { DirectiveBlock } from '@/common/markdown/blockParser';

/**
 * Parses Objectives from `:::about` or `:::objectives`
 */
export function parseObjectives(block: DirectiveBlock): JamObjective[] {
    const sections = parseH3Sections(block.content);
    return sections.map((sec) => ({
        title: sec.title,
        icon: sec.icon,
        description: sec.body,
    }));
}

/**
 * Parses Sponsors from `:::sponsors`
 * Format:
 * - name: Global Game Jam
 *   logo: https://...
 *   url: https://...
 * OR
 * - Global Game Jam | https://logo-url | https://site-url
 */
export function parseSponsors(block: DirectiveBlock): JamSponsor[] {
    const sponsors: JamSponsor[] = [];
    const lines = block.content.split(/\r?\n/);

    let currentSponsor: Partial<JamSponsor> | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Pipe delimited shorthand: "- Name | Logo | Url"
        if (trimmed.startsWith('-') && trimmed.includes('|')) {
            const clean = trimmed.replace(/^-\s*/, '');
            const parts = clean.split('|').map((s) => s.trim());
            if (parts.length >= 2) {
                let height: number | undefined = undefined;
                if (parts[3]) {
                    const parsed = Number(parts[3]);
                    if (!isNaN(parsed) && parsed > 0) height = parsed;
                }
                sponsors.push({
                    name: parts[0],
                    logo: parts[1],
                    url: parts[2] || undefined,
                    height,
                });
            }
            continue;
        }

        // YAML-like list items
        if (trimmed.startsWith('- name:') || trimmed.startsWith('- Name:')) {
            if (currentSponsor && currentSponsor.name && currentSponsor.logo) {
                sponsors.push(currentSponsor as JamSponsor);
            }
            const name = trimmed.replace(/^-\s*[nN]ame:\s*/, '').trim();
            currentSponsor = { name };
        } else if (trimmed.startsWith('logo:') || trimmed.startsWith('Logo:')) {
            const logo = trimmed.replace(/^[lL]ogo:\s*/, '').trim();
            if (currentSponsor) currentSponsor.logo = logo;
        } else if (trimmed.startsWith('url:') || trimmed.startsWith('Url:')) {
            const url = trimmed.replace(/^[uU]rl:\s*/, '').trim();
            if (currentSponsor) currentSponsor.url = url;
        } else if (trimmed.startsWith('height:') || trimmed.startsWith('Height:')) {
            const parsed = Number(trimmed.replace(/^[hH]eight:\s*/, '').trim());
            if (!isNaN(parsed) && parsed > 0 && currentSponsor) currentSponsor.height = parsed;
        }
    }

    if (currentSponsor && currentSponsor.name && currentSponsor.logo) {
        sponsors.push(currentSponsor as JamSponsor);
    }

    return sponsors;
}

/**
 * Parses Phases / Schedule from `:::schedule` or `:::phases`
 * Format:
 * - [📝 Inscripciones](2026-07-14T00:00:00-04:00 -> 2026-07-23T23:59:59-04:00): Regístrate en itch.io
 * OR
 * ### 📝 Inscripciones
 * Dates: 2026-07-14 -> 2026-07-23
 * Description...
 */
export function parseSchedule(block: DirectiveBlock): JamPhase[] {
    const phases: JamPhase[] = [];
    const lines = block.content.split(/\r?\n/);

    // Check for bullet list format: - [Icon Label](dateStart -> dateEnd): Description
    const listRegex = /^-\s*(?:\[([^\]]+)\])?\s*(?:\(([^)]+)\))?\s*:\s*(.*)$/;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const match = trimmed.match(listRegex);
        if (match) {
            const rawLabel = match[1] || '';
            const rawDates = match[2] || '';
            const description = match[3] || '';

            let icon: string | undefined = undefined;
            let label = rawLabel;

            const emojiMatch = rawLabel.match(/^([\p{Extended_Pictographic}\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]+)\s*(.*)$/u);
            if (emojiMatch && emojiMatch[2]) {
                icon = emojiMatch[1].trim();
                label = emojiMatch[2].trim();
            }

            let startDate: Date | null = null;
            let endDate: Date | null = null;

            if (rawDates) {
                const dateParts = rawDates.split(/->|—|to/).map((d) => d.trim());
                if (dateParts[0]) {
                    const sd = new Date(dateParts[0]);
                    if (!isNaN(sd.getTime())) startDate = sd;
                }
                if (dateParts[1]) {
                    const ed = new Date(dateParts[1]);
                    if (!isNaN(ed.getTime())) endDate = ed;
                }
            }

            phases.push({
                label,
                icon,
                startDate,
                endDate,
                description,
            });
        }
    }

    // Fallback to H3 if no list items matched
    if (phases.length === 0) {
        const sections = parseH3Sections(block.content);
        for (const sec of sections) {
            phases.push({
                label: sec.title,
                icon: sec.icon,
                description: sec.body,
            });
        }
    }

    return phases;
}

/**
 * Parses FAQs from `:::faq` or `:::faqs`
 * Format:
 * ### Question?
 * Answer...
 */
export function parseFAQs(block: DirectiveBlock): JamFAQ[] {
    const sections = parseH3Sections(block.content);
    return sections.map((sec) => ({
        question: sec.title,
        answer: sec.body,
    }));
}

/**
 * Parses Prizes from `:::prizes`
 */
export function parsePrizes(block: DirectiveBlock): JamPrize[] {
    const sections = parseH3Sections(block.content);
    return sections.map((sec) => {
        const lines = sec.body.split(/\r?\n/);
        let explicitEmoji: string | undefined = undefined;
        let color = 'secondary';
        const descLines: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('Emoji:') || trimmed.startsWith('emoji:')) {
                explicitEmoji = trimmed.replace(/^[eE]moji:\s*/, '').trim();
            } else if (trimmed.startsWith('Color:') || trimmed.startsWith('color:')) {
                color = trimmed.replace(/^[cC]olor:\s*/, '').trim();
            } else if (trimmed.startsWith('Descripción:') || trimmed.startsWith('description:')) {
                descLines.push(trimmed.replace(/^(?:[dD]escripción|[dD]escription):\s*/, '').trim());
            } else {
                descLines.push(trimmed);
            }
        }

        return {
            category: sec.title,
            emoji: explicitEmoji || sec.icon || '🏆',
            color,
            description: descLines.filter(Boolean).join('\n'),
        };
    });
}

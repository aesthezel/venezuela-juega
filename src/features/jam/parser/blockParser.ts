import type {
    JamObjective,
    JamSponsor,
    JamPhase,
    JamPrize,
    JamFAQ,
    JamCustomSection,
} from '../types';

export interface DirectiveBlock {
    type: string;
    params: Record<string, string>;
    content: string;
}

/**
 * Parses block parameters like `{title: "¿Por qué esta jam?", subtitle: "Jugamos para ayudar", badge: "Nuevo"}`
 */
export function parseBlockParams(paramStr: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (!paramStr) return params;

    const trimmed = paramStr.trim();
    const clean = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;

    // Match key: "value" or key: 'value' or key: value
    const regex = /(\w+)\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,\s}]+))/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(clean)) !== null) {
        const key = match[1];
        const val = match[2] ?? match[3] ?? match[4] ?? '';
        params[key] = val.trim();
    }

    return params;
}

/**
 * Extracts directive blocks `:::blockType {params} ... :::` from markdown body.
 */
export function extractDirectiveBlocks(body: string): DirectiveBlock[] {
    const blocks: DirectiveBlock[] = [];
    // Matches :::blockName {optional params on same line} \n content \n :::
    // Note: use [ \t] instead of \s so newlines are not swallowed as params
    const blockRegex = /:::[ \t]*([a-zA-Z0-9_-]+)(?:[ \t]+([^\r\n]*))?[\r\n]+([\s\S]*?)[\r\n]+:::/g;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(body)) !== null) {
        const type = match[1].toLowerCase();
        const paramStr = match[2] || '';
        const content = match[3].trim();
        const params = parseBlockParams(paramStr);

        blocks.push({
            type,
            params,
            content,
        });
    }

    return blocks;
}

/**
 * Parses H3 sections like:
 * ### ❤️‍🩹 Title
 * Description...
 */
export function parseH3Sections(content: string): { title: string; icon?: string; body: string }[] {
    const sections: { title: string; icon?: string; body: string }[] = [];
    // Split by ### whether at beginning of string or after a newline
    const parts = content.split(/(?:^|[\r\n]+)###\s+/);

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        const lines = trimmed.split(/\r?\n/);
        const header = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();

        // Check if header starts with an emoji / icon
        let icon: string | undefined = undefined;
        let title = header;

        const emojiMatch = header.match(/^([\p{Extended_Pictographic}\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]+)\s*(.*)$/u);
        if (emojiMatch && emojiMatch[2]) {
            icon = emojiMatch[1].trim();
            title = emojiMatch[2].trim();
        }

        sections.push({ title, icon, body });
    }

    return sections;
}

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
                sponsors.push({
                    name: parts[0],
                    logo: parts[1],
                    url: parts[2] || undefined,
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

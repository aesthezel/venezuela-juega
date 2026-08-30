import type { JamEvent, JamCustomSection, JamSectionType } from '../types';
import { extractFrontmatter } from './frontmatter';
import {
    extractDirectiveBlocks,
    parseObjectives,
    parseSponsors,
    parseSchedule,
    parseFAQs,
    parsePrizes,
} from './blockParser';

export * from './frontmatter';
export * from './blockParser';

function parseDate(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Parses raw file content (.md or .json) into a JamEvent object.
 */
export function parseJamContent(rawContent: string, defaultSlug?: string): JamEvent {
    const { attributes, body } = extractFrontmatter(rawContent);

    const slug = attributes.slug || defaultSlug || 'unknown-jam';
    const edition = String(attributes.edition || 'i');
    const name = attributes.name || 'Game Jam';
    const shortName = attributes.shortName || name;
    const tagline = attributes.tagline || '';
    const status = attributes.status || 'draft';

    const startDate = parseDate(attributes.startDate);
    const endDate = parseDate(attributes.endDate);
    const submissionUrl = attributes.submissionUrl || null;
    const platform = attributes.platform || 'itch.io';
    const heroGradient = attributes.heroGradient;
    const heroImage = attributes.heroImage;
    const accentColor = attributes.accentColor;
    const accentTextColor = attributes.accentTextColor;
    const logo = attributes.logo;
    const isCharity = Boolean(attributes.isCharity);
    const donationUrl = attributes.donationUrl;
    const donationGoal = attributes.donationGoal;

    // Stats
    const stats = attributes.stats
        ? {
              participants: Number(attributes.stats.participants) || undefined,
              submissions: Number(attributes.stats.submissions) || undefined,
              countries: Number(attributes.stats.countries) || undefined,
          }
        : undefined;

    // Blocks in Markdown Body
    const directiveBlocks = extractDirectiveBlocks(body);

    let objectives = attributes.objectives || [];
    let sponsors = attributes.sponsors || [];
    let phases = attributes.phases || [];
    let faqs = attributes.faqs || [];
    let prizes = attributes.prizes || [];
    const customSections: Record<string, JamCustomSection> = {};

    for (const block of directiveBlocks) {
        switch (block.type) {
            case 'about':
            case 'objectives':
                objectives = parseObjectives(block);
                break;
            case 'sponsors':
                sponsors = parseSponsors(block);
                break;
            case 'schedule':
            case 'phases':
            case 'timeline':
                phases = parseSchedule(block);
                break;
            case 'faq':
            case 'faqs':
                faqs = parseFAQs(block);
                break;
            case 'prizes':
            case 'premios':
                prizes = parsePrizes(block);
                break;
            case 'custom':
            case 'markdown':
            case 'section':
            case 'embed': {
                const sectionId = block.params.id || `custom-${Object.keys(customSections).length + 1}`;
                customSections[sectionId] = {
                    id: sectionId,
                    type: block.type === 'embed' ? 'embed' : 'markdown',
                    title: block.params.title,
                    subtitle: block.params.subtitle,
                    badge: block.params.badge,
                    content: block.content,
                    embedUrl: block.params.url || block.params.embedUrl,
                    theme: (block.params.theme as any) || 'base-100',
                };
                break;
            }
            default:
                break;
        }
    }

    // Standardize phases dates if they were provided in attributes
    if (Array.isArray(phases)) {
        phases = phases.map((p: any) => ({
            ...p,
            startDate: parseDate(p.startDate),
            endDate: parseDate(p.endDate),
        }));
    }

    // Default or specified Layout
    const layout: JamSectionType[] = attributes.layout || [
        'hero',
        'stats',
        'about',
        isCharity ? 'donation' : 'prizes',
        'schedule',
        ...Object.keys(customSections),
        'faq',
        'cta',
    ];

    return {
        slug,
        edition,
        name,
        shortName,
        tagline,
        status,
        startDate,
        endDate,
        submissionUrl,
        platform,
        heroGradient,
        heroImage,
        accentColor,
        accentTextColor,
        logo,
        objectives,
        prizes,
        isCharity,
        donationUrl,
        donationGoal,
        phases,
        faqs,
        sponsors,
        stats,
        layout,
        customSections,
    };
}

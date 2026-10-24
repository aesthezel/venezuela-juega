import type { JamEvent, JamCustomSection, JamSectionType } from '../types';
import { parseDate } from '@/common/markdown';
import { extractFrontmatter } from './frontmatter';
import { parseGameIds } from './gameIds';
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
export * from './gameIds';

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
    const registrationUrl: string | undefined = attributes.registrationUrl || undefined;
    const registrationLabel: string | undefined = attributes.registrationLabel || undefined;
    const registrationOpenDate = attributes.registrationOpenDate ? parseDate(attributes.registrationOpenDate) : undefined;
    const registrationCloseDate = attributes.registrationCloseDate ? parseDate(attributes.registrationCloseDate) : undefined;
    const platform = attributes.platform || 'itch.io';
    const heroGradient = attributes.heroGradient;
    const heroImage = attributes.heroImage;
    const accentColor = attributes.accentColor;
    const accentTextColor = attributes.accentTextColor;
    const logo = attributes.logo;
    const isCharity = Boolean(attributes.isCharity);
    const donationUrl = attributes.donationUrl;
    const donationGoal = attributes.donationGoal;

    // SEO / Event Schema.org properties
    const attendanceMode = attributes.attendanceMode;
    const locationVenue = attributes.locationVenue;
    const locationAddress = attributes.locationAddress;
    const locationCity = attributes.locationCity;
    const locationState = attributes.locationState;
    const locationCountry = attributes.locationCountry;
    const onlineUrl = attributes.onlineUrl;
    const organizerName = attributes.organizerName;

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

    // Games made in this jam edition (IDs from the jam games spreadsheet)
    let gameIds = parseGameIds(attributes.games ?? attributes.gameIds ?? attributes.gamesIds);
    let gamesTitle: string | undefined = attributes.gamesTitle || undefined;
    let gamesSubtitle: string | undefined = attributes.gamesSubtitle || undefined;

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
            case 'games':
            case 'juegos': {
                const ids = parseGameIds(
                    block.params.ids ?? block.params.games ?? block.params.juegos ?? block.content
                );
                if (ids.length > 0) gameIds = ids;
                gamesTitle = block.params.title || gamesTitle;
                gamesSubtitle = block.params.subtitle || gamesSubtitle;
                break;
            }
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
    const layout: JamSectionType[] = [...(attributes.layout || [
        'hero',
        'stats',
        'about',
        'sponsors',
        isCharity ? 'donation' : 'prizes',
        'schedule',
        ...Object.keys(customSections),
        'faq',
        'cta',
    ])];

    // If the jam declares games but its layout doesn't mention the section,
    // surface it automatically before the FAQ (or at the end).
    if (gameIds.length > 0 && !layout.some((section) => section === 'games' || section === 'juegos')) {
        const faqIndex = layout.indexOf('faq');
        if (faqIndex === -1) {
            layout.push('games');
        } else {
            layout.splice(faqIndex, 0, 'games');
        }
    }

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
        registrationUrl,
        registrationLabel,
        registrationOpenDate,
        registrationCloseDate,
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
        gameIds,
        gamesTitle,
        gamesSubtitle,
        stats,
        layout,
        customSections,
        attendanceMode,
        locationVenue,
        locationAddress,
        locationCity,
        locationState,
        locationCountry,
        onlineUrl,
        organizerName,
    };
}

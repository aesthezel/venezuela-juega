// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/preact';
import type { JamEvent } from '../src/features/jam/types';

vi.mock('gsap', () => {
    const timeline = {
        from: () => timeline,
    };
    return {
        gsap: {
            registerPlugin: vi.fn(),
            context: (fn: () => void) => {
                fn();
                return { revert: vi.fn() };
            },
            timeline: () => timeline,
            to: () => ({ pause: vi.fn(), resume: vi.fn() }),
        },
    };
});

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

import JamHero from '../src/features/jam/components/JamHero';
import JamCTA from '../src/features/jam/components/JamCTA';

const makeJam = (overrides: Partial<JamEvent> = {}): JamEvent => ({
    slug: 'test-jam',
    edition: '2026',
    name: 'Test Jam',
    status: 'ended',
    startDate: new Date('2026-10-16T00:00:00Z'),
    endDate: new Date('2026-10-18T00:00:00Z'),
    submissionUrl: null,
    objectives: [],
    phases: [],
    faqs: [],
    sponsors: [],
    accentColor: '#e34262',
    accentTextColor: '#ffffff',
    ...overrides,
});

const registrationDates = {
    registrationUrl: 'https://example.com/register',
    registrationLabel: 'Inscríbete',
    registrationOpenDate: new Date('2026-09-01T00:00:00Z'),
    registrationCloseDate: new Date('2026-10-15T23:59:59Z'),
};

describe('Jam CTAs when the jam has ended', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        cleanup();
    });

    it('hides the registration button and hint and shows the games CTA in the hero', () => {
        const jam = makeJam({ ...registrationDates, jamUid: '8' });
        const { getByRole, queryByText } = render(<JamHero jam={jam} hasGames />);

        expect(queryByText('Inscríbete')).toBeNull();
        expect(queryByText(/inscripciones cerradas/i)).toBeNull();
        expect(getByRole('button', { name: /ver los juegos realizados/i })).toBeTruthy();
    });

    it('scrolls to the games section from the hero CTA', () => {
        const target = document.createElement('div');
        target.id = 'juegos';
        const scrollIntoView = vi.fn();
        target.scrollIntoView = scrollIntoView;
        document.body.appendChild(target);

        const jam = makeJam({ ...registrationDates, jamUid: '8' });
        const { getByRole } = render(<JamHero jam={jam} hasGames />);

        fireEvent.click(getByRole('button', { name: /ver los juegos realizados/i }));
        expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('keeps the platform link in the hero when the ended jam has no games', () => {
        const jam = makeJam({ submissionUrl: 'https://itch.io/jam/test', platform: 'itch.io' });
        const { queryByRole, getByRole } = render(<JamHero jam={jam} />);

        expect(queryByRole('button', { name: /ver los juegos realizados/i })).toBeNull();
        expect(getByRole('link', { name: /ver test jam en itch\.io/i })).toBeTruthy();
    });

    it('shows the games CTA instead of "Participar ahora" in the final CTA', () => {
        const jam = makeJam({ jamUid: '8', submissionUrl: 'https://itch.io/jam/test' });
        const { getByRole, queryByText } = render(<JamCTA jam={jam} hasGames />);

        expect(getByRole('button', { name: /ver los juegos realizados/i })).toBeTruthy();
        expect(queryByText(/participar ahora/i)).toBeNull();
        expect(queryByText(/próximamente/i)).toBeNull();
    });

    it('keeps the regular participation CTA while the jam is not over', () => {
        const jam = makeJam({ status: 'active', submissionUrl: 'https://itch.io/jam/test' });
        const { getByText, queryByRole } = render(<JamCTA jam={jam} />);

        expect(getByText(/participar ahora/i)).toBeTruthy();
        expect(queryByRole('button', { name: /ver los juegos realizados/i })).toBeNull();
    });
});

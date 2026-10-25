// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/preact';

vi.mock('gsap', () => ({
    gsap: {
        set: vi.fn(),
        to: () => ({ pause: vi.fn(), resume: vi.fn(), kill: vi.fn() }),
        killTweensOf: vi.fn(),
    },
}));

vi.mock('../src/features/jam/registry', () => ({
    getAllJams: vi.fn(),
}));

import { getAllJams } from '../src/features/jam/registry';
import ActiveJamsBanner from '../src/features/jam/components/ActiveJamsBanner';
import type { JamEvent } from '../src/features/jam/types';

const mockGetAllJams = vi.mocked(getAllJams);

const createJam = (overrides: Partial<JamEvent> = {}): JamEvent => ({
    slug: 'sample-jam',
    edition: '2026',
    name: 'Sample Jam',
    status: 'ended',
    startDate: new Date('2026-10-16T00:00:00Z'),
    endDate: new Date('2026-10-18T00:00:00Z'),
    submissionUrl: null,
    objectives: [],
    phases: [],
    faqs: [],
    sponsors: [],
    accentColor: '#fbb916',
    layout: ['hero'],
    ...overrides,
});

describe('ActiveJamsBanner Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders null when all jams are ended or draft', () => {
        mockGetAllJams.mockReturnValue([
            createJam({ slug: 'jam-1', status: 'ended', registrationUrl: 'https://example.com/register' }),
            createJam({ slug: 'jam-2', status: 'draft' }),
        ]);

        const { container } = render(<ActiveJamsBanner />);
        expect(container.firstChild).toBeNull();
    });

    it('renders the marquee banner when there is an active, open or upcoming jam', () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        mockGetAllJams.mockReturnValue([
            createJam({ slug: 'jam-ended', status: 'ended' }),
            createJam({
                slug: 'jam-upcoming',
                status: 'upcoming',
                endDate: futureDate,
                name: 'Jam Futura 2026',
                shortName: 'Jam Futura',
            }),
        ]);

        const { container } = render(<ActiveJamsBanner />);
        expect(container.firstChild).not.toBeNull();
        expect(container.textContent).toContain('Jam Futura');
        expect(container.textContent).not.toContain('jam-ended');
    });

    it('excludes jams whose endDate has already passed', () => {
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        mockGetAllJams.mockReturnValue([
            createJam({
                slug: 'jam-expired',
                status: 'active',
                endDate: pastDate,
                name: 'Expired Active Jam',
            }),
        ]);

        const { container } = render(<ActiveJamsBanner />);
        expect(container.firstChild).toBeNull();
    });
});

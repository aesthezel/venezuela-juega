// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/preact';
import { DocArticleRenderer } from '../src/features/docs/components';
import { getDocBySlug } from '../src/features/docs/registry';

beforeAll(() => {
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
    );
});

describe('DocArticleRenderer', () => {
    it('renders hero, anchored headings, callouts and sources', () => {
        const doc = getDocBySlug('propiedad-intelectual-videojuegos');
        expect(doc).toBeDefined();

        const { container } = render(<DocArticleRenderer article={doc!} />);

        // Hero + badges
        expect(container.textContent).toContain(doc!.title);
        expect(container.textContent).toContain('Borrador');

        // Heading anchors generated for the TOC
        for (const item of doc!.toc) {
            expect(container.querySelector(`[id="${item.id}"]`)).not.toBeNull();
        }

        // Callouts and sources
        expect(container.textContent).toContain('Este documento es informativo');
        expect(container.textContent).toContain('Fuentes y referencias');
        expect(container.querySelector('a[href="https://sapi.gob.ve/"]')).not.toBeNull();
    });
});

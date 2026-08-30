import { describe, it, expect } from 'vitest';
import { parseJamContent } from '../src/features/jam/parser';
import { buildContentBlocks } from '../src/features/jam/components/JamMarkdownSection';
import rawContent from '../src/features/jam/content/venezuela-juega-game-jam-2026-2027.md?raw';

describe('JamMarkdownSection content blocks', () => {
    const jam = parseJamContent(rawContent, 'test-jam');

    it('renders reglas-clave intro as paragraph and bullets as list', () => {
        const section = jam.customSections['reglas-clave'];
        const blocks = buildContentBlocks(section.content ?? '');

        expect(blocks[0].kind).toBe('paragraph');
        expect(blocks[0].lines[0]).toContain('experiencia justa');

        expect(blocks[1].kind).toBe('list');
        expect(blocks[1].items).toHaveLength(6);
        expect(blocks[1].items[0]).toContain('Originalidad');
        expect(blocks[1].items[5]).toContain('Respeto');
    });

    it('keeps headers and paragraphs of sedes section separate', () => {
        const section = jam.customSections['sedes'];
        const blocks = buildContentBlocks(section.content ?? '');

        expect(blocks[0]).toEqual({ kind: 'header', text: '🏢 ¿Qué es una sede?' });
        expect(blocks[1].kind).toBe('paragraph');
        expect(blocks[1].lines.join(' ')).toContain('punto de encuentro físico');
        expect(blocks[2]).toEqual({ kind: 'header', text: '💻 Participación online' });
        expect(blocks[3].kind).toBe('paragraph');
    });
});

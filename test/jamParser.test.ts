import { describe, it, expect } from 'vitest';
import { parseJamContent, extractFrontmatter, extractDirectiveBlocks, parsePrizes, parseH3Sections } from '../src/features/jam/parser';

describe('Jam CMS Parser', () => {
    it('should parse YAML frontmatter and scalar types', () => {
        const raw = `---
slug: test-jam
edition: "2"
name: "Test Game Jam"
status: upcoming
startDate: 2026-10-15T14:00:00-04:00
isCharity: true
layout:
  - hero
  - about
  - faq
---
Some body content`;

        const { attributes, body } = extractFrontmatter(raw);
        expect(attributes.slug).toBe('test-jam');
        expect(attributes.edition).toBe('2');
        expect(attributes.name).toBe('Test Game Jam');
        expect(attributes.status).toBe('upcoming');
        expect(attributes.isCharity).toBe(true);
        expect(attributes.startDate).toBeInstanceOf(Date);
        expect(attributes.layout).toEqual(['hero', 'about', 'faq']);
        expect(body).toBe('Some body content');
    });

    it('should parse directive blocks correctly', () => {
        const body = `
:::about {title: "Sobre la Jam", subtitle: "Innovación"}
### 🚀 Objetivo 1
Crear un juego en 48h.

### 🎨 Objetivo 2
Diseño libre y creativo.
:::

:::schedule
- [📝 Registro](2026-10-01 -> 2026-10-05): Inscripciones
- [🎮 Hackathon](2026-10-06 -> 2026-10-08): Desarrollo
:::

:::faq
### ¿Es gratis?
Sí, totalmente gratis.
:::
`;

        const blocks = extractDirectiveBlocks(body);
        expect(blocks).toHaveLength(3);
        expect(blocks[0].type).toBe('about');
        expect(blocks[0].params.title).toBe('Sobre la Jam');
        expect(blocks[1].type).toBe('schedule');
        expect(blocks[2].type).toBe('faq');
    });

    it('should parse H3 sections and prizes properly', () => {
        const rawPrizes = `### 🏆 Gran Premio
Emoji: 🥇
Color: warning
Descripción: Premio especial para el equipo ganador.`;

        const sections = parseH3Sections(rawPrizes);
        expect(sections).toHaveLength(1);
        expect(sections[0].title).toBe('Gran Premio');
        expect(sections[0].icon).toBe('🏆');

        const prizes = parsePrizes({ type: 'prizes', params: {}, content: rawPrizes });
        expect(prizes).toHaveLength(1);
        expect(prizes[0].category).toBe('Gran Premio');
        expect(prizes[0].emoji).toBe('🥇');
        expect(prizes[0].color).toBe('warning');
    });

    it('should parse a complete Markdown Jam file into a typed JamEvent', () => {
        const sampleJamMd = `---
slug: maracaibo-jam
edition: "1"
name: "Maracaibo Game Jam"
tagline: "El calor de la creatividad"
status: active
startDate: 2026-09-01T12:00:00-04:00
endDate: 2026-09-03T20:00:00-04:00
accentColor: "#ffaa00"
isCharity: false
---

:::about {title: "¿De qué trata?"}
### 🌴 Pasión Marabina
Desarrollando juegos desde el Zulia.
:::

:::prizes
### 🏆 Gran Premio
Emoji: 🥇
Color: warning
Descripción: Premio especial para el equipo ganador.
:::

:::custom {id: "reglas", title: "Reglas Especiales", badge: "IMPORTANTE"}
- Respetar el tiempo de entrega.
- Subir build jugable a itch.io.
:::
`;

        const jam = parseJamContent(sampleJamMd, 'default-slug');

        expect(jam.slug).toBe('maracaibo-jam');
        expect(jam.name).toBe('Maracaibo Game Jam');
        expect(jam.status).toBe('active');
        expect(jam.accentColor).toBe('#ffaa00');
        expect(jam.objectives).toHaveLength(1);
        expect(jam.objectives[0].title).toBe('Pasión Marabina');
        expect(jam.prizes).toHaveLength(1);
        expect(jam.prizes![0].category).toBe('Gran Premio');
        expect(jam.customSections?.['reglas']).toBeDefined();
        expect(jam.customSections?.['reglas'].badge).toBe('IMPORTANTE');
    });

    it('should parse JSON jam definitions cleanly', () => {
        const jsonContent = JSON.stringify({
            slug: 'valencia-jam',
            edition: '2026',
            name: 'Valencia Game Jam',
            status: 'upcoming',
            startDate: '2026-12-01T00:00:00Z',
            objectives: [
                { title: 'Objetivo V', description: 'Crear prototipos', icon: '🚀' }
            ],
            faqs: [
                { question: '¿Dónde es?', answer: 'Online y presencial' }
            ]
        });

        const jam = parseJamContent(jsonContent, 'valencia-slug');
        expect(jam.slug).toBe('valencia-jam');
        expect(jam.name).toBe('Valencia Game Jam');
        expect(jam.objectives).toHaveLength(1);
        expect(jam.faqs).toHaveLength(1);
        expect(jam.startDate).toBeInstanceOf(Date);
    });
});

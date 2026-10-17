import { describe, it, expect } from 'vitest';
import {
    extractFrontmatter,
    parseYaml,
    parseDate,
    toStringArray,
    parseBlockParams,
    extractDirectiveBlocks,
    stripDirectiveBlocks,
    parseH3Sections,
    buildContentBlocks,
    extractToc,
    slugifyHeading,
    countWords,
    estimateReadingTime,
} from '../src/common/markdown';

describe('common markdown — frontmatter', () => {
    it('parses YAML scalars, dates and inline lists', () => {
        const raw = `---
slug: mi-doc
title: "Título"
count: 3
published: true
publishedDate: 2026-10-01
tags: [legal, sapi, derechos]
---
Cuerpo`;

        const { attributes, body } = extractFrontmatter(raw);
        expect(attributes.slug).toBe('mi-doc');
        expect(attributes.title).toBe('Título');
        expect(attributes.count).toBe(3);
        expect(attributes.published).toBe(true);
        expect(attributes.publishedDate).toBeInstanceOf(Date);
        expect(attributes.tags).toEqual(['legal', 'sapi', 'derechos']);
        expect(body).toBe('Cuerpo');
    });

    it('parses JSON content directly', () => {
        const { attributes, body } = extractFrontmatter('{"slug":"json-doc","tags":["a"]}');
        expect(attributes.slug).toBe('json-doc');
        expect(attributes.tags).toEqual(['a']);
        expect(body).toBe('');
    });

    it('parses block-style YAML lists', () => {
        const parsed = parseYaml('tags:\n  - uno\n  - dos');
        expect(parsed.tags).toEqual(['uno', 'dos']);
    });

    it('normalizes dates and string arrays', () => {
        expect(parseDate('2026-05-10')).toBeInstanceOf(Date);
        expect(parseDate('')).toBeNull();
        expect(toStringArray('a, b ,c')).toEqual(['a', 'b', 'c']);
        expect(toStringArray(['x', ' y '])).toEqual(['x', 'y']);
        expect(toStringArray(undefined)).toEqual([]);
    });
});

describe('common markdown — directivas', () => {
    it('parses block params with quotes and bare values', () => {
        const params = parseBlockParams('{title: "Hola mundo", id: reglas, badge: NUEVO}');
        expect(params.title).toBe('Hola mundo');
        expect(params.id).toBe('reglas');
        expect(params.badge).toBe('NUEVO');
    });

    it('extracts directive blocks preserving content', () => {
        const body = `
:::info {title: "Nota"}
Texto del bloque.
:::

:::sources
- [SAPI](https://sapi.gob.ve/)
:::
`;
        const blocks = extractDirectiveBlocks(body);
        expect(blocks).toHaveLength(2);
        expect(blocks[0].type).toBe('info');
        expect(blocks[0].params.title).toBe('Nota');
        expect(blocks[0].content).toContain('Texto del bloque');
        expect(blocks[1].type).toBe('sources');
    });

    it('strips directive blocks from markdown', () => {
        const body = `Antes

:::info
Dentro
:::

Después`;
        const stripped = stripDirectiveBlocks(body);
        expect(stripped).not.toContain('Dentro');
        expect(stripped).toContain('Antes');
        expect(stripped).toContain('Después');
    });

    it('parses H3 sections with emoji icons', () => {
        const sections = parseH3Sections('### 🚀 Objetivo\nCrear algo.');
        expect(sections[0].title).toBe('Objetivo');
        expect(sections[0].icon).toBe('🚀');
        expect(sections[0].body).toBe('Crear algo.');
    });
});

describe('common markdown — bloques de contenido', () => {
    it('groups paragraphs, lists, ordered lists, quotes and code fences', () => {
        const content = `Frase inicial.

- uno
- dos

1. primero
2. segundo

> cita

\`\`\`ts
const x = 1;
\`\`\``;

        const blocks = buildContentBlocks(content);
        const kinds = blocks.map((b) => b.kind);
        expect(kinds).toEqual(['paragraph', 'list', 'ordered-list', 'quote', 'code']);

        const code = blocks[4];
        if (code.kind !== 'code') throw new Error('expected code');
        expect(code.lang).toBe('ts');
        expect(code.code).toContain('const x = 1;');
    });

    it('parses headings with level and directive blocks with inner blank lines', () => {
        const content = `## Sección

:::warning {title: "Ojo"}
Con **negrita**.

- item
:::

### Sub`;

        const blocks = buildContentBlocks(content);
        expect(blocks[0]).toEqual({ kind: 'header', level: 2, text: 'Sección' });

        const directive = blocks[1];
        if (directive.kind !== 'directive') throw new Error('expected directive');
        expect(directive.type).toBe('warning');
        expect(directive.params.title).toBe('Ojo');
        expect(directive.content).toContain('Con **negrita**.');

        expect(blocks[2]).toEqual({ kind: 'header', level: 3, text: 'Sub' });
    });
});

describe('common markdown — TOC', () => {
    it('generates anchors, ignores directives and dedupes repeated headings', () => {
        const body = `## Introducción

:::info
### No debe aparecer
:::

## Cómo Registrar la Propiedad
### Paso a paso
## Cómo Registrar la Propiedad`;

        const toc = extractToc(body);
        expect(toc.map((item) => item.text)).toEqual([
            'Introducción',
            'Cómo Registrar la Propiedad',
            'Paso a paso',
            'Cómo Registrar la Propiedad',
        ]);
        expect(toc[0].id).toBe('introduccion');
        expect(toc[1].id).toBe('como-registrar-la-propiedad');
        expect(toc[3].id).toBe('como-registrar-la-propiedad-2');
        expect(toc[1].level).toBe(2);
        expect(toc[2].level).toBe(3);
    });

    it('slugifies accents and markup', () => {
        expect(slugifyHeading('¿Qué protege el **derecho** de autor?')).toBe('que-protege-el-derecho-de-autor');
        expect(slugifyHeading('¡¡¡')).toBe('seccion');
    });
});

describe('common markdown — tiempo de lectura', () => {
    it('counts words and estimates minutes', () => {
        expect(countWords('')).toBe(0);
        expect(countWords('uno dos tres')).toBe(3);
        expect(estimateReadingTime('')).toBe(0);
        expect(estimateReadingTime(Array.from({ length: 450 }, () => 'palabra').join(' '))).toBe(3);
    });
});

import { describe, it, expect } from 'vitest';
import { parseDocContent, getCalloutKind, DEFAULT_DOC_LAYOUT } from '../src/features/docs/parser';
import { getDocBySlug, getDocsByStatus, getAllDocs } from '../src/features/docs/registry';

const SAMPLE_DOC = `---
slug: guia-de-prueba
title: "Guía de Prueba"
subtitle: "Subtítulo de la guía"
description: "Una descripción para SEO."
category: legal
tags: [propiedad-intelectual, SAPI]
status: published
author: "Venezuela Juega"
publishedDate: 2026-10-01
updatedDate: 2026-10-15
icon: "⚖️"
relatedSlugs: [otra-guia]
---

## Introducción

Texto introductorio con **negrita** y un [enlace](https://example.com).

:::info {title: "Dato importante"}
Contenido del callout.
:::

## Paso a paso

1. Primer paso
2. Segundo paso

:::warning
Cuidado con esto.
:::

:::sources
- [SAPI](https://sapi.gob.ve/)
- [WIPO](https://www.wipo.int/)
:::
`;

describe('Docs CMS Parser', () => {
    it('parses frontmatter into a typed DocArticle', () => {
        const doc = parseDocContent(SAMPLE_DOC, 'fallback-slug');

        expect(doc.slug).toBe('guia-de-prueba');
        expect(doc.title).toBe('Guía de Prueba');
        expect(doc.subtitle).toBe('Subtítulo de la guía');
        expect(doc.description).toBe('Una descripción para SEO.');
        expect(doc.category).toBe('legal');
        expect(doc.status).toBe('published');
        expect(doc.author).toBe('Venezuela Juega');
        expect(doc.tags).toEqual(['propiedad-intelectual', 'SAPI']);
        expect(doc.relatedSlugs).toEqual(['otra-guia']);
        expect(doc.publishedDate).toBeInstanceOf(Date);
        expect(doc.updatedDate).toBeInstanceOf(Date);
        expect(doc.readingTime).toBeGreaterThan(0);
        expect(doc.layout).toEqual(DEFAULT_DOC_LAYOUT);
    });

    it('generates the table of contents ignoring callouts', () => {
        const doc = parseDocContent(SAMPLE_DOC);
        expect(doc.toc.map((item) => item.id)).toEqual(['introduccion', 'paso-a-paso']);
        expect(doc.toc[0]).toEqual({ id: 'introduccion', text: 'Introducción', level: 2 });
    });

    it('extracts callouts in order with kind and title', () => {
        const doc = parseDocContent(SAMPLE_DOC);
        expect(doc.callouts).toHaveLength(2);
        expect(doc.callouts[0].kind).toBe('info');
        expect(doc.callouts[0].title).toBe('Dato importante');
        expect(doc.callouts[1].kind).toBe('warning');
        expect(doc.callouts[1].title).toBeUndefined();
    });

    it('extracts sources from :::sources blocks', () => {
        const doc = parseDocContent(SAMPLE_DOC);
        expect(doc.sources).toEqual([
            { label: 'SAPI', url: 'https://sapi.gob.ve/' },
            { label: 'WIPO', url: 'https://www.wipo.int/' },
        ]);
    });

    it('falls back to safe defaults (draft, community, category accent)', () => {
        const doc = parseDocContent('## Solo cuerpo', 'mi-archivo');
        expect(doc.slug).toBe('mi-archivo');
        expect(doc.status).toBe('draft');
        expect(doc.category).toBe('community');
        expect(doc.accentColor).toBeTruthy();
        expect(doc.icon).toBeTruthy();
    });

    it('maps directive types to callout kinds', () => {
        expect(getCalloutKind('info')).toBe('info');
        expect(getCalloutKind('error')).toBe('danger');
        expect(getCalloutKind('sources')).toBeNull();
    });
});

describe('Docs registry (contenido real del CMS)', () => {
    it('ignores README.md and parses the example article', () => {
        const doc = getDocBySlug('propiedad-intelectual-videojuegos');
        expect(doc).toBeDefined();
        expect(doc!.toc.length).toBeGreaterThan(0);
        expect(doc!.status).toBe('draft');
        expect(doc!.callouts.length).toBeGreaterThan(0);
        expect(doc!.sources?.length).toBeGreaterThan(0);

        expect(getDocBySlug('README')).toBeUndefined();
        expect(getDocBySlug('readme')).toBeUndefined();
    });

    it('only exposes published documents in the public list', () => {
        const published = getAllDocs();
        expect(published.every((doc) => doc.status === 'published')).toBe(true);
        expect(published.some((doc) => doc.slug === 'propiedad-intelectual-videojuegos')).toBe(false);
        expect(getDocsByStatus('draft').some((doc) => doc.slug === 'propiedad-intelectual-videojuegos')).toBe(true);
    });
});

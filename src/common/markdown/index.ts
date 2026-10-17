// ── common/markdown/index.ts ──────────────────────────────────────────────
// Librería común de contenido markdown: frontmatter, directivas, bloques,
// TOC, tiempo de lectura y render de texto enriquecido.
// Reutilizable por cualquier feature basada en markdown (docs, jams, blog...).

export * from './frontmatter';
export * from './blockParser';
export * from './contentBlocks';
export * from './toc';
export * from './readingTime';
export { renderRichText } from './renderRichText';

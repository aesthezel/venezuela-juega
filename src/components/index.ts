// ── Shim de compatibilidad ────────────────────────────────────────────────
// Este archivo redirige al nuevo punto de entrada: src/common/components
// El alias @/components en vite.config.ts/tsconfig.json ya apunta ahí directamente.
// Este shim es un fallback para cualquier import físico a 'src/components'.
export * from '@/common/components';
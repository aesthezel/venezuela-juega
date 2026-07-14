// ── Shim de compatibilidad ────────────────────────────────────────────────
// Este archivo redirige al nuevo punto de entrada: src/common/hooks
// Los imports directos a @/hooks siguen funcionando gracias al alias en vite.config.ts
// No añadir lógica aquí — usar @/common/hooks directamente en código nuevo.
export * from '@/common/hooks';

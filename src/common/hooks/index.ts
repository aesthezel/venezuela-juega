// ── common/hooks/index.ts ─────────────────────────────────────────────────
// Hooks globales reutilizables en toda la aplicación.
// El alias @/hooks apunta aquí.

export * from './useDebounce';
export * from './useGamesData';
export * from './useMetadata';
export * from './useFireflies';
export * from './FireflyContext';
export * from './useMeasure';
export * from './useTextLayout';
export * from './useDevelopers';

// Re-export de hooks de features para backward compat
// (antes vivían en src/hooks junto a los hooks globales)
export * from '@/features/catalog/hooks';

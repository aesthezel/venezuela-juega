// ── common/components/index.ts ────────────────────────────────────────────
// Punto de exportación central — alias @/components apunta aquí.
// Re-exporta desde todos los subdirectorios para mantener
// backward compatibility con imports existentes como:
//   import { GameCard, Header, Modal } from '@/components'

// Subdirectorios propios
export * from './ui';
export * from './layout';
export * from './firefly';
export * from './icons';

// Features — re-exportadas aquí para backward compat
export * from '@/features/catalog/components';
export * from '@/features/game-detail/components';
export * from '@/features/contributors/components';

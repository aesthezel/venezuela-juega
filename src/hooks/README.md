# Directorio de hooks

Este directorio contiene todos los hooks personalizados de React utilizados en toda la aplicación Venezuela Juega.

## Estructura

- `useDebounce.ts` - Un hook para aplicar debounce a valores que cambian rápidamente
- `index.ts` - Reexporta todos los hooks

## Uso

Importa los hooks desde el punto de exportación central:
```typescript
import { useDebounce } from '../hooks';
```
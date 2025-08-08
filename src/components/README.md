# Directorio de componentes

Este directorio contiene todos los componentes de interfaz de usuario reutilizables utilizados en toda la aplicación Venezuela Juega.

## Estructura

- `icons/` - Directorio que contiene componentes de íconos
    - `ArrowLeftIcon.tsx` - Ícono de flecha hacia la izquierda
    - `ChartBarIcon.tsx` - Ícono de gráfico de barras
    - `CloseIcon.tsx` - Ícono de cerrar
    - `IndicatorLeftIcon.tsx` - Ícono de indicador hacia la izquierda
    - `IndicatorRightIcon.tsx` - Ícono de indicador hacia la derecha
    - `InfoIcon.tsx` - Ícono de información
    - `LinkIcon.tsx` - Ícono de enlace
    - `PlusIcon.tsx` - Ícono de más
    - `index.ts` - Reexporta todos los íconos
- `FilterPanel.tsx` - Componente para filtrar juegos
- `Footer.tsx` - Componente de pie de página
- `GameCard.tsx` - Componente de tarjeta para mostrar un juego
- `GameCounter.tsx` - Componente para mostrar el conteo de juegos
- `GameGrid.tsx` - Componente de cuadrícula para mostrar juegos
- `Header.tsx` - Componente de encabezado
- `HighlightCard.tsx` - Componente de tarjeta para juegos destacados
- `Highlights.tsx` - Componente para mostrar juegos destacados
- `LoadingSpinner.tsx` - Componente de indicador de carga
- `Modal.tsx` - Componente modal
- `SearchBar.tsx` - Componente de barra de búsqueda
- `index.ts` - Reexporta todos los componentes

## Uso

Importa los componentes desde el punto de exportación central:

```typescript
import { GameCard, Header, Footer, SearchBar } from '@/src/components';
import { ArrowLeftIcon, CloseIcon } from '@/src/components/icons';
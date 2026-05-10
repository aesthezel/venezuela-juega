This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*.ts, src/**/*.tsx, **/*.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.agents/rules/spacetimedb-typescript.md
.agents/rules/spacetimedb.md
.agents/skills/caveman-commit/SKILL.md
.agents/skills/caveman-compress/README.md
.agents/skills/caveman-compress/SECURITY.md
.agents/skills/caveman-compress/SKILL.md
.agents/skills/caveman-review/SKILL.md
.agents/skills/caveman/SKILL.md
.agents/skills/daisyui/actions-button.md
.agents/skills/daisyui/actions-dropdown.md
.agents/skills/daisyui/actions-modal.md
.agents/skills/daisyui/actions-speed-dial.md
.agents/skills/daisyui/actions-swap.md
.agents/skills/daisyui/actions-theme-controller.md
.agents/skills/daisyui/base-style.md
.agents/skills/daisyui/data-display-accordion.md
.agents/skills/daisyui/data-display-avatar.md
.agents/skills/daisyui/data-display-badge.md
.agents/skills/daisyui/data-display-card.md
.agents/skills/daisyui/data-display-carousel.md
.agents/skills/daisyui/data-display-chat.md
.agents/skills/daisyui/data-display-collapse.md
.agents/skills/daisyui/data-display-countdown.md
.agents/skills/daisyui/data-display-diff.md
.agents/skills/daisyui/data-display-hover-3d-card.md
.agents/skills/daisyui/data-display-hover-gallery.md
.agents/skills/daisyui/data-display-kbd.md
.agents/skills/daisyui/data-display-list.md
.agents/skills/daisyui/data-display-stat.md
.agents/skills/daisyui/data-display-status.md
.agents/skills/daisyui/data-display-table.md
.agents/skills/daisyui/data-display-text-rotate.md
.agents/skills/daisyui/data-display-timeline.md
.agents/skills/daisyui/data-input-calendar.md
.agents/skills/daisyui/data-input-checkbox.md
.agents/skills/daisyui/data-input-fieldset.md
.agents/skills/daisyui/data-input-file.md
.agents/skills/daisyui/data-input-filter.md
.agents/skills/daisyui/data-input-label.md
.agents/skills/daisyui/data-input-radio.md
.agents/skills/daisyui/data-input-range.md
.agents/skills/daisyui/data-input-rating.md
.agents/skills/daisyui/data-input-select.md
.agents/skills/daisyui/data-input-text.md
.agents/skills/daisyui/data-input-textarea.md
.agents/skills/daisyui/data-input-toggle.md
.agents/skills/daisyui/data-input-validator.md
.agents/skills/daisyui/feedback-alert.md
.agents/skills/daisyui/feedback-loading.md
.agents/skills/daisyui/feedback-progress.md
.agents/skills/daisyui/feedback-radial.md
.agents/skills/daisyui/feedback-skeleton.md
.agents/skills/daisyui/feedback-toast.md
.agents/skills/daisyui/feedback-tooltip.md
.agents/skills/daisyui/layout-artboard.md
.agents/skills/daisyui/layout-divider.md
.agents/skills/daisyui/layout-drawer.md
.agents/skills/daisyui/layout-footer.md
.agents/skills/daisyui/layout-hero.md
.agents/skills/daisyui/layout-indicator.md
.agents/skills/daisyui/layout-join.md
.agents/skills/daisyui/layout-mask.md
.agents/skills/daisyui/layout-stack.md
.agents/skills/daisyui/mockup-browser.md
.agents/skills/daisyui/mockup-code.md
.agents/skills/daisyui/mockup-phone.md
.agents/skills/daisyui/mockup-window.md
.agents/skills/daisyui/navigation-bottom-nav.md
.agents/skills/daisyui/navigation-breadcrumbs.md
.agents/skills/daisyui/navigation-dock.md
.agents/skills/daisyui/navigation-link.md
.agents/skills/daisyui/navigation-menu.md
.agents/skills/daisyui/navigation-navbar.md
.agents/skills/daisyui/navigation-pagination.md
.agents/skills/daisyui/navigation-steps.md
.agents/skills/daisyui/navigation-tab.md
.agents/skills/daisyui/SKILL.md
.agents/skills/daisyui/theme-generator.md
.agents/skills/daisyui/themes.md
.agents/skills/daisyui/utilities-variables.md
.github/copilot-instructions.md
.junie/guidelines.md
AGENTS.md
CONTRIBUTING.md
docs/frontend/business-logic.md
docs/frontend/components/catalog.md
docs/frontend/components/hero.md
docs/frontend/components/index.md
docs/frontend/components/layout.md
docs/frontend/components/ui-atoms.md
docs/frontend/design-tokens.md
docs/frontend/features.md
docs/frontend/firefly-system.md
docs/frontend/github-pages-spa.md
docs/frontend/hero-mosaic.md
docs/frontend/hooks/data-fetching.md
docs/frontend/hooks/index.md
docs/frontend/hooks/presence.md
docs/frontend/hooks/ui-utilities.md
docs/frontend/overview.md
docs/frontend/README.md
docs/frontend/spacetimedb-reactivity.md
docs/frontend/technical-stack.md
docs/frontend/theme-system.md
README.md
src/App.tsx
src/components/AlphaFilter.tsx
src/components/BackButton.tsx
src/components/ContributorCard.tsx
src/components/CoverImage.tsx
src/components/FilterPanel.tsx
src/components/Firefly.tsx
src/components/FireflyOverlay.tsx
src/components/Footer.tsx
src/components/GameCard.tsx
src/components/GameCounter.tsx
src/components/GameGrid.tsx
src/components/GameJamPlusSection.tsx
src/components/GameList.tsx
src/components/Header.tsx
src/components/hero/CategoryCard.tsx
src/components/hero/categoryPresets.ts
src/components/hero/CompactStat.tsx
src/components/hero/index.ts
src/components/hero/ProgressDots.tsx
src/components/hero/TabButton.tsx
src/components/HeroMosaic.tsx
src/components/HighlightCard.tsx
src/components/Highlights.tsx
src/components/icons/ArrowLeftIcon.tsx
src/components/icons/ChartBarIcon.tsx
src/components/icons/CloseIcon.tsx
src/components/icons/ExternalLinkIcon.tsx
src/components/icons/index.ts
src/components/icons/IndicatorLeftIcon.tsx
src/components/icons/IndicatorRightIcon.tsx
src/components/icons/InfoIcon.tsx
src/components/icons/LinkIcon.tsx
src/components/icons/PlusIcon.tsx
src/components/index.ts
src/components/LoadingOverlay.tsx
src/components/LoadingSpinner.tsx
src/components/Modal.tsx
src/components/PageTransition.tsx
src/components/PromoHeader.tsx
src/components/README.md
src/components/ScreenshotLightbox.tsx
src/components/ScrollToTop.tsx
src/components/SearchBar.tsx
src/components/StatusBadge.tsx
src/components/StoreButton.tsx
src/components/UserProfile.tsx
src/components/ViewModeToggle.tsx
src/hooks/FireflyContext.tsx
src/hooks/index.ts
src/hooks/README.md
src/hooks/useDebounce.ts
src/hooks/useFireflies.ts
src/hooks/useGamesData.ts
src/hooks/useGameStats.ts
src/hooks/useMeasure.ts
src/hooks/useMetadata.ts
src/hooks/useTextLayout.ts
src/index.tsx
src/pages/AboutPage.tsx
src/pages/AddGamePage.tsx
src/pages/CalendarPage.tsx
src/pages/CatalogPage.tsx
src/pages/ChartsPage.tsx
src/pages/GameDetailPage.tsx
src/pages/GameJamGalleryPage.tsx
src/pages/GameJamPage.tsx
src/pages/GameJamsPage.tsx
src/pages/index.ts
src/pages/NotFoundPage.tsx
src/pages/README.md
src/pages/Redirect.tsx
src/spacetimedb/config.ts
src/spacetimedb/connection.ts
src/spacetimedb/module_bindings/firefly_table.ts
src/spacetimedb/module_bindings/game_stats_table.ts
src/spacetimedb/module_bindings/get_fireflies_nearby_procedure.ts
src/spacetimedb/module_bindings/index.ts
src/spacetimedb/module_bindings/my_activity_table.ts
src/spacetimedb/module_bindings/profile_table.ts
src/spacetimedb/module_bindings/toggle_favorite_reducer.ts
src/spacetimedb/module_bindings/toggle_like_reducer.ts
src/spacetimedb/module_bindings/types.ts
src/spacetimedb/module_bindings/types/procedures.ts
src/spacetimedb/module_bindings/types/reducers.ts
src/spacetimedb/module_bindings/update_firefly_reducer.ts
src/spacetimedb/module_bindings/visit_game_reducer.ts
src/spacetimedb/SpacetimeDBProvider.tsx
src/styles/index.ts
src/types/enums.ts
src/types/index.ts
src/types/interfaces/Game.ts
src/types/interfaces/index.ts
src/types/interfaces/PageProps.ts
src/types/README.md
src/types/types.ts
src/utils/analytics.ts
src/utils/anotherUtils.ts
src/utils/gameUtils.ts
src/utils/index.ts
src/utils/README.md
src/utils/stringUtils.ts
```

# Files

## File: .junie/guidelines.md
`````markdown
# Venezuela Juega - Development Guidelines

This document provides guidelines and information for developers working on the Venezuela Juega project.

## Project Overview

Venezuela Juega is a web application that catalogs video games developed in Venezuela. The application is built with:

- **Preact**: A lightweight alternative to React
- **TypeScript**: For type safety
- **Vite**: For fast development and building
- **Tailwind CSS**: For styling (loaded via CDN)

The application fetches game data from a Google Spreadsheet and provides features like filtering, searching, and different views (catalog, calendar, charts).

## Build and Configuration

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start a development server at `http://localhost:5173/` with hot module replacement.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate optimized assets in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Testing

The project uses Vitest for testing, along with Testing Library for Preact.

### Running Tests

To run tests once:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

### Adding New Tests

Tests are located in the `test` directory, mirroring the structure of the source code. For example, tests for components in the `components` directory are in `test/components`.

To add a new test:

1. Create a new file with the `.test.tsx` extension in the appropriate directory
2. Import the component and testing utilities
3. Write your tests using the Vitest and Testing Library APIs

Example test file:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import YourComponent from '../../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop1="value1" />);
    expect(screen.getByText('Expected Text')).toBeDefined();
  });
});
```

## Project Structure

- `components/`: UI components
  - `icons/`: Icon components
  - `pages/`: Page components
- `dist/`: Build output (generated)
- `test/`: Test files
- `App.tsx`: Main application component
- `index.tsx`: Application entry point
- `types.ts`: TypeScript type definitions
- `vite.config.ts`: Vite configuration
- `vitest.config.ts`: Vitest configuration

## Data Structure

The application uses the following main data types:

- `Game`: Represents a video game with properties like title, platform, genre, etc.
- `GameStatus`: Enum representing the status of a game (released, in development, etc.)
- `Page`: Type representing the different pages in the application

## Code Style and Conventions

Based on the existing codebase, follow these conventions:

### TypeScript

- Use TypeScript for all new code
- Define interfaces for component props
- Use enums for fixed sets of values
- Use type annotations for function parameters and return types

### Components

- Use functional components with hooks
- Define prop interfaces at the top of the file
- Use destructuring for props
- Export components as default exports

### Styling

- Use Tailwind CSS classes for styling
- Follow the existing pattern of using utility classes directly in the JSX
- Use consistent spacing and indentation

### State Management

- Use React hooks for state management (useState, useEffect, useMemo)
- Keep state as close to where it's used as possible
- Use callbacks for state updates that depend on previous state

## External Dependencies

The application uses several external libraries loaded via CDN:

- Tailwind CSS: For styling
- Chart.js: For charts
- FullCalendar: For the calendar view
- Bootstrap Icons: For icons

These are loaded in the `index.html` file and don't need to be installed via npm.

## Data Source

The application fetches game data from a Google Spreadsheet using Papa Parse. The URL is hardcoded in the `App.tsx` file:

```
https://docs.google.com/spreadsheets/d/1tVBCGdGaTSTTikMKWFVT4Lzmq71TRikWSzIjiIR15FA/pub?gid=0&single=true&output=csv
```

If you need to change the data source, update this URL in the `App.tsx` file.
`````

## File: src/components/icons/ArrowLeftIcon.tsx
`````typescript
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
`````

## File: src/components/icons/ChartBarIcon.tsx
`````typescript
const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
`````

## File: src/components/icons/CloseIcon.tsx
`````typescript
const CloseIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);
`````

## File: src/components/icons/IndicatorLeftIcon.tsx
`````typescript
const IndicatorLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
`````

## File: src/components/icons/IndicatorRightIcon.tsx
`````typescript
const IndicatorRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
`````

## File: src/components/icons/InfoIcon.tsx
`````typescript
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
`````

## File: src/components/icons/LinkIcon.tsx
`````typescript
const LinkIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
    </svg>
);
`````

## File: src/components/icons/PlusIcon.tsx
`````typescript
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
`````

## File: src/components/README.md
`````markdown
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
- `ScrollToTop.tsx` - Componente para subir hacia el tope de la página

## Uso

Importa los componentes desde el punto de exportación central:

```typescript
import { GameCard, Header, Footer, SearchBar } from '@/src/components';
import { ArrowLeftIcon, CloseIcon } from '@/src/components/icons';
`````

## File: src/hooks/README.md
`````markdown
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
`````

## File: src/hooks/useDebounce.ts
`````typescript
import { useState, useEffect } from 'preact/hooks';
⋮----
export const useDebounce = <T>(value: T, delay: number): T =>
`````

## File: src/pages/README.md
`````markdown
# Directorio de páginas

Este directorio contiene todos los componentes de página utilizados en la aplicación Venezuela Juega.

## Estructura

-   `CatalogPage.tsx` - Carga todas tarjetas de juego desde la API
-   `AboutPage.tsx` - La página "Acerca de"
-   `AddGamePage.tsx` - La página tipo formulario para agregar juegos
-   `CalendarPage.tsx` - La página del calendario que usa FullCalendar
-   `ChartsPage.tsx` - Página de gráficos y datos relacionados con la lista de juegos
-   `GameDetailPage.tsx` - Página de detalles del juego

## Uso
Importa los componentes de página desde el punto de exportación central:
```typescript
import { CalendarPage, ChartsPage, AboutPage } from '@/src/pages';
````

Este enfoque proporciona varios beneficios:
1.  Definiciones centralizadas de los componentes de página
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de los componentes de página relacionados
4.  Mantenibilidad mejorada

## Añadir nuevas páginas
Al añadir nuevos componentes de página:
1.  Crea un nuevo archivo con el nombre de la página (p. ej., `ContactPage.tsx`)
2.  Añade comentarios JSDoc para documentar el propósito del componente, sus props y ejemplos de uso
3.  Exporta el componente de página desde el archivo
4.  Añade la exportación al archivo `index.ts`

## Mejores prácticas
- Mantén los componentes de página enfocados en la maquetación y composición
- Usa componentes más pequeños del directorio de componentes para los elementos de la interfaz de usuario
- Usa interfaces de TypeScript para las props
- Incluye comentarios JSDoc completos con ejemplos
- Usa componentes funcionales con hooks
- Sigue el patrón existente de usar clases de Tailwind CSS para los estilos
- Exporta los componentes de página como exportaciones por defecto desde sus archivos
`````

## File: src/styles/index.ts
`````typescript

`````

## File: src/types/index.ts
`````typescript

`````

## File: src/types/interfaces/index.ts
`````typescript

`````

## File: src/types/README.md
`````markdown
# Directorio de tipos
Este directorio contiene todas las definiciones de tipos, interfaces y enumeraciones (enums) de TypeScript utilizadas en la aplicación Venezuela Juega.

## Estructura
- `enums.ts` - Contiene definiciones de enumeraciones como `GameStatus`
- `types.ts` - Contiene definiciones de tipos como `Page`
- `interfaces/` - Directorio que contiene las definiciones de interfaces
    - `Game.ts` - Interfaz para los objetos de juego
    - `PageProps.ts` - Interfaces para las props de los componentes de página

## Uso
Importa los tipos, interfaces y enumeraciones desde el punto de exportación central:

```typescript
import { Game, GameStatus, Page, CatalogPageProps } from '../types';
```

Este enfoque proporciona varios beneficios:
1.  Definiciones de tipos centralizadas
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de los tipos relacionados
4.  Mantenibilidad mejorada

## Añadir nuevos tipos
Al añadir nuevos tipos:
1.  Colócalos en el archivo apropiado según su categoría
2.  Añade comentarios JSDoc para documentar su propósito y uso
3.  Expórtalos desde el archivo `index.ts` correspondiente
4.  Si creas una nueva categoría, añade un nuevo archivo y actualiza el `index.ts` principal
`````

## File: src/types/types.ts
`````typescript
export type Page = 'catalog' | 'charts' | 'add-game' | 'about' | 'calendar';
export type ViewMode = 'grid' | 'list';
`````

## File: src/utils/README.md
`````markdown
# Directorio de Utilidades

Este directorio contiene funciones de utilidad utilizadas en toda la aplicación Venezuela Juega.

## Estructura

- `stringUtils.ts` - Utilidades de manipulación de cadenas (strings) como `parseStringToArray`
- `gameUtils.ts` - Utilidades relacionadas con juegos como `mapStatus`, `generateSlug` y `ensureUniqueSlug`
- `index.ts` - Reexporta todas las funciones de utilidad

## Uso

Importa las funciones de utilidad desde el punto de exportación central:

```typescript
import { parseStringToArray, generateSlug, mapStatus } from '../utils';
```

Este enfoque proporciona varios beneficios:

1.  Funciones de utilidad centralizadas
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de las funciones relacionadas
4.  Reutilización mejorada entre componentes

## Añadir Nuevas Utilidades

Al añadir nuevas funciones de utilidad:

1.  Determina la categoría apropiada para la función
2.  Añade la función a un archivo existente si encaja en la categoría, o crea un nuevo archivo si es necesario
3.  Añade comentarios JSDoc para documentar el propósito de la función, sus parámetros, el valor de retorno y ejemplos de uso
4.  Exporta la función desde el archivo
5.  Añade la exportación al archivo `index.ts` si estás usando un archivo nuevo

## Mejores Prácticas

- Mantén las funciones de utilidad puras (sin efectos secundarios)
- Haz que las funciones se centren en una única responsabilidad
- Incluye comentarios JSDoc completos con ejemplos
- Usa TypeScript para la seguridad de tipos (*type safety*)
- Considera añadir pruebas unitarias para las funciones complejas
- Agrupa las funciones relacionadas en el mismo archivo
`````

## File: .agents/rules/spacetimedb-typescript.md
`````markdown
---
description: "⛔ MANDATORY: Read this ENTIRE file before writing ANY SpacetimeDB TypeScript code. Contains critical SDK patterns and HALLUCINATED APIs to avoid."
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
alwaysApply: true
---
# SpacetimeDB TypeScript SDK

## ⛔ HALLUCINATED APIs — DO NOT USE
LLMs frequently hallucinate these:
```typescript
// ❌ WRONG PACKAGE
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";
// ❌ WRONG METHODS
SpacetimeDBClient.connect(...);
SpacetimeDBClient.call("reducer_name", [...]);
connection.call("reducer_name", [arg1, arg2]);
// ❌ WRONG REDUCER ARGS
conn.reducers.doSomething("value"); // Positions are WRONG
// ❌ WRONG DATA ACCESS
User.filterByName('alice');
tables.user.filter(u => u.name === 'alice'); // No .filter() on tables
```

### ✅ CORRECT PATTERNS
```typescript
// ✅ CORRECT IMPORTS
import { DbConnection, tables } from './module_bindings';
import { SpacetimeDBProvider, useTable, Identity } from 'spacetimedb/react';
// ✅ CORRECT REDUCER CALLS — Object syntax
conn.reducers.doSomething({ value: 'test' });
// ✅ CORRECT DATA ACCESS — Tuple destructuring
const [items, isLoading] = useTable(tables.item);
```

## 1) Common Mistakes
### Server-side Errors
- **Indexes in OPTIONS (1st arg)**: `table({ name, indexes }, { columns })` not in columns
- **Single-column index lookup**: Multi-column index `.filter()` is broken
- **`insert` returns ROW, not ID**
- **BigInt syntax**: All u64/i64 use `0n`, `1n`, etc.
- **Procedures**: No `ctx.db` directly; use `ctx.withTx(tx => tx.db...)`

### Client-side Errors
- **Package name**: `spacetimedb` NOT `@spacetimedb/sdk`
- **Reducer syntax**: `conn.reducers.foo({ param: "val" })`
- **Memoize connection**: Use `useMemo(() =>builder..., [])`

## 2) Table Definition
```typescript
import { schema, table, t } from 'spacetimedb/server';
// ⚠️ Indexes in first argument object
export const Task = table({ 
  name: 'task',
  indexes: [{ name: 'by_owner', algorithm: 'btree', columns: ['ownerId'] }]
}, {
  id: t.u64().primaryKey().autoInc(),
  ownerId: t.identity(),
  title: t.string(),
});
```

## 3) Index Access
- **Primary key**: `.pkColumn.find(val)`
- **Explicit index**: `.index_name_from_schema.filter(val)`
- **No index**: `[...ctx.db.table.iter()].filter(...)` (use sparingly)

## 4) Reducers
- **Name from export**: `export const reducer_name = spacetimedb.reducer(...)`
- **Update pattern**: `ctx.db.task.id.update({ ...existing, title: newTitle })` (Spread first!)
- **Lifecycle hooks**: `spacetimedb.clientConnected(...)`, `spacetimedb.clientDisconnected(...)`

## 5) Timestamps
- **Server**: `ctx.timestamp`
- **Client**: `new Date(Number(row.createdAt.microsSinceUnixEpoch / 1000n))`

## 6) Data Visibility & Views
- **`public: true`**: Everyone sees all rows.
- **Views (Recommended)**: Server-side filtering. Use index lookups.
- **Anonymous View**: Shared result for everyone.

## 7) React Integration
- **`useTable`**: returns `[rows, isLoading]`
- **Identities**: Compare using `.toHexString()`
`````

## File: .agents/rules/spacetimedb.md
`````markdown
---
description: "⛔ MANDATORY: Core SpacetimeDB concepts (all languages)."
globs: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.rs,**/*.cs"
alwaysApply: true
---
# SpacetimeDB Rules (All Languages)

## Migrating 1.0 → 2.0
If migrating existing SpacetimeDB 1.0 code, follow the migration rules. Documents breaking changes (reducer callbacks → event tables, `name`→`accessor`, `sender()` method, etc.).

## Language-Specific Rules
- **TypeScript/React** → `.agents/rules/spacetimedb-typescript.md`
- **Rust** → `.agents/rules/spacetimedb-rust.md`
- **C#** → `.agents/rules/spacetimedb-csharp.md`

## Core Concepts
1. **Reducers are transactional** — they do not return data to callers
2. **Reducers must be deterministic** — no filesystem, network, timers, or random
3. **Read data via tables/subscriptions** — not reducer return values
4. **Auto-increment IDs are not sequential** — gaps are normal, don't use for ordering
5. **`ctx.sender` is the authenticated principal** — never trust identity args

## Feature Implementation Checklist
When implementing feature that spans backend and client:
1. **Backend:** Define table(s) to store data
2. **Backend:** Define reducer(s) to mutate data
3. **Client:** Subscribe to table(s)
4. **Client:** Call reducer(s) from UI — **don't forget this step!**
5. **Client:** Render data from table(s)

## Index System
SpacetimeDB automatically creates indexes for:
- Primary key columns
- Columns marked as unique

You can add explicit indexes on non-unique columns for query performance.
**Index names must be unique across entire module (all tables).** 

## Commands
```bash
# Login to allow remote deployment
spacetime login
# Start local SpacetimeDB
spacetime start
# Publish module
spacetime publish <db-name> --module-path <module-path>
# Clear and republish
spacetime publish <db-name> --clear-database -y --module-path <module-path>
# Generate client bindings
spacetime generate --lang <lang> --out-dir <out> --module-path <module-path>
# View logs
spacetime logs <db-name>
```

## Deployment
- Maincloud is hosted cloud and default location
- Default server marked by `***` in `spacetime server list`
- Dashboard URL: `https://spacetimedb.com/@<username>/<database-name>`

## Debugging
1. Is server running? (`spacetime start`)
2. Is module published? (`spacetime publish`)
3. Are bindings generated? (`spacetime generate`)
4. Check server logs (`spacetime logs <db-name>`)
5. Is the reducer actually called from client?
`````

## File: .agents/skills/caveman-commit/SKILL.md
`````markdown
---
name: caveman-commit
description: >
  Ultra-compressed commit message generator. Cuts noise from commit messages while preserving
  intent and reasoning. Conventional Commits format. Subject ≤50 chars, body only when "why"
  isn't obvious. Use when user says "write a commit", "commit message", "generate commit",
  "/commit", or invokes /caveman-commit. Auto-triggers when staging changes.
---

Write commit messages terse and exact. Conventional Commits format. No fluff. Why over what.

## Rules

**Subject line:**
- `<type>(<scope>): <imperative summary>` — `<scope>` optional
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`
- Imperative mood: "add", "fix", "remove" — not "added", "adds", "adding"
- ≤50 chars when possible, hard cap 72
- No trailing period
- Match project convention for capitalization after the colon

**Body (only if needed):**
- Skip entirely when subject is self-explanatory
- Add body only for: non-obvious *why*, breaking changes, migration notes, linked issues
- Wrap at 72 chars
- Bullets `-` not `*`
- Reference issues/PRs at end: `Closes #42`, `Refs #17`

**What NEVER goes in:**
- "This commit does X", "I", "we", "now", "currently" — the diff says what
- "As requested by..." — use Co-authored-by trailer
- "Generated with Claude Code" or any AI attribution
- Emoji (unless project convention requires)
- Restating the file name when scope already says it

## Examples

Diff: new endpoint for user profile with body explaining the why
- ❌ "feat: add a new endpoint to get user profile information from the database"
- ✅
  ```
  feat(api): add GET /users/:id/profile

  Mobile client needs profile data without the full user payload
  to reduce LTE bandwidth on cold-launch screens.

  Closes #128
  ```

Diff: breaking API change
- ✅
  ```
  feat(api)!: rename /v1/orders to /v1/checkout

  BREAKING CHANGE: clients on /v1/orders must migrate to /v1/checkout
  before 2026-06-01. Old route returns 410 after that date.
  ```

## Auto-Clarity

Always include body for: breaking changes, security fixes, data migrations, anything reverting a prior commit. Never compress these into subject-only — future debuggers need the context.

## Boundaries

Only generates the commit message. Does not run `git commit`, does not stage files, does not amend. Output the message as a code block ready to paste. "stop caveman-commit" or "normal mode": revert to verbose commit style.
`````

## File: .agents/skills/caveman-compress/README.md
`````markdown
<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/rock_1faa8.png" width="80" />
</p>

<h1 align="center">caveman-compress</h1>

<p align="center">
  <strong>shrink memory file. save token every session.</strong>
</p>

---

A Claude Code skill that compresses your project memory files (`CLAUDE.md`, todos, preferences) into caveman format — so every session loads fewer tokens automatically.

Claude read `CLAUDE.md` on every session start. If file big, cost big. Caveman make file small. Cost go down forever.

## What It Do

```
/caveman:compress CLAUDE.md
```

```
CLAUDE.md          ← compressed (Claude reads this — fewer tokens every session)
CLAUDE.original.md ← human-readable backup (you edit this)
```

Original never lost. You can read and edit `.original.md`. Run skill again to re-compress after edits.

## Benchmarks

Real results on real project files:

| File | Original | Compressed | Saved |
|------|----------:|----------:|------:|
| `claude-md-preferences.md` | 706 | 285 | **59.6%** |
| `project-notes.md` | 1145 | 535 | **53.3%** |
| `claude-md-project.md` | 1122 | 636 | **43.3%** |
| `todo-list.md` | 627 | 388 | **38.1%** |
| `mixed-with-code.md` | 888 | 560 | **36.9%** |
| **Average** | **898** | **481** | **46%** |

All validations passed ✅ — headings, code blocks, URLs, file paths preserved exactly.

## Before / After

<table>
<tr>
<td width="50%">

### 📄 Original (706 tokens)

> "I strongly prefer TypeScript with strict mode enabled for all new code. Please don't use `any` type unless there's genuinely no way around it, and if you do, leave a comment explaining the reasoning. I find that taking the time to properly type things catches a lot of bugs before they ever make it to runtime."

</td>
<td width="50%">

### 🪨 Caveman (285 tokens)

> "Prefer TypeScript strict mode always. No `any` unless unavoidable — comment why if used. Proper types catch bugs early."

</td>
</tr>
</table>

**Same instructions. 60% fewer tokens. Every. Single. Session.**

## Security

`caveman-compress` is flagged as Snyk High Risk due to subprocess and file I/O patterns detected by static analysis. This is a false positive — see [SECURITY.md](./SECURITY.md) for a full explanation of what the skill does and does not do.

## Install

Compress is built in with the `caveman` plugin. Install `caveman` once, then use `/caveman:compress`.

If you need local files, the compress skill lives at:

```bash
caveman-compress/
```

**Requires:** Python 3.10+

## Usage

```
/caveman:compress <filepath>
```

Examples:
```
/caveman:compress CLAUDE.md
/caveman:compress docs/preferences.md
/caveman:compress todos.md
```

### What files work

| Type | Compress? |
|------|-----------|
| `.md`, `.txt`, `.rst` | ✅ Yes |
| Extensionless natural language | ✅ Yes |
| `.py`, `.js`, `.ts`, `.json`, `.yaml` | ❌ Skip (code/config) |
| `*.original.md` | ❌ Skip (backup files) |

## How It Work

```
/caveman:compress CLAUDE.md
        ↓
detect file type        (no tokens)
        ↓
Claude compresses       (tokens — one call)
        ↓
validate output         (no tokens)
  checks: headings, code blocks, URLs, file paths, bullets
        ↓
if errors: Claude fixes cherry-picked issues only   (tokens — targeted fix)
  does NOT recompress — only patches broken parts
        ↓
retry up to 2 times
        ↓
write compressed → CLAUDE.md
write original   → CLAUDE.original.md
```

Only two things use tokens: initial compression + targeted fix if validation fails. Everything else is local Python.

## What Is Preserved

Caveman compress natural language. It never touch:

- Code blocks (` ``` ` fenced or indented)
- Inline code (`` `backtick content` ``)
- URLs and links
- File paths (`/src/components/...`)
- Commands (`npm install`, `git commit`)
- Technical terms, library names, API names
- Headings (exact text preserved)
- Tables (structure preserved, cell text compressed)
- Dates, version numbers, numeric values

## Why This Matter

`CLAUDE.md` loads on **every session start**. A 1000-token project memory file costs tokens every single time you open a project. Over 100 sessions that's 100,000 tokens of overhead — just for context you already wrote.

Caveman cut that by ~46% on average. Same instructions. Same accuracy. Less waste.

```
┌────────────────────────────────────────────┐
│  TOKEN SAVINGS PER FILE    █████       46% │
│  SESSIONS THAT BENEFIT     ██████████ 100% │
│  INFORMATION PRESERVED     ██████████ 100% │
│  SETUP TIME                █            1x │
└────────────────────────────────────────────┘
```

## Part of Caveman

This skill is part of the [caveman](https://github.com/JuliusBrussee/caveman) toolkit — making Claude use fewer tokens without losing accuracy.

- **caveman** — make Claude *speak* like caveman (cuts response tokens ~65%)
- **caveman-compress** — make Claude *read* less (cuts context tokens ~46%)
`````

## File: .agents/skills/caveman-compress/SECURITY.md
`````markdown
# Security

## Snyk High Risk Rating

`caveman-compress` receives a Snyk High Risk rating due to static analysis heuristics. This document explains what the skill does and does not do.

### What triggers the rating

1. **subprocess usage**: The skill calls the `claude` CLI via `subprocess.run()` as a fallback when `ANTHROPIC_API_KEY` is not set. The subprocess call uses a fixed argument list — no shell interpolation occurs. User file content is passed via stdin, not as a shell argument.

2. **File read/write**: The skill reads the file the user explicitly points it at, compresses it, and writes the result back to the same path. A `.original.md` backup is saved alongside it. No files outside the user-specified path are read or written.

### What the skill does NOT do

- Does not execute user file content as code
- Does not make network requests except to Anthropic's API (via SDK or CLI)
- Does not access files outside the path the user provides
- Does not use shell=True or string interpolation in subprocess calls
- Does not collect or transmit any data beyond the file being compressed

### Auth behavior

If `ANTHROPIC_API_KEY` is set, the skill uses the Anthropic Python SDK directly (no subprocess). If not set, it falls back to the `claude` CLI, which uses the user's existing Claude desktop authentication.

### File size limit

Files larger than 500KB are rejected before any API call is made.

### Reporting a vulnerability

If you believe you've found a genuine security issue, please open a GitHub issue with the label `security`.
`````

## File: .agents/skills/caveman-compress/SKILL.md
`````markdown
---
name: caveman-compress
description: >
  Compress natural language memory files (CLAUDE.md, todos, preferences) into caveman format
  to save input tokens. Preserves all technical substance, code, URLs, and structure.
  Compressed version overwrites the original file. Human-readable backup saved as FILE.original.md.
  Trigger: /caveman:compress <filepath> or "compress memory file"
---

# Caveman Compress

## Purpose

Compress natural language files (CLAUDE.md, todos, preferences) into caveman-speak to reduce input tokens. Compressed version overwrites original. Human-readable backup saved as `<filename>.original.md`.

## Trigger

`/caveman:compress <filepath>` or when user asks to compress a memory file.

## Process

1. The compression scripts live in `caveman-compress/scripts/` (adjacent to this SKILL.md). If the path is not immediately available, search for `caveman-compress/scripts/__main__.py`.

2. Run:

cd caveman-compress && python3 -m scripts <absolute_filepath>

3. The CLI will:
- detect file type (no tokens)
- call Claude to compress
- validate output (no tokens)
- if errors: cherry-pick fix with Claude (targeted fixes only, no recompression)
- retry up to 2 times
- if still failing after 2 retries: report error to user, leave original file untouched

4. Return result to user

## Compression Rules

### Remove
- Articles: a, an, the
- Filler: just, really, basically, actually, simply, essentially, generally
- Pleasantries: "sure", "certainly", "of course", "happy to", "I'd recommend"
- Hedging: "it might be worth", "you could consider", "it would be good to"
- Redundant phrasing: "in order to" → "to", "make sure to" → "ensure", "the reason is because" → "because"
- Connective fluff: "however", "furthermore", "additionally", "in addition"

### Preserve EXACTLY (never modify)
- Code blocks (fenced ``` and indented)
- Inline code (`backtick content`)
- URLs and links (full URLs, markdown links)
- File paths (`/src/components/...`, `./config.yaml`)
- Commands (`npm install`, `git commit`, `docker build`)
- Technical terms (library names, API names, protocols, algorithms)
- Proper nouns (project names, people, companies)
- Dates, version numbers, numeric values
- Environment variables (`$HOME`, `NODE_ENV`)

### Preserve Structure
- All markdown headings (keep exact heading text, compress body below)
- Bullet point hierarchy (keep nesting level)
- Numbered lists (keep numbering)
- Tables (compress cell text, keep structure)
- Frontmatter/YAML headers in markdown files

### Compress
- Use short synonyms: "big" not "extensive", "fix" not "implement a solution for", "use" not "utilize"
- Fragments OK: "Run tests before commit" not "You should always run tests before committing"
- Drop "you should", "make sure to", "remember to" — just state the action
- Merge redundant bullets that say the same thing differently
- Keep one example where multiple examples show the same pattern

CRITICAL RULE:
Anything inside ``` ... ``` must be copied EXACTLY.
Do not:
- remove comments
- remove spacing
- reorder lines
- shorten commands
- simplify anything

Inline code (`...`) must be preserved EXACTLY.
Do not modify anything inside backticks.

If file contains code blocks:
- Treat code blocks as read-only regions
- Only compress text outside them
- Do not merge sections around code

## Pattern

Original:
> You should always make sure to run the test suite before pushing any changes to the main branch. This is important because it helps catch bugs early and prevents broken builds from being deployed to production.

Compressed:
> Run tests before push to main. Catch bugs early, prevent broken prod deploys.

Original:
> The application uses a microservices architecture with the following components. The API gateway handles all incoming requests and routes them to the appropriate service. The authentication service is responsible for managing user sessions and JWT tokens.

Compressed:
> Microservices architecture. API gateway route all requests to services. Auth service manage user sessions + JWT tokens.

## Boundaries

- ONLY compress natural language files (.md, .txt, extensionless)
- NEVER modify: .py, .js, .ts, .json, .yaml, .yml, .toml, .env, .lock, .css, .html, .xml, .sql, .sh
- If file has mixed content (prose + code), compress ONLY the prose sections
- If unsure whether something is code or prose, leave it unchanged
- Original file is backed up as FILE.original.md before overwriting
- Never compress FILE.original.md (skip it)
`````

## File: .agents/skills/caveman-review/SKILL.md
`````markdown
---
name: caveman-review
description: >
  Ultra-compressed code review comments. Cuts noise from PR feedback while preserving
  the actionable signal. Each comment is one line: location, problem, fix. Use when user
  says "review this PR", "code review", "review the diff", "/review", or invokes
  /caveman-review. Auto-triggers when reviewing pull requests.
---

Write code review comments terse and actionable. One line per finding. Location, problem, fix. No throat-clearing.

## Rules

**Format:** `L<line>: <problem>. <fix>.` — or `<file>:L<line>: ...` when reviewing multi-file diffs.

**Severity prefix (optional, when mixed):**
- `🔴 bug:` — broken behavior, will cause incident
- `🟡 risk:` — works but fragile (race, missing null check, swallowed error)
- `🔵 nit:` — style, naming, micro-optim. Author can ignore
- `❓ q:` — genuine question, not a suggestion

**Drop:**
- "I noticed that...", "It seems like...", "You might want to consider..."
- "This is just a suggestion but..." — use `nit:` instead
- "Great work!", "Looks good overall but..." — say it once at the top, not per comment
- Restating what the line does — the reviewer can read the diff
- Hedging ("perhaps", "maybe", "I think") — if unsure use `q:`

**Keep:**
- Exact line numbers
- Exact symbol/function/variable names in backticks
- Concrete fix, not "consider refactoring this"
- The *why* if the fix isn't obvious from the problem statement

## Examples

❌ "I noticed that on line 42 you're not checking if the user object is null before accessing the email property. This could potentially cause a crash if the user is not found in the database. You might want to add a null check here."

✅ `L42: 🔴 bug: user can be null after .find(). Add guard before .email.`

❌ "It looks like this function is doing a lot of things and might benefit from being broken up into smaller functions for readability."

✅ `L88-140: 🔵 nit: 50-line fn does 4 things. Extract validate/normalize/persist.`

❌ "Have you considered what happens if the API returns a 429? I think we should probably handle that case."

✅ `L23: 🟡 risk: no retry on 429. Wrap in withBackoff(3).`

## Auto-Clarity

Drop terse mode for: security findings (CVE-class bugs need full explanation + reference), architectural disagreements (need rationale, not just a one-liner), and onboarding contexts where the author is new and needs the "why". In those cases write a normal paragraph, then resume terse for the rest.

## Boundaries

Reviews only — does not write the code fix, does not approve/request-changes, does not run linters. Output the comment(s) ready to paste into the PR. "stop caveman-review" or "normal mode": revert to verbose review style.
`````

## File: .agents/skills/caveman/SKILL.md
`````markdown
---
name: caveman
description: >
  Ultra-compressed communication mode. Cuts token usage ~75% by speaking like caveman
  while keeping full technical accuracy. Supports intensity levels: lite, full (default), ultra,
  wenyan-lite, wenyan-full, wenyan-ultra.
  Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens",
  "be brief", or invokes /caveman. Also auto-triggers when token efficiency is requested.
---

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Persistence

ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift. Still active if unsure. Off only: "stop caveman" / "normal mode".

Default: **full**. Switch: `/caveman lite|full|ultra`.

## Rules

Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). Technical terms exact. Code blocks unchanged. Errors quoted exact.

Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

## Intensity

| Level | What change |
|-------|------------|
| **lite** | No filler/hedging. Keep articles + full sentences. Professional but tight |
| **full** | Drop articles, fragments OK, short synonyms. Classic caveman |
| **ultra** | Abbreviate (DB/auth/config/req/res/fn/impl), strip conjunctions, arrows for causality (X → Y), one word when one word enough |
| **wenyan-lite** | Semi-classical. Drop filler/hedging but keep grammar structure, classical register |
| **wenyan-full** | Maximum classical terseness. Fully 文言文. 80-90% character reduction. Classical sentence patterns, verbs precede objects, subjects often omitted, classical particles (之/乃/為/其) |
| **wenyan-ultra** | Extreme abbreviation while keeping classical Chinese feel. Maximum compression, ultra terse |

Example — "Why React component re-render?"
- lite: "Your component re-renders because you create a new object reference each render. Wrap it in `useMemo`."
- full: "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."
- ultra: "Inline obj prop → new ref → re-render. `useMemo`."
- wenyan-lite: "組件頻重繪，以每繪新生對象參照故。以 useMemo 包之。"
- wenyan-full: "物出新參照，致重繪。useMemo .Wrap之。"
- wenyan-ultra: "新參照→重繪。useMemo Wrap。"

Example — "Explain database connection pooling."
- lite: "Connection pooling reuses open connections instead of creating new ones per request. Avoids repeated handshake overhead."
- full: "Pool reuse open DB connections. No new connection per request. Skip handshake overhead."
- ultra: "Pool = reuse DB conn. Skip handshake → fast under load."
- wenyan-full: "池reuse open connection。不每req新開。skip handshake overhead。"
- wenyan-ultra: "池reuse conn。skip handshake → fast。"

## Auto-Clarity

Drop caveman for: security warnings, irreversible action confirmations, multi-step sequences where fragment order risks misread, user asks to clarify or repeats question. Resume caveman after clear part done.

Example — destructive op:
> **Warning:** This will permanently delete all rows in the `users` table and cannot be undone.
> ```sql
> DROP TABLE users;
> ```
> Caveman resume. Verify backup exist first.

## Boundaries

Code/commits/PRs: write normal. "stop caveman" or "normal mode": revert. Level persist until changed or session end.
`````

## File: .agents/skills/daisyui/actions-button.md
`````markdown
# DaisyUI Actions: Buttons

Comprehensive guide for `btn` classes in daisyUI 5.

## Basic Patterns
Buttons come in various colors and styles. Always prefer semantic modifiers.

```html
<!-- Colors -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-error">Error</button>

<!-- Styles -->
<button class="btn btn-soft">Soft (Light background)</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost (No background)</button>
<button class="btn btn-dash">Dashed Border</button>
<button class="btn btn-link">Link Style</button>
```

## Pattern: Sizing & Shapes
Use size modifiers for consistent scaling across devices.

```html
<!-- Sizes -->
<button class="btn btn-xs">Extra Small</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Medium (Default)</button>
<button class="btn btn-lg">Large</button>
<button class="btn btn-xl">Extra Large</button>

<!-- Shapes -->
<button class="btn btn-square">
  <svg>...</svg>
</button>
<button class="btn btn-circle">
  <svg>...</svg>
</button>
<button class="btn btn-wide">Wide Button</button>
<button class="btn btn-block">Full Width</button>
```

## Good vs. Bad Buttons
```html
<!-- Good: Semantic and accessible -->
<button class="btn btn-primary btn-sm" aria-label="Submit Form">
  Submit
</button>

<!-- Bad: Over-relying on Tailwind utilities -->
<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
  Manual Button (Harder to theme)
</button>
```

## Quick Reference: State Classes
- `btn-disabled` / `disabled`: Applies grayed out style and removes pointer events.
- `btn-active`: Forces active/pressed state visual.
- `loading`: (Handled via feedback-loading.md) Can be added to buttons.
`````

## File: .agents/skills/daisyui/actions-dropdown.md
`````markdown
# Actions: Dropdown

DaisyUI dropdowns use HTML `<details>` or custom `.dropdown` classes to display a list of actions or links.

## Hover & Click Triggers

### Good Example: Standard Click Dropdown
```html
<div class="dropdown">
  <div tabindex="0" role="button" class="btn m-1">Click Me</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```
*Note: `z-[1]` or `z-1` in Tailwind 4 is needed so the dropdown floats above content.*

### Good Example: Hover Dropdown
```html
<div class="dropdown dropdown-hover">
  <div tabindex="0" role="button" class="btn m-1">Hover Me</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
    <li><a>Item 1</a></li>
  </ul>
</div>
```

## Positioning

Use directional modifier classes to change where the menu appears.

### Good Example: Dropdown Directions
```html
<!-- Top -->
<div class="dropdown dropdown-top">...</div>
<!-- Left -->
<div class="dropdown dropdown-left">...</div>
<!-- Right -->
<div class="dropdown dropdown-right">...</div>
<!-- End (RTL Support) -->
<div class="dropdown dropdown-end">...</div>
```

### Bad Example: Custom Positioning
```html
<!-- Bad: Using arbitrary margins instead of built-in directional classes -->
<div class="dropdown">
  <div class="btn">Click</div>
  <ul class="dropdown-content mt-[-200px]">...</ul>
</div>
```
`````

## File: .agents/skills/daisyui/actions-modal.md
`````markdown
# Actions: Modal

DaisyUI 5 recommends using the native HTML `<dialog>` element for modals to ensure accessibility, focus trapping, and native backdrop support.

## Standard Modal

### Good Example: Native Dialog Modal
```html
<!-- Trigger -->
<button class="btn" onclick="my_modal_1.showModal()">Open Modal</button>

<!-- Modal Content -->
<dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
```

## Click Outside to Close

### Good Example: Backdrop Close
```html
<dialog id="my_modal_2" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Close via backdrop</h3>
  </div>
  <!-- Clicking this form area closes the dialog -->
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```

### Bad Example: Checkbox Hack (Outdated)
```html
<!-- Bad: While DaisyUI supports this, the <dialog> approach is more accessible and semantic. -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">...</div>
</div>
```
`````

## File: .agents/skills/daisyui/actions-speed-dial.md
`````markdown
# DaisyUI Actions: Speed Dial

A fixed-position floating action button that reveals secondary actions when clicked or hovered.

## Basic Usage
Speed Dial uses the `dropdown` class combined with `fixed` and `btn-circle` for a classic floating action button feel.

```html
<div class="dropdown dropdown-top dropdown-end fixed right-6 bottom-6">
  <div tabindex="0" role="button" class="btn btn-primary btn-circle btn-lg shadow-xl">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl mb-4">
    <li><a><svg>...</svg> New Document</a></li>
    <li><a><svg>...</svg> Upload Photo</a></li>
    <li><a><svg>...</svg> Share Link</a></li>
  </ul>
</div>
```

## Good vs. Bad Speed Dial
```html
<!-- Good: Semantic and properly positioned -->
<div class="dropdown dropdown-top fixed bottom-8 right-8">
  <button class="btn btn-accent btn-circle shadow-lg" aria-label="Quick Actions">
    +
  </button>
  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box mb-2">
    <li><a>Action 1</a></li>
  </ul>
</div>

<!-- Bad: Manual absolute positioning and z-index hacks -->
<div class="absolute bottom-0 right-0 z-50 p-4">
  <button class="rounded-full h-12 w-12 bg-blue-500">
    +
  </button>
</div>
```

## Variants
- `dropdown-top`: Opens upwards (common for FABs).
- `dropdown-left` / `dropdown-right`: Horizontal speed dials.
- `btn-circle`: Essential for the rounded floating action button look.
`````

## File: .agents/skills/daisyui/actions-swap.md
`````markdown
# Actions: Swap

The `swap` class allows toggling between two different elements (usually icons, text, or SVGs) using a hidden checkbox or dynamically via a class toggle.

## Checkbox Trigger

### Good Example: Icon Swap (Active/Inactive)
```html
<label class="swap swap-rotate">
  <!-- This hidden checkbox controls the state -->
  <input type="checkbox" />

  <!-- Sun icon (shown when unchecked) -->
  <svg class="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <!-- SVG Path -->
  </svg>

  <!-- Moon icon (shown when checked) -->
  <svg class="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <!-- SVG Path -->
  </svg>
</label>
```

## Animation Variants

Use modifier classes to change the transition effect.

- `swap-rotate`: Rotates the elements during the swap.
- `swap-flip`: Flips the elements 3D style.

### Good Example: Flip Animation with Text
```html
<label class="swap swap-flip text-9xl">
  <input type="checkbox" />
  <div class="swap-on">😈</div>
  <div class="swap-off">😇</div>
</label>
```

### Bad Example: Manual State Management for Pure UI Swaps
```html
<!-- Bad: Using JS for a purely visual toggle when CSS can handle it via the 'swap' class -->
<div onclick="toggleIcon()">
  <span id="icon-a">A</span>
  <span id="icon-b" class="hidden">B</span>
</div>
```
`````

## File: .agents/skills/daisyui/actions-theme-controller.md
`````markdown
# DaisyUI Actions: Theme Controller

A toggle, radio, or checkbox component that automatically switches themes for the entire document or a specific container.

## Basic Usage
The `theme-controller` class is used on an input element. It listens for changes and applies the theme specified in the `value` attribute.

```html
<!-- Toggle style -->
<input type="checkbox" value="synthwave" class="toggle theme-controller" />

<!-- Swap style (using icons) -->
<label class="swap swap-rotate">
  <input type="checkbox" class="theme-controller" value="light" />
  <!-- sun icon -->
  <svg class="swap-on ...">...</svg>
  <!-- moon icon -->
  <svg class="swap-off ...">...</svg>
</label>
```

## Pattern: Radio Theme Selection
Use radios with `theme-controller` to provide multiple theme choices.

```html
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Default</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="default"/>
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Retro</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="retro"/>
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer gap-4">
    <span class="label-text">Cyberpunk</span>
    <input type="radio" name="theme-buttons" class="radio theme-controller" value="cyberpunk"/>
  </label>
</div>
```

## Good vs. Bad Theme Switching
```html
<!-- Good: Declarative theme control -->
<input type="checkbox" value="dark" class="checkbox theme-controller" />

<!-- Bad: Manual JS theme toggling with classList manipulation -->
<button onclick="document.documentElement.setAttribute('data-theme', 'dark')">
  Dark Mode (Requires extra JS boilerplate)
</button>
```
`````

## File: .agents/skills/daisyui/base-style.md
`````markdown
# Base Style

DaisyUI 5 relies on Tailwind CSS 4 and OKLCH color spaces. Base styles are automatically applied to standard HTML elements when using the plugin, but can be customized heavily using CSS variables.

## Semantic Colors and OKLCH

Colors in DaisyUI 5 are defined using OKLCH to ensure perceptual uniformity.

### Good Example: Overriding Colors in CSS
```css
/* Customizing base colors in Tailwind 4 / DaisyUI 5 */
@theme {
  --color-primary: oklch(0.65 0.25 250);
  --color-secondary: oklch(0.7 0.15 300);
  --color-base-100: oklch(0.98 0.01 200);
  --color-base-content: oklch(0.2 0.05 200);
}
```

### Good Example: Using Semantic Variables in Utility Classes
```html
<!-- Use semantic names directly, mapping to standard Tailwind 4 colors -->
<div class="bg-base-100 text-base-content">
  <h1 class="text-primary">Welcome</h1>
  <p class="text-secondary">This text uses the secondary color.</p>
</div>
```

### Bad Example: Hardcoding Hex Codes
```html
<!-- Bad: Breaks theme support and OKLCH perceptual lightness -->
<div class="bg-[#ffffff] text-[#333333]">
  <h1 class="text-[#3b82f6]">Welcome</h1>
</div>
```

## Key Variables
- `base-100`: Main background color.
- `base-200`, `base-300`: Slightly darker variants for cards or panels.
- `base-content`: Text color for `base-*` backgrounds.
- `primary`, `secondary`, `accent`, `neutral`: Brand colors.
- `info`, `success`, `warning`, `error`: State colors.
`````

## File: .agents/skills/daisyui/data-display-accordion.md
`````markdown
# Data Display: Accordion

DaisyUI uses the `.collapse` class with radio inputs to create a mutually exclusive accordion.

## Mutually Exclusive Accordion (Single Open)

### Good Example: Radio Input Accordion
```html
<div class="join join-vertical w-full">
  <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" checked="checked" /> 
    <div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
    <div class="collapse-content"> 
      <p>Content for the first section.</p>
    </div>
  </div>
  <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" /> 
    <div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
    <div class="collapse-content"> 
      <p>Content for the second section.</p>
    </div>
  </div>
</div>
```
*Note: Using `name="my-accordion-4"` on all radio inputs groups them, ensuring only one can be checked at a time.*

## Multiple Open Accordion (Independent)

If you want multiple sections to be open simultaneously, use `type="checkbox"` or the HTML `<details>` element instead of radio buttons. See the `collapse` component for more details.

### Bad Example: Missing Name Attribute
```html
<!-- Bad: Missing 'name' attribute means they act as independent checkboxes, breaking the accordion behavior. -->
<div class="collapse">
  <input type="radio" />
  ...
</div>
```
`````

## File: .agents/skills/daisyui/data-display-avatar.md
`````markdown
# DaisyUI Data Display: Avatar

A versatile component for displaying user profile pictures, initials, or status indicators.

## Basic Usage
The `avatar` class wraps an image or text element.

```html
<div class="avatar">
  <div class="w-24 rounded">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
  </div>
</div>

<!-- With placeholder (initials) -->
<div class="avatar placeholder">
  <div class="bg-neutral text-neutral-content w-12 rounded-full">
    <span>JS</span>
  </div>
</div>
```

## Pattern: Sizes & Shapes
Avatars can be shaped using standard Tailwind border-radius classes inside the `avatar` wrapper.

```html
<!-- Rounded-full (Circle) -->
<div class="avatar">
  <div class="w-16 rounded-full">
    <img src="..." />
  </div>
</div>

<!-- Mask Squircle -->
<div class="avatar">
  <div class="mask mask-squircle w-20">
    <img src="..." />
  </div>
</div>
```

## Good vs. Bad Avatar
```html
<!-- Good: Semantic avatar container with proper sizing -->
<div class="avatar">
  <div class="w-12 h-12 rounded-full">
    <img src="user.jpg" alt="User profile" />
  </div>
</div>

<!-- Bad: Manual image styling without container -->
<img src="user.jpg" class="rounded-full w-12 h-12 object-cover border-2 border-white" />
```

## Quick Reference
- `avatar-online`: Adds a green status indicator.
- `avatar-offline`: Adds a gray status indicator.
- `avatar-group`: Wrapper for multiple overlapping avatars.
`````

## File: .agents/skills/daisyui/data-display-badge.md
`````markdown
# Data Display: Badge

Badges are used to highlight an item's status for quick recognition.

## Colors and Variants

DaisyUI provides semantic colors and stylistic variants for badges.

### Good Example: Color Badges
```html
<div class="badge">neutral</div>
<div class="badge badge-primary">primary</div>
<div class="badge badge-secondary">secondary</div>
<div class="badge badge-accent">accent</div>
```

### Good Example: Variant Badges
```html
<div class="badge badge-outline">Outline</div>
<div class="badge badge-ghost">Ghost</div>
<div class="badge badge-soft">Soft</div> <!-- New in DaisyUI 5 -->
```

## Sizes

### Good Example: Sizing Badges
```html
<div class="badge badge-lg">Large</div>
<div class="badge badge-md">Medium</div>
<div class="badge badge-sm">Small</div>
<div class="badge badge-xs">Extra Small</div>
```

## Common Use Case: Badges in Buttons

### Good Example: Badge in a Button
```html
<button class="btn">
  Inbox
  <div class="badge badge-secondary">+99</div>
</button>
```

### Bad Example: Arbitrary Styling
```html
<!-- Bad: Ignoring built-in badge sizes and variants -->
<div class="badge bg-red-500 border-2 border-dashed text-[10px] p-4">Custom</div>
```
`````

## File: .agents/skills/daisyui/data-display-card.md
`````markdown
# Data Display: Card

Cards provide a flexible and extensible content container with multiple variants and options.

## Anatomy of a Card

A card typically contains a figure (image) and a body, which further contains the title, content, and actions.

### Good Example: Standard Card
```html
<div class="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
```

## Variants

### Good Example: Bordered Card
```html
<!-- Add border and remove shadow for a flatter look -->
<div class="card bg-base-100 w-96 border-base-300 border">
  <div class="card-body">...</div>
</div>
```

### Good Example: Image Full (Background Image)
```html
<!-- The image becomes a darkened background behind the text -->
<div class="card image-full bg-base-100 w-96 shadow-sm">
  <figure><img src="..." alt="Shoes" /></figure>
  <div class="card-body">...</div>
</div>
```

### Bad Example: Unstructured Content
```html
<!-- Bad: Missing card-body, text will touch the edges -->
<div class="card bg-base-100 w-96 shadow-sm">
  <h2>Shoes!</h2>
  <button class="btn">Buy</button>
</div>
```
`````

## File: .agents/skills/daisyui/data-display-carousel.md
`````markdown
# Data Display: Carousel

Carousels display multiple items in a scrollable horizontal area. They utilize native CSS scroll snapping.

## Basic Carousel

### Good Example: Standard Scroll Carousel
```html
<div class="carousel rounded-box">
  <div class="carousel-item">
    <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" alt="Burger" />
  </div> 
  <div class="carousel-item">
    <img src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp" alt="Burger" />
  </div>
</div>
```

## Carousels with Navigation

### Good Example: Button Navigation
```html
<div class="carousel w-full">
  <div id="item1" class="carousel-item w-full">
    <img src="..." class="w-full" />
  </div> 
  <div id="item2" class="carousel-item w-full">
    <img src="..." class="w-full" />
  </div>
</div> 
<div class="flex w-full justify-center gap-2 py-2">
  <a href="#item1" class="btn btn-xs">1</a> 
  <a href="#item2" class="btn btn-xs">2</a>
</div>
```

### Good Example: Full-width Items with Prev/Next Buttons
```html
<div class="carousel w-full">
  <div id="slide1" class="carousel-item relative w-full">
    <img src="..." class="w-full" />
    <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" class="btn btn-circle">❮</a> 
      <a href="#slide2" class="btn btn-circle">❯</a>
    </div>
  </div>
</div>
```

### Bad Example: JS Over-engineering
```html
<!-- Bad: Bringing in heavy JS libraries for basic sliders when CSS scroll snap (DaisyUI's approach) works natively and performantly. -->
```
`````

## File: .agents/skills/daisyui/data-display-chat.md
`````markdown
# Data Display: Chat

Chat components style messaging interfaces with avatars, timestamps, and styled bubbles.

## Chat Directions

Use `chat-start` (left) or `chat-end` (right) to determine the alignment of the message.

### Good Example: Chat Start & End
```html
<div class="chat chat-start">
  <div class="chat-bubble">It's over Anakin, I have the high ground.</div>
</div>
<div class="chat chat-end">
  <div class="chat-bubble">You underestimate my power!</div>
</div>
```

## Advanced Anatomy

A complete chat bubble includes headers, footers, and avatars.

### Good Example: Complete Chat Bubble
```html
<div class="chat chat-start">
  <div class="chat-image avatar">
    <div class="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
    </div>
  </div>
  <div class="chat-header">
    Obi-Wan Kenobi
    <time class="text-xs opacity-50">12:45</time>
  </div>
  <div class="chat-bubble chat-bubble-primary">You were the Chosen One!</div>
  <div class="chat-footer opacity-50">Delivered</div>
</div>
```

### Colors

Apply color variants directly to the `chat-bubble`.

### Good Example: Bubble Colors
```html
<div class="chat chat-start">
  <div class="chat-bubble chat-bubble-info">Calm down.</div>
</div>
<div class="chat chat-end">
  <div class="chat-bubble chat-bubble-error">I HATE YOU!</div>
</div>
```
`````

## File: .agents/skills/daisyui/data-display-collapse.md
`````markdown
# Data Display: Collapse

The collapse component hides or shows content based on focus or a checkbox state.

## Native `<details>` Element

This is the most semantic and accessible way to create a collapsible element.

### Good Example: Semantic Details/Summary
```html
<details class="collapse collapse-arrow bg-base-200">
  <summary class="collapse-title text-xl font-medium">Click to open/close</summary>
  <div class="collapse-content">
    <p>Content goes here.</p>
  </div>
</details>
```

## Checkbox or Focus Triggers

If you need specific styling or behavior that `<details>` cannot provide, use hidden inputs.

### Good Example: Checkbox Trigger
```html
<div class="collapse collapse-plus bg-base-200">
  <input type="checkbox" /> 
  <div class="collapse-title text-xl font-medium">Click me to show/hide content</div>
  <div class="collapse-content"> 
    <p>hello</p>
  </div>
</div>
```

### Good Example: Focus Trigger (Closes when clicking away)
```html
<div tabindex="0" class="collapse collapse-arrow border-base-300 bg-base-100 border">
  <div class="collapse-title text-xl font-medium">Focus me to see content</div>
  <div class="collapse-content"> 
    <p>tabindex="0" attribute is necessary to make the div focusable</p>
  </div>
</div>
```

### Bad Example: Invalid Structure
```html
<!-- Bad: Missing collapse-title and collapse-content wrappers -->
<details class="collapse">
  <h1>Click me</h1>
  <p>Content</p>
</details>
```
`````

## File: .agents/skills/daisyui/data-display-countdown.md
`````markdown
# Data Display: Countdown

The countdown component utilizes CSS variables to display numbers. This allows updating the value via JavaScript by changing a single CSS variable rather than manipulating the DOM text directly.

## Usage

Set the `--value` CSS variable using inline styles. The variable accepts an integer between 0 and 99.

### Good Example: Standard Countdown
```html
<span class="countdown">
  <span style="--value:59;"></span>
</span>
```

### Good Example: Clock Format
```html
<span class="countdown font-mono text-2xl">
  <span style="--value:10;"></span>h
  <span style="--value:24;"></span>m
  <span style="--value:59;"></span>s
</span>
```

### Good Example: Updating via JavaScript
```javascript
// Good: Update the style property to change the number
const timer = document.getElementById('seconds');
let time = 60;
setInterval(() => {
  time--;
  timer.style.setProperty('--value', time);
}, 1000);
```

### Bad Example: Direct DOM Manipulation
```html
<!-- Bad: Modifying the innerText instead of using the CSS variable breaks the component's formatting logic -->
<span class="countdown">
  <span id="counter">59</span> 
</span>
```
`````

## File: .agents/skills/daisyui/data-display-diff.md
`````markdown
# DaisyUI Data Display: Diff

A component to compare two images or elements side-by-side with a draggable slider.

## Basic Usage
The `diff` class contains two items and a handle is automatically generated.

```html
<div class="diff aspect-16/9">
  <div class="diff-item-1">
    <img alt="daisyui" src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.webp" />
  </div>
  <div class="diff-item-2">
    <img alt="daisyui" src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp" />
  </div>
  <div class="diff-resizer"></div>
</div>
```

## Pattern: Content Comparison
You can compare text or any HTML content, not just images.

```html
<div class="diff aspect-16/9">
  <div class="diff-item-1">
    <div class="bg-primary text-primary-content grid place-content-center text-9xl font-black">
      BEFORE
    </div>
  </div>
  <div class="diff-item-2">
    <div class="bg-base-200 grid place-content-center text-9xl font-black">
      AFTER
    </div>
  </div>
  <div class="diff-resizer"></div>
</div>
```

## Good vs. Bad Diff
```html
<!-- Good: Using the built-in diff component -->
<div class="diff h-64">...</div>

<!-- Bad: Manual implementation with range inputs and absolute positioning -->
<div class="relative overflow-hidden">
  <div class="absolute inset-0">...</div>
  <input type="range" class="absolute w-full ..." />
</div>
```
`````

## File: .agents/skills/daisyui/data-display-hover-3d-card.md
`````markdown
# DaisyUI Data Display: Hover 3D Card

A visually striking card component that tilts in 3D space based on mouse position.

## Basic Usage
The `hover-3d` class requires 8 empty `div` elements inside to handle the hover detection zones.

```html
<div class="hover-3d h-64 w-96">
  <!-- 8 divs for hover detection -->
  <div></div><div></div><div></div><div></div>
  <div></div><div></div><div></div><div></div>
  
  <div class="hover-3d-card bg-primary text-primary-content grid place-content-center rounded-xl shadow-2xl">
    <div class="text-3xl font-bold">Tilt Me</div>
  </div>
</div>
```

## Patterns
Use `bg-base-100` and `shadow-xl` for a more subtle, professional card look.

```html
<div class="hover-3d h-72 w-60">
  <div></div><div></div><div></div><div></div>
  <div></div><div></div><div></div><div></div>
  <div class="hover-3d-card bg-base-100 p-6 rounded-box shadow-xl border border-base-300">
    <h3 class="text-lg font-bold">Interactive Card</h3>
    <p class="text-sm opacity-70">Move your mouse over this card to see the 3D effect.</p>
  </div>
</div>
```

## Good vs. Bad Hover 3D
```html
<!-- Good: Pure CSS 3D effect using DaisyUI classes -->
<div class="hover-3d">...</div>

<!-- Bad: Heavy JavaScript libraries (like Tilt.js) for simple UI effects -->
<div data-tilt class="manual-tilt-card">...</div>
```
`````

## File: .agents/skills/daisyui/data-display-hover-gallery.md
`````markdown
# DaisyUI Data Display: Hover Gallery

An interactive image gallery where images expand or reveal details on hover.

## Basic Usage
Use `hover-gallery` to create a grid of items that respond to mouse interaction.

```html
<div class="hover-gallery flex flex-wrap gap-4">
  <div class="hover-gallery-item">
    <img src="..." alt="Gallery Image" />
    <div class="hover-gallery-content">
      <h2 class="text-xl">Title</h2>
    </div>
  </div>
</div>
```

## Patterns: Grid Layout
Hover galleries work best with auto-filling grids or flexbox.

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 hover-gallery">
  <div class="hover-gallery-item aspect-square overflow-hidden rounded-box">
    <img src="image1.jpg" class="object-cover" />
    <div class="bg-black/50 text-white p-4">Caption 1</div>
  </div>
  <div class="hover-gallery-item aspect-square overflow-hidden rounded-box">
    <img src="image2.jpg" class="object-cover" />
    <div class="bg-black/50 text-white p-4">Caption 2</div>
  </div>
</div>
```

## Good vs. Bad Gallery
```html
<!-- Good: Pure CSS hover effects with DaisyUI -->
<div class="hover-gallery-item">...</div>

<!-- Bad: Complex JS event listeners for simple overlay toggles -->
<div onmouseenter="showOverlay(this)" onmouseleave="hideOverlay(this)">...</div>
```
`````

## File: .agents/skills/daisyui/data-display-kbd.md
`````markdown
# Data Display: KBD

The KBD component is used to format keyboard shortcuts or key combinations.

## Basic Usage

### Good Example: Individual Keys
```html
<kbd class="kbd">A</kbd>
<kbd class="kbd">Ctrl</kbd>
<kbd class="kbd">⌘</kbd>
```

## Sizes

### Good Example: Responsive Key Sizes
```html
<kbd class="kbd kbd-lg">Shift</kbd>
<kbd class="kbd kbd-md">Shift</kbd>
<kbd class="kbd kbd-sm">Shift</kbd>
<kbd class="kbd kbd-xs">Shift</kbd>
```

## Key Combinations

Group keys together with a plus sign or spacing to show shortcuts.

### Good Example: Shortcut Display
```html
<p>
  Press
  <kbd class="kbd kbd-sm">⌘</kbd>
  +
  <kbd class="kbd kbd-sm">C</kbd>
  to copy.
</p>
```

### Bad Example: Complex Structures inside KBD
```html
<!-- Bad: KBD is an inline text element, do not put block elements inside it -->
<kbd class="kbd">
  <div>Enter</div>
</kbd>
```
`````

## File: .agents/skills/daisyui/data-display-list.md
`````markdown
# DaisyUI Data Display: List

A semantic list component for displaying rows of data, often used for settings, menus, or contact lists.

## Basic Usage
The `list` class is used on the container, and `list-row` on each item.

```html
<ul class="list bg-base-100 rounded-box shadow">
  <li class="list-row">
    <div>
      <div class="font-bold">John Doe</div>
      <div class="text-xs opacity-50">Admin</div>
    </div>
    <button class="btn btn-ghost btn-xs">Edit</button>
  </li>
  <li class="list-row">
    <div>
      <div class="font-bold">Jane Smith</div>
      <div class="text-xs opacity-50">User</div>
    </div>
    <button class="btn btn-ghost btn-xs">Edit</button>
  </li>
</ul>
```

## Pattern: List with Avatars
Combine with `avatar` for professional contact lists.

```html
<div class="list bg-base-100 border border-base-300 rounded-box">
  <div class="list-row items-center p-4">
    <div class="avatar">
      <div class="w-10 rounded-full"><img src="..." /></div>
    </div>
    <div class="flex-1">
      <div class="font-bold">Project Alpha</div>
      <div class="text-sm">Ongoing development</div>
    </div>
    <span class="badge badge-success">Active</span>
  </div>
</div>
```

## Good vs. Bad Lists
```html
<!-- Good: Semantic list rows with flexbox alignment -->
<li class="list-row p-4 hover:bg-base-200 transition-colors">...</li>

<!-- Bad: Manual list styling with border-t hacks -->
<li class="p-4 border-t border-gray-200 last:border-b">...</li>
```
`````

## File: .agents/skills/daisyui/data-display-stat.md
`````markdown
# Data Display: Stat

The stat component groups labels, values, and descriptive text together, often used for dashboards to display Key Performance Indicators (KPIs).

## Anatomy of a Stat

Wrap multiple stats in a `stats` container. Each individual item is a `stat`.

### Good Example: Basic Stats Group
```html
<div class="stats shadow-sm">
  <div class="stat">
    <div class="stat-title">Total Page Views</div>
    <div class="stat-value">89,400</div>
    <div class="stat-desc">21% more than last month</div>
  </div>
</div>
```

## Adding Figures and Actions

You can include icons (figures) and action buttons within a stat block.

### Good Example: Complex Stat Block
```html
<div class="stats shadow-sm">
  <div class="stat">
    <div class="stat-figure text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-8 w-8 stroke-current">
        <!-- SVG Path -->
      </svg>
    </div>
    <div class="stat-title">Total Likes</div>
    <div class="stat-value text-primary">25.6K</div>
    <div class="stat-desc">21% more than last month</div>
  </div>
</div>
```

## Layouts

Use Tailwind 4 layout utilities to change the orientation.

### Good Example: Vertical Stats
```html
<!-- Use flex-col or stats-vertical for stacking -->
<div class="stats stats-vertical shadow-sm">
  <div class="stat">...</div>
  <div class="stat">...</div>
</div>
```

### Bad Example: Missing Hierarchy
```html
<!-- Bad: Missing semantic child classes breaks the layout -->
<div class="stat">
  <span>Total Views</span>
  <h1>89,400</h1>
</div>
```
`````

## File: .agents/skills/daisyui/data-display-status.md
`````markdown
# DaisyUI Data Display: Status

A compact component used to show status indicators (online, busy, etc.) on avatars or standalone elements.

## Basic Usage
The `status` class provides a small circle indicator.

```html
<div class="status"></div>
<div class="status status-success"></div>
<div class="status status-error"></div>
<div class="status status-warning"></div>
<div class="status status-info"></div>
```

## Pattern: Status on Avatars
Place the `status` inside an `avatar` container for automatic positioning.

```html
<div class="avatar">
  <div class="w-16 rounded-full">
    <img src="..." />
  </div>
  <div class="status status-success status-bottom status-right border-2 border-base-100"></div>
</div>
```

## Good vs. Bad Status
```html
<!-- Good: Semantic status indicator -->
<span class="status status-success"></span>

<!-- Bad: Manual circle styling -->
<span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
```

## Quick Reference
- `status-success`, `status-error`, `status-warning`, `status-info`: Colors.
- `status-top`, `status-bottom`, `status-left`, `status-right`: Positioning relative to parent.
`````

## File: .agents/skills/daisyui/data-display-table.md
`````markdown
# Data Display: Table

The table component styles HTML tables, adding padding, borders, and hover effects. Ensure the table is wrapped in an `overflow-x-auto` container for responsive scrolling.

## Basic Table

### Good Example: Standard Table
```html
<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Table Variants

### Good Example: Zebra and Hover Effects
```html
<!-- table-zebra adds striped rows, table-hover adds a hover effect to rows -->
<table class="table table-zebra table-hover">
  ...
</table>
```

## Pinning Rows and Columns

DaisyUI provides sticky utilities for complex tables.

### Good Example: Pinned Header and First Column
```html
<table class="table table-pin-rows table-pin-cols">
  <thead>
    <tr>
      <!-- This column stays pinned on horizontal scroll -->
      <th>ID</th> 
      <th>Name</th>
      <th>Job</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>
```

### Bad Example: Missing Responsive Wrapper
```html
<!-- Bad: Missing div.overflow-x-auto causes the table to overflow the screen on mobile devices -->
<table class="table">...</table>
```
`````

## File: .agents/skills/daisyui/data-display-text-rotate.md
`````markdown
# DaisyUI Data Display: Text Rotate

An animation component that rotates text elements, useful for headlines with dynamic content.

## Basic Usage
The `text-rotate` class contains multiple spans that rotate in sequence.

```html
<h1 class="text-4xl font-bold">
  Build 
  <span class="text-rotate text-primary">
    <span>faster</span>
    <span>better</span>
    <span>stronger</span>
  </span>
  websites.
</h1>
```

## Patterns: Colors and Timing
You can style individual rotated items.

```html
<div class="text-lg">
  Status: 
  <span class="text-rotate font-mono">
    <span class="text-success">Online</span>
    <span class="text-warning">Connecting</span>
    <span class="text-error">Offline</span>
  </span>
</div>
```

## Good vs. Bad Text Rotate
```html
<!-- Good: Using the built-in text-rotate component -->
<span class="text-rotate">...</span>

<!-- Bad: Complex JavaScript intervals or heavy Framer Motion animations for simple text flips -->
<div id="rotating-text">...</div>
```
`````

## File: .agents/skills/daisyui/data-display-timeline.md
`````markdown
# Data Display: Timeline

The timeline component displays a list of events in chronological order. It can be oriented horizontally or vertically.

## Horizontal Timeline

### Good Example: Horizontal Steps
```html
<ul class="timeline">
  <li>
    <div class="timeline-start">1984</div>
    <div class="timeline-middle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="timeline-end timeline-box">First Macintosh computer</div>
    <hr/>
  </li>
  <li>
    <hr/>
    <div class="timeline-start">1998</div>
    <div class="timeline-middle">...</div>
    <div class="timeline-end timeline-box">iMac</div>
  </li>
</ul>
```

## Vertical Timeline

Add the `timeline-vertical` class to stack items.

### Good Example: Vertical Events
```html
<ul class="timeline timeline-vertical">
  <li>
    <div class="timeline-start">Step 1</div>
    <div class="timeline-middle">...</div>
    <hr/>
  </li>
  <li>
    <hr/>
    <div class="timeline-start">Step 2</div>
    <div class="timeline-middle">...</div>
  </li>
</ul>
```

### Bad Example: Inconsistent Alignment
```html
<!-- Bad: Mixing timeline-start and timeline-end on the same side without clear hierarchy -->
<li>
  <div class="timeline-start">Date</div>
  <div class="timeline-start">Description</div>
</li>
```
`````

## File: .agents/skills/daisyui/data-input-calendar.md
`````markdown
# DaisyUI Data Input: Calendar

A semantic calendar component for date selection and display. Often uses the `cally` class for enhanced functionality.

## Basic Usage
The `calendar` class creates a standard date grid.

```html
<div class="calendar bg-base-100 p-4 rounded-box shadow">
  <!-- Calendar header/grid provided by daisyUI styles -->
  <div class="calendar-month">October 2024</div>
  <div class="calendar-grid">...</div>
</div>
```

## Pattern: Date Range Picker
Use with multiple calendars or specialized `cally` wrappers.

```html
<div class="flex gap-4">
  <div class="calendar calendar-sm">...</div>
  <div class="calendar calendar-sm border-l pl-4">...</div>
</div>
```

## Good vs. Bad Calendar
```html
<!-- Good: DaisyUI calendar component for consistent theming -->
<div class="calendar">...</div>

<!-- Bad: Over-relying on browser default <input type="date"> which is hard to style -->
<input type="date" class="input input-bordered" />
```

## Quick Reference
- `calendar-sm`, `calendar-lg`: Sizing.
- `calendar-today`: Highlights current date.
- `calendar-selected`: Highlights active selection.
`````

## File: .agents/skills/daisyui/data-input-checkbox.md
`````markdown
# Data Input: Checkbox

Checkboxes allow users to select one or more options from a set.

## Basic Usage

### Good Example: Standard Checkbox
```html
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span> 
    <input type="checkbox" checked="checked" class="checkbox" />
  </label>
</div>
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="checkbox" class="checkbox checkbox-primary" />
<input type="checkbox" class="checkbox checkbox-secondary" />
<input type="checkbox" class="checkbox checkbox-success" />
```

### Good Example: Size Variants
```html
<input type="checkbox" class="checkbox checkbox-lg" />
<input type="checkbox" class="checkbox checkbox-md" />
<input type="checkbox" class="checkbox checkbox-sm" />
<input type="checkbox" class="checkbox checkbox-xs" />
```

## Intermediate State

Intermediate states must be set via JavaScript as there is no HTML attribute for it.

### Good Example: JS Indeterminate
```javascript
document.getElementById('my-checkbox').indeterminate = true;
```

### Bad Example: Bare Input
```html
<!-- Bad: Missing 'checkbox' class results in unstyled native browser checkbox -->
<input type="checkbox" />
```
`````

## File: .agents/skills/daisyui/data-input-fieldset.md
`````markdown
# DaisyUI Data Input: Fieldset

A semantic container for grouping related form inputs with legends and labels.

## Basic Usage
Use `fieldset`, `fieldset-legend`, and `fieldset-label` for accessible forms.

```html
<fieldset class="fieldset bg-base-200 p-4 rounded-box">
  <legend class="fieldset-legend">User Information</legend>
  
  <label class="fieldset-label">Name</label>
  <input type="text" class="input input-bordered" placeholder="Full Name" />
  
  <label class="fieldset-label">Email</label>
  <input type="email" class="input input-bordered" placeholder="email@example.com" />
</fieldset>
```

## Pattern: Radio Groups
Fieldsets are ideal for radio button groups.

```html
<fieldset class="fieldset">
  <legend class="fieldset-legend text-primary">Notification Settings</legend>
  <label class="label cursor-pointer">
    <span class="label-text">Email</span>
    <input type="radio" name="notify" class="radio" checked />
  </label>
  <label class="label cursor-pointer">
    <span class="label-text">Push</span>
    <input type="radio" name="notify" class="radio" />
  </label>
</fieldset>
```

## Good vs. Bad Fieldset
```html
<!-- Good: Accessible fieldset with semantic legend -->
<fieldset class="fieldset">
  <legend class="fieldset-legend">Title</legend>
  ...
</fieldset>

<!-- Bad: Using a div with font-bold to simulate a legend -->
<div class="p-4 border">
  <div class="font-bold">Title</div>
  ...
</div>
```
`````

## File: .agents/skills/daisyui/data-input-file.md
`````markdown
# Data Input: File

The file input component provides a styled interface for selecting files from the local device.

## Basic Usage

### Good Example: Bordered File Input
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Pick a file</span>
  </div>
  <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
</label>
```

## Variants

### Good Example: Ghost and Color Variants
```html
<input type="file" class="file-input file-input-ghost w-full max-w-xs" />
<input type="file" class="file-input file-input-primary w-full max-w-xs" />
```

## Sizes

### Good Example: Sizing File Inputs
```html
<input type="file" class="file-input file-input-lg" />
<input type="file" class="file-input file-input-sm" />
```

### Bad Example: Overflowing Container
```html
<!-- Bad: File inputs often have wide default widths; always wrap or use 'w-full' -->
<input type="file" class="file-input" />
```
`````

## File: .agents/skills/daisyui/data-input-filter.md
`````markdown
# DaisyUI Data Input: Filter

A toggleable filter component often used for search tags, categories, or filtering lists.

## Basic Usage
The `filter` class acts as a toggle button for filtering data.

```html
<div class="join">
  <input class="join-item btn filter" type="radio" name="options" aria-label="All" checked />
  <input class="join-item btn filter" type="radio" name="options" aria-label="Active" />
  <input class="join-item btn filter" type="radio" name="options" aria-label="Completed" />
</div>
```

## Pattern: Checkbox Filters
Use `filter` with checkboxes for multi-select filtering.

```html
<div class="flex flex-wrap gap-2">
  <input type="checkbox" aria-label="React" class="filter btn btn-sm" />
  <input type="checkbox" aria-label="Vue" class="filter btn btn-sm" />
  <input type="checkbox" aria-label="Svelte" class="filter btn btn-sm" />
</div>
```

## Good vs. Bad Filter
```html
<!-- Good: Using native inputs with filter classes for accessibility -->
<input type="radio" class="filter btn" aria-label="Selection" />

<!-- Bad: Manual button styling with complex active-state logic in JS -->
<button onclick="toggleFilter(this)" class="btn bg-gray-200">
  Filter
</button>
```
`````

## File: .agents/skills/daisyui/data-input-label.md
`````markdown
# DaisyUI Data Input: Label

A semantic label component for form inputs, providing consistent spacing and typography.

## Basic Usage
The `label` class wraps label text or spans.

```html
<div class="form-control">
  <label class="label">
    <span class="label-text text-base-content">Username</span>
  </label>
  <input type="text" class="input input-bordered" />
</div>
```

## Pattern: Top/Bottom Labels
Use multiple spans within a `label` to create descriptive helpers.

```html
<div class="form-control">
  <label class="label">
    <span class="label-text">Email</span>
    <span class="label-text-alt text-error">Required</span>
  </label>
  <input type="email" class="input input-bordered" />
  <label class="label">
    <span class="label-text-alt">We'll never share your email.</span>
  </label>
</div>
```

## Good vs. Bad Label
```html
<!-- Good: Semantic label with text-alt for auxiliary information -->
<label class="label">
  <span class="label-text">Password</span>
</label>

<!-- Bad: Using a p tag with mb-2 for labeling -->
<p class="mb-2 font-semibold">Password</p>
```
`````

## File: .agents/skills/daisyui/data-input-radio.md
`````markdown
# Data Input: Radio

Radio buttons allow users to select exactly one option from a predefined set of mutually exclusive options.

## Basic Usage

Ensure all radio buttons in a group share the same `name` attribute.

### Good Example: Styled Radio Group
```html
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Option 1</span> 
    <input type="radio" name="radio-10" class="radio checked:bg-red-500" checked="checked" />
  </label>
</div>
<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Option 2</span> 
    <input type="radio" name="radio-10" class="radio checked:bg-blue-500" />
  </label>
</div>
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="radio" name="radio-1" class="radio radio-primary" />
<input type="radio" name="radio-1" class="radio radio-secondary" />
```

### Good Example: Size Variants
```html
<input type="radio" name="radio-2" class="radio radio-lg" />
<input type="radio" name="radio-2" class="radio radio-xs" />
```

### Bad Example: Missing Name Attribute
```html
<!-- Bad: Without a name, these are not linked and behave like independent checkboxes -->
<input type="radio" class="radio" />
<input type="radio" class="radio" />
```
`````

## File: .agents/skills/daisyui/data-input-range.md
`````markdown
# Data Input: Range

The range component is a slider input for selecting a numeric value within a specified range.

## Basic Usage

### Good Example: Standard Range Slider
```html
<input type="range" min="0" max="100" value="40" class="range" />
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="range" min="0" max="100" value="25" class="range range-primary" />
<input type="range" min="0" max="100" value="50" class="range range-secondary" />
<input type="range" min="0" max="100" value="75" class="range range-accent" />
```

### Good Example: Size Variants
```html
<input type="range" min="0" max="100" value="40" class="range range-lg" />
<input type="range" min="0" max="100" value="40" class="range range-xs" />
```

## Range with Steps (Ticks)

### Good Example: Stepped Range
```html
<input type="range" min="0" max="100" value="25" class="range" step="25" />
<div class="flex w-full justify-between px-2 text-xs">
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
</div>
```

### Bad Example: Vertical Range without Modifiers
```html
<!-- Bad: Range is horizontal by default. Native vertical ranges require platform-specific CSS. -->
```
`````

## File: .agents/skills/daisyui/data-input-rating.md
`````markdown
# Data Input: Rating

The rating component uses a set of radio inputs to create a star, heart, or emoji-based rating system.

## Basic Usage

### Good Example: Star Rating
```html
<div class="rating">
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" checked="checked" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
  <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
</div>
```

## Half Stars

Use the `mask-half-1` and `mask-half-2` classes on two separate inputs to create a single star that can be half-filled.

### Good Example: Half-Star Rating
```html
<div class="rating rating-half">
  <input type="radio" name="rating-10" class="rating-hidden" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-1 bg-green-500" />
  <input type="radio" name="rating-10" class="mask mask-star-2 mask-half-2 bg-green-500" />
  <!-- repeat ... -->
</div>
```

## Sizes

### Good Example: Rating Sizes
```html
<div class="rating rating-lg">...</div>
<div class="rating rating-sm">...</div>
```

### Bad Example: Using Buttons
```html
<!-- Bad: Ratings should be radio inputs for form compatibility and accessibility. -->
<div class="rating">
  <button class="mask mask-star">1</button>
</div>
```
`````

## File: .agents/skills/daisyui/data-input-select.md
`````markdown
# Data Input: Select

The select component provides a styled dropdown menu for selecting an option from a list.

## Basic Usage

### Good Example: Bordered Select
```html
<select class="select select-bordered w-full max-w-xs">
  <option disabled selected>Who shot first?</option>
  <option>Han Solo</option>
  <option>Greedo</option>
</select>
```

## Colors and Variants

### Good Example: Ghost and Color Variants
```html
<select class="select select-ghost w-full max-w-xs">...</select>
<select class="select select-primary w-full max-w-xs">...</select>
```

## Sizes

### Good Example: Sizing Selects
```html
<select class="select select-lg">...</select>
<select class="select select-xs">...</select>
```

## Use Case: Select with Form Control

### Good Example: Select with Label
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Pick the best sci-fi movie</span>
  </div>
  <select class="select select-bordered">
    <option>Star Wars</option>
    <option>Star Trek</option>
  </select>
</label>
```

### Bad Example: Bare Select
```html
<!-- Bad: Unstyled select looks inconsistent with the rest of the UI -->
<select>
  <option>Option 1</option>
</select>
```
`````

## File: .agents/skills/daisyui/data-input-text.md
`````markdown
# Data Input: Text

The text input component styles standard single-line text inputs.

## Basic Usage

### Good Example: Bordered Input
```html
<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
```

## Variants

### Good Example: Ghost and Color Variants
```html
<input type="text" placeholder="Ghost" class="input input-ghost w-full max-w-xs" />
<input type="text" placeholder="Primary" class="input input-primary w-full max-w-xs" />
```

## Sizes

### Good Example: Input Sizes
```html
<input type="text" class="input input-lg" />
<input type="text" class="input input-md" />
<input type="text" class="input input-sm" />
<input type="text" class="input input-xs" />
```

## Form Control Integration

### Good Example: Input with Labels and Helper Text
```html
<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">What is your name?</span>
    <span class="label-text-alt">Top Right</span>
  </div>
  <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  <div class="label">
    <span class="label-text-alt">Bottom Left</span>
  </div>
</label>
```

### Bad Example: Input without width class
```html
<!-- Bad: Inputs have small default widths; use 'w-full' for responsive layouts -->
<input class="input input-bordered" />
```
`````

## File: .agents/skills/daisyui/data-input-textarea.md
`````markdown
# Data Input: Textarea

The textarea component styles multi-line text inputs.

## Basic Usage

### Good Example: Bordered Textarea
```html
<textarea class="textarea textarea-bordered" placeholder="Bio"></textarea>
```

## Colors and Variants

### Good Example: Ghost and Color Variants
```html
<textarea class="textarea textarea-ghost" placeholder="Bio"></textarea>
<textarea class="textarea textarea-primary" placeholder="Bio"></textarea>
```

## Sizes

### Good Example: Textarea Sizes
```html
<textarea class="textarea textarea-lg"></textarea>
<textarea class="textarea textarea-xs"></textarea>
```

## Form Control Integration

### Good Example: Textarea with Label
```html
<label class="form-control">
  <div class="label">
    <span class="label-text">Your bio</span>
  </div>
  <textarea class="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
</label>
```

### Bad Example: Missing Height
```html
<!-- Bad: Textareas often need a specific height (h-24, etc.) to look balanced in a form -->
<textarea class="textarea textarea-bordered"></textarea>
```
`````

## File: .agents/skills/daisyui/data-input-toggle.md
`````markdown
# Data Input: Toggle

The toggle component is a styled checkbox that acts as a binary switch.

## Basic Usage

### Good Example: Standard Toggle
```html
<input type="checkbox" class="toggle" checked="checked" />
```

## Colors and Sizes

### Good Example: Color Variants
```html
<input type="checkbox" class="toggle toggle-primary" />
<input type="checkbox" class="toggle toggle-secondary" />
<input type="checkbox" class="toggle toggle-success" />
```

### Good Example: Size Variants
```html
<input type="checkbox" class="toggle toggle-lg" />
<input type="checkbox" class="toggle toggle-md" />
<input type="checkbox" class="toggle toggle-sm" />
<input type="checkbox" class="toggle toggle-xs" />
```

## Integration with Labels

### Good Example: Toggle with Label
```html
<div class="form-control w-52">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span> 
    <input type="checkbox" class="toggle" checked="checked" />
  </label>
</div>
```

### Bad Example: Manual Switch Styling
```html
<!-- Bad: Creating custom switch logic when DaisyUI 'toggle' class handles it natively and accessibly -->
<div class="bg-gray-200 rounded-full w-10 h-6">
  <div class="bg-white rounded-full w-4 h-4 translate-x-1"></div>
</div>
```
`````

## File: .agents/skills/daisyui/data-input-validator.md
`````markdown
# DaisyUI Data Input: Validator

A component for real-time form validation feedback using CSS-only patterns or minimal JS.

## Basic Usage
The `validator` class is applied to input wrappers to show error states.

```html
<div class="form-control">
  <input type="email" placeholder="email@example.com" class="input validator" required />
  <div class="validator-hint">Please enter a valid email address</div>
</div>
```

## Pattern: Successful Validation
DaisyUI can show success states automatically when criteria are met.

```html
<div class="form-control">
  <input type="password" 
         pattern=".{8,}" 
         placeholder="Min 8 chars" 
         class="input validator" 
         required />
  <div class="validator-hint">Password must be at least 8 characters</div>
</div>
```

## Good vs. Bad Validator
```html
<!-- Good: Native HTML5 validation integrated with DaisyUI -->
<input type="text" class="validator" required />

<!-- Bad: Manual error state toggling via complex JS logic -->
<input id="my-input" class="input border-red-500" />
<p id="error-msg" class="hidden text-red-500">Error</p>
```

## Quick Reference
- `validator-hint`: The message shown when validation fails.
- `validator-success`: (Internal) Applied when input is valid.
- `validator-error`: (Internal) Applied when input is invalid.
`````

## File: .agents/skills/daisyui/feedback-alert.md
`````markdown
# Feedback: Alert

Alerts inform users about important events or changes in state. They use semantic colors to convey meaning.

## Basic Usage

### Good Example: Informational Alert
```html
<div role="alert" class="alert shadow-sm">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info h-6 w-6 shrink-0">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>New software update available.</span>
</div>
```

## Semantic Variants

### Good Example: Success, Warning, and Error
```html
<div role="alert" class="alert alert-success">
  <span>Your purchase has been confirmed!</span>
</div>

<div role="alert" class="alert alert-warning">
  <span>Warning: Invalid email address!</span>
</div>

<div role="alert" class="alert alert-error">
  <span>Error! Task failed successfully.</span>
</div>
```

## Alerts with Actions

### Good Example: Alert with Buttons
```html
<div role="alert" class="alert">
  <svg ...></svg>
  <div>
    <h3 class="font-bold">New message!</h3>
    <div class="text-xs">You have 1 unread message</div>
  </div>
  <button class="btn btn-sm">See</button>
</div>
```

### Bad Example: Missing Role Attribute
```html
<!-- Bad: Missing role="alert" reduces accessibility for screen readers -->
<div class="alert alert-info">...</div>
```
`````

## File: .agents/skills/daisyui/feedback-loading.md
`````markdown
# Feedback: Loading

The loading component provides various animated indicators for indeterminate wait states.

## Types of Spinners

### Good Example: Different Loading Animations
```html
<span class="loading loading-spinner loading-lg"></span>
<span class="loading loading-dots loading-lg"></span>
<span class="loading loading-ring loading-lg"></span>
<span class="loading loading-ball loading-lg"></span>
<span class="loading loading-bars loading-lg"></span>
<span class="loading loading-infinity loading-lg"></span>
```

## Colors

### Good Example: Semantic Loading Colors
```html
<span class="loading loading-spinner text-primary"></span>
<span class="loading loading-spinner text-secondary"></span>
<span class="loading loading-spinner text-success"></span>
```

## Integration with Buttons

### Good Example: Button with Loading State
```html
<button class="btn">
  <span class="loading loading-spinner"></span>
  loading
</button>
```

### Bad Example: Manual SVG Animations
```html
<!-- Bad: Over-complicating UI with custom keyframe animations when 'loading' classes provide optimized defaults -->
<svg class="animate-spin ...">...</svg>
```
`````

## File: .agents/skills/daisyui/feedback-progress.md
`````markdown
# Feedback: Progress

The progress component is used for displaying both determinate and indeterminate progress states.

## Determinate Progress

Set the `value` and `max` attributes to show a specific progress level.

### Good Example: 40% Progress
```html
<progress class="progress progress-primary w-56" value="40" max="100"></progress>
```

## Indeterminate Progress

Omit the `value` attribute to create a looping animation for unknown wait times.

### Good Example: Indeterminate Progress
```html
<progress class="progress w-56"></progress>
```

## Colors

### Good Example: Semantic Colors
```html
<progress class="progress progress-success w-56" value="100" max="100"></progress>
<progress class="progress progress-warning w-56" value="70" max="100"></progress>
<progress class="progress progress-error w-56" value="10" max="100"></progress>
```

### Bad Example: Using Divs with Widths
```html
<!-- Bad: Using a div with a fixed width for progress is less accessible than the semantic <progress> element -->
<div class="h-2 w-full bg-gray-200">
  <div class="h-2 bg-blue-500 w-[40%]"></div>
</div>
```
`````

## File: .agents/skills/daisyui/feedback-radial.md
`````markdown
# Feedback: Radial Progress

Radial progress displays a circular progress indicator using CSS variables.

## Usage

Set the `--value` and `--size` CSS variables. The component uses a `radial-progress` class.

### Good Example: 70% Circular Progress
```html
<div class="radial-progress" style="--value:70;" role="progressbar">70%</div>
```

## Customization

### Good Example: Colors, Size, and Thickness
```html
<div class="radial-progress text-primary" style="--value:70; --size:12rem; --thickness: 2rem;" role="progressbar">
  70%
</div>
```

## Integration with Backgrounds

### Good Example: Adding Background and Borders
```html
<div class="radial-progress bg-primary text-primary-content border-primary border-4" style="--value:70;" role="progressbar">
  70%
</div>
```

### Bad Example: Missing Role Attribute
```html
<!-- Bad: Missing role="progressbar" makes it difficult for assistive technologies to interpret the component -->
<div class="radial-progress" style="--value:70;">70%</div>
```
`````

## File: .agents/skills/daisyui/feedback-skeleton.md
`````markdown
# Feedback: Skeleton

Skeleton loaders act as placeholders while content is being fetched, preventing layout shifts.

## Basic Usage

### Good Example: Square and Circle Placeholders
```html
<div class="skeleton h-32 w-32"></div>
<div class="skeleton h-10 w-10 shrink-0 rounded-full"></div>
```

## Complex Layouts

Combine multiple skeleton elements to mimic the layout of the final content.

### Good Example: Skeleton for a Card/Post
```html
<div class="flex w-52 flex-col gap-4">
  <div class="skeleton h-32 w-full"></div>
  <div class="skeleton h-4 w-28"></div>
  <div class="skeleton h-4 w-full"></div>
  <div class="skeleton h-4 w-full"></div>
</div>
```

## Integration with Actual Content

Use conditional rendering in your framework (React/Vue/etc.) to swap skeletons for real components.

### Good Example: Logic Pseudo-code
```html
{isLoading ? <div class="skeleton ..."></div> : <Card ... />}
```

### Bad Example: Static Heights
```html
<!-- Bad: If the skeleton doesn't match the final content's height, you'll still get a layout shift -->
<div class="skeleton h-10 w-full"></div> <!-- Content is actually 200px tall -->
```
`````

## File: .agents/skills/daisyui/feedback-toast.md
`````markdown
# Feedback: Toast

Toasts are used to display floating notifications, typically in one of the corners of the viewport.

## Positioning

The `toast` container can be positioned using Tailwind 4 utility classes (e.g., `toast-start`, `toast-end`, `toast-top`, `toast-bottom`).

### Good Example: Bottom-End Toast
```html
<div class="toast toast-end toast-bottom">
  <div class="alert alert-info">
    <span>New message arrived.</span>
  </div>
  <div class="alert alert-success">
    <span>Message sent successfully.</span>
  </div>
</div>
```

## Alignment Variants

### Good Example: Top-Center Toast
```html
<div class="toast toast-top toast-center">
  <div class="alert alert-info">
    <span>New notification</span>
  </div>
</div>
```

## Responsive Positioning

### Good Example: Changing Position on Mobile
```html
<!-- Bottom on mobile, Top-End on larger screens -->
<div class="toast toast-bottom sm:toast-top sm:toast-end">
  <div class="alert">...</div>
</div>
```

### Bad Example: Multiple Toast Containers
```html
<!-- Bad: Multiple 'toast' divs can overlap. Use a single container for multiple alerts if they share the same position. -->
<div class="toast">...</div>
<div class="toast">...</div>
```
`````

## File: .agents/skills/daisyui/feedback-tooltip.md
`````markdown
# Feedback: Tooltip

Tooltips provide small contextual information when a user hovers over or focuses on an element.

## Basic Usage

Wrap the target element in a `tooltip` container and set the `data-tip` attribute.

### Good Example: Standard Tooltip
```html
<div class="tooltip" data-tip="hello">
  <button class="btn">Hover me</button>
</div>
```

## Positioning

### Good Example: Tooltip Directions
```html
<div class="tooltip tooltip-top" data-tip="Top">...</div>
<div class="tooltip tooltip-bottom" data-tip="Bottom">...</div>
<div class="tooltip tooltip-left" data-tip="Left">...</div>
<div class="tooltip tooltip-right" data-tip="Right">...</div>
```

## Colors

### Good Example: Semantic Tooltip Colors
```html
<div class="tooltip tooltip-primary" data-tip="Primary color">...</div>
<div class="tooltip tooltip-error" data-tip="Error state">...</div>
```

## Forced Visibility

### Good Example: Persistent Tooltip (Always Open)
```html
<div class="tooltip tooltip-open" data-tip="I am always here">...</div>
```

### Bad Example: Complex HTML inside Tooltip
```html
<!-- Bad: The tooltip content is defined in the data-tip attribute, which only supports plain text. Use a dropdown for complex HTML. -->
<div class="tooltip" data-tip="<b>Bold</b>">...</div>
```
`````

## File: .agents/skills/daisyui/layout-artboard.md
`````markdown
# Layout: Artboard

The artboard component provides fixed-size containers that mimic mobile screen resolutions, useful for prototyping mobile apps.

## Basic Usage

### Good Example: iPhone-sized Artboard
```html
<!-- Phone 1 (320×568) -->
<div class="artboard phone-1 bg-base-200">
  <div class="p-4">Mobile View Content</div>
</div>
```

## Artboard Sizes

- `phone-1`: 320×568
- `phone-2`: 375×667
- `phone-3`: 414×736
- `phone-4`: 375×812
- `phone-5`: 414×896
- `phone-6`: 320×1024

## Orientation

Use `artboard-horizontal` to switch to landscape mode.

### Good Example: Horizontal Artboard
```html
<div class="artboard artboard-horizontal phone-1 bg-base-200">
  Landscape Content
</div>
```

### Bad Example: Using Artboard for Production Layouts
```html
<!-- Bad: Artboards are intended for prototyping and demos, not for actual responsive production website containers. Use standard Tailwind 'container' or 'max-w-*' classes instead. -->
```
`````

## File: .agents/skills/daisyui/layout-divider.md
`````markdown
# Layout: Divider

Dividers create visual separation between elements and can optionally include text or icons.

## Basic Usage

### Good Example: Horizontal Divider
```html
<div class="flex flex-col w-full">
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
  <div class="divider">OR</div>
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
</div>
```

## Vertical Divider

Add the `divider-horizontal` class. Note that the parent container must be `flex-row`.

### Good Example: Side-by-side Separation
```html
<div class="flex w-full">
  <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div>
  <div class="divider divider-horizontal">OR</div>
  <div class="grid h-20 flex-grow card bg-base-300 rounded-box place-items-center">content</div>
</div>
```

## Colors

### Good Example: Semantic Divider Colors
```html
<div class="divider divider-primary">Primary</div>
<div class="divider divider-secondary">Secondary</div>
<div class="divider divider-accent">Accent</div>
```

### Bad Example: Absolute Positioning for Dividers
```html
<!-- Bad: Trying to manually position a divider line with absolute positioning and borders is brittle compared to the 'divider' utility -->
```
`````

## File: .agents/skills/daisyui/layout-drawer.md
`````markdown
# Layout: Drawer

The drawer component creates a side-menu overlay, common in mobile apps and dashboards.

## Basic Usage

The drawer consists of a toggle (hidden checkbox), the page content, and the side-menu content.

### Good Example: Standard Drawer
```html
<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label>
  </div> 
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <!-- Sidebar content here -->
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
```

## Always Open on Large Screens

Use the `lg:drawer-open` modifier to keep the sidebar visible on desktops.

### Good Example: Responsive Sidebar
```html
<div class="drawer lg:drawer-open">
  ...
</div>
```

## Drawer End (Right Side)

Use the `drawer-end` modifier to move the sidebar to the right.

### Good Example: Right Sidebar
```html
<div class="drawer drawer-end">
  ...
</div>
```

### Bad Example: Missing Overlay
```html
<!-- Bad: Without the drawer-overlay label, the user cannot click outside the sidebar to close it -->
<div class="drawer-side">
  <ul class="menu ...">...</ul>
</div>
```
`````

## File: .agents/skills/daisyui/layout-footer.md
`````markdown
# Layout: Footer

The footer component styles page footers with multiple columns of links and branding.

## Basic Usage

### Good Example: Multi-column Footer
```html
<footer class="footer p-10 bg-neutral text-neutral-content">
  <nav>
    <h6 class="footer-title">Services</h6> 
    <a class="link link-hover">Branding</a>
    <a class="link link-hover">Design</a>
  </nav> 
  <nav>
    <h6 class="footer-title">Company</h6> 
    <a class="link link-hover">About us</a>
    <a class="link link-hover">Contact</a>
  </nav> 
  <nav>
    <h6 class="footer-title">Legal</h6> 
    <a class="link link-hover">Terms of use</a>
    <a class="link link-hover">Privacy policy</a>
  </nav>
</footer>
```

## Centered Footer

### Good Example: Simple Footer with Icons
```html
<footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
  <nav class="grid grid-flow-col gap-4">
    <a class="link link-hover">About us</a>
    <a class="link link-hover">Contact</a>
  </nav> 
  <nav>
    <div class="grid grid-flow-col gap-4">
      <a><svg ...></svg></a>
      <a><svg ...></svg></a>
    </div>
  </nav> 
  <aside>
    <p>Copyright © 2024 - All right reserved</p>
  </aside>
</footer>
```

### Bad Example: Complex Layout inside Footer
```html
<!-- Bad: Avoid putting large forms or complex interactive components directly inside the footer; keep it focused on navigation and meta information. -->
```
`````

## File: .agents/skills/daisyui/layout-hero.md
`````markdown
# Layout: Hero

The hero component is a large, attention-grabbing section typically found at the top of a page.

## Centered Hero

### Good Example: Text and Button Hero
```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Hello there</h1>
      <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi.</p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

## Hero with Side Image

### Good Example: Image and Content
```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row">
    <img src="..." class="max-w-sm rounded-lg shadow-2xl" />
    <div>
      <h1 class="text-5xl font-bold">Box Office News!</h1>
      <p class="py-6">Check out the latest movies.</p>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

## Hero with Background Image

### Good Example: Overlay Hero
```html
<div class="hero min-h-screen" style="background-image: url(...);">
  <div class="hero-overlay bg-opacity-60"></div>
  <div class="hero-content text-center text-neutral-content">
    <div class="max-w-md">
      <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
      <button class="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

### Bad Example: Missing Max-Width
```html
<!-- Bad: Without max-w-md or similar, text lines can become too long and difficult to read in a hero section -->
<div class="hero-content">
  <p>Very long text that spans the whole screen width...</p>
</div>
```
`````

## File: .agents/skills/daisyui/layout-indicator.md
`````markdown
# Layout: Indicator

Indicators are used to place an element (like a badge or status dot) on the corner of another element.

## Basic Usage

The `indicator` class is placed on the parent, and `indicator-item` is placed on the element that floats.

### Good Example: Badge on an Avatar
```html
<div class="avatar indicator">
  <span class="indicator-item badge badge-secondary">new</span> 
  <div class="h-20 w-20 rounded-lg">
    <img src="..." />
  </div>
</div>
```

## Positioning

Use alignment utilities to move the indicator to different corners.

### Good Example: Placement Variants
```html
<!-- Top End (Default) -->
<div class="indicator">
  <span class="indicator-item badge">1</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>

<!-- Bottom Start -->
<div class="indicator">
  <span class="indicator-item indicator-bottom indicator-start badge">1</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>
```

## Center and Middle

### Good Example: Centered Indicator
```html
<div class="indicator">
  <span class="indicator-item indicator-center indicator-middle badge">Center</span>
  <div class="grid w-32 h-32 bg-base-300 place-items-center">content</div>
</div>
```

### Bad Example: Missing Indicator Parent
```html
<!-- Bad: Without the 'indicator' parent, 'indicator-item' will not be positioned correctly relative to the content -->
<div class="badge indicator-item">1</div>
<div>content</div>
```
`````

## File: .agents/skills/daisyui/layout-join.md
`````markdown
# Layout: Join

The `join` component groups multiple items (buttons, inputs, etc.) together into a single cohesive unit with shared borders and radii.

## Basic Usage

### Good Example: Grouping Buttons and Inputs
```html
<div class="join">
  <input class="input input-bordered join-item" placeholder="Search..."/>
  <select class="select select-bordered join-item">
    <option disabled selected>Category</option>
    <option>Sci-fi</option>
    <option>Drama</option>
  </select>
  <button class="btn join-item">Search</button>
</div>
```

## Vertical Join

Add the `join-vertical` class to stack items.

### Good Example: Vertical Button Group
```html
<div class="join join-vertical">
  <button class="btn join-item">Top</button>
  <button class="btn join-item">Middle</button>
  <button class="btn join-item">Bottom</button>
</div>
```

## Responsive Join

### Good Example: Vertical on Mobile, Horizontal on Desktop
```html
<div class="join join-vertical lg:join-horizontal">
  <button class="btn join-item">Item 1</button>
  <button class="btn join-item">Item 2</button>
</div>
```

### Bad Example: Missing Join-Item Class
```html
<!-- Bad: Items without 'join-item' will not have their border-radii adjusted, leading to broken visual continuity -->
<div class="join">
  <button class="btn">1</button>
  <button class="btn">2</button>
</div>
```
`````

## File: .agents/skills/daisyui/layout-mask.md
`````markdown
# Layout: Mask

The mask component allows you to clip images or elements into specific shapes like circles, hearts, or squircles.

## Basic Usage

Apply the `mask` class along with a specific shape modifier.

### Good Example: Common Mask Shapes
```html
<!-- Squircle (Smoothed corner square) -->
<img class="mask mask-squircle" src="..." />

<!-- Heart -->
<img class="mask mask-heart" src="..." />

<!-- Hexagon -->
<img class="mask mask-hexagon" src="..." />

<!-- Decagon -->
<img class="mask mask-decagon" src="..." />
```

## Mask with Half Shapes

### Good Example: Half-Star (Used in Ratings)
```html
<div class="mask mask-star-2 mask-half-1 bg-orange-400 w-10 h-10"></div>
<div class="mask mask-star-2 mask-half-2 bg-orange-400 w-10 h-10"></div>
```

## Custom Masks

You can use the `mask` class with standard Tailwind 4 object-fit utilities.

### Good Example: Centered Masked Image
```html
<img class="mask mask-circle object-cover w-32 h-32" src="..." />
```

### Bad Example: Low Resolution Images
```html
<!-- Bad: Small images masked into large shapes will appear pixelated. Ensure the source image resolution is sufficient for the mask size. -->
```
`````

## File: .agents/skills/daisyui/layout-stack.md
`````markdown
# Layout: Stack

The stack component visually layers multiple elements on top of each other, creating a sense of depth or grouping (like a stack of cards or photos).

## Basic Usage

### Good Example: Stack of Cards
```html
<div class="stack">
  <div class="card bg-primary text-primary-content shadow-md">
    <div class="card-body">Top card</div>
  </div>
  <div class="card bg-secondary text-secondary-content shadow-sm">
    <div class="card-body">Middle card</div>
  </div>
  <div class="card bg-accent text-accent-content shadow-xs">
    <div class="card-body">Bottom card</div>
  </div>
</div>
```

## Stacking Images

### Good Example: Image Gallery Stack
```html
<div class="stack">
  <img src="..." class="rounded-box" />
  <img src="..." class="rounded-box" />
  <img src="..." class="rounded-box" />
</div>
```

## Interaction Patterns

Stacks are often used with hover effects to "expand" the stack via custom CSS or simple JS toggles.

### Bad Example: Too many items
```html
<!-- Bad: Stacking more than 3-4 items usually results in a messy appearance as the underlying items become too crowded -->
<div class="stack">
  <!-- 10 items ... -->
</div>
```
`````

## File: .agents/skills/daisyui/mockup-browser.md
`````markdown
# Mockup: Browser

The browser mockup component displays content inside a simulated web browser window.

## Basic Usage

### Good Example: Browser with URL Bar
```html
<div class="mockup-browser bg-base-300 border">
  <div class="mockup-browser-toolbar">
    <div class="input">https://daisyui.com</div>
  </div>
  <div class="flex justify-center bg-base-200 px-4 py-16">Hello!</div>
</div>
```

## Variants

### Good Example: Different Background Colors
```html
<div class="mockup-browser bg-primary text-primary-content border">
  <div class="mockup-browser-toolbar">
    <div class="input">https://daisyui.com</div>
  </div>
  <div class="flex justify-center bg-base-100 p-4">...</div>
</div>
```

### Bad Example: Excessive Content Height
```html
<!-- Bad: Mockups are best for demos; if the content is extremely long, it breaks the "window" illusion. Use a fixed height with overflow-y-auto for long content. -->
<div class="mockup-browser">
  <div class="h-96 overflow-y-auto">...</div>
</div>
```
`````

## File: .agents/skills/daisyui/mockup-code.md
`````markdown
# Mockup: Code

The code mockup component displays code snippets inside a simulated terminal window.

## Basic Usage

Use `data-prefix` on the `<code>` tag to show terminal prompts.

### Good Example: Simple Terminal Command
```html
<div class="mockup-code">
  <pre data-prefix="$"><code>npm i daisyui</code></pre>
  <pre data-prefix=">" class="text-warning"><code>installing...</code></pre> 
  <pre data-prefix=">" class="text-success"><code>Done!</code></pre>
</div>
```

## Line Highlights and Colors

### Good Example: Multi-line Code with Highlights
```html
<div class="mockup-code">
  <pre data-prefix="1"><code>const x = 10;</code></pre>
  <pre data-prefix="2" class="bg-warning text-warning-content"><code>console.log(x);</code></pre>
  <pre data-prefix="3"><code>// Output: 10</code></pre>
</div>
```

## Multi-line Wraps

Use `overflow-x-auto` if your code lines are long.

### Bad Example: Hardcoded Prefixes
```html
<!-- Bad: Do not put '$' directly in the code text; use the 'data-prefix' attribute for proper alignment and styling -->
<div class="mockup-code">
  <pre><code>$ npm install</code></pre>
</div>
```
`````

## File: .agents/skills/daisyui/mockup-phone.md
`````markdown
# Mockup: Phone

The phone mockup component displays content inside a simulated mobile device frame.

## Basic Usage

### Good Example: iPhone Mockup
```html
<div class="mockup-phone">
  <div class="camera"></div> 
  <div class="display">
    <div class="artboard phone-1 bg-base-200">
      <div class="flex h-full items-center justify-center">Hello World</div>
    </div>
  </div>
</div>
```

## Colored Borders

### Good Example: Primary Colored Phone
```html
<div class="mockup-phone border-primary">
  <div class="camera"></div>
  <div class="display">...</div>
</div>
```

### Bad Example: Invalid Hierarchy
```html
<!-- Bad: Missing 'camera' or 'display' divs will break the CSS grid layout of the phone frame -->
<div class="mockup-phone">
  <div class="artboard">...</div>
</div>
```
`````

## File: .agents/skills/daisyui/mockup-window.md
`````markdown
# Mockup: Window

The window mockup component displays content inside a simulated operating system window (macOS style).

## Basic Usage

### Good Example: Standard Window
```html
<div class="mockup-window bg-base-300 border">
  <div class="flex justify-center bg-base-200 px-4 py-16 text-xl">
    Hello!
  </div>
</div>
```

## Background Variants

### Good Example: Color and Contrast
```html
<div class="mockup-window bg-neutral text-neutral-content border">
  <div class="p-10">Window Content</div>
</div>
```

### Bad Example: Missing Border
```html
<!-- Bad: Without a border or a high-contrast background, the window mockup can blend into the page and lose its "window" effect -->
<div class="mockup-window bg-base-100">...</div>
```
`````

## File: .agents/skills/daisyui/navigation-bottom-nav.md
`````markdown
# Navigation: Bottom Nav

Bottom navigation is a mobile-first navigation pattern that stays fixed at the bottom of the screen.

## Basic Usage

### Good Example: Standard Bottom Nav
```html
<div class="btm-nav">
  <button>
    <svg ...></svg>
    <span class="btm-nav-label">Home</span>
  </button>
  <button class="active">
    <svg ...></svg>
    <span class="btm-nav-label">Warnings</span>
  </button>
  <button>
    <svg ...></svg>
    <span class="btm-nav-label">Stat</span>
  </button>
</div>
```

## Colors

Apply color classes directly to the buttons to indicate state.

### Good Example: Colored Active States
```html
<div class="btm-nav">
  <button class="text-primary active">...</button>
  <button class="text-secondary">...</button>
  <button class="text-accent">...</button>
</div>
```

## Sizes

### Good Example: Responsive Bottom Nav
```html
<div class="btm-nav btm-nav-xs sm:btm-nav-md md:btm-nav-lg">
  ...
</div>
```

### Bad Example: Missing Active Class
```html
<!-- Bad: If no button has the 'active' class, the user won't know which section they are currently in -->
<div class="btm-nav">
  <button>No Active State</button>
</div>
```
`````

## File: .agents/skills/daisyui/navigation-breadcrumbs.md
`````markdown
# Navigation: Breadcrumbs

Breadcrumbs help users understand their current location within a site's hierarchy.

## Basic Usage

Breadcrumbs use a standard `<ul>` inside a `<nav>` or `<div>` with the `breadcrumbs` class.

### Good Example: List-based Breadcrumbs
```html
<div class="breadcrumbs text-sm">
  <ul>
    <li><a>Home</a></li>
    <li><a>Documents</a></li>
    <li>Add Document</li>
  </ul>
</div>
```

## With Icons

### Good Example: Breadcrumbs with SVGs
```html
<div class="breadcrumbs text-sm">
  <ul>
    <li>
      <a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>
        Home
      </a>
    </li> 
    <li>
      <a>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mr-2 h-4 w-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
        </svg>
        Documents
      </a>
    </li>
  </ul>
</div>
```

### Bad Example: Using Divs instead of Lis
```html
<!-- Bad: DaisyUI breadcrumbs rely on <ul> and <li> structure for proper styling and separators -->
<div class="breadcrumbs">
  <a>Home</a> / <a>Settings</a>
</div>
```
`````

## File: .agents/skills/daisyui/navigation-dock.md
`````markdown
# DaisyUI Navigation: Dock

A bottom navigation component (formerly `btm-nav`) optimized for mobile web and desktop applications.

## Basic Usage
The `dock` class creates a fixed bottom bar.

```html
<div class="dock">
  <button>
    <svg>...</svg>
    <span class="dock-label">Home</span>
  </button>
  <button class="dock-active">
    <svg>...</svg>
    <span class="dock-label">Search</span>
  </button>
  <button>
    <svg>...</svg>
    <span class="dock-label">Profile</span>
  </button>
</div>
```

## Pattern: Responsive Dock
Hide labels on small screens or change dock position.

```html
<div class="dock dock-sm md:dock-md lg:dock-lg">
  <button class="text-primary">
    <svg>...</svg>
  </button>
  <button>
    <svg>...</svg>
  </button>
</div>
```

## Good vs. Bad Dock
```html
<!-- Good: Semantic dock with proper button interaction -->
<nav class="dock">
  <a href="/">...</a>
</nav>

<!-- Bad: Manual absolute positioning and flex-grow hacks -->
<div class="fixed bottom-0 w-full flex justify-around bg-white">...</div>
```

## Quick Reference
- `dock-active`: Highlights the current item.
- `dock-xs` to `dock-lg`: Sizing.
- `dock-label`: Optional text label below icons.
`````

## File: .agents/skills/daisyui/navigation-link.md
`````markdown
# Navigation: Link

The link component styles anchor tags with subtle hover effects and semantic colors.

## Basic Usage

### Good Example: Standard Link
```html
<a class="link">I am a simple link</a>
```

## Colors and Hover

Use `link-hover` if you want the underline to only appear on hover.

### Good Example: Link Variants
```html
<a class="link link-primary">Primary color</a>
<a class="link link-secondary">Secondary color</a>
<a class="link link-hover">Underline only on hover</a>
<a class="link link-neutral">Neutral color</a>
```

## Interaction Patterns

### Good Example: Hover-Primary
```html
<!-- Text starts neutral and becomes primary on hover -->
<a class="link hover:link-primary">Hover me to see primary color</a>
```

### Bad Example: Over-styling Links
```html
<!-- Bad: Using button classes for text-only inline links is confusing for UX -->
<p>Click <a class="btn btn-link">this button</a> to continue.</p>
```
`````

## File: .agents/skills/daisyui/navigation-menu.md
`````markdown
# Navigation: Menu

The menu component is a list of links, often used for sidebars or dropdowns. It can be vertical or horizontal.

## Vertical Menu

### Good Example: Basic Sidebar Menu
```html
<ul class="menu bg-base-200 rounded-box w-56">
  <li><a>Item 1</a></li>
  <li>
    <a>Parent</a>
    <ul>
      <li><a>Submenu 1</a></li>
      <li><a>Submenu 2</a></li>
    </ul>
  </li>
  <li><a>Item 3</a></li>
</ul>
```

## Horizontal Menu

### Good Example: Navbar Menu
```html
<ul class="menu menu-horizontal bg-base-200 rounded-box">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li><a>Item 3</a></li>
</ul>
```

## Active and Focus States

### Good Example: Highlighted Item
```html
<li><a class="active">Current Page</a></li>
<li><a class="focus">Focused Item</a></li>
```

## With Icons

### Good Example: Menu with Icons
```html
<ul class="menu bg-base-200 rounded-box w-56">
  <li>
    <a>
      <svg ...></svg>
      Dashboard
    </a>
  </li>
</ul>
```

### Bad Example: Unordered Structure
```html
<!-- Bad: DaisyUI menu expects a strict <ul> -> <li> -> <a> structure -->
<div class="menu">
  <a>Item 1</a>
</div>
```
`````

## File: .agents/skills/daisyui/navigation-navbar.md
`````markdown
# Navigation: Navbar

The navbar is a high-level container for branding, navigation links, and actions at the top of a page.

## Anatomy of a Navbar

A standard navbar is divided into `navbar-start`, `navbar-center`, and `navbar-end`.

### Good Example: Standard Layout
```html
<div class="navbar bg-base-100 shadow-sm">
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn">Button</a>
  </div>
</div>
```

## Responsive Navbar

Use a dropdown in `navbar-start` for mobile menus.

### Good Example: Mobile Dropdown
```html
<div class="navbar-start">
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
      <svg ...></svg>
    </div>
    <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
      <li><a>Item 1</a></li>
    </ul>
  </div>
  <a class="btn btn-ghost text-xl">daisyUI</a>
</div>
```

### Bad Example: Center-heavy Layout on Mobile
```html
<!-- Bad: Centered navigation usually overflows on mobile; always wrap in hidden lg:flex -->
<div class="navbar-center flex">...</div>
```
`````

## File: .agents/skills/daisyui/navigation-pagination.md
`````markdown
# Navigation: Pagination

Pagination allows users to navigate through multi-page content using a group of buttons.

## Basic Usage

Wrap buttons in a `join` container to group them together.

### Good Example: Simple Pagination
```html
<div class="join">
  <button class="join-item btn">1</button>
  <button class="join-item btn btn-active">2</button>
  <button class="join-item btn">3</button>
  <button class="join-item btn">4</button>
</div>
```

## Sizes

### Good Example: Different Sizes
```html
<div class="join">
  <button class="join-item btn btn-xs">1</button>
  <button class="join-item btn btn-xs">2</button>
</div>
```

## Navigation with Arrows

### Good Example: Prev/Next Buttons
```html
<div class="join">
  <button class="join-item btn">«</button>
  <button class="join-item btn">Page 22</button>
  <button class="join-item btn">»</button>
</div>
```

### Bad Example: Ungrouped Buttons
```html
<!-- Bad: Without the 'join' container, buttons will have standard margins and separated borders -->
<button class="btn">1</button>
<button class="btn">2</button>
```
`````

## File: .agents/skills/daisyui/navigation-steps.md
`````markdown
# Navigation: Steps

Steps are used to visualize a multi-step process or progress through a wizard.

## Basic Usage

Steps use a `<ul>` with the `steps` class and `<li>` with the `step` class.

### Good Example: Progress Tracker
```html
<ul class="steps">
  <li class="step step-primary">Register</li>
  <li class="step step-primary">Choose plan</li>
  <li class="step">Purchase</li>
  <li class="step">Receive Product</li>
</ul>
```

## Vertical Steps

Add the `steps-vertical` class to stack steps.

### Good Example: Vertical Wizard
```html
<ul class="steps steps-vertical">
  <li class="step step-primary">Step 1</li>
  <li class="step step-primary">Step 2</li>
  <li class="step">Step 3</li>
</ul>
```

## Colored Steps

### Good Example: Status-based Colors
```html
<ul class="steps">
  <li class="step step-info">Fly</li>
  <li class="step step-success">Land</li>
  <li class="step step-error">Crash</li>
</ul>
```

### Bad Example: Too many steps
```html
<!-- Bad: More than 5 steps horizontally often overflows on mobile. Use 'steps-vertical' for small screens. -->
<ul class="steps">...</ul>
```
`````

## File: .agents/skills/daisyui/navigation-tab.md
`````markdown
# Navigation: Tab

Tabs allow users to switch between different views or content sections.

## Basic Usage

Tabs use a container with the `tabs` class. For modern DaisyUI 5 projects, using the radio button approach is recommended for state management without JS.

### Good Example: Tabbed Interface with Radio Buttons
```html
<div role="tablist" class="tabs tabs-bordered">
  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 1" />
  <div role="tabpanel" class="tab-content p-10">Tab content 1</div>

  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 2" checked="checked" />
  <div role="tabpanel" class="tab-content p-10">Tab content 2</div>

  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Tab 3" />
  <div role="tabpanel" class="tab-content p-10">Tab content 3</div>
</div>
```

## Variants

### Good Example: Lifted and Boxed Tabs
```html
<div role="tablist" class="tabs tabs-lifted">...</div>
<div role="tablist" class="tabs tabs-boxed">...</div>
```

## Sizes

### Good Example: Sizing Tabs
```html
<div role="tablist" class="tabs tabs-lg">...</div>
<div role="tablist" class="tabs tabs-xs">...</div>
```

### Bad Example: Manual Active Class Toggling
```html
<!-- Bad: Toggling 'tab-active' with JS is less efficient than using the radio input pattern (DaisyUI 5 standard) -->
<a class="tab tab-active">Tab 1</a>
```
`````

## File: .agents/skills/daisyui/SKILL.md
`````markdown
---
name: daisyui
description: Expert guidance for building accessible, themeable UI components using daisyUI 5 and Tailwind CSS 4. Use this skill whenever the user wants to build web interfaces, dashboards, or components with Tailwind CSS.
---

# daisyui

Expert guidance for using daisyUI 5 with Tailwind CSS 4 to build modern, accessible, and themeable web interfaces.

## Core Concepts & Configuration

Fundamental setup and customization for daisyUI projects.

See [themes.md](./themes.md) for:
- Official theme list and activation
- Customizing themes with `@theme` blocks
- Light/Dark mode implementation

See [base-style.md](./base-style.md) for:
- Default CSS variables
- Color semantic mapping
- Global component styling

See [utilities-variables.md](./utilities-variables.md) for:
- Layout utilities (Flex/Grid integration)
- Variable overrides
- Performance optimization

See [theme-generator.md](./theme-generator.md) for:
- Tailwind CSS 4 `@theme` block generation
- OKLCH color customizing
- Variable-based theme overrides

## Actions

Interactive elements for user engagement.

- [actions-button.md](./actions-button.md): Primary, soft, outline, and ghost variants
- [actions-dropdown.md](./actions-dropdown.md): Menu placement, hover, and click triggers
- [actions-modal.md](./actions-modal.md): Dialog element integration and accessibility
- [actions-speed-dial.md](./actions-speed-dial.md): Floating action buttons with revealed sub-menu
- [actions-swap.md](./actions-swap.md): Animated state toggles (icons/text)
- [actions-theme-controller.md](./actions-theme-controller.md): Declarative theme switching toggles and radios

## Data Display

Displaying information in structured formats.

- [data-display-accordion.md](./data-display-accordion.md): Collapsible content sections
- [data-display-avatar.md](./data-display-avatar.md): User profiles and status indicators
- [data-display-badge.md](./data-display-badge.md): Small status indicators and counts
- [data-display-card.md](./data-display-card.md): Versatile content containers
- [data-display-carousel.md](./data-display-carousel.md): Image and content sliders
- [data-display-chat.md](./data-display-chat.md): Messaging interface bubbles
- [data-display-collapse.md](./data-display-collapse.md): Simple toggleable visibility
- [data-display-countdown.md](./data-display-countdown.md): Time-based counters
- [data-display-diff.md](./data-display-diff.md): Side-by-side element comparison
- [data-display-hover-3d-card.md](./data-display-hover-3d-card.md): Interactive 3D tilt effects
- [data-display-hover-gallery.md](./data-display-hover-gallery.md): Expanding grid image galleries
- [data-display-kbd.md](./data-display-kbd.md): Keyboard shortcut keys
- [data-display-list.md](./data-display-list.md): Semantic rows for settings and contacts
- [data-display-stat.md](./data-display-stat.md): Numerical data and KPI displays
- [data-display-status.md](./data-display-status.md): Standalone and avatar-bound status dots
- [data-display-table.md](./data-display-table.md): Tabular data formatting
- [data-display-text-rotate.md](./data-display-text-rotate.md): Animated sequential text headlines
- [data-display-timeline.md](./data-display-timeline.md): Chronological event lists

## Data Input

Collecting user information through forms.

- [data-input-calendar.md](./data-input-calendar.md): Date grid selection and display
- [data-input-checkbox.md](./data-input-checkbox.md): Multi-select options
- [data-input-fieldset.md](./data-input-fieldset.md): Grouped input containers with legends
- [data-input-file.md](./data-input-file.md): Styled file upload inputs
- [data-input-filter.md](./data-input-filter.md): Toggleable chips for search categories
- [data-input-label.md](./data-input-label.md): Semantic spacing for form labels
- [data-input-radio.md](./data-input-radio.md): Single-select options
- [data-input-range.md](./data-input-range.md): Slider inputs for numeric values
- [data-input-rating.md](./data-input-rating.md): Star and emoji rating systems
- [data-input-select.md](./data-input-select.md): Dropdown selection menus
- [data-input-text.md](./data-input-text.md): Standard text and email inputs
- [data-input-textarea.md](./data-input-textarea.md): Multi-line text input
- [data-input-toggle.md](./data-input-toggle.md): Binary switch inputs
- [data-input-validator.md](./data-input-validator.md): Real-time feedback for input criteria

## Feedback

Providing status and progress updates to users.

- [feedback-alert.md](./feedback-alert.md): Critical status messages
- [feedback-loading.md](./feedback-loading.md): Spinners and indeterminate states
- [feedback-progress.md](./feedback-progress.md): Determinant progress bars
- [feedback-radial.md](./feedback-radial.md): Circular progress indicators
- [feedback-skeleton.md](./feedback-skeleton.md): Content loading placeholders
- [feedback-toast.md](./feedback-toast.md): Floating notification messages
- [feedback-tooltip.md](./feedback-tooltip.md): Hover-based context info

## Navigation

Guiding users through the application.

- [navigation-breadcrumbs.md](./navigation-breadcrumbs.md): Path-based navigation
- [navigation-bottom-nav.md](./navigation-bottom-nav.md): Legacy sticky bottom navigation
- [navigation-dock.md](./navigation-dock.md): Modern sticky bottom navigation (replaces btm-nav)
- [navigation-link.md](./navigation-link.md): Styled anchor elements
- [navigation-menu.md](./navigation-menu.md): List-based navigation menus
- [navigation-navbar.md](./navigation-navbar.md): Main application headers
- [navigation-pagination.md](./navigation-pagination.md): Multi-page navigation controls
- [navigation-steps.md](./navigation-steps.md): Multi-step process indicators
- [navigation-tab.md](./navigation-tab.md): Content switching interfaces

## Layout

Structural components for page organization.

- [layout-artboard.md](./layout-artboard.md): Fixed-size mobile screens
- [layout-divider.md](./layout-divider.md): Vertical or horizontal separators
- [layout-drawer.md](./layout-drawer.md): Sidebar navigation overlays
- [layout-footer.md](./layout-footer.md): Multi-column page footers
- [layout-hero.md](./layout-hero.md): Large attention-grabbing headers
- [layout-indicator.md](./layout-indicator.md): Floating element badges
- [layout-join.md](./layout-join.md): Grouping adjacent components
- [layout-mask.md](./layout-mask.md): Image shaping and cropping
- [layout-stack.md](./layout-stack.md): Layered component groupings

## Mockup

Presenting content inside simulated UI wrappers.

- [mockup-browser.md](./mockup-browser.md): Simulated browser window
- [mockup-code.md](./mockup-code.md): Styled terminal/editor block
- [mockup-phone.md](./mockup-phone.md): Simulated mobile device
- [mockup-window.md](./mockup-window.md): Simulated OS window
`````

## File: .agents/skills/daisyui/theme-generator.md
`````markdown
# DaisyUI 5 Theme Generator

Guide for generating and customizing themes in DaisyUI 5 using Tailwind CSS 4 `@theme` blocks.

## Basic Usage
In DaisyUI 5, themes are defined using standard CSS variables within a Tailwind `@theme` block.

```css
@theme {
  --color-primary: oklch(0.65 0.25 250);
  --color-secondary: oklch(0.7 0.15 300);
  --radius-box: 1rem;
  --radius-btn: 0.5rem;
}
```

## Pattern: Multiple Themes
You can define multiple themes by nesting variables under data attributes.

```css
[data-theme="my-custom-theme"] {
  --color-primary: oklch(0.6 0.2 20);
  --color-base-100: oklch(0.95 0.02 20);
  --color-base-content: oklch(0.2 0.05 20);
}

[data-theme="dark-pro"] {
  --color-primary: oklch(0.5 0.15 200);
  --color-base-100: oklch(0.2 0.01 200);
  --color-base-content: oklch(0.9 0.01 200);
}
```

## Good vs. Bad Theme Config
```css
/* Good: Using OKLCH for consistent perceptual lightness across themes */
--color-primary: oklch(0.65 0.25 250);

/* Bad: Using Hex codes which don't support modern color features natively */
--color-primary: #3b82f6;
```

## Key Variable Prefix
DaisyUI 5 looks for specifically named variables to apply its component styles:
- `--color-primary`, `--color-secondary`, etc.
- `--color-base-100`, `--color-base-200`, etc.
- `--radius-btn`, `--radius-box`.
- `--padding-card`.
`````

## File: .agents/skills/daisyui/themes.md
`````markdown
# DaisyUI Themes

Expert guidance for implementing and customizing themes in daisyUI 5.

## Official Themes
daisyUI includes 32+ built-in themes. Activate them by adding `data-theme` to your `<html>` tag.

| Theme Group | Names |
|-------------|-------|
| Clean | `light`, `dark`, `cupcake`, `bumblebee`, `winter`, `nord` |
| Vibrant | `emerald`, `corporate`, `synthwave`, `cyberpunk`, `aqua` |
| Aesthetic | `retro`, `valentine`, `halloween`, `garden`, `forest`, `lofi`, `pastel`, `fantasy` |
| Pro | `luxury`, `dracula`, `business`, `night`, `coffee`, `dim`, `sunset` |

## Theme Activation
```html
<!-- Single theme -->
<html data-theme="cupcake">

<!-- Dark mode toggle support -->
<html data-theme="light">
<!-- Switch to -->
<html data-theme="dark">
```

## Pattern: Customizing with Tailwind 4
In Tailwind 4, you customize daisyUI themes directly in your CSS using the `@theme` block.

```css
@import "tailwindcss";
@plugin "daisyui";

@theme {
  /* Customize an existing theme */
  --color-primary: oklch(0.7 0.2 150);
  --color-primary-content: oklch(0.98 0.01 150);
  
  /* Create a custom theme object */
  --daisyui-theme-mytheme: {
    "primary": "#570df8",
    "primary-content": "#ffffff",
    "secondary": "#f000b8",
    "accent": "#37cdbe",
    "neutral": "#3d4451",
    "base-100": "#ffffff",
  }
}
```

## Good vs. Bad Theming
```html
<!-- Good: Using semantic colors -->
<div class="bg-primary text-primary-content p-4">
  Always readable in any theme.
</div>

<!-- Bad: Hardcoding hex values -->
<div class="bg-[#570df8] text-white p-4">
  Will look broken when switching to a light/custom theme.
</div>
```
`````

## File: .agents/skills/daisyui/utilities-variables.md
`````markdown
# Utilities & Variables

DaisyUI 5 and Tailwind CSS 4 integrate deeply, allowing you to use CSS variables to override specific component behaviors without writing complex selectors.

## Layout Utilities

Use standard Tailwind layout utilities alongside DaisyUI components.

### Good Example: Mixing Tailwind Layout with DaisyUI
```html
<div class="flex flex-col gap-4 p-6 sm:grid sm:grid-cols-2">
  <div class="card bg-base-100 shadow-sm">...</div>
  <div class="card bg-base-100 shadow-sm">...</div>
</div>
```

## Variable Overrides

DaisyUI 5 allows overriding specific component variables within a local scope or in the `@theme` block.

### Good Example: Local Variable Override
```html
<!-- Overriding the border radius locally using arbitrary property syntax in Tailwind 4 -->
<button class="btn btn-primary [--rounded-btn:0.5rem]">
  Slightly Rounded Button
</button>
```

### Good Example: Global Theme Overrides
```css
@theme {
  /* Tailwind 4 @theme syntax for global DaisyUI variables */
  --rounded-box: 1rem; /* Border radius for cards and modals */
  --rounded-btn: 0.5rem; /* Border radius for buttons */
  --animation-btn: 0.25s; /* Click animation duration */
}
```

### Bad Example: Important Flags and Custom CSS
```css
/* Bad: Bypassing the built-in variable system */
.btn {
  border-radius: 0px !important;
}
```
`````

## File: .github/copilot-instructions.md
`````markdown
# SpacetimeDB Rules (All Languages)

## Migrating from 1.0 to 2.0?

**If you are migrating existing SpacetimeDB 1.0 code to 2.0, apply `spacetimedb-migration-2.0.mdc` first.** It documents breaking changes (reducer callbacks → event tables, `name`→`accessor`, `sender()` method, etc.) and should be considered before other rules.

---

## Language-Specific Rules

| Language | Rule File |
|----------|-----------|
| **TypeScript/React** | `spacetimedb-typescript.mdc` (MANDATORY) |
| **Rust** | `spacetimedb-rust.mdc` (MANDATORY) |
| **C#** | `spacetimedb-csharp.mdc` (MANDATORY) |
| **Migrating 1.0 → 2.0** | `spacetimedb-migration-2.0.mdc` |

---

## Core Concepts

1. **Reducers are transactional** — they do not return data to callers
2. **Reducers must be deterministic** — no filesystem, network, timers, or random
3. **Read data via tables/subscriptions** — not reducer return values
4. **Auto-increment IDs are not sequential** — gaps are normal, don't use for ordering
5. **`ctx.sender` is the authenticated principal** — never trust identity args

---

## Feature Implementation Checklist

When implementing a feature that spans backend and client:

1. **Backend:** Define table(s) to store the data
2. **Backend:** Define reducer(s) to mutate the data
3. **Client:** Subscribe to the table(s)
4. **Client:** Call the reducer(s) from UI — **don't forget this step!**
5. **Client:** Render the data from the table(s)

**Common mistake:** Building backend tables/reducers but forgetting to wire up the client to call them.

---

## Index System

SpacetimeDB automatically creates indexes for:
- Primary key columns
- Columns marked as unique

You can add explicit indexes on non-unique columns for query performance.

**Index names must be unique across your entire module (all tables).** If two tables have indexes with the same declared name → conflict error.

**Schema ↔ Code coupling:**
- Your query code references indexes by name
- If you add/remove/rename an index in the schema, update all code that uses it
- Removing an index without updating queries causes runtime errors

---

## Commands

```bash
# Login to allow remote database deployment e.g. to maincloud
spacetime login

# Start local SpacetimeDB
spacetime start

# Publish module
spacetime publish <db-name> --module-path <module-path>

# Clear and republish
spacetime publish <db-name> --clear-database -y --module-path <module-path>

# Generate client bindings
spacetime generate --lang <lang> --out-dir <out> --module-path <module-path>

# View logs
spacetime logs <db-name>
```

---

## Deployment

- Maincloud is the spacetimedb hosted cloud and the default location for module publishing
- The default server marked by *** in `spacetime server list` should be used when publishing
- If the default server is maincloud you should publish to maincloud
- Publishing to maincloud is free of charge
- When publishing to maincloud the database dashboard will be at the url: https://spacetimedb.com/@<username>/<database-name>
- The database owner can view utilization and performance metrics on the dashboard

---

## Debugging Checklist

1. Is SpacetimeDB server running? (`spacetime start`)
2. Is the module published? (`spacetime publish`)
3. Are client bindings generated? (`spacetime generate`)
4. Check server logs for errors (`spacetime logs <db-name>`)
5. **Is the reducer actually being called from the client?**

---

## Editing Behavior

- Make the smallest change necessary
- Do NOT touch unrelated files, configs, or dependencies
- Do NOT invent new SpacetimeDB APIs — use only what exists in docs or this repo
- Do NOT add restrictions the prompt didn't ask for — if "users can do X", implement X for all users




# SpacetimeDB TypeScript SDK

## ⛔ HALLUCINATED APIs — DO NOT USE

**These APIs DO NOT EXIST. LLMs frequently hallucinate them.**

```typescript
// ❌ WRONG PACKAGE — does not exist
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";

// ❌ WRONG — these methods don't exist
SpacetimeDBClient.connect(...);
SpacetimeDBClient.call("reducer_name", [...]);
connection.call("reducer_name", [arg1, arg2]);

// ❌ WRONG — positional reducer arguments
conn.reducers.doSomething("value");  // WRONG!

// ❌ WRONG — static methods on generated types don't exist
User.filterByName('alice');
Message.findById(123n);
tables.user.filter(u => u.name === 'alice');  // No .filter() on tables object!
```

### ✅ CORRECT PATTERNS:

```typescript
// ✅ CORRECT IMPORTS
import { DbConnection, tables } from './module_bindings';  // Generated!
import { SpacetimeDBProvider, useTable, Identity } from 'spacetimedb/react';

// ✅ CORRECT REDUCER CALLS — object syntax, not positional!
conn.reducers.doSomething({ value: 'test' });
conn.reducers.updateItem({ itemId: 1n, newValue: 42 });

// ✅ CORRECT DATA ACCESS — useTable returns [rows, isLoading]
const [items, isLoading] = useTable(tables.item);
```

### ⛔ DO NOT:
- **Invent hooks** like `useItems()`, `useData()` — use `useTable(tables.tableName)`
- **Import from fake packages** — only `spacetimedb`, `spacetimedb/react`, `./module_bindings`

---

## 1) Common Mistakes Table

### Server-side errors

| Wrong | Right | Error |
|-------|-------|-------|
| Missing `package.json` | Create `package.json` | "could not detect language" |
| Missing `tsconfig.json` | Create `tsconfig.json` | "TsconfigNotFound" |
| Entrypoint not at `src/index.ts` | Use `src/index.ts` | Module won't bundle |
| `indexes` in COLUMNS (2nd arg) | `indexes` in OPTIONS (1st arg) | "reading 'tag'" error |
| Index without `algorithm` | `algorithm: 'btree'` | "reading 'tag'" error |
| `filter({ ownerId })` | `filter(ownerId)` | "does not exist in type 'Range'" |
| `.filter()` on unique column | `.find()` on unique column | TypeError |
| `insert({ ...without id })` | `insert({ id: 0n, ... })` | "Property 'id' is missing" |
| `const id = table.insert(...)` | `const row = table.insert(...)` | `.insert()` returns ROW, not ID |
| `.unique()` + explicit index | Just use `.unique()` | "name is used for multiple entities" |
| Index on `.primaryKey()` column | Don't — already indexed | "name is used for multiple entities" |
| Same index name in multiple tables | Prefix with table name | "name is used for multiple entities" |
| `.indexName.filter()` after removing index | Use `.iter()` + manual filter | "Cannot read properties of undefined" |
| Import spacetimedb from index.ts | Import from schema.ts | "Cannot access before initialization" |
| Multi-column index `.filter()` | **⚠️ BROKEN** — use single-column | PANIC or silent empty results |
| `JSON.stringify({ id: row.id })` | Convert BigInt first: `{ id: row.id.toString() }` | "Do not know how to serialize a BigInt" |
| `ScheduleAt.Time(timestamp)` | `ScheduleAt.time(timestamp)` (lowercase) | "ScheduleAt.Time is not a function" |
| `ctx.db.foo.myIndexName.filter()` | Use exact name: `ctx.db.foo.my_index_name.filter()` | "Cannot read properties of undefined" |
| `.iter()` in views | Use index lookups | Severe performance issues (re-evaluates on any change) |
| `ctx.db` in procedures | `ctx.withTx(tx => tx.db...)` | Procedures need explicit transactions |
| `ctx.myTable` in procedure tx | `tx.db.myTable` | Wrong context variable |

### Client-side errors

| Wrong | Right | Error |
|-------|-------|-------|
| `@spacetimedb/sdk` | `spacetimedb` | 404 / missing subpath |
| `conn.reducers.foo("val")` | `conn.reducers.foo({ param: "val" })` | Wrong reducer syntax |
| Inline `connectionBuilder` | `useMemo(() => ..., [])` | Reconnects every render |
| `const rows = useTable(table)` | `const [rows, isLoading] = useTable(table)` | Tuple destructuring |
| Optimistic UI updates | Let subscriptions drive state | Desync issues |
| `<SpacetimeDBProvider builder={...}>` | `connectionBuilder={...}` | Wrong prop name |

---

## 2) Table Definition (CRITICAL)

**`table()` takes TWO arguments: `table(OPTIONS, COLUMNS)`**

```typescript
import { schema, table, t } from 'spacetimedb/server';

// ❌ WRONG — indexes in COLUMNS causes "reading 'tag'" error
export const Task = table({ name: 'task' }, {
  id: t.u64().primaryKey().autoInc(),
  ownerId: t.identity(),
  indexes: [{ name: 'by_owner', algorithm: 'btree', columns: ['ownerId'] }]  // ❌ WRONG!
});

// ✅ RIGHT — indexes in OPTIONS (first argument)
export const Task = table({ 
  name: 'task',
  public: true,
  indexes: [{ name: 'by_owner', algorithm: 'btree', columns: ['ownerId'] }]
}, {
  id: t.u64().primaryKey().autoInc(),
  ownerId: t.identity(),
  title: t.string(),
  createdAt: t.timestamp(),
});
```

### Column types
```typescript
t.identity()           // User identity (primary key for per-user tables)
t.u64()                // Unsigned 64-bit integer (use for IDs)
t.string()             // Text
t.bool()               // Boolean
t.timestamp()          // Timestamp (use ctx.timestamp for current time)
t.scheduleAt()         // For scheduled tables only

// Product types (nested objects) — use t.object, NOT t.struct
const Point = t.object('Point', { x: t.i32(), y: t.i32() });

// Sum types (tagged unions) — use t.enum, NOT t.sum
const Shape = t.enum('Shape', { circle: t.i32(), rectangle: Point });
// Values use { tag: 'circle', value: 10 } or { tag: 'rectangle', value: { x: 1, y: 2 } }

// Modifiers
t.string().optional()           // Nullable
t.u64().primaryKey()            // Primary key
t.u64().primaryKey().autoInc()  // Auto-increment primary key
```

> ⚠️ **BIGINT SYNTAX:** All `u64`, `i64`, and ID fields use JavaScript BigInt.
> - Literals: `0n`, `1n`, `100n` (NOT `0`, `1`, `100`)
> - Comparisons: `row.id === 5n` (NOT `row.id === 5`)
> - Arithmetic: `row.count + 1n` (NOT `row.count + 1`)

### Auto-increment placeholder
```typescript
// ✅ MUST provide 0n placeholder for auto-inc fields
ctx.db.task.insert({ id: 0n, ownerId: ctx.sender, title: 'New', createdAt: ctx.timestamp });
```

### Insert returns ROW, not ID
```typescript
// ❌ WRONG
const id = ctx.db.task.insert({ ... });

// ✅ RIGHT
const row = ctx.db.task.insert({ ... });
const newId = row.id;  // Extract .id from returned row
```

### Schema export (CRITICAL)
```typescript
// At end of schema.ts — schema() takes exactly ONE argument: an object
const spacetimedb = schema({ table1, table2, table3 });
export default spacetimedb;

// ❌ WRONG — never pass tables directly or as multiple args
schema(myTable);      // WRONG!
schema(t1, t2, t3);   // WRONG!
```

---

## 3) Index Access

### TypeScript Query Patterns

```typescript
// 1. PRIMARY KEY — use .pkColumn.find()
const user = ctx.db.user.identity.find(ctx.sender);
const msg = ctx.db.message.id.find(messageId);

// 2. EXPLICIT INDEX — use .indexName.filter(value)
const msgs = [...ctx.db.message.message_room_id.filter(roomId)];

// 3. NO INDEX — use .iter() + manual filter
for (const m of ctx.db.roomMember.iter()) {
  if (m.roomId === roomId) { /* ... */ }
}
```

### Index Definition Syntax

```typescript
// In table OPTIONS (first argument), not columns
export const Message = table({ 
  name: 'message',
  public: true,
  indexes: [{ name: 'message_room_id', algorithm: 'btree', columns: ['roomId'] }]
}, {
  id: t.u64().primaryKey().autoInc(),
  roomId: t.u64(),
  // ...
});
```

### Naming conventions

**Table names — automatic transformation:**
- Schema: `table({ name: 'my_messages' })` 
- Access: `ctx.db.myMessages` (automatic snake_case → camelCase)

**Index names — NO transformation, use EXACTLY as defined:**
```typescript
// Schema definition
indexes: [{ name: 'canvas_member_canvas_id', algorithm: 'btree', columns: ['canvasId'] }]

// ❌ WRONG — don't assume camelCase transformation
ctx.db.canvasMember.canvasMember_canvas_id.filter(...)  // WRONG!
ctx.db.canvasMember.canvasMemberCanvasId.filter(...)    // WRONG!

// ✅ RIGHT — use exact name from schema
ctx.db.canvasMember.canvas_member_canvas_id.filter(...)
```

> ⚠️ **Index names are used VERBATIM** — pick a convention (snake_case or camelCase) and stick with it.

**Index naming pattern — use `{tableName}_{columnName}`:**
```typescript
// ✅ GOOD — unique names across entire module
indexes: [{ name: 'message_room_id', algorithm: 'btree', columns: ['roomId'] }]
indexes: [{ name: 'reaction_message_id', algorithm: 'btree', columns: ['messageId'] }]

// ❌ BAD — will collide if multiple tables use same index name
indexes: [{ name: 'by_owner', ... }]  // in Task table
indexes: [{ name: 'by_owner', ... }]  // in Note table — CONFLICT!
```

**Client-side table names:**
- Check generated `module_bindings/index.ts` for exact export names
- Usage: `useTable(tables.MyMessages)` or `tables.myMessages` (varies by SDK version)

### Filter vs Find
```typescript
// Filter takes VALUE directly, not object — returns iterator
const rows = [...ctx.db.task.by_owner.filter(ownerId)];

// Unique columns use .find() — returns single row or undefined
const row = ctx.db.player.identity.find(ctx.sender);
```

### ⚠️ Multi-column indexes are BROKEN
```typescript
// ❌ DON'T — causes PANIC
ctx.db.scores.by_player_level.filter(playerId);

// ✅ DO — use single-column index + manual filter
for (const row of ctx.db.scores.by_player.filter(playerId)) {
  if (row.level === targetLevel) { /* ... */ }
}
```

---

## 4) Reducers

### Definition syntax (CRITICAL)
**Reducer name comes from the export — NOT from a string argument.** Use `reducer(params, fn)` or `reducer(fn)`.

```typescript
import spacetimedb from './schema';
import { t, SenderError } from 'spacetimedb/server';

// ✅ CORRECT — export const name = spacetimedb.reducer(params, fn)
export const reducer_name = spacetimedb.reducer({ param1: t.string(), param2: t.u64() }, (ctx, { param1, param2 }) => {
  // Validation
  if (!param1) throw new SenderError('param1 required');
  
  // Access tables via ctx.db
  const row = ctx.db.myTable.primaryKey.find(param2);
  
  // Mutations
  ctx.db.myTable.insert({ ... });
  ctx.db.myTable.primaryKey.update({ ...row, newField: value });
  ctx.db.myTable.primaryKey.delete(param2);
});

// No params: export const init = spacetimedb.reducer((ctx) => { ... });
```

```typescript
// ❌ WRONG — reducer('name', params, fn) does NOT exist
spacetimedb.reducer('reducer_name', { param1: t.string() }, (ctx, { param1 }) => { ... });
```

### Update pattern (CRITICAL)
```typescript
// ✅ CORRECT — spread existing row, override specific fields
const existing = ctx.db.task.id.find(taskId);
if (!existing) throw new SenderError('Task not found');
ctx.db.task.id.update({ ...existing, title: newTitle, updatedAt: ctx.timestamp });

// ❌ WRONG — partial update nulls out other fields!
ctx.db.task.id.update({ id: taskId, title: newTitle });
```

### Delete pattern
```typescript
// Delete by primary key VALUE (not row object)
ctx.db.task.id.delete(taskId);          // taskId is the u64 value
ctx.db.player.identity.delete(ctx.sender);  // delete by identity
```

### Lifecycle hooks
```typescript
spacetimedb.clientConnected((ctx) => {
  // ctx.sender is the connecting identity
  // Create/update user record, set online status, etc.
});

spacetimedb.clientDisconnected((ctx) => {
  // Clean up: set offline status, remove ephemeral data, etc.
});
```

### Snake_case to camelCase conversion
- Server: `export const do_something = spacetimedb.reducer(...)` — name from export
- Client: `conn.reducers.doSomething({ ... })`

### Object syntax required
```typescript
// ❌ WRONG - positional
conn.reducers.doSomething('value');

// ✅ RIGHT - object
conn.reducers.doSomething({ param: 'value' });
```

---

## 5) Scheduled Tables

```typescript
// 1. Define table first (scheduled: () => reducer — pass the exported reducer)
export const CleanupJob = table({ 
  name: 'cleanup_job', 
  scheduled: () => run_cleanup  // reducer defined below
}, {
  scheduledId: t.u64().primaryKey().autoInc(),
  scheduledAt: t.scheduleAt(),
  targetId: t.u64(),  // Your custom data
});

// 2. Define scheduled reducer (receives full row as arg)
export const run_cleanup = spacetimedb.reducer({ arg: CleanupJob.rowType }, (ctx, { arg }) => {
  // arg.scheduledId, arg.targetId available
  // Row is auto-deleted after reducer completes
});

// Schedule a job
import { ScheduleAt } from 'spacetimedb';
const futureTime = ctx.timestamp.microsSinceUnixEpoch + 60_000_000n; // 60 seconds
ctx.db.cleanupJob.insert({ 
  scheduledId: 0n, 
  scheduledAt: ScheduleAt.time(futureTime),
  targetId: someId 
});

// Cancel a job by deleting the row
ctx.db.cleanupJob.scheduledId.delete(jobId);
```

---

## 6) Timestamps

### Server-side
```typescript
import { Timestamp, ScheduleAt } from 'spacetimedb';

// Current time
ctx.db.item.insert({ id: 0n, createdAt: ctx.timestamp });

// Future time (add microseconds)
const future = ctx.timestamp.microsSinceUnixEpoch + 300_000_000n;  // 5 minutes
```

### Client-side (CRITICAL)
**Timestamps are objects, not numbers:**
```typescript
// ❌ WRONG
const date = new Date(row.createdAt);
const date = new Date(Number(row.createdAt / 1000n));

// ✅ RIGHT
const date = new Date(Number(row.createdAt.microsSinceUnixEpoch / 1000n));
```

### ScheduleAt on client
```typescript
// ScheduleAt is a tagged union
if (scheduleAt.tag === 'Time') {
  const date = new Date(Number(scheduleAt.value.microsSinceUnixEpoch / 1000n));
}
```

---

## 7) Data Visibility & Subscriptions

**`public: true` exposes ALL rows to ALL clients.**

| Scenario | Pattern |
|----------|---------|
| Everyone sees all rows | `public: true` |
| Users see only their data | Private table + filtered subscription |

### Subscription patterns (client-side)
```typescript
// Subscribe to ALL public tables (simplest)
conn.subscriptionBuilder().subscribeToAll();

// Subscribe to specific tables with SQL
conn.subscriptionBuilder().subscribe([
  'SELECT * FROM message',
  'SELECT * FROM room WHERE is_public = true',
]);

// Handle subscription lifecycle
conn.subscriptionBuilder()
  .onApplied(() => console.log('Initial data loaded'))
  .onError((e) => console.error('Subscription failed:', e))
  .subscribeToAll();
```

### Private table + view pattern (RECOMMENDED)

**Views are the recommended approach** for controlling data visibility. They provide:
- Server-side filtering (reduces network traffic)
- Real-time updates when underlying data changes
- Full control over what data clients can access

> ⚠️ **Do NOT use Row Level Security (RLS)** — it is deprecated.

> ⚠️ **CRITICAL:** Procedural views (views that compute results in code) can ONLY access data via index lookups, NOT `.iter()`.
> If you need a view that scans/filters across many rows (including the entire table), return a **query** built with the query builder (`ctx.from...`).

```typescript
// Private table with index on ownerId
export const PrivateData = table(
  { name: 'private_data',
    indexes: [{ name: 'by_owner', algorithm: 'btree', columns: ['ownerId'] }]
  },
  {
    id: t.u64().primaryKey().autoInc(),
    ownerId: t.identity(),
    secret: t.string()
  }
);

// ❌ BAD — .iter() causes performance issues (re-evaluates on ANY row change)
spacetimedb.view(
  { name: 'my_data_slow', public: true },
  t.array(PrivateData.rowType),
  (ctx) => [...ctx.db.privateData.iter()]  // Works but VERY slow at scale
);

// ✅ GOOD — index lookup enables targeted invalidation
spacetimedb.view(
  { name: 'my_data', public: true },
  t.array(PrivateData.rowType),
  (ctx) => [...ctx.db.privateData.by_owner.filter(ctx.sender)]
);
```

### Query builder view pattern (can scan)

```typescript
// Query-builder views return a query; the SQL engine maintains the result incrementally.
// This can scan the whole table if needed (e.g. leaderboard-style queries).
spacetimedb.anonymousView(
  { name: 'top_players', public: true },
  t.array(Player.rowType),
  (ctx) =>
    ctx.from.player
      .where(p => p.score.gt(1000))
);
```

### ViewContext vs AnonymousViewContext
```typescript
// ViewContext — has ctx.sender, result varies per user (computed per-subscriber)
spacetimedb.view({ name: 'my_items', public: true }, t.array(Item.rowType), (ctx) => {
  return [...ctx.db.item.by_owner.filter(ctx.sender)];
});

// AnonymousViewContext — no ctx.sender, same result for everyone (shared, better perf)
spacetimedb.anonymousView({ name: 'leaderboard', public: true }, t.array(LeaderboardRow), (ctx) => {
  return [...ctx.db.player.by_score.filter(/* top scores */)];
});
```

**Views require explicit subscription:**
```typescript
conn.subscriptionBuilder().subscribe([
  'SELECT * FROM public_table',
  'SELECT * FROM my_data',  // Views need explicit SQL!
]);
```

---

## 8) React Integration

### Key patterns
```typescript
// Memoize connectionBuilder to prevent reconnects on re-render
const builder = useMemo(() => 
  DbConnection.builder()
    .withUri(SPACETIMEDB_URI)
    .withDatabaseName(MODULE_NAME)
    .withToken(localStorage.getItem('auth_token') || undefined)
    .onConnect(onConnect)
    .onConnectError(onConnectError),
  []  // Empty deps - only create once
);

// useTable returns tuple [rows, isLoading]
const [rows, isLoading] = useTable(tables.myTable);

// Compare identities using toHexString()
const isOwner = row.ownerId.toHexString() === myIdentity.toHexString();
```

---

## 9) Procedures (Beta)

**Procedures are for side effects (HTTP requests, etc.) that reducers can't do.**

⚠️ Procedures are currently in beta. API may change.

### Defining a procedure
**Procedure name comes from the export — NOT from a string argument.** Use `procedure(params, ret, fn)` or `procedure(ret, fn)`.

```typescript
// ✅ CORRECT — export const name = spacetimedb.procedure(params, ret, fn)
export const fetch_external_data = spacetimedb.procedure(
  { url: t.string() },
  t.string(),  // return type
  (ctx, { url }) => {
    const response = ctx.http.fetch(url);
    return response.text();
  }
);
```

### Database access in procedures

⚠️ **CRITICAL: Procedures don't have `ctx.db`. Use `ctx.withTx()` for database access.**

```typescript
spacetimedb.procedure({ url: t.string() }, t.unit(), (ctx, { url }) => {
  // Fetch external data (outside transaction)
  const response = ctx.http.fetch(url);
  const data = response.text();

  // ❌ WRONG — ctx.db doesn't exist in procedures
  ctx.db.myTable.insert({ ... });

  // ✅ RIGHT — use ctx.withTx() for database access
  ctx.withTx(tx => {
    tx.db.myTable.insert({
      id: 0n,
      content: data,
      fetchedAt: tx.timestamp,
      fetchedBy: tx.sender,
    });
  });

  return {};
});
```

### Key differences from reducers
| Reducers | Procedures |
|----------|------------|
| `ctx.db` available directly | Must use `ctx.withTx(tx => tx.db...)` |
| Automatic transaction | Manual transaction management |
| No HTTP/network | `ctx.http.fetch()` available |
| No return values to caller | Can return data to caller |

---

## 10) Project Structure

### Server (`backend/spacetimedb/`)
```
src/schema.ts   → Tables, export spacetimedb
src/index.ts    → Reducers, lifecycle, import schema
package.json    → { "type": "module", "dependencies": { "spacetimedb": "^1.11.0" } }
tsconfig.json   → Standard config
```

### Avoiding circular imports
```
schema.ts → defines tables AND exports spacetimedb
index.ts  → imports spacetimedb from ./schema, defines reducers
```

### Client (`client/`)
```
src/module_bindings/ → Generated (spacetime generate)
src/main.tsx         → Provider, connection setup
src/App.tsx          → UI components
src/config.ts        → MODULE_NAME, SPACETIMEDB_URI
```

---

## 11) Commands

```bash
# Start local server
spacetime start

# Publish module
spacetime publish <module-name> --module-path <backend-dir>

# Clear database and republish
spacetime publish <module-name> --clear-database -y --module-path <backend-dir>

# Generate bindings
spacetime generate --lang typescript --out-dir <client>/src/module_bindings --module-path <backend-dir>

# View logs
spacetime logs <module-name>
```

---

## 12) Hard Requirements

**TypeScript-specific:**

1. **`schema({ table })`** — takes exactly one object; never `schema(table)` or `schema(t1, t2, t3)`
2. **Reducer/procedure names from exports** — `export const name = spacetimedb.reducer(params, fn)`; never `reducer('name', ...)`
3. **Reducer calls use object syntax** — `{ param: 'value' }` not positional args
4. **Import `DbConnection` from `./module_bindings`** — not from `spacetimedb`
5. **DO NOT edit generated bindings** — regenerate with `spacetime generate`
6. **Indexes go in OPTIONS (1st arg)** — not in COLUMNS (2nd arg) of `table()`
7. **Use BigInt for u64/i64 fields** — `0n`, `1n`, not `0`, `1`
8. **Reducers are transactional** — they do not return data
9. **Reducers must be deterministic** — no filesystem, network, timers, random
10. **Views should use index lookups** — `.iter()` causes severe performance issues
11. **Procedures need `ctx.withTx()`** — `ctx.db` doesn't exist in procedures
12. **Sum type values** — use `{ tag: 'variant', value: payload }` not `{ variant: payload }`
`````

## File: docs/frontend/business-logic.md
`````markdown
# Lógica de Negocio y Gestión de Datos

La arquitectura de Venezuela Juega está diseñada para ser ligera, mantenible y fácil de actualizar por personal no técnico.

## 1. Google Sheets como CMS
El proyecto utiliza **Google Sheets** como su base de datos principal (CMS). Esto permite que la comunidad o administradores actualicen la lista de juegos sin tocar el código.
- **Papa Parse**: Se encarga de descargar y parsear el CSV de la hoja de cálculo en tiempo real.
- **Configuración**: Las URLs de las hojas se gestionan mediante variables de entorno (`VITE_SPREADSHEET_ID`, `VITE_SHEET_NAME`).

## 2. Procesamiento de Datos (Hooks y Utils)
- **`useGamesData`**: Es el hook central que orquestra la descarga del CSV y la transformación de datos crudos a objetos de tipo `Game`.
- **Validación y Mapeo**:
    - **GameStatus**: Un enum que normaliza estados como "En Desarrollo" o "Early Access" para que el filtrado sea consistente.
    - **GameOrigin**: Identifica si el juego viene de una Game Jam, es un proyecto personal o profesional.
- **Generación de Slugs**: Convierte títulos con caracteres especiales (acentos, ñ, espacios) en cadenas seguras para URLs mediante lógica de limpieza personalizada.

## 3. SEO y Pre-renderizado
Dado que es una SPA (Single Page Application), el SEO puede ser un reto. Venezuela Juega implementa un script de "post-build" que:
- Lee los slugs de los juegos.
- Genera archivos de metadatos para que rastreadores de RRSS (Twitter, Discord, Facebook) puedan ver la información de cada ficha individual sin necesidad de ejecutar JavaScript.

## 4. Estado de los Proyectos
La lógica de negocio define criterios específicos para los estados de cada juego:
- **Released/Publicado**: El juego está disponible para el público general.
- **In Development**: Proyectos activos.
- **Lost Media**: Juegos que se sabe que existieron pero cuyos archivos no están disponibles actualmente (importante para la preservación histórica).

## 5. Integración con APIs de Terceros
- **Steam API**: Obtiene datos adicionales y URLs de trailers de forma dinámica cuando se proporciona un `appid`.
- **YouTube/Vimeo**: Lógica para extraer IDs de video para incrustar trailers rápidamente.

## 6. Evolución: SpacetimeDB
Próximamente, el proyecto integrará **SpacetimeDB** para:
- Implementar un sistema de autenticación de usuarios.
- Permitir que los desarrolladores envíen sus propios juegos directamente desde la web.
- Gestión de perfiles y favoritos en tiempo real.
`````

## File: docs/frontend/components/catalog.md
`````markdown
# Sistema Catálogo

Exploración eficiente base datos juegos venezolanos.

## `FilterPanel`

Gestiona múltiples dimensiones filtrado.

### Funcionalidades
- **Acordeones**: Categorías (Estado, Género, Tiendas, Plataformas, Año).
- **Rango Años**: Selector dual lanzamientos.
- **Badges**: Conteo filtros activos en sección colapsada.
- **Responsive**: Panel lateral/modal en móvil.

### Ejemplo Uso
```tsx
<FilterPanel 
  genres={availableGenres}
  activeFilters={filters}
  onFilterChange={handleFilterChange}
  onClearAll={resetFilters}
/>
```

---

## `GameCard`

Unidad individual videojuego.

### Funcionalidades
- **Hover**: Escala + sombras sutiles.
- **Tiendas**: Iconos dinámicos (Steam, Itch, Play Store).
- **View Transitions**: IDs únicos para transiciones imágenes fluidas.

### Ejemplo Uso
```tsx
<GameCard 
  game={gameData}
  viewMode="grid"
/>
```

---

## `AlphaFilter`

Selector alfabético. Salto rápido por letra. Optimiza navegación.

---

## Mejoras
- **Input Chips**: Selección etiquetas más visual.
- **Virtualización**: `react-window` para >1000 juegos.
`````

## File: docs/frontend/components/hero.md
`````markdown
# Componentes Hero Internos

Sub-componentes especializados ubicados en `src/components/hero/` para el `HeroMosaic`.

## `CategoryCard`
Tarjetas interactivas diseño GOG.
- **Visual**: Efecto inset, sombras color dinámicas, blur en hover.
- **Datos**: Usa `categoryPresets.ts` para filtros + colores.

## `CompactStat`
Módulos métricas minimalistas.
- **Animación**: Entrada sutil sin parpadeo. Reutiliza estados `useMetadata`.

## `ProgressDots`
Indicador navegación + temporizador.
- **Visual**: Barra progreso indica tiempo hasta siguiente rotación automática.

## `categoryPresets.ts`
Centro configuración. Define:
- `dataSource`: (games/jams).
- `filterFn`: Lógica selección juegos.
- `accentFrom/To`: Colores branding.
`````

## File: docs/frontend/components/index.md
`````markdown
# Doc Componentes

Arquitectura modular centrada en reutilización + Tailwind CSS.

## Estructura

### 1. Sistema Catálogo ([catalog.md](catalog.md))
Visualización, búsqueda + filtrado.
- `GameGrid` / `GameList`: Contenedores colecciones.
- `GameCard`: Unidad básica videojuego.
- `FilterPanel`: Filtrado avanzado (género, motor, estado, año).
- `SearchBar`: Buscador con sugerencias + debounce.

### 2. Layout ([layout.md](layout.md))
Marco visual app.
- `Header` / `Footer`: Navegación + enlaces.
- `HeroMosaic`: Impacto visual home.
- `PageTransition`: Animaciones entrada GSAP.
- `Modal`: Detalle juegos + media.

### 3. Átomos ([ui-atoms.md](ui-atoms.md))
Piezas UI transversales.
- `StatusBadge`: Etiquetas estado desarrollo color.
- `StoreButton`: Enlaces tiendas + iconos plataforma.
- `LoadingOverlay`: Feedback carga global.

---

## Diseño
- **Responsive**: Ajuste 320px -> Ultra-wide.
- **Interacciones**: GSAP + transiciones CSS.
- **Accesibilidad**: Etiquetas semánticas + contraste.
`````

## File: docs/frontend/components/layout.md
`````markdown
# Layout y Estructura

Jerarquía visual + navegación.

## `HeroMosaic`

Impacto visual mosaico dinámico portadas.

### Funcionalidades
- **Parallax**: Fondo reacciona scroll.
- **Panel Stats**: Rotación automática categorías + métricas.
- **Always Dark**: Estética cinematográfica permanente.

*(Detalle en [HeroMosaic](../hero-mosaic.md))*

---

## `PageTransition`

Estandariza entrada páginas.

### Funcionamiento
Usa **GSAP**. Efecto *fade-in* + `translateY` al montar componente. Evita saltos bruscos.

### Ejemplo Uso
```tsx
<PageTransition>
  <MyContent />
</PageTransition>
```

---

## `Modal`

Detalle videojuego.

### Funcionalidades
- **Cierre**: Tecla `Esc`, click fuera, botón.
- **Scroll Lock**: Bloquea fondo.
- **Media**: Trailers YouTube/Vimeo + screenshots.

---

## Mejoras
- **Sticky Header**: Ocultar al bajar, mostrar al subir (móvil).
- **Skeleton Loaders**: Mejorar percepción velocidad (LCP).
`````

## File: docs/frontend/components/ui-atoms.md
`````markdown
# Átomos UI

Consistencia visual + interacción base.

## `StatusBadge`

Muestra estado desarrollo (`Lanzado`, `Demo`, `Perdido`). Colores semánticos + gradientes.

---

## `StoreButton`

Enlace tiendas.

### Funcionalidades
- **Auto-detección**: Icono/color según dominio (Steam, GOG, etc).
- **Seguridad**: `rel="noopener noreferrer"`.

---

## `Loading`

Feedback visual. SVG animados ligeros. `LoadingOverlay` bloquea interacción en carga pesada.

---

## Mejoras
- **Iconografía**: Lucide (SVG nativos) en vez de FontAwesome. Reduce bundle.
- **Tooltips**: Descripción en botones tiendas solo icono (móvil).
`````

## File: docs/frontend/design-tokens.md
`````markdown
# Guía de Design Tokens — Venezuela Juega

> Referencia práctica para mantener y extender el sistema de tokens de diseño del proyecto.

## Arquitectura de Tokens

El sistema usa **3 capas** (Tailwind v4 CSS-first):

```
@theme { Primitivos }      →  Valores raw de color, tipografía
:root  { Semánticos }       →  Variables CSS con propósito (glass, layout)
Componentes (clases TW)     →  bg-surface-900, text-brand-gold, etc.
```

### Regla de Oro

> **Nunca** sobrescribas nombres de paleta de Tailwind (`slate-*`, `cyan-*`, `blue-*`).  
> Usa nombres **semánticos propios**: `surface-*`, `brand-*`, `accent-*`.

---

## Inventario de Tokens Actuales

### Surface (escala oscura principal)

| Token | Hex | Uso típico |
|-------|-----|------------|
| `surface-950` | `#0d0a11` | Fondo más profundo, body |
| `surface-900` | `#18131e` | Fondos de sección, sidebar |
| `surface-800` | `#221a2a` | Cards, inputs, contenedores |
| `surface-700` | `#2c1b2e` | Bordes, divisores |
| `surface-600` | `#3b2a3d` | Bordes secundarios |
| `surface-500` | `#5b4a5d` | Texto deshabilitado |
| `surface-400` | `#9c8a9d` | Texto secundario, iconos |
| `surface-300` | `#d4cfd6` | Texto body |
| `surface-200` | `#eae7ec` | Texto principal |
| `surface-100` | `#fff4e0` | Texto destacado (warm) |
| `surface-50`  | `#ffffff` | Blanco puro |

### Brand (bandera venezolana)

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-gold` | `#f2b63d` | Amarillo principal, highlights |
| `brand-blue` | `#457cd6` | Azul principal, links |
| `brand-red` | `#e34262` | Rojo principal, errores |
| `brand-red-dark` | `#94353d` | Rojo oscuro, estados críticos |
| `brand-warm-white` | `#fff4e0` | Blanco cálido |

### Accent (paleta suplementaria)

| Token | Hex | Uso |
|-------|-----|-----|
| `accent-teal` | `#8fcccb` | Teal claro, highlights interactivos |
| `accent-teal-dark` | `#449489` | Teal primario, botones CTA |
| `accent-teal-deep` | `#285763` | Teal oscuro, sombras |
| `accent-indigo` | `#4b3b9c` | Violeta, scrollbar hover |
| `accent-indigo-dark` | `#2f2b5c` | Violeta oscuro |
| `accent-lime` | `#b4ba47` | Lima/verde claro |
| `accent-lime-dark` | `#6d8c32` | Lima oscuro |
| `accent-orange` | `#d46e33` | Naranja |
| `accent-mauve` | `#9c656c` | Mauve/rosado |
| `accent-mauve-dark` | `#57253b` | Mauve oscuro |
| `accent-mauve-deep` | `#2c1b2e` | Mauve profundo |

### Status (estados de juegos)

| Token | Hex | Estado |
|-------|-----|--------|
| `status-released` | `#16a34a` | Lanzado |
| `status-in-development` | `#f2b63d` | En desarrollo |
| `status-on-hold` | `#71717a` | En pausa |
| `status-canceled` | `#94353d` | Cancelado |
| `status-demo` | `#4ade80` | Demo lanzado |
| `status-prototype` | `#e4e4e7` | Prototipo |
| `status-lost` | `#fecaca` | Media perdida |
| `status-early` | `#449489` | Acceso anticipado |
| `status-recovered` | `#457cd6` | Recuperado |
| `status-unknown` | `#18181b` | Desconocido |

### Store (marcas de tiendas)

| Token | Hex | Tienda |
|-------|-----|--------|
| `store-steam` / `store-steam-hover` | `#172337` / `#2a475e` | Steam |
| `store-itch` / `store-itch-hover` | `#fa5c5c` / `#ff7f7f` | Itch.io |
| `store-nintendo` / `store-nintendo-hover` | `#e60012` / `#ff334f` | Nintendo |
| `store-playstation` / `store-playstation-hover` | `#0070d1` / `#0084f7` | PlayStation |
| `store-xbox` / `store-xbox-hover` | `#107b10` / `#00bfff` | Xbox |
| `store-google-play` / `store-google-play-hover` | `#00a185` / `#00c9a6` | Play Store |
| `store-apple` / `store-apple-hover` | `#000000` / `#333333` | App Store |
| `store-meta` / `store-meta-hover` | `#0078ff` / `#3391ff` | Meta |
| `store-gog` / `store-gog-hover` | `#c99aff` / `#3391ff` | GOG |

---

## Cómo Agregar Nuevos Tokens

### 1. Agregar un color primitivo

En `src/styles/global.css`, dentro del bloque `@theme`:

```css
@theme {
  /* ─── Tu nueva categoría ─── */
  --color-mi-nuevo-token: #hexcolor;
}
```

### 2. Usarlo en componentes

```tsx
// Tailwind lo genera automáticamente como clase
<div className="bg-mi-nuevo-token text-mi-nuevo-token">
```

### 3. Si es un token semántico (con propósito)

Agréguelo en `:root` como variable CSS:

```css
:root {
  --mi-variable: var(--color-mi-nuevo-token);
}
```

---

## Convenciones de Nombres

| Prefijo | Cuándo usarlo | Ejemplo |
|---------|--------------|---------|
| `surface-` | Escala de grises/oscuros del fondo | `surface-800` |
| `brand-` | Colores de identidad de marca | `brand-gold` |
| `accent-` | Colores decorativos/highlight | `accent-teal-dark` |
| `status-` | Estados de juegos | `status-released` |
| `store-` | Colores de marca de tiendas | `store-steam` |

### Reglas:
1. **Usar sufijos descriptivos** en vez de números arbitrarios: `-dark`, `-deep`, `-hover`
2. **Agrupar en familias**: `accent-teal`, `accent-teal-dark`, `accent-teal-deep`
3. **No sobrescribir paletas de Tailwind**: nunca `--color-slate-*` ni `--color-cyan-*`
4. **Token para cada uso**: no reutilizar el mismo hex en múltiples tokens a menos que sea intencional

---

## Tokens Semánticos en `:root`

Tokens de mayor nivel para efectos y layout:

```css
:root {
  --header-height: 80px;
  --primary-glow: conic-gradient(...);
  
  /* Glass morphism */
  --glass-bg: rgba(24, 19, 30, 0.4);
  --glass-border: rgba(255, 244, 224, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-card-bg: rgba(255, 255, 255, 0.03);
  --glass-card-border: rgba(255, 255, 255, 0.05);
}
```

---

## Patrones Anti (NO hacer)

| ❌ Incorrecto | ✅ Correcto |
|---|---|
| `bg-[#172337]` | `bg-store-steam` |
| `text-[#f2b63d]` | `text-brand-gold` |
| `--color-slate-900: #custom` | `--color-surface-900: #custom` |
| `bg-cyan-500` (overriding cyan) | `bg-accent-teal-dark` |
| `rgba(6, 182, 212, 0.3)` inline | Crear `--glass-*` token en `:root` |

---

## Checklist para Nuevos Componentes

- [ ] ¿Usas solo tokens de `@theme` para colores? (nunca hex raw)
- [ ] ¿Las sombras con `rgba()` están en `:root` como variables?
- [ ] ¿Los nombres de clase usan `surface-*`, `brand-*`, `accent-*`?
- [ ] ¿Los colores de hover/active usan tokens (ej. `hover:bg-store-steam-hover`)?
- [ ] ¿No se sobrescriben nombres de Tailwind por defecto?

---

## Próximos Pasos de Estandarización

### Pendientes de tokenizar:

1. **Sombras con rgba en inline styles**  
   Componentes como `GameCard.tsx`, `GameDetailPage.tsx`, `Modal.tsx` usan `shadow-[0_0_12px_rgba(...)]`. Crear tokens:
   ```css
   @theme {
     --shadow-glow-teal: 0 0 12px rgba(68, 148, 137, 0.3);
     --shadow-glow-red: 0 0 8px rgba(244, 63, 94, 0.5);
   }
   ```

2. **CalendarPage (FullCalendar overrides)**  
   ~30 valores `rgba(6, 182, 212, ...)` en un bloque `<style>` inline. Migrar a variables CSS.

3. **GameJamPage `gray-*` references**  
   ~30 usos de `text-gray-300/400` que podrían estandarizarse a `text-surface-300/400`.

4. **CategoryPresets `accentFrom`/`accentTo`**  
   Los colores en `categoryPresets.ts` son hex raw dinámicos. Considerar crear un mapping a los tokens CSS.

5. **Colores de gradiente dinámicos**  
   `GameJamsPage.tsx` genera gradientes con hex dinámico desde datos. No tokenizable directamente, pero documentar como excepción aceptada.

---

## Referencia Rápida: Migración de Nombres

| Antes (hijacked) | Después (token propio) |
|---|---|
| `slate-950` | `surface-950` |
| `slate-900` → `900` | `surface-900` → `900` |
| `cyan-400` | `accent-teal` |
| `cyan-500` | `accent-teal-dark` |
| `yellow-300/400/500` | `brand-gold` |
| `blue-400/500/600` | `brand-blue` |
| `red-400/500` | `brand-red` |
| `red-600` | `brand-red-dark` |
| `indigo-400/500` | `accent-indigo` |
| `emerald-300/400` | `accent-lime` |
| `orange-300/400/500` | `accent-orange` |
| `purple-300/400` | `accent-mauve` |
`````

## File: docs/frontend/features.md
`````markdown
# Características y Funcionalidades

Venezuela Juega ofrece una experiencia rica en funcionalidades orientadas al descubrimiento de videojuegos.

## 0. Hero Interactivo (Showcase)
- **Mosaico Dinámico**: Fondo con arte de juegos venezolanos que utiliza efectos de parallax mediante GSAP.
- **Métricas en Tiempo Real**: Visualización de estadísticas clave (total de juegos, estudios, desarrolladores).
- **Categorías Inteligentes**: Acceso directo a colecciones filtradas (PC, Móvil, Consolas, Demos) con rotación automática.
- [Ver documentación detallada](hero-mosaic.md).

## 1. Catálogo Interactivo
- **Vistas Duales**: Permite alternar entre una vista de **Grid** (inspirada en Steam) y una vista de **Lista** para facilitar la lectura rápida.
- **Masonry Grid**: Utiliza `@chenglou/pretext` para manejar un diseño de rejilla fluida que se adapta al contenido de las portadas sin dejar espacios vacíos innecesarios.
- **Buscador en tiempo real**: Filtra instantáneamente por título o desarrollador mientras el usuario escribe.

## 2. Filtros Avanzados
Los usuarios pueden refinar su búsqueda utilizando múltiples criterios:
- **Estado del proyecto**: Filtrar por juegos publicados, en desarrollo, acceso anticipado, cancelados, etc.
- **Plataformas**: Búsqueda por PC, Web, Mobile, Consolas, entre otras.
- **Géneros**: Navegación por etiquetas (RPG, Acción, Plataformas, etc.).
- **Tiendas**: Filtrar según dónde se pueden adquirir o jugar (Steam, Itch.io, Play Store).

## 3. Detalles del Juego (Modal y Slug)
- **Modal de Detalle**: Al seleccionar un juego, se abre una vista enriquecida con:
    - **Hero dinámico**: Una imagen de fondo impactante basada en el arte del juego.
    - **Layout 60/40**: Información organizada jerárquicamente.
    - **Videos Interactivos**: Trailers de YouTube o videos directos de Steam que se reproducen automáticamente o al hacer hover.
- **URLs Amigables (Slugs)**: Cada juego tiene su propia página estática accesible mediante un ID de texto legible (`/game/nombe-del-juego`).

## 4. Calendario de Lanzamientos
Integración con **FullCalendar** para visualizar:
- Fecha de lanzamientos pasados y futuros.
- Eventos importantes de la industria.
- Permite a los desarrolladores y fans planificar su agenda de juegos.

## 5. Estadísticas y Charts
Sección dedicada (integrada con **Chart.js**) que muestra:
- Distribución de juegos por género.
- Plataformas más populares para el desarrollo nacional.
- Evolución de lanzamientos por año.

## 6. Galería de Game Jams
Espacio exclusivo para eventos como la **GameJam+ 25/26**, donde se muestran:
- Rankings de organizaciones locales.
- Juegos clasificados como proyectos de Game Jam.

## 7. Optimización y Accesibilidad
- **Responsive Design**: Totalmente optimizado para su uso en dispositivos móviles mediante un menú hamburguesa y layouts adaptables.
- **SEO Ready**: Inyección de metadatos (OpenGraph/Twitter Cards) para que al compartir un link en redes sociales, se vea la portada del juego y su descripción.
- **Micro-animaciones**: Uso de **GSAP** para transiciones suaves y efectos de scroll en el Header y Footer.

## 8. Sistema de Presencia (Luciérnagas)
- **Gamificación**: Representación visual de otros visitantes activos como orbes de luz (luciérnagas) que vuelan por la página.
- **Tiempo Real**: Sincronización instantánea mediante **SpacetimeDB** con actualizaciones de posición cada 2 segundos.
- **Efectos Orgánicos**: Movimiento suave (lerp) y "revoloteo" aleatorio mediante GSAP para simular vida en los cursores de otros usuarios.
- **No Obstructivo**: Capa visual de solo lectura que no interfiere con la interacción del usuario.
`````

## File: docs/frontend/firefly-system.md
`````markdown
# Sistema de Presencia (Fireflies / Luciérnagas)

El sistema de **Luciérnagas** es una funcionalidad de presencia en tiempo real que gamifica la experiencia de navegación. Permite a los usuarios ver a otros visitantes activos en la misma página de forma no obstructiva mediante pequeñas orbes de luz animadas.

## 1. Arquitectura del Sistema

El sistema se basa en una arquitectura de tres capas:

### A. Persistencia y Sincronización (SpacetimeDB)
Utiliza la tabla `firefly` en SpacetimeDB para almacenar el estado de presencia de cada usuario:
- **Campos**: `playerId` (Hex), `x` (%), `y` (%), `location` (URL), `lastSeen` (Timestamp).
- **Backend Sync**: Un reductor (`update_firefly`) recibe las actualizaciones de posición.
- **Auto-Cleanup**: El servidor elimina automáticamente las filas cuando un usuario se desconecta (`onDisconnect`).

### B. FireflyProvider (Contexto Central)
Ubicación: `src/hooks/FireflyContext.tsx`

Provider Preact que centraliza **toda** la lógica de luciérnagas en un solo punto. Itera la tabla `firefly` **una sola vez** por actualización y produce dos datasets:

1. **`otherFireflies`**: Luciérnagas en la misma página (para overlay visual de cursor).
2. **`presenceBySlug`**: Conteo de luciérnagas agrupadas por slug de juego (`Record<string, number>`).

**Responsabilidades del Provider:**
- **Tracking**: Captura movimiento de mouse/touch y normaliza a porcentajes (0-100).
- **Heartbeat**: Envía pulsación al servidor cada **2 segundos**.
- **Iteración única**: Un solo `for` loop procesa todos los fireflies de la tabla.
- **Optimización de re-renders**: Compara conteos previos antes de actualizar `presenceBySlug`.

### C. Hooks de Consumo

| Hook | Retorno | Consumidor |
|------|---------|------------|
| `useFireflyOverlay()` | `{ otherFireflies }` | `FireflyOverlay.tsx` |
| `useFireflyPresence(slug)` | `number` (conteo) | `GameCard.tsx`, `GameList.tsx` |

### D. Visualización y Animación (GSAP)
- **Overlay**: Una capa fija (`FireflyOverlay.tsx`) con `pointer-events: none` que renderiza a los demás usuarios sin interferir con los clics.
- **Interpolación (Lerp)**: Utiliza **GSAP** para mover la luciérnaga suavemente entre el punto A y el punto B durante 1.8s, evitando saltos visuales.
- **Efecto de Vida (Flutter)**: Implementa un "revoloteo" aleatorio (`transform: translate`) de ±15px para que la luciérnaga se sienta orgánica incluso si el usuario remoto está estático.

## 2. Indicador de Presencia en Catálogo

Los componentes de catálogo (`GameCard`, `GameList`) muestran un indicador visual cuando hay luciérnagas navegando en la página de detalle de un juego. El propósito es guiar a los visitantes hacia "habitaciones activas".

### Flujo de Datos

```
firefly table (SpacetimeDB)
  └→ FireflyProvider (single iteration)
       ├→ otherFireflies → FireflyOverlay (cursores en pantalla)
       └→ presenceBySlug → GameCard/GameList (badges de presencia)
            Extracción: /game/:slug o /games/:slug → slug → count
```

### Tratamiento Visual

**GameCard (Grid/Masonry):**
- `ring-1 ring-cyan-400/40` — Borde cyan sutil
- `boxShadow` dinámico — Intensidad proporcional al conteo
- Badge top-left con dot pulsante + número de visitantes

**GameList (Filas):**
- `border-l-2 border-l-cyan-400/60` — Acento izquierdo cyan
- `inset boxShadow` — Resplandor interior
- Badge compacto con dot pulsante + conteo

**Intensidad escalable:**
- 1 firefly → glow sutil (`8px`, `0.08` opacity)
- 3+ fireflies → glow medio
- 5+ fireflies → glow máximo (`30px`, `0.3` opacity, capped)

## 3. Detalles Visuales

- **Estética**: Las luciérnagas tienen un núcleo blanco brillante, un resplandor cian (`#22d3ee`) y un anillo pulsante (`animate-pulse`).
- **Titileo (Flicker)**: Un efecto GSAP de alta frecuencia varía la opacidad y la escala de forma aleatoria para simular el brillo natural de un insecto.
- **Indicadores**: Badges usan `animate-ping` para el dot pulsante, consistente con el color cyan del sistema.

## 4. Optimización de Rendimiento

- **Iteración única**: El `FireflyProvider` itera `connection.db.firefly.iter()` una sola vez por evento (insert/update/delete), generando ambos datasets simultáneamente.
- **Transmisión de Datos**: Solo se envían coordenadas y ubicación, minimizando el ancho de banda.
- **Shallow comparison**: `presenceBySlug` solo se actualiza en el estado si los conteos cambiaron, evitando cascadas de re-renders innecesarias.
- **GSAP Overwrite**: Las animaciones de movimiento usan `overwrite: 'auto'` para manejar gracefully las actualizaciones que llegan antes de que termine la animación anterior.

## 5. Jerarquía de Componentes

```
App.tsx
  └→ SpacetimeDBProvider
       └→ FireflyProvider (currentPath)
            ├→ FireflyOverlay (useFireflyOverlay)
            │    └→ Firefly × N (GSAP animated)
            ├→ GameGrid → GameCard × N (useFireflyPresence)
            └→ GameList → GameRowItem × N (useFireflyPresence)
```
`````

## File: docs/frontend/github-pages-spa.md
`````markdown
# Enrutamiento SPA en GitHub Pages

GitHub Pages no soporta nativamente el enrutamiento de Aplicaciones de Página Única (SPA). Cuando un usuario accede directamente a una ruta que no sea la raíz (ej. `/games/mi-juego`), el servidor de GitHub intenta encontrar un archivo físico en esa ubicación. Al no encontrarlo, devuelve un error 404.

Para solucionar esto, implementamos un workaround técnico que permite deep-linking y actualizaciones de página sin perder el estado del enrutador.

## Arquitectura del Workaround

El sistema se basa en la interceptación del error 404 y la redirección controlada utilizando tres archivos clave:

### 1. `public/404.html` (El Interceptor)
Este archivo es la pieza fundamental. GitHub Pages sirve automáticamente `404.html` para cualquier ruta no encontrada.

*   **Función**: Captura la `location.pathname` y `location.search` originales.
*   **Redirección**: Redirige al navegador a la raíz de la aplicación pasando la ruta original en un parámetro de consulta (ej. `/?p=/games/mi-juego`).
*   **Detección de Base**: Incluye lógica para detectar si el sitio corre en un dominio personalizado (`venezuelajuega.com`) o en el dominio de GitHub (`*.github.io`). Esto asegura que la ruta base (`/` vs `/venezuela-juega/`) se calcule correctamente para evitar bucles de redirección.

### 2. `index.html` (El Restaurador Temprano)
Ubicado en el `<head>`, este script se ejecuta antes de que se descarguen los archivos JS pesados.

*   **Función**: Revisa si existe el parámetro `p` en la URL.
*   **Limpieza**: Si existe, utiliza `window.history.replaceState` para cambiar la URL del navegador de vuelta a la ruta original capturada, eliminando el parámetro `p` de la vista del usuario.
*   **Beneficio**: Esto ocurre tan rápido que el usuario rara vez nota el cambio de URL, y el router de Preact encuentra la ruta correcta ya establecida en el historial al inicializarse.

### 3. `index.tsx` (La Garantía de Consistencia)
El punto de entrada de la aplicación React/Preact.

*   **Función**: Refuerza la lógica de restauración y maneja casos de borde como la preservación de múltiples parámetros de consulta o hashes (`#`).
*   **Integración**: Asegura que el estado inicial de la aplicación coincida exactamente con lo que el usuario esperaba visitar, permitiendo que `preact-router` renderice el componente adecuado (como `GameDetailPage` o `NotFoundPage`).

## Ventajas de esta Implementación

1.  **Soporte de Deep Links**: Los usuarios pueden compartir enlaces directos a juegos específicos y funcionarán correctamente.
2.  **SEO y UX**: Aunque GitHub devuelve un código 404 inicialmente, el usuario termina viendo el contenido correcto en menos de un segundo.
3.  **Manejo de Errores**: Si el usuario introduce una ruta que realmente no existe en nuestra aplicación, el router restaurará la URL y luego mostrará nuestro componente `NotFoundPage.tsx` personalizado, en lugar de una página de error genérica del servidor.
4.  **Portabilidad**: Funciona tanto en entornos de desarrollo local como en producción (GitHub Pages) sin cambios manuales.

## Notas Técnicas
Este workaround está basado en el patrón de [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) pero optimizado para el sistema de construcción de Vite y soporte de dominios personalizados.
`````

## File: docs/frontend/hero-mosaic.md
`````markdown
# HeroMosaic Component

El `HeroMosaic` es el componente principal de la página de inicio de Venezuela Juega. Sirve como la primera impresión visual del sitio y ofrece una puerta de entrada dinámica al catálogo de juegos y estadísticas de la industria.

## Arquitectura Modular

El componente fue refactorado para separar la lógica de presentación en sub-componentes especializados ubicados en `src/components/hero/`:

- **`CategoryCard`**: Tarjetas visuales para las categorías principales. Inspiradas en el diseño de GOG, presentan un estilo "inset" con sombras de color, desenfoque al pasar el cursor y escalado interactivo.
- **`CompactStat`**: Módulos minimalistas para mostrar métricas clave (total de juegos, estudios, años de historia, etc.).
- **`TabButton`**: Botones estilizados para alternar entre las vistas del panel central.
- **`ProgressDots`**: Indicador visual de navegación entre pestañas que incluye una barra de progreso para la rotación automática.
- **`categoryPresets.ts`**: Archivo de configuración centralizado que define los filtros, colores e iconos de cada categoría.

## Funcionalidades Principales

### 1. Panel de Exhibición (Showcase)
El centro del Hero permite alternar entre dos vistas principales:
- **Explorar (Categorías)**: Una fila deslizable de tarjetas que filtran el catálogo por plataformas (PC, Móvil, Consolas) o estados (Lanzados, Demos).
- **Métricas (Estadísticas)**: Un resumen visual del impacto de la industria nacional, calculado dinámicamente a partir de la base de datos de juegos y jams.

### 2. Rotación Automática y Auto-pausa
El componente alterna automáticamente entre las pestañas "Explorar" y "Métricas" cada 10 segundos. 
- **Barra de Progreso**: Los puntos de navegación inferiores muestran visualmente cuánto tiempo queda para el siguiente cambio.
- **Interacción Inteligente**: Si el usuario coloca el cursor sobre el panel de exhibición, el temporizador se pausa automáticamente para permitir una interacción sin interrupciones.

### 3. Fondo de Mosaico Animado
Utiliza una cuadrícula de 28 juegos aleatorios con portadas reales.
- **GSAP Parallax**: La cuadrícula tiene una animación de escala inicial y responde al scroll del usuario con un desplazamiento vertical suave (parallax).
- **Filtros Visuales**: Las imágenes están desaturadas y oscurecidas por defecto para priorizar la legibilidad del texto frontal, recuperando color al pasar el cursor (en dispositivos compatibles).

### 4. Responsividad Crítica
- **Desktop**: Layout amplio con navegación por flechas y hover effects detallados.
- **Mobile**: 
    - El mosaico de fondo se simplifica a menos columnas.
    - Las métricas pasan de una cuadrícula a un carrusel interactivo con flechas laterales y puntos de navegación propios.
    - Las tarjetas de categorías se adaptan para ser el foco de la pantalla mediante scroll-snap.

## Lógica de Filtrado y Datos

El componente utiliza `CATEGORY_PRESETS` para generar las vistas filtradas. Cada preset define:
- `dataSource`: Si debe buscar en juegos publicados (`games`), proyectos de Game Jam (`jams`) o ambos (`all`).
- `filterFn` / `filterRecord`: Reglas de filtrado para seleccionar los juegos que pertenecen a esa categoría.
- `accentFrom` / `accentTo`: Colores de marca para las tarjetas y los iconos de estadísticas.

## Cómo Extenderlo

### Añadir una nueva Categoría
Para añadir una nueva categoría al Hero, simplemente edita `src/components/hero/categoryPresets.ts` y añade un nuevo objeto al array `CATEGORY_PRESETS`. El componente detectará automáticamente el cambio, calculará el conteo de juegos y seleccionará una imagen de fondo aleatoria válida de entre los juegos que coincidan con el filtro.

### Modificar Animaciones
La mayoría de las animaciones están manejadas por:
1. **GSAP**: Para la lógica de ScrollTrigger y entrada del mosaico de fondo.
## Estética y Temas

A diferencia del resto del sitio, el `HeroMosaic` mantiene una **estética oscura cinematográfica** de forma permanente, independientemente de si la aplicación está en modo claro o oscuro.

- **`hero-always-dark`**: Esta clase CSS asegura que los contrastes y colores de la sección hero no cambien al activar el tema claro, preservando la atmósfera "gamer" y la legibilidad de los textos dorados/blancos sobre el mosaico de juegos.
- **Gradientes de Contraste**: El componente utiliza gradientes radiales y lineales fijos para asegurar que el centro de la pantalla siempre sea el punto focal y que las imágenes del mosaico no interfieran con la interfaz de usuario.
`````

## File: docs/frontend/hooks/data-fetching.md
`````markdown
# Hooks Gestión Datos

"Cerebro" app: transforma tablas Google Sheets en objetos `Game`.

## `useGamesData`

Usa **Papa Parse** descarga + procesa CSV (Juegos Públicos + Game Jams).

### Funcionamiento
1. Lee variables entorno (URLs CSV).
2. Descarga datos asíncrono.
3. Mapea columnas a interfaz `Game`.
4. Genera **slugs únicos** amigables (`/game/slug`).
5. Limpia URLs (HTTPS) + parsea screenshots/tiendas.

### Ejemplo Uso
```tsx
const { games, jamGames, loading, error } = useGamesData();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;

return <GameGrid games={games} />;
```

### Reuso
- Vistas catálogo completo/filtrado.
- Centralizado en `App.tsx` para proveer datos a rutas.

---

## `useMetadata`

Extrae info semántica para SEO + métricas impacto.
- **Conteo Industria**: Juegos, estudios, géneros dinámicos.
- **Gestión SEO**: Actualiza `<title>` + `<meta description>` según página/juego.

### Ejemplo Uso
```tsx
const stats = useMetadata(games);
// stats.totalGames -> count
```

---

## `useGameStats`

Prepara datos para gráficas (Chart.js/CSS).
- Agrupa juegos por año lanzamiento.
- Filtra proyectos incompletos.

---

## Mejoras
- **Caché IndexDB**: Persistencia local carga instantánea.
- **Validación Zod**: Esquemas para detectar errores CSV antes UI.
`````

## File: docs/frontend/hooks/index.md
`````markdown
# Doc Hooks

Hooks Venezuela Juega gestionan lógica estado global, obtención datos Google Sheets e interactividad real SpacetimeDB.

## Categorías Hooks

### 1. Gestión Datos ([data-fetching.md](data-fetching.md))
Hooks centralizan info catálogo + estadísticas.
- `useGamesData`: Motor principal, descarga + parsea CSV.
- `useMetadata`: Genera contadores industria, gestiona SEO.
- `useGameStats`: Datos estructurados para gráficas.

### 2. Presencia Tiempo Real ([presence.md](presence.md))
Sistemas visualización usuarios.
- `useFireflies`: Sincroniza cursor con backend.
- `FireflyContext`: Proveedor global estado presencia.

### 3. Utilidades UI ([ui-utilities.md](ui-utilities.md))
Herramientas mejora UX + rendimiento.
- `useDebounce`: Optimiza búsquedas reactivas.
- `useMeasure`: Dimensiones elementos tiempo real.
- `useTextLayout`: Ajuste dinámico tipografía.

---

## Prácticas
- **Tipado Fuerte**: Hooks usan interfaces en `src/types.ts`.
- **Caché**: Llamar `useGamesData` nivel alto (`App.tsx`) evita peticiones red extras.
`````

## File: docs/frontend/hooks/presence.md
`````markdown
# Hooks Presencia (Fireflies)

Sistema "Fireflies" visualiza presencia usuarios tiempo real. Luciérnagas siguen cursor.

## `useFireflies`

Gestiona conexión **SpacetimeDB**. Sincroniza coordenadas visitantes.

### Funcionamiento
1. **Captura Movimiento**: Eventos `mousemove` + `touchmove`.
2. **Normalización**: Píxeles -> Porcentajes relativos documento. Correcto en cualquier resolución.
3. **Sincronización**: Heartbeat cada 2s a SpacetimeDB (`updateFirefly`).
4. **Filtrado**: Solo muestra luciérnagas en misma URL.

### Ejemplo Uso
```tsx
const { otherFireflies } = useFireflies(location.pathname);

return (
  <FireflyOverlay>
    {otherFireflies.map(f => <Firefly x={f.x} y={f.y} />)}
  </FireflyOverlay>
);
```

### Reuso
- Contexto o layout global para persistencia visual.

---

## `FireflyContext`

Proveedor Preact. Cualquier componente accede estado presencia sin reconectar DB.

### Mejoras
- **Interpolación GSAP**: Movimiento suave entre coordenadas.
- **Inactividad**: Atenuar/desconectar si no hay movimiento.
`````

## File: docs/frontend/hooks/ui-utilities.md
`````markdown
# Hooks Utilidad UI

Herramientas transversales: fluidez + rendimiento.

## `useDebounce`

Retrasa actualización valor hasta tiempo determinado sin cambios.

### Uso
Optimización `SearchBar`. Filtra catálogo 300ms después dejar escribir.

```tsx
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  const filtered = games.filter(g => g.title.includes(debouncedSearch));
}, [debouncedSearch]);
```

---

## `useTextLayout` / `useMeasure`

Aseguran diseño no rompa con títulos largos.

### `useMeasure`
Obtiene dimensiones físicas (`width`, `height`). Uso: posicionamiento dinámico popups.

### `useTextLayout`
Detecta desbordamiento texto. Permite autosizing/truncado.

---

## Mejoras
- **`useIntersectionObserver`**: Lazy load portadas. Mejora rendimiento móvil.
`````

## File: docs/frontend/overview.md
`````markdown
# Descripción General - Venezuela Juega

## ¿Qué es Venezuela Juega?
**Venezuela Juega** es una plataforma web dedicada a centralizar, organizar y dar visibilidad a la industria del desarrollo de videojuegos en Venezuela. Funciona como un catálogo interactivo que permite a los usuarios descubrir títulos creados por talentos nacionales, desde grandes producciones hasta proyectos experimentales surgidos en Game Jams.

## Propósito y Misión
El sitio web nace con la necesidad de:
- **Indexar y preservar**: Crear un registro histórico de los videojuegos venezolanos, incluyendo aquellos que son considerados "lost media" o que ya no están disponibles en tiendas.
- **Conectar**: Facilitar que jugadores, desarrolladores y distribuidores encuentren proyectos nacionales en un solo lugar.
- **Promoción**: Ofrecer una vitrina profesional para los lanzamientos recientes y destacados de la industria.

## Audiencia
- **Jugadores**: Interesados en conocer y apoyar el talento local.
- **Desarrolladores**: Que buscan inspirarse o ver qué está haciendo el resto de la comunidad.
- **Investigadores**: Que deseen obtener estadísticas sobre el estado de la industria en el país.

## Acceso
El proyecto está desplegado actualmente en [venezuelajuega.com](https://venezuelajuega.com).
`````

## File: docs/frontend/README.md
`````markdown
# Documentación de Venezuela Juega

Bienvenido a la documentación técnica y de usuario del proyecto **Venezuela Juega**. Aquí encontrarás información detallada sobre cómo funciona la plataforma a nivel de frontend, su arquitectura y sus características.

## Contenido

1.  **[Descripción General](overview.md)**: ¿Qué es el proyecto, su misión y a quién va dirigido?
2.  **[Características y Funcionalidades](features.md)**: Detalle del catálogo, filtros, calendario, estadísticas y más.
3.  **[Lógica de Negocio](business-logic.md)**: Cómo se gestionan los datos desde Google Sheets, SEO, y la arquitectura de preservación.
4.  **[Hooks Personalizados](hooks/index.md)**: Documentación técnica de la lógica reactiva, obtención de datos y presencia.
5.  **[Biblioteca de Componentes](components/index.md)**: Guía de UI, sistema de diseño y componentes de catálogo.
7.  **[Hero Interactivo](hero-mosaic.md)**: Documentación del sistema de mosaico, estadísticas y categorías de la página de inicio.
8.  **[Enrutamiento SPA (GitHub Pages)](github-pages-spa.md)**: Explicación del workaround para deep-linking y manejo de errores 404.
9.  **[Stack Tecnológico](technical-stack.md)**: Herramientas, librerías y estructura del código fuente.

---

Para más detalles sobre el desarrollo, consulta el archivo [README.md](../README.md) en la raíz del repositorio.
`````

## File: docs/frontend/spacetimedb-reactivity.md
`````markdown
# SpacetimeDB Reactivity & State Management

Este documento describe la arquitectura y los patrones implementados para garantizar una sincronización en tiempo real fluida y precisa utilizando SpacetimeDB como backend, centrándose en la reactividad de estadísticas de juegos (likes, favoritos, visitas).

## 1. Patrón de Proveedor Centralizado (`SpacetimeDBProvider.tsx`)

Para evitar condiciones de carrera y redundancia, toda la lógica de suscripción y escucha de tablas reside en el `SpacetimeDBProvider`.

### Beneficios:
- **Fuente de Verdad Única**: Un solo mapa global para estadísticas (`gameStatsMap`) y uno para actividad personal (`myActivityMap`).
- **Suscripción Única**: Evita múltiples conexiones WebSocket abiertas.
- **Transmisión Atómica**: Al actualizar el mapa global, todos los componentes que consumen el contexto se renderizan simultáneamente con los mismos datos.

### Estabilización de Listeners:
Para evitar que se registren múltiples listeners idénticos (lo que causaría actualizaciones de estado duplicadas e inconsistentes), los controladores de eventos se definen con `useCallback` y se usan referencias estables.

```typescript
// Uso de Refs para evitar que la identidad cause re-registros innecesarios
const identityRef = useRef(identity);
useEffect(() => { identityRef.current = identity; }, [identity]);

// Handlers estables que no dependen de clausuras de estado volátiles
const onStatUpdate = useCallback((row: any) => {
    // Lógica de actualización...
}, []);
```

## 2. Aislamiento de Actividad Personal

Las tablas de "actividad" (como `my_activity`) contienen datos de **todos los usuarios**. Es crítico filtrar estas actualizaciones en el cliente para que la interfaz de un usuario no reaccione a las acciones de otro.

- **Filtro de Identidad**: Cada actualización de `my_activity` se compara contra `connection.identity`. Si la fila pertenece a otro `playerId`, se ignora silenciosamente.
- **Prevención de Fuga de Estado**: Esto garantiza que, si el Usuario A da "Me gusta", el corazón del Usuario B no se pinte de rosa, pero su contador sí suba (al recibir la actualización de `game_stats`).

## 3. UI Optimista y Cálculo de Contador Derivado

En lugar de usar un estado de "delta" (+1/-1) que es difícil de sincronizar con el servidor, implementamos un **Cálculo Derivado** en `useGameStats.ts`.

### Lógica de Cálculo:
El contador final se calcula comparando el estado actual del servidor con la intención optimista del usuario local.

```typescript
const totalHearts = useMemo(() => {
    let count = serverTotalHearts; // Valor real en DB
    // Si yo di Like optimísticamente pero la DB aún no lo refleja (+1)
    if (optHasLiked === true && !serverHasLiked) count += 1;
    // Si yo quité el Like pero la DB aún lo tiene (-1)
    if (optHasLiked === false && serverHasLiked) count -= 1;
    return Math.max(0, count);
}, [serverTotalHearts, serverHasLiked, optHasLiked]);
```

### Ventajas:
- **Resiliencia a Concurrencia**: Si otra persona da Like al mismo tiempo, `serverTotalHearts` sube y la fórmula se ajusta automáticamente sin perder el "Like" optimista del usuario actual.
- **Autocorrección**: En cuanto la base de datos se sincroniza con tu valor (ej. `serverHasLiked` se vuelve `true`), el valor optimista se resetea a `null` y la UI simplemente muestra el valor real del servidor.

## 4. Normalización de Slugs

Es imperativo que el `gameSlug` usado en el frontend coincida exactamente con la clave primaria en SpacetimeDB.
- Siempre usar la utilidad `generateSlug(title)` de `src/utils/gameUtils.ts`.
- Evitar comparaciones de strings manuales sin normalización previa.

---
*Última actualización: Abril 2026 - Documentado durante la corrección de reactividad multi-usuario.*
`````

## File: docs/frontend/technical-stack.md
`````markdown
# Stack Tecnológico

El proyecto utiliza tecnologías modernas enfocadas en el rendimiento, la interactividad y la facilidad de mantenimiento.

## Core
- **Preact 10.x**: Alternativa ligera a React con el mismo ecosistema de hooks, proporcionando un bundle size mucho menor y mejor rendimiento en dispositivos móviles.
- **TypeScript 5.x**: Tipado estático en todo el proyecto (Tipos definidos en `src/types`) para evitar errores en tiempo de ejecución.
- **Vite 6.x**: Herramienta de construcción ultrarrápida y servidor de desarrollo.

## Estilizacion y UI
- **Tailwind CSS v4**: Framework de utilidades para un diseño consistente y rápido de iterar. Se utiliza de forma local.
- **GSAP (GreenSock)**: Motor de animaciones utilizado para micro-interacciones, efectos parallax y transiciones de UI.
- **Bootstrap Icons & FontAwesome**: Sets de iconos para la interfaz de usuario.

## Visualización y Datos
- **Papa Parse**: Librería robusta para el procesamiento de archivos CSV/Google Sheets.
- **Chart.js**: Utilizada para las gráficas de analytics de la industria en la sección de estadísticas.
- **FullCalendar**: Maneja la vista de calendario de lanzamientos.
- **@chenglou/pretext**: Biblioteca de vanguardia para la medición aritmética de textos, fundamental para la implementación del **Masonry Grid** sin reflows de layout.

## Estructura del Proyecto
```
src/
├── components/   # Componentes reutilizables (Botones, Cards, Header, etc.)
├── hooks/        # Lógica de hooks personalizados (useGamesData, useMetadata)
├── pages/        # Componentes de página (Catalog, Details, JamGallery)
├── styles/       # Configuraciones globales de Tailwind y CSS general
├── types/        # Definiciones de Interfaces y Enums globales
├── utils/        # Funciones puras (Formateo de fechas, slugs, mapeos)
└── spacetimedb/  # Configuraciones y bindings para el backend distribuido
```
`````

## File: src/components/CoverImage.tsx
`````typescript
import { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';
⋮----
interface CoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}
⋮----
const handleError = () =>
⋮----
// Placeholder con degradado + emoji
`````

## File: src/components/hero/categoryPresets.ts
`````typescript
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
    faDesktop, faMobileAlt, faTv, faRocket, faPuzzlePiece, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Game, GameStatus, GameOrigin } from '@/src/types';
⋮----
export type CategoryDataSource = 'games' | 'jams' | 'all';
⋮----
export interface CategoryPreset {
    id: string;
    label: string;
    description: string;
    icon: IconDefinition;
    accentFrom: string;
    accentTo: string;

    dataSource: CategoryDataSource;
    filterFn?: (game: Game) => boolean;
    filterRecord?: Record<string, string[]>;
}
`````

## File: src/components/hero/index.ts
`````typescript

`````

## File: src/components/hero/ProgressDots.tsx
`````typescript
import { h } from 'preact';
⋮----
export interface ProgressDotsProps {
    activeTab: 'stats' | 'explore';
    onTabChange: (tab: 'stats' | 'explore') => void;
    progress: number;
}
`````

## File: src/components/icons/ExternalLinkIcon.tsx
`````typescript
import { h } from 'preact';
⋮----
interface ExternalLinkIconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
⋮----
const ExternalLinkIcon = (
`````

## File: src/components/icons/index.ts
`````typescript

`````

## File: src/components/PageTransition.tsx
`````typescript
import { useLayoutEffect, useRef } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import gsap from 'gsap';
⋮----
interface PageTransitionProps {
    children: ComponentChildren;
    className?: string;
}
⋮----
const PageTransition = (
⋮----
// Ensure initial state to avoid flash of content
`````

## File: src/hooks/FireflyContext.tsx
`````typescript
import { createContext } from 'preact';
import { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { useSpacetimeDB } from '../spacetimedb/connection';
⋮----
interface FireflyContextValue {
  otherFireflies: any[];
  presenceBySlug: Record<string, number>;
}
⋮----
interface FireflyProviderProps {
  currentPath: string;
  children: ComponentChildren;
}
⋮----
export const FireflyProvider = (
⋮----
const computeFireflyData = () =>
⋮----
const normalize = (p: string)
⋮----
export const useFireflyOverlay = () =>
⋮----
export const useFireflyPresence = (slug: string): number =>
`````

## File: src/hooks/useMetadata.ts
`````typescript
import { useEffect } from 'preact/hooks';
import { Game } from '@/src/types';
import { updateMetadata } from '@/src/utils';
import { trackPageView, trackGameView, trackEvent } from '@/src/utils/analytics';
⋮----
export const useMetadata = (currentPath: string, games: Game[]) =>
`````

## File: src/hooks/useTextLayout.ts
`````typescript
import { useState, useMemo, useEffect } from 'preact/hooks';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';
⋮----
interface TextLayoutOptions {
  fontSize?: number;
  lineHeight?: number;
  fontFamily?: string;
  whiteSpace?: 'normal' | 'pre-wrap';
  wordBreak?: 'normal' | 'keep-all';
}
⋮----
export function useTextLayout(
  text: string | undefined,
  containerWidth: number,
  options: TextLayoutOptions = {}
)
`````

## File: src/index.tsx
`````typescript
import { render } from 'preact';
import App from './App';
⋮----
// Normalize trailing slash (avoid blank page when route doesn't match '/path/' vs '/path')
⋮----
const normalized = pathname.replace(/\/+$/, ''); // remove trailing slashes
⋮----
// No-op: normalization is best-effort
`````

## File: src/pages/Redirect.tsx
`````typescript
import { useEffect } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';
⋮----
const Redirect = (
`````

## File: src/spacetimedb/module_bindings/firefly_table.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/game_stats_table.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/get_fireflies_nearby_procedure.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
⋮----
import {
  Firefly,
} from "./types";
`````

## File: src/spacetimedb/module_bindings/my_activity_table.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/profile_table.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/toggle_favorite_reducer.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/toggle_like_reducer.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/update_firefly_reducer.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/spacetimedb/module_bindings/visit_game_reducer.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
`````

## File: src/types/enums.ts
`````typescript
export enum GameStatus {
  RELEASED = "Lanzado",
  RELEASED_DEMO = "Demo",
  PROTOTYPE = "Prototipo",
  IN_DEVELOPMENT = "En desarrollo",
  ON_HOLD = "Pausado",
  CANCELED = "Cancelado",
  LOST_MEDIA = "Perdido",
  EARLY_ACCESS = "Acceso anticipado",
  RECOVERED = "Recuperado",
  UNKNOWN = "Desconocido",
}
⋮----
export enum GameOrigin {

    FROM_HOME = 'Desde casa',


    GAME_JAM = 'Gamejam',


    DEGREE_PROJECT = 'Proyecto de grado',


    CONTRACT = 'Contratación',


    MODDING = 'Modding',


    GAME_JAM_PLUS_25_26 = 'GameJam+ 25/26',
}
`````

## File: src/utils/analytics.ts
`````typescript
export type GAParams = Record<string, any>;
⋮----
function getGtag(): ((type: string, event: string, params?: GAParams) => void) | null
⋮----
export function trackEvent(eventName: string, params: GAParams =
⋮----
export function trackPageView(path?: string, title?: string): void
⋮----
export function trackNav(destination: string, source: string = 'header'): void
⋮----
export function trackGameCardClick(game:
⋮----
export function trackGameView(game:
⋮----
export function trackGameSection(game:
⋮----
export function trackExternalStore(game:
⋮----
export function trackGameJam(action: string, extra: GAParams =
`````

## File: src/utils/anotherUtils.ts
`````typescript
export const updateMetadata = (selector: string, attribute: string, content: string) =>
`````

## File: src/utils/index.ts
`````typescript

`````

## File: src/utils/stringUtils.ts
`````typescript
export const parseStringToArray = (str: string | undefined): string[] =>
⋮----
export const ensureHttps = (url: string | undefined): string | undefined =>
`````

## File: AGENTS.md
`````markdown
# Agent Instructions

## Package Manager
Use **npm**: `npm install`, `npm run dev`, `npm run build`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Typecheck | `npx tsc --noEmit path/to/file.ts` |
| Test | `npx vitest run path/to/file.test.ts` |
| Lint | `npx eslint path/to/file.ts` |

## SpacetimeDB Rules
Follow the canonical rules for database logic and client SDK:
- **General Rules:** See [.agents/rules/spacetimedb.md](.agents/rules/spacetimedb.md)
- **TypeScript SDK:** See [.agents/rules/spacetimedb-typescript.md](.agents/rules/spacetimedb-typescript.md)

## Key Conventions
- **Framework**: Preact with hooks (useState, useEffect, useMemo)
- **Styling**: Tailwind CSS (loaded via CDN, use utility classes)
- **Data Source**: Fetches from Google Spreadsheets via Papa Parse
- **Shared States**: Use `src/types.ts` for unified models
- **Tests**: Use `vitest` + `Testing Library for Preact` in `test/` directory
`````

## File: CONTRIBUTING.md
`````markdown
# Contribuye al proyecto

¡Gracias por tu interés en colaborar con **Venezuela Juega**! Este proyecto tiene como objetivo centralizar y dar visibilidad al talento nacional en el desarrollo de videojuegos.

Para que podamos trabajar juntos de la mejor manera, por favor sigue estas instrucciones:

## 1. Primeros pasos

### Crear un fork
Para contribuir, no puedes subir cambios directamente a este repositorio. Debes crear tu propio **fork**:
1. Haz clic en el botón "Fork" en la esquina superior derecha de este repositorio.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/{tu-usuario}/venezuela-juega.git
   ```

### Para entender el proyecto
Antes de empezar a codificar, es **obligatorio** leer la carpeta [`docs/`](./docs) para entender la arquitectura, el stack técnico y la lógica de negocio del proyecto:
- [Documentación Frontend](./docs/frontend)
- [Documentación Backend](./docs/backend)

## 2. Flujo de trabajo

### Ramas y cambios
1. Crea una rama para tu cambio: `git checkout -b feature/mi-nueva-caracteristica`.
2. Realiza tus cambios siguiendo las convenciones del proyecto.
3. Asegúrate de que el proyecto compila y no tiene errores de linting.

### Pull Requests (PR)
Una vez que tus cambios estén listos en tu fork:
1. Sube los cambios a tu repositorio: `git push origin feature/mi-nueva-caracteristica`.
2. Abre un **Pull Request** hacia la rama `pull-requests` del repositorio original.
3. **Notifica los cambios**: El PR debe incluir una descripción clara de qué se cambió, por qué se cambió y cualquier información relevante para la revisión (capturas de pantalla si es un cambio visual).

## 3. Entorno de desarrollo

Este proyecto utiliza **npm** como manejador de paquetes.

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Comandos útiles
| Tarea | Comando |
|-------|---------|
| Validar tipos | `npx tsc --noEmit` |
| Ejecutar tests | `npx vitest` |
| Linting | `npx eslint .` |

## 4. Convenciones técnicas

Para mantener la consistencia del código, sigue estas reglas:

- **Framework**: [Preact](https://preactjs.com/) con hooks (`useState`, `useEffect`, `useMemo`).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/).
- **Base de Datos**: [SpacetimeDB](https://spacetimedb.com/) para funcionalidades en tiempo real.
- **Modelos**: Todos los modelos compartidos deben estar en `src/types.ts`.
- **Tests**: Usamos `vitest` + `Testing Library for Preact`. Los tests se encuentran en la carpeta `test/`.

## 5. ¿Necesitas ayuda?

Si tienes dudas sobre cómo implementar algo o encuentras un error, puedes abrir un **Issue** para discutirlo antes de empezar a trabajar en el código.

---
¡Gracias por sumarte a la comunidad de desarrolladores de Venezuela!
`````

## File: docs/frontend/theme-system.md
`````markdown
# Sistema de Temas (Light/Dark Mode)

Este documento describe la arquitectura y el funcionamiento del sistema de temas de **Venezuela Juega**, el cual permite alternar entre un modo oscuro (predeterminado) y un modo claro con una transición visual suave.

## Arquitectura del Sistema

El sistema se basa en tres pilares fundamentales:
1. **Estado Global**: Administrado por `ThemeContext`.
2. **Inversión de Tokens**: Re-mapeado automático de colores de Tailwind v4 mediante variables CSS.
3. **Persistencia y Rendimiento**: Prevención de destellos (FOUC) mediante detección temprana.

---

## 1. ThemeContext

Ubicación: `src/hooks/ThemeContext.tsx`

Es el responsable de orquestar el cambio de estado y aplicar las persistencias necesarias.

### Funcionamiento
- **Estado Inicial**: Determina el tema basándose en `localStorage` (llave `vj-theme`). Si no existe, el valor predeterminado es `dark`.
- **Efecto de Aplicación**: Al cambiar el estado, actualiza la clase del elemento `<html>` (`.light` o `.dark`) y el atributo `data-theme`.
- **Transición**: Integra el **View Transitions API** para realizar un efecto de "revelación de logo" (logo reveal) al cambiar de tema.
- **Efecto de Logo**: El nuevo tema se revela a través del logo de la aplicación, el cual escala desde el centro de la pantalla.
- **Fases de Animación**: El logo aparece rápidamente (10% de la duración), se mantiene visible un momento para reforzar la identidad de marca, y finalmente se expande masivamente para revelar el contenido completo.

```typescript
const toggleTheme = () => {
    const switchTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    if (!document.startViewTransition) {
        switchTheme();
    } else {
        document.startViewTransition(switchTheme);
    }
};
```

---

## 2. Estrategia de Inversión de Tokens (CSS)

Ubicación: `src/styles/global.css`

En lugar de añadir clases `dark:` de forma manual en cientos de componentes, el sistema utiliza una técnica de **inversión de tokens** a nivel de motor de estilos.

### Tailwind v4 Configuration
Para habilitar el modo oscuro basado en clases (requerido por Tailwind v4), se utiliza la directiva:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Inversión de Escala
Definimos los colores base de la aplicación (Escala Surface) en el bloque `@theme`. Cuando la clase `.light` está activa, re-definimos esas mismas variables en el `@layer theme`:

- **Oscuro (Default)**: `surface-950` es negro profundo (#0d0a11).
- **Claro (.light)**: `surface-950` se convierte en un gris muy claro (#f5f3f7).

Este enfoque garantiza que cualquier componente que use tokens como `bg-surface-950` o `text-surface-200` se adapte **automáticamente** sin cambios en el código del componente.

### Secciones Scoped (`hero-always-dark`)
Para mantener la estética cinematográfica de la sección Hero (mosaico de juegos), se utiliza la clase `.hero-always-dark`. Esta clase restaura los tokens oscuros dentro de ese contenedor, incluso si el sitio está en modo claro.

---

## 3. Prevención de Destellos (FOUC)

Para evitar el "flash" de luz blanca al cargar la app en modo oscuro (o viceversa), se implementó un script de bloqueo en el `<head>` de `index.html`.

```html
<script>
    (function() {
        try {
            var t = localStorage.getItem('vj-theme');
            if (t === 'light' || t === 'dark') {
                document.documentElement.className = t;
            }
        } catch(e) {}
    })();
</script>
```

Este script se ejecuta antes de que el navegador renderice el cuerpo de la página, asegurando que el tema correcto esté aplicado desde el primer frame.

---

## 4. Efectos Visuales y Glassmorphism

El sistema adapta dinámicamente:
- **Scrollbars**: Cambian de color y opacidad según el tema.
- **Glass Panel**: La utilidad `.glass-panel` ajusta su desenfoque y opacidad de fondo (`white/75` en claro vs `surface-950/70` en oscuro). Los valores de glass están tokenizados en `:root` como `--glass-*`.
- **Logos**: Se aplica un filtro `invert` condicional mediante CSS para asegurar la visibilidad del logo blanco sobre fondos claros.

---

## 5. Mejores Prácticas para Desarrolladores

Para mantener la compatibilidad con el sistema de temas:
1. **Usa Tokens Surface**: Prefiere `bg-surface-900` sobre colores hexadecimales fijos. Ver [design-tokens.md](./design-tokens.md) para el inventario completo.
2. **Evita Hardcoding**: Si necesitas un color específico para un tema, usa las variantes de Tailwind: `bg-white dark:bg-surface-950`.
3. **Semántica**: Los tokens están invertidos. Recuerda que `surface-50` es el texto más oscuro en el tema claro.
4. **No sobrescribas Tailwind**: Nunca uses `--color-slate-*` o `--color-cyan-*` en `@theme`. Usa los nombres propios (`surface-*`, `accent-*`, `brand-*`).
`````

## File: src/components/BackButton.tsx
`````typescript
import { ComponentChildren, VNode } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { ArrowLeftIcon } from '@/src/components/icons';
⋮----
type Size = 'sm' | 'md' | 'lg';
⋮----
interface BackButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'class' | 'className' | 'size' | 'icon'> {
  onClick: () => void;
  children?: ComponentChildren;
  className?: string;
  icon?: VNode;
  size?: Size;
}
⋮----
md: '',      // default DaisyUI size
⋮----
const BackButton = (
`````

## File: src/components/GameCounter.tsx
`````typescript
interface GameCounterProps {
    filteredCount: number;
    totalCount: number;
}
⋮----
const GameCounter = (
`````

## File: src/components/PromoHeader.tsx
`````typescript
import { h } from 'preact';
import { ComponentChildren } from 'preact';
⋮----
interface PromoHeaderProps {
    title: string;
    subtitle: string;
    subtitleMobile?: string;
    logoSrc?: string;
    gradientClass?: string;
    children: ComponentChildren;
}
⋮----
const PromoHeader = ({
                           title,
                           subtitle,
                           subtitleMobile,
                           children,
                           logoSrc,
                           gradientClass
}: PromoHeaderProps) =>
`````

## File: src/components/ScreenshotLightbox.tsx
`````typescript
import { useEffect, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
⋮----
interface ScreenshotLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    screenshots: string[];
    initialIndex?: number;
}
⋮----
const showPrev = () =>
⋮----
const showNext = () =>
⋮----
const onKey = (e: KeyboardEvent) =>
⋮----
onClick=
`````

## File: src/components/ViewModeToggle.tsx
`````typescript
import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { ViewMode } from '@/src/types';
⋮----
interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}
⋮----
const ViewModeToggle = (
⋮----
onClick=
`````

## File: src/hooks/useMeasure.ts
`````typescript
import { useState, useLayoutEffect, useCallback, useRef } from 'preact/hooks';
⋮----
export function useMeasure<T extends HTMLElement>()
`````

## File: src/spacetimedb/connection.ts
`````typescript

`````

## File: src/spacetimedb/module_bindings/index.ts
`````typescript
import {
  DbConnectionBuilder as __DbConnectionBuilder,
  DbConnectionImpl as __DbConnectionImpl,
  SubscriptionBuilderImpl as __SubscriptionBuilderImpl,
  TypeBuilder as __TypeBuilder,
  Uuid as __Uuid,
  convertToAccessorMap as __convertToAccessorMap,
  makeQueryBuilder as __makeQueryBuilder,
  procedureSchema as __procedureSchema,
  procedures as __procedures,
  reducerSchema as __reducerSchema,
  reducers as __reducers,
  schema as __schema,
  t as __t,
  table as __table,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type DbConnectionConfig as __DbConnectionConfig,
  type ErrorContextInterface as __ErrorContextInterface,
  type Event as __Event,
  type EventContextInterface as __EventContextInterface,
  type Infer as __Infer,
  type QueryBuilder as __QueryBuilder,
  type ReducerEventContextInterface as __ReducerEventContextInterface,
  type RemoteModule as __RemoteModule,
  type SubscriptionEventContextInterface as __SubscriptionEventContextInterface,
  type SubscriptionHandleImpl as __SubscriptionHandleImpl,
} from "spacetimedb";
⋮----
import ToggleFavoriteReducer from "./toggle_favorite_reducer";
import ToggleLikeReducer from "./toggle_like_reducer";
import UpdateFireflyReducer from "./update_firefly_reducer";
import VisitGameReducer from "./visit_game_reducer";
⋮----
import FireflyRow from "./firefly_table";
import GameStatsRow from "./game_stats_table";
import MyActivityRow from "./my_activity_table";
import ProfileRow from "./profile_table";
⋮----
export type EventContext = __EventContextInterface<typeof REMOTE_MODULE>;
⋮----
export type ReducerEventContext = __ReducerEventContextInterface<typeof REMOTE_MODULE>;
⋮----
export type SubscriptionEventContext = __SubscriptionEventContextInterface<typeof REMOTE_MODULE>;
⋮----
export type ErrorContext = __ErrorContextInterface<typeof REMOTE_MODULE>;
⋮----
export type SubscriptionHandle = __SubscriptionHandleImpl<typeof REMOTE_MODULE>;
⋮----
export class SubscriptionBuilder extends __SubscriptionBuilderImpl<typeof REMOTE_MODULE>
⋮----
export class DbConnectionBuilder extends __DbConnectionBuilder<DbConnection>
⋮----
export class DbConnection extends __DbConnectionImpl<typeof REMOTE_MODULE>
`````

## File: src/spacetimedb/module_bindings/types.ts
`````typescript
import {
  TypeBuilder as __TypeBuilder,
  t as __t,
  type AlgebraicTypeType as __AlgebraicTypeType,
  type Infer as __Infer,
} from "spacetimedb";
⋮----
export type Firefly = __Infer<typeof Firefly>;
⋮----
export type GameActivity = __Infer<typeof GameActivity>;
⋮----
export type GameStats = __Infer<typeof GameStats>;
⋮----
export type GameVisit = __Infer<typeof GameVisit>;
⋮----
export type MyActivity = __Infer<typeof MyActivity>;
⋮----
export type Profile = __Infer<typeof Profile>;
`````

## File: src/spacetimedb/module_bindings/types/procedures.ts
`````typescript
import { type Infer as __Infer } from "spacetimedb";
⋮----
export type GetFirefliesNearbyArgs = __Infer<typeof GetFirefliesNearbyProcedure.params>;
export type GetFirefliesNearbyResult = __Infer<typeof GetFirefliesNearbyProcedure.returnType>;
`````

## File: src/spacetimedb/module_bindings/types/reducers.ts
`````typescript
import { type Infer as __Infer } from "spacetimedb";
⋮----
import ToggleFavoriteReducer from "../toggle_favorite_reducer";
import ToggleLikeReducer from "../toggle_like_reducer";
import UpdateFireflyReducer from "../update_firefly_reducer";
import VisitGameReducer from "../visit_game_reducer";
⋮----
export type ToggleFavoriteParams = __Infer<typeof ToggleFavoriteReducer>;
export type ToggleLikeParams = __Infer<typeof ToggleLikeReducer>;
export type UpdateFireflyParams = __Infer<typeof UpdateFireflyReducer>;
export type VisitGameParams = __Infer<typeof VisitGameReducer>;
`````

## File: src/utils/gameUtils.ts
`````typescript
import { GameStatus, GameOrigin } from '@/src/types';
⋮----
export const mapStatus = (statusStr: string | undefined): GameStatus =>
⋮----
export const generateSlug = (title: string): string =>
⋮----
export const ensureUniqueSlug = (baseSlug: string, existingSlugs: Set<string>): string =>
⋮----
/**
 * Maps a raw origin string from the spreadsheet to the GameOrigin enum
 * @param rawOrigin - The origin string from the spreadsheet
 * @returns The corresponding GameOrigin enum value or undefined if not found
 */
export const mapOrigin = (rawOrigin?: string): GameOrigin | undefined =>
⋮----
// Map the string values to enum values
⋮----
export type TrailerInfo = { type: 'youtube'; id: string } | { type: 'video'; url: string } | null;
⋮----
export const getTrailerInfo = (url?: string): TrailerInfo =>
`````

## File: src/App.tsx
`````typescript
import { useState, useMemo } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { Game, ViewMode } from "@/src/types";
import { useGamesData, useMetadata } from '@/src/hooks';
import { FireflyProvider } from '@/src/hooks/FireflyContext';
import { generateSlug, ensureUniqueSlug } from '@/src/utils';
import { Header, Modal, LoadingSpinner, Footer, ScrollToTop, FireflyOverlay } from '@/src/components';
import {
    ChartsPage,
    AddGamePage,
    AboutPage,
    CalendarPage,
    GameDetailPage,
    CatalogPage,
    GameJamGalleryPage,
    GameJamsPage,
    NotFoundPage,
    Redirect
} from '@/src/pages';
⋮----
import { SpacetimeDBProvider } from '@/src/spacetimedb/SpacetimeDBProvider';
⋮----
const handleFilterChange = (category: string, value: string) =>
⋮----
const handleRouteChange = (e: any) =>
⋮----
const handleOpenModal = (game: Game)
const handleCloseModal = ()
const navigateToCatalog = ()
`````

## File: src/components/AlphaFilter.tsx
`````typescript
import { h } from 'preact';
⋮----
interface AlphaFilterProps {
  activeAlpha: string | null;
  onAlphaChange: (value: string | null) => void;
  className?: string;
}
⋮----
const AlphaFilter = (
`````

## File: src/components/ContributorCard.tsx
`````typescript
import { h, ComponentChildren } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
⋮----
export interface ContributorSocial {
    icon: any;
    url: string;
}
⋮----
export interface Contributor {
    name: string;
    role: string;
    description: string;
    socials: ContributorSocial[];
}
`````

## File: src/components/hero/CategoryCard.tsx
`````typescript
import { h } from 'preact';
import type { CategoryPreset } from './categoryPresets';
⋮----
const hexToRgb = (hex: string): string =>
⋮----
export interface CategoryCardProps {
    preset: CategoryPreset;
    gameCount: number;
    backgroundSrc?: string;

    overrideImageUrl?: string;
    onClick: () => void;
    index: number;
}
`````

## File: src/components/hero/TabButton.tsx
`````typescript
import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
⋮----
export interface TabButtonProps {
    icon: IconDefinition;
    label: string;
    isActive: boolean;
    onClick: () => void;
}
⋮----
const TabButton = ({ icon, label, isActive, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5
            rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-[0.12em]
            transition-all duration-300 cursor-pointer border
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50
            ${isActive
                ? 'bg-white/[0.1] border-white/[0.15] text-white shadow-lg'
                : 'bg-transparent border-transparent text-base-content/70 hover:text-base-content/70 hover:bg-white/[0.04]'
            }
        `}
    >
        <FontAwesomeIcon icon={icon} className={`text-xs ${isActive ? 'text-accent' : ''}`} />
        <span className="hidden sm:inline">{label}</span>
    </button>
);
`````

## File: src/components/Highlights.tsx
`````typescript
import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { HighlightCard } from '@/src/components';
import { IndicatorLeftIcon, IndicatorRightIcon } from '@/src/components/icons';
⋮----
interface HighlightsProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}
⋮----
const goToPrevious = () =>
`````

## File: src/components/LoadingOverlay.tsx
`````typescript
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { gsap } from 'gsap';
⋮----
interface LoadingOverlayProps {
    isLoading: boolean;
    logoSrc?: string;
    onAnimationComplete?: () => void;
}
`````

## File: src/components/LoadingSpinner.tsx
`````typescript
import {FunctionComponent, h} from 'preact';
import {useRef} from "preact/hooks";
⋮----
interface LoadingSpinnerProps {
    logoSrc?: string;
}
⋮----
const LoadingSpinner: FunctionComponent<LoadingSpinnerProps> = (
`````

## File: src/hooks/index.ts
`````typescript

`````

## File: src/hooks/useFireflies.ts
`````typescript
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { useSpacetimeDB } from '../spacetimedb/connection';
⋮----
export const useFireflies = (currentPath: string) =>
⋮----
const updateOtherFireflies = () =>
⋮----
const normalize = (p: string)
`````

## File: src/hooks/useGameStats.ts
`````typescript
import { useState, useCallback, useMemo, useEffect } from 'preact/hooks';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { generateSlug } from '@/src/utils/gameUtils';
⋮----
export const useGameStats = (gameSlugRaw: string) =>
`````

## File: src/pages/AddGamePage.tsx
`````typescript
import { useState } from 'preact/hooks';
import { ComponentChildren, ComponentProps } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { Game, GameStatus } from "@/src/types";
import CloseIcon from '../components/icons/CloseIcon.tsx';
import { AddGamePageProps } from "@/src/types";
import { PageTransition } from '@/src/components';
⋮----
interface FormCardProps {
    title: string;
    children: ComponentChildren;
}
⋮----
const FormCard = ({ title, children }: FormCardProps) => (
    <div className="card bg-base-200 shadow-xl border border-surface-700 mb-8">
        <div className="card-body">
            <h3 className="card-title text-primary border-l-4 border-primary pl-3 mb-2">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    </div>
);
⋮----
type FormInputProps = { label: string } & ComponentProps<'input'>;
⋮----
const FormInput = ({ label, ...props }: FormInputProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <input
            {...props}
            className="input input-bordered w-full focus:input-primary transition-colors duration-300"
        />
    </label>
);
⋮----
type FormTextareaProps = { label: string } & ComponentProps<'textarea'>;
⋮----
const FormTextarea = ({ label, ...props }: FormTextareaProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <textarea
            {...props}
            className="textarea textarea-bordered w-full focus:textarea-primary transition-colors duration-300 min-h-[100px]"
        ></textarea>
    </label>
);
⋮----
type FormSelectProps = { label: string } & ComponentProps<'select'>;
⋮----
const FormSelect = ({ label, children, ...props }: FormSelectProps) => (
    <label className="form-control w-full">
        <div className="label">
            <span className="label-text font-medium">{label}</span>
        </div>
        <select
            {...props}
            className="select select-bordered w-full focus:select-primary transition-colors duration-300"
        >
            {children}
        </select>
    </label>
);
⋮----
const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
⋮----
const handleArrayChange = (e: JSX.TargetedEvent<HTMLInputElement>) =>
⋮----
const handleAddLink = () =>
⋮----
const handleRemoveLink = (index: number) =>
⋮----
const handleAddStore = () =>
⋮----
const handleRemoveStore = (index: number) =>
⋮----
const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) =>
`````

## File: src/spacetimedb/config.ts
`````typescript

`````

## File: src/spacetimedb/SpacetimeDBProvider.tsx
`````typescript
import { createContext } from 'preact';
import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'preact/hooks';
import { DbConnection } from './module_bindings';
import { SPACETIMEDB_URI, MODULE_NAME, AUTH_TOKEN_KEY } from './config';
import { generateSlug } from '@/src/utils/gameUtils';
⋮----
export interface GameStats { gameSlug: string; totalHearts: number; totalVisits: number; }
export interface MyActivity { gameSlug: string; hasLiked: boolean; isFavorite: boolean; visitCount: number; lastVisitAt?: number; }
⋮----
interface SpacetimeDBContextType {
    connection: DbConnection | null;
    identity: string | null;
    isConnected: boolean;
    error: string | null;
    gameStatsMap: Record<string, GameStats>;
    myActivityMap: Record<string, MyActivity>;
}
⋮----
const getHex = (id: any): string | null =>
⋮----
const getP = (r: any, c: string, s: string) =>
⋮----
export const useSpacetimeDB = ()
`````

## File: src/components/Firefly.tsx
`````typescript
import { useLayoutEffect, useRef } from 'preact/hooks';
import gsap from 'gsap';
⋮----
interface FireflyProps {
  x: number;
  y: number;
  id: string;
}
⋮----
const Firefly = (
`````

## File: src/components/FireflyOverlay.tsx
`````typescript
import { useFireflyOverlay } from '../hooks/FireflyContext';
import Firefly from './Firefly';
`````

## File: src/components/hero/CompactStat.tsx
`````typescript
import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
⋮----
export interface CompactStatProps {
    value: string | number;
    label: string;
    icon: IconDefinition;
    accentColor: string;
}
⋮----
const CompactStat = ({ value, label, icon, accentColor }: CompactStatProps) => (
    <div className="flex flex-col items-center px-4 py-3 md:px-8 md:py-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex-1 min-w-[90px] md:min-w-[150px] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white/[0.08] hover:border-white/[0.15] group">
        <span className="text-2xl md:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">{value}</span>
        <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase text-base-content/70 md:text-sm text-center leading-tight">
            <FontAwesomeIcon icon={icon} className="transition-colors duration-300" style={{ color: accentColor }} />
            {label}
        </span>
    </div>
);
`````

## File: src/components/StatusBadge.tsx
`````typescript
import { GameStatus } from '@/src/types';
import { JSX } from 'preact/jsx-runtime';
⋮----
type Variant = 'solid' | 'soft' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';
⋮----
export interface StatusBadgeProps {
  status: GameStatus;
  className?: string;
  variant?: Variant;
  size?: Size;
  colorMap?: Partial<Record<GameStatus, string>>;
}
⋮----
function toSoftBg(bgClass: string)
⋮----
export default function StatusBadge({
  status,
  className = '',
  variant = 'solid',
  size = 'md',
  colorMap,
}: StatusBadgeProps): JSX.Element
`````

## File: src/hooks/useGamesData.ts
`````typescript
import { useState, useEffect } from 'preact/hooks';
import Papa from 'papaparse';
import { Game } from '@/src/types';
import {
    generateSlug,
    ensureUniqueSlug,
    parseStringToArray,
    mapStatus,
    mapOrigin,
    ensureHttps
} from '@/src/utils';
⋮----
export interface JamGame extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}
⋮----
export interface JamSettingRow {
    Organization: string;
    Venue: string;
    Venue_City: string;
    Venue_Logo_URL?: string;
    Venue_Logo?: string;
    Venue_Socials?: string;
    Order_Priority: string;
    UID: string;
}
⋮----
export const useGamesData = () =>
⋮----
const parseScreenshots = (value?: string): string[] =>
`````

## File: src/pages/index.ts
`````typescript

`````

## File: src/pages/NotFoundPage.tsx
`````typescript
import { useEffect, useState, useMemo } from 'preact/hooks';
import { RoutableProps, route } from 'preact-router';
import { PageTransition, BackButton, GameCard } from '@/src/components';
import { Game } from '@/src/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass, faDice, faGhost, faHouse } from '@fortawesome/free-solid-svg-icons';
⋮----
interface NotFoundPageProps extends RoutableProps {
    games?: Game[];
    onGameClick?: (game: Game) => void;
}
⋮----
const pickRandomGame = () =>
⋮----
const handleNavigateHome = () =>
`````

## File: src/types/interfaces/Game.ts
`````typescript
import { GameStatus, GameOrigin } from '../enums';
⋮----
export interface Game {

    id: number;


    slug: string;


    title: string;


    platform: string[];


    genre: string[];


    developers: string[];


    publishers: string[];


    releaseDate: string;


    lastUpdateDate?: string;


    status: GameStatus;


    stores: { name: string; url: string }[];


    links: { name: string; url: string }[];


    pressKitUrl?: string;


    pitch?: string;


    funding?: string;


    engine: string;


    languages: string[];


    imageUrl: string;
    imageHero: string;
    imageCover: string;


    trailerUrl?: string;


    description: string;


    isHighlighted?: boolean;


    highlightReason?: string;


    screenshots?: string[];


    origin?: GameOrigin;
}
`````

## File: src/types/interfaces/PageProps.ts
`````typescript
import { Game } from './Game';
⋮----
export interface CatalogPageProps {

    path?: string;
}
⋮----
export interface CalendarPageProps {

    path?: string;

    games: Game[];

    onNavigateToCatalog: () => void;

    onEventClick: (game: Game) => void;
}
⋮----
export interface ChartsPageProps {

    path?: string;

    games: Game[];

    onNavigateToCatalog: () => void;

    onGameClick: (game: Game) => void;
}
⋮----
export interface AboutPageProps {

    path?: string;

    onNavigateToCatalog: () => void;
}
⋮----
export interface GameDetailPageProps {

    path?: string;

    games: Game[];

    gameSlug?: string;
}
⋮----
export interface AddGamePageProps {

    path?: string;

    onAddNewGame: (newGameData: Omit<Game, 'id' | 'slug'>) => void;

    onNavigateToCatalog: () => void;
}
⋮----
export interface CatalogPageProps {
    path?: string;
    games: Game[];
    filteredGames: Game[];
    allGenres: string[];
    allPlatforms: string[];
    allStores: string[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeFilters: Record<string, string[]>;
    onFilterChange: (category: string, value: string) => void;
    onClearCategory: (category: string) => void;
    onClearAllFilters: () => void;
    onGameClick: (game: Game) => void;
    jamGames?: Game[];
    minYear: number;
    maxYear: number;
    yearRange: { min: number; max: number } | null;
    onYearRangeChange: (range: { min: number; max: number }) => void;
}
`````

## File: src/components/GameGrid.tsx
`````typescript
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { useMeasure } from '@/src/hooks/useMeasure';
import { Game } from '@/src/types';
import { GameCard } from '@/src/components';
import { gsap } from 'gsap';
import { trackGameCardClick } from '@/src/utils/analytics';
⋮----
interface GameGridProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}
⋮----
const MasonryItem = (
⋮----
onClick=
`````

## File: src/components/GameJamPlusSection.tsx
`````typescript
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Game, GameOrigin } from '@/src/types';
import { route } from 'preact-router';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
⋮----
interface GameJamPlusSectionProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}
⋮----
const shuffleArray = (array: Game[]) =>
⋮----
onClick=
`````

## File: src/components/HighlightCard.tsx
`````typescript
import { useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { StatusBadge } from "@/src/components/index.ts";
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
⋮----
interface HighlightCardProps {
    game: Game;
    onClick: (game: Game) => void;
    fullWidth?: boolean;
}
`````

## File: src/components/SearchBar.tsx
`````typescript
import { useState, useEffect, useRef, useMemo, useCallback } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { useDebounce } from '@/src/hooks';
import { CoverImage } from "@/src/components/index.ts";
⋮----
interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    games: Game[];
    onSelectGame?: (game: Game) => void;
    renderSuggestionSubtitle?: (game: Game) => any;
}
⋮----
const handleClickOutside = (event: MouseEvent) =>
⋮----
onClick=
⋮----
e.preventDefault();
selectSuggestion(game);
`````

## File: src/components/StoreButton.tsx
`````typescript
import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSteam,
    faItchIo,
    faPlaystation,
    faXbox,
    faGooglePlay,
    faApple,
    faMeta,
} from '@fortawesome/free-brands-svg-icons';
import { faGamepad, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LinkIcon } from './icons';
import { trackExternalStore } from '@/src/utils/analytics';
⋮----
interface StoreButtonProps {
    store: { name: string; url: string };
    gameSlug?: string;
    gameTitle?: string;
}
⋮----
const StoreButton = (
`````

## File: src/components/UserProfile.tsx
`````typescript
import { useState, useEffect, useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { useGamesData } from '@/src/hooks/useGamesData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faHistory, faClose, faExchangeAlt, faMagic, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
⋮----
const updateProfile = () =>
⋮----
const updateActivity = () =>
⋮----
const handleToggleHistory = () =>
⋮----
<button onClick=
⋮----
setShowHistory(false);
route(`/game/$
`````

## File: src/pages/GameJamGalleryPage.tsx
`````typescript
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { Game } from '@/src/types';
import { GameOrigin } from '@/src/types/enums';
import { RoutableProps, route } from 'preact-router';
import {LinkIcon, CoverImage, BackButton, PromoHeader} from '@/src/components';
import { trackEvent } from '@/src/utils/analytics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
⋮----
interface GameJamPlusGalleryProps extends RoutableProps {
    games: Game[];
    onGameClick: (game: Game) => void;
}
⋮----
onClick=
⋮----
trackEvent('game_jam_click', {
                    game_slug: game.slug,
                    game_title: game.title
                });
onGameClick(game);
⋮----
e.stopPropagation();
trackEvent('game_external_click', {
                                        game_slug: game.slug,
                                        game_title: game.title,
                                        link_name: link.name,
                                        url: link.url
                                    });
`````

## File: src/components/Footer.tsx
`````typescript
import { useRef, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { gsap } from 'gsap';
⋮----
const Footer = () =>
⋮----
const handleScroll = () =>
`````

## File: src/components/ScrollToTop.tsx
`````typescript
import { useEffect, useRef, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
⋮----
const handleScroll = () =>
⋮----
const scrollToTop = () =>
`````

## File: src/pages/AboutPage.tsx
`````typescript
import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { BackButton, ContributorCard, PageTransition } from "@/src/components";
import { AboutPageProps } from "@/src/types";
`````

## File: src/components/FilterPanel.tsx
`````typescript
import { useState, useEffect } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faChevronDown,
    faCalendarAlt,
    faCheck,
    faFilter,
    faTags,
    faDesktop,
    faStore
} from '@fortawesome/free-solid-svg-icons';
import { GameStatus } from "@/src/types";
⋮----
interface FilterPanelProps {
    genres: string[];
    platforms: string[];
    stores: string[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (category: string, value: string) => void;
    onClearCategory: (category: string) => void;
    onClearAll?: () => void;
    clearAllEnabled?: boolean;
    minYear: number;
    maxYear: number;
    yearRange: { min: number; max: number } | null;
    onYearRangeChange: (range: { min: number; max: number }) => void;
}
⋮----
onClick=
⋮----
const commitChanges = () =>
⋮----
const handleKeyDown = (e: KeyboardEvent) =>
⋮----
const handleClearAllClick = (e: MouseEvent) =>
`````

## File: src/components/GameList.tsx
`````typescript
import { useState, useEffect, useRef, useCallback, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { useGameStats } from '@/src/hooks';
import { useFireflyPresence } from '@/src/hooks/FireflyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg } from '@fortawesome/free-regular-svg-icons';
import { CoverImage, StatusBadge } from '@/src/components';
import { trackGameCardClick } from '@/src/utils/analytics';
import { getTrailerInfo } from '@/src/utils';
import { gsap } from 'gsap';
⋮----
interface GameListProps {
  games: Game[];
  onGameClick: (game: Game) => void;
}
⋮----
const GameList = (
⋮----
const GameRowItem = (
⋮----
const handleMouseEnter = ()
const handleMouseLeave = ()
⋮----
const handleToggleLike = (e: MouseEvent) =>
⋮----
onClick=
⋮----
src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
`````

## File: src/pages/ChartsPage.tsx
`````typescript
import { useEffect, useRef, useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { Game, GameStatus, GameOrigin } from "@/src/types";
import { BackButton, PageTransition } from "@/src/components";
import { ChartsPageProps } from "@/src/types";
import { Chart, registerables } from 'chart.js/auto';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad,
    faDesktop,
    faLayerGroup,
    faCodeBranch
} from '@fortawesome/free-solid-svg-icons';
⋮----
const countItems = (data: Game[], key: 'platform' | 'genre' | 'engine' | 'origin') =>
⋮----
const countStatuses = (data: Game[]) =>
⋮----
const countByYear = (data: Game[]) =>
⋮----
interface ChartCardProps {
    title: string;
    children: ComponentChildren;
}
⋮----
const ChartCard = ({ title, children }: ChartCardProps) => (
    <div className="bg-base-300/30 backdrop-blur-sm border border-surface-700 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
        <div className="px-6 py-4 border-b border-surface-700 bg-base-300/50">
            <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            {children}
        </div>
    </div>
);
⋮----
const RealtimeTopVisitsChart = (
`````

## File: src/components/index.ts
`````typescript

`````

## File: src/components/Modal.tsx
`````typescript
import { useEffect, useState } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { CloseIcon, LinkIcon } from '@/src/components/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart as faHeartSolid, faStar as faStarSolid, faEye } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg, faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import StoreButton from './StoreButton';
import ScreenshotLightbox from './ScreenshotLightbox';
import { trackEvent } from '@/src/utils/analytics';
import { useGameStats } from '@/src/hooks/useGameStats';
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
⋮----
interface ModalProps {
    game: Game;
    onClose: () => void;
}
⋮----
interface DetailItemProps {
    label: string;
    children: ComponentChildren;
}
⋮----
const DetailItem = ({ label, children }: DetailItemProps) => (
    <div className="flex flex-col">
        <dt className="text-xs font-bold text-base-content/70 uppercase tracking-wider">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-base-content">{children}</dd>
    </div>
);
⋮----
const getYoutubeEmbedUrl = (url?: string) =>
⋮----
// ignore invalid urls
⋮----
const handleToggleLike = () =>
⋮----
const handleToggleFavorite = () =>
⋮----
const openLightbox = (index: number) =>
⋮----
const handleEsc = (event: KeyboardEvent) =>
⋮----
const handleViewFullInfo = () =>
⋮----
onClick=
`````

## File: src/pages/GameJamPage.tsx
`````typescript
import { h } from 'preact';
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ExternalLinkIcon } from '@/src/components/icons';
⋮----
interface Talk {
    title: string;
    url: string;
    videoId: string;
}
⋮----
const openVideoModal = (talk: Talk) =>
⋮----
const closeVideoModal = () =>
⋮----
src={`https://img.youtube.com/vi/${talk.videoId}/maxresdefault.jpg`}
⋮----
src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
`````

## File: src/components/GameCard.tsx
`````typescript
import { useState, useRef, useMemo } from 'preact/hooks';
import { Game } from '@/src/types';
import { useMeasure, useTextLayout, useGameStats } from '@/src/hooks';
import { useFireflyPresence } from '@/src/hooks/FireflyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWindows,
    faLinux,
    faAndroid,
    faApple,
    faPlaystation,
    faXbox
} from '@fortawesome/free-brands-svg-icons';
import {
    faDesktop,
    faGamepad,
    faMobile,
    faGlobe,
    faHeart as faHeartSolid
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg } from '@fortawesome/free-regular-svg-icons';
import { CoverImage, StatusBadge } from '@/src/components';
import { getTrailerInfo } from '@/src/utils';
⋮----
interface GameCardProps {
    game: Game;
    onClick: () => void;
    layout?: 'grid' | 'masonry';
}
⋮----
const getPlatformIcon = (platform: string) =>
⋮----
const handleMouseEnter = ()
const handleMouseLeave = ()
⋮----
const handleReadMoreClick = (e: MouseEvent) =>
⋮----
const handleToggleLike = (e: MouseEvent) =>
⋮----
{/* Firefly presence indicator */}
`````

## File: src/pages/CalendarPage.tsx
`````typescript
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Game } from "@/src/types";
import { BackButton, CoverImage, PageTransition } from "@/src/components";
import { CalendarPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad,
    faCalendarDays,
    faUsers,
    faClock,
    faCalendarWeek,
    faChartLine,
    faTrophy,
    faRocket,
    faFire,
    faCalendarCheck,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
⋮----
const parseDate = (dateString: string): string | null =>
⋮----
const handleClickOutside = (event: MouseEvent) =>
⋮----
setViewYear(year);
setIsDropdownOpen(false);
if (calendarRef.current)
⋮----
eventMouseEnter=
`````

## File: src/pages/GameDetailPage.tsx
`````typescript
import { useEffect, useState, useMemo } from 'preact/hooks';
import { ComponentChildren } from 'preact';
import { route } from 'preact-router';
import { Game, GameDetailPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft, faGamepad, faGlobe, faCog, faTimes,
    faChevronLeft, faChevronRight, faShoppingCart,
    faHeart as faHeartSolid, faStar as faStarSolid, faEye
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartReg, faStar as faStarReg } from '@fortawesome/free-regular-svg-icons';
import { BackButton, LinkIcon, CoverImage, StoreButton, StatusBadge, PageTransition, ScreenshotLightbox } from "@/src/components";
import { useSpacetimeDB } from '@/src/spacetimedb/connection';
import { useGameStats, useMeasure, useTextLayout } from '@/src/hooks';
import { updateMetadata, getTrailerInfo } from "@/src/utils";
⋮----
interface DetailSectionProps {
    title: string;
    children: ComponentChildren;
    icon?: any;
}
⋮----
const DetailSection = ({ title, children, icon }: DetailSectionProps) => (
    <div className="bg-base-200/40 backdrop-blur-xl border border-surface-700 rounded-[2rem] p-8 shadow-2xl hover:border-accent-teal-dark/20 transition-all duration-500 group overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-teal-dark/5 blur-[80px] pointer-events-none group-hover:bg-accent-teal-dark/10 transition-all duration-700" />
        <h3 className="text-sm font-black text-white mb-8 flex items-center gap-4 uppercase tracking-[0.2em]">
            <div className="w-12 h-12 rounded-2xl bg-accent-teal-dark/10 flex items-center justify-center text-accent-teal group-hover:bg-accent-teal-dark group-hover:text-base-100 transition-all duration-500 shadow-inner">
                {icon && <FontAwesomeIcon icon={icon} className="text-lg" />}
            </div>
            {title}
        </h3>
        <div className="text-base-content/70">
            {children}
        </div>
    </div>
);
⋮----
const handleToggleLike = () =>
⋮----
const handleToggleFavorite = () =>
⋮----
// Lightbox state
⋮----
// Solución de runtime render - Placebo visual - No es solución final
⋮----
const handleGoBack = () =>
⋮----
const openLightbox = (index: number) =>
⋮----
src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
`````

## File: src/pages/CatalogPage.tsx
`````typescript
import { h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import {
    Highlights,
    GameCounter,
    SearchBar,
    FilterPanel,
    GameGrid,
    GameList,
    ViewModeToggle,
    AlphaFilter,
    GameJamPlusSection,
    HeroMosaic,
    PageTransition
} from '@/src/components';
import { ViewMode, GameOrigin } from '@/src/types';
import { CatalogPageProps } from "@/src/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import type { CategoryPreset } from '@/src/components/hero';
⋮----
const normalizeFirstChar = (title: string) =>
`````

## File: src/pages/GameJamsPage.tsx
`````typescript
import { h } from 'preact';
import { useMemo, useState, useEffect } from 'preact/hooks';
import { useMeasure } from '@/src/hooks/useMeasure';
import { useTextLayout } from '@/src/hooks/useTextLayout';
import { Game } from '@/src/types';
import { RoutableProps, route } from 'preact-router';
import { SearchBar, AlphaFilter, CoverImage, BackButton, PageTransition } from '@/src/components';
import { getTrailerInfo } from '@/src/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrophy, faMapMarkerAlt, faCalendarAlt, faUsers,
    faChevronDown, faChevronUp, faGamepad, faGlobe,
    faFire, faLocationDot, faLayerGroup, faArrowRight,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import {
    faDiscord, faInstagram, faTwitter, faYoutube,
    faTiktok, faFacebook, faTwitch, faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
⋮----
export interface VenueSocialLink {
    red: string;
    link: string;
}
⋮----
export interface JamSettingRow {
    Organization: string;
    Venue: string;
    Venue_City: string;
    Venue_Logo_URL?: string;
    Venue_Logo?: string;
    Venue_Socials?: string;
    Order_Priority: string;
    UID: string;
}
⋮----
interface JamGame extends Game {
    Jam_Org_UID?: string;
    Jam_Edition?: string;
}
⋮----
interface GameJamsPageProps extends RoutableProps {
    games: JamGame[];
    settings?: JamSettingRow[];
    onGameClick: (game: Game) => void;
}
⋮----
interface ProcessedEdition {
    id: string;
    year: string;
    orgName: string;
    venues: ProcessedVenue[];
}
⋮----
interface ProcessedVenue {
    id: string;
    uid: string;
    name: string;
    city: string;
    accentColor: string;
    accentColorSolid: string;
    logo?: string;
    logoTheme: 'day' | 'night';
    socials: VenueSocialLink[];
    games: JamGame[];
    orderPriority: number;
}
⋮----
const getSocialIcon = (redName: string): IconDefinition =>
⋮----
const getSocialHoverColor = (redName: string): string =>
⋮----
const parseSocials = (socialsString?: string): VenueSocialLink[] =>
⋮----
const processImageUrl = (rawUrl?: string):
⋮----
const getVenuePalette = (seed: string) =>
⋮----
onMouseLeave=
⋮----
src={`https://www.youtube.com/embed/${trailerInfo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&loop=1&playlist=${trailerInfo.id}&rel=0`}
⋮----
const toggleVenue = (venueId: string) =>
⋮----
const expandAll = ()
const collapseAll = ()
⋮----
onToggle=
⋮----
const normalizeFirstChar = (title: string) =>
⋮----
<BackButton onClick=
⋮----
{/* Page header */}
⋮----
{/* Hero Section: Title & Stats */}
⋮----
{/* Stats bar - Dashboard style */}
⋮----
renderSuggestionSubtitle=
`````

## File: src/components/HeroMosaic.tsx
`````typescript
import { h } from 'preact';
import { useMemo, useEffect, useRef, useState, useCallback } from 'preact/hooks';
import { route } from 'preact-router';
import { Game } from '@/src/types';
import { CoverImage } from '@/src/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGamepad, faUsers, faArrowDown,
    faChartBar, faCompass, faChevronLeft, faChevronRight,
    faArrowRight, faClock, faTrophy, faDatabase
} from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
⋮----
import { CategoryCard, TabButton, ProgressDots, CompactStat, CATEGORY_PRESETS } from './hero';
import type { CategoryPreset } from './hero';
⋮----
interface HeroMosaicProps {
    games: Game[];
    jamGames?: Game[];
    onGameClick: (game: Game) => void;
    onCategorySelect?: (categoryId: string, preset: CategoryPreset) => void;
}
⋮----
const startTimer = () =>
⋮----
const handleScroll = () =>
⋮----
const scrollDown = () =>
⋮----
onClick=
⋮----
onMouseLeave=
`````

## File: src/components/Header.tsx
`````typescript
import { useRef, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle, faCalendarAlt, faBars, faXmark, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { route } from 'preact-router';
import { trackNav } from '@/src/utils/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UserProfile from './UserProfile';
⋮----
interface HeaderProps {
    currentPath?: string;
}
⋮----
const navigateTo = (path: string) =>
⋮----
const handleScroll = () =>
⋮----
onClick=
⋮----
{/* Tooltip Bubble for Home page */}
⋮----
{/* Mobile Hamburger Trigger */}
⋮----
{/* Mobile Sidebar (Right Side) */}
⋮----
{/* Backdrop Overlay */}
⋮----
{/* Sidebar Panel */}
⋮----
{/* Sidebar Header */}
⋮----
{/* Sidebar Nav */}
`````

## File: README.md
`````markdown
# Venezuela Juega
Este repositorio sirve como una aplicación web que se despliega en [venezuelajuega.com](https://venezuelajuega.com) que organiza y presenta videojuegos desarrollados en Venezuela. La plataforma permite explorar, filtrar y descubrir juegos venezolanos de la manera más intuitiva, buscando ofrecer información detallada sobre cada título.

## 🎯 Características principales
- **Catálogo de juegos**: Visualización completa de videojuegos venezolanos
- **Filtros avanzados**: Búsqueda por género, plataforma y estado de desarrollo
- **Juegos destacados**: Sección especial para títulos destacados
- **Vista de calendario**: Visualización de lanzamientos por fechas
- **Estadísticas**: Gráficos y análisis del ecosistema de videojuegos
- **Detalles del juego**: Páginas individuales con información completa
- **Modo responsivo**: Optimizado para dispositivos móviles y escritorio

## 🛠️ Tecnologías utilizadas
### Librerías principales
- **Preact** 10.22.1
- **SpacetimeDB** 2.1.0
- **TypeScript** 5.8.2
- **Preact Router** 4.1.2
- **Vite** 6.2.0
- **GSAP** 3.13.0

### Librerías anexadas estáticas
- **Tailwind CSS** 4.0.0
- **Chart.js** 4.5.1
- **Bootstrap Icons** 1.13.1
- **FullCalendar** 6.1.15

### Librerías extras
- **Papa Parse** 5.5.3
- **Dotenv** 17.3.1
- **FontAwesome** 7.0.0
- **Vitest** 3.2.4
- **Happy DOM** 18.0.1
- **Pretext** 0.0.4

## 🚀 Funcionalidades del sitio web

### 1. Gestión de datos
- **Fuente de datos**: Google Sheets como CMS
- **Parser CSV**: Procesamiento automático de datos
- **Validación**: Mapeo y validación de estados de juegos
- **Generación de slugs**: URLs amigables para cada juego
- **Pre-renderizado de Metadatos**: Script de post-build para inyectar SEO (OpenGraph/Twitter) en cada juego.

### 2. Interfaz de usuario
- **Búsqueda en tiempo real**: Búsqueda con debounce
- **Filtros múltiples**: Por estado, género y plataforma
- **Previsualización de Videos**: Trailers incrustados en hover (YouTube y Steam)
- **Modal de detalles**: Vista enriquecida con Hero dinámico y layout 60/40

### 3. Estadísticas en tiempo real
- **Gráficos en tiempo real**: Gráficos que se actualizan en tiempo real
- **Contadores en tiempo real**: Contadores que se actualizan en tiempo real
- **Luciernagas**: Sistema de luciernagas que se actualizan en tiempo real con la posición de los usuarios en el sitio web

## 📋 TO-DO
- [x] Scraping de CSV de la lista de videojuegos
- [x] Parseo de datos de la lista de videojuegos
- [x] Gráficos
- [x] Buscador en tiempo real
- [x] Completación en la búsqueda
- [x] Filtros de búsqueda
- [x] Modal de detalles
- [x] Página de contacto
- [x] Calendario de lanzamientos
- [x] Página con slug de los juegos por separado
- [x] Ajustar la sección del header y footer para cuando se hace scroll se retraigan
- [x] Cambiar de modo grid a modo listado
- [x] Modo lista y búsqueda por #-A-Z para los juegos
- [x] Burger menu en versión móvil
- [x] Agregar capturas de pantalla a los juegos
- [x] Conexión a API de STEAM para obtener datos de los juegos
- [x] Solucionar los tamaños de los grid, mejorar el responsive
- [x] Solucionar persistencia del router cuando se cambia de página
- [x] Añadir botón para ir a tiendas y la página de steam (si la tiene)
- [x] Analíticas en tiempo real
- [x] Ajuste de metadatos a nivel servidor cuando navegas por paginas
- [x] Filtro de ordenar búsqueda por un rango de fecha de lanzamiento
- [x] Filtro para ordenar juegos por tiendas
- [x] Juego destacado mejor proporcionado
- [x] Añadida página de eventos especiales como la GJ+ 25/26
- [x] Mejora de estadisticas en la sección de calendario
- [x] Creación de páginas con resultados de juegos hechos en la GJ+ 25/26
- [x] Componente Hero para presentación de página
- [x] Mejora de disposición de los filtros
- [x] Migración a Tailwind CSS v4 local
- [x] Mejoras de accesibilidad, UI/UX y soporte para animaciones
- [x] Agregar trailers a los juegos interactivos desde YouTube o Steam
- [x] Ajustar metadatos pre-renderizados para cada juego y página
- [x] Agregado el paquete @chenglou/pretext para mejor manejo de textos
- [x] MANSORY GRID VIEW ahora si funciona gracias a pretext
- [x] Solucionar el problema de los tamaños de las imágenes en el grid
- [x] Solución de saneamiento y origen mixto que causa error SSL
- [x] Estadísticas rediseñadas
- [x] Optimización de renderizado de juegos mediante pre-renderizado estático en build time
- [x] Design tokens y tailwind mejorados
- [ ] Agregar DaisyUI y mejorar el Tailwind
- [ ] Agregar sistema de links extras
- [ ] Agregar sistema de redes sociales
- [ ] Conexión a API de IGDB o similar
- [ ] Terminar formulario para agregar nuevos juegos
- [ ] Optimizar el filtrado del CSV para mejorar el rendimiento
- [ ] Mejorar el responsive del calendario en móvil
- [ ] Mejorar la carga de juegos y secciones, en base a un cache o IndexDB

### Tiempo real
- [x] Integrar SpacetimeDB y inicio de futuras implementaciones
- [x] Sistema de me gusta, favoritos y visitas en tiempo real
- [x] Sistema de experiencia ganada por el usuario
- [x] Solucionado el problema de los contadores de me gusta y visitas
- [x] Luciernagas
- [x] Estadísticas en tiempo real

## 🤝 Colaboración
¡Toda ayuda es bienvenida! Para colaborar, por favor consulta nuestra [Guía de Contribución](./CONTRIBUTING.md) para conocer el flujo de trabajo, las reglas del proyecto y cómo configurar tu entorno.

También puedes reportar cualquier error o sugerencia abriendo un [Issue](https://github.com/aesthezel/venezuela-juega/issues).
`````

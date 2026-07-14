# Arquitectura del Proyecto — Feature-Based

## Motivación

El proyecto creció hasta un punto donde `src/components` se convirtió en un "dump" de 31+ archivos sin clasificación: UI genérica, componentes de layout, lógica específica de features y primitivos visuales convivían en el mismo nivel. 

La refactorización adopta una **arquitectura feature-based** que separa claramente lo global de lo específico.

---

## Principio Central

```
¿Quién usa este componente/hook?

  Más de una feature         → src/common/
  Solo una feature           → src/features/<feature>/
```

---

## Estructura de Carpetas

```
src/
├── common/                         ← Compartido globalmente
│   ├── components/
│   │   ├── ui/                     ← Primitivos reutilizables
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── BackButton.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── ScrollToTop.tsx
│   │   │   └── StoreButton.tsx
│   │   ├── icons/                  ← Íconos SVG inline
│   │   │   ├── ArrowLeftIcon.tsx
│   │   │   ├── ChartBarIcon.tsx
│   │   │   ├── CloseIcon.tsx
│   │   │   ├── ExternalLinkIcon.tsx
│   │   │   ├── IndicatorLeftIcon.tsx
│   │   │   ├── IndicatorRightIcon.tsx
│   │   │   ├── InfoIcon.tsx
│   │   │   ├── LinkIcon.tsx
│   │   │   ├── PlusIcon.tsx
│   │   │   └── index.ts
│   │   ├── layout/                 ← Shell visual de la aplicación
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── index.ts
│   │   ├── firefly/                ← Sistema de luciérnagas (presencia)
│   │   │   ├── Firefly.tsx
│   │   │   ├── FireflyOverlay.tsx
│   │   │   └── index.ts
│   │   └── index.ts                ← Re-exporta TODO (backward compat con @/components)
│   │
│   └── hooks/
│       ├── useDebounce.ts          ← Optimización de inputs reactivos
│       ├── useGamesData.ts         ← Carga principal del catálogo desde Sheets
│       ├── useDevelopers.ts        ← Lógica de perfiles de desarrollador
│       ├── useMetadata.ts          ← SEO + meta tags dinámicos
│       ├── useFireflies.ts         ← Sincronización de posición con SpacetimeDB
│       ├── FireflyContext.tsx      ← Proveedor global de presencia de usuarios
│       ├── useMeasure.ts           ← Medición de dimensiones de elementos DOM
│       ├── useTextLayout.ts        ← Ajuste dinámico de tipografía
│       └── index.ts                ← Re-exporta TODO (backward compat con @/hooks)
│
├── features/                       ← Features auto-contenidas
│   │
│   ├── jam/                        ← Game Jams venezolanas
│   │   ├── components/
│   │   │   ├── JamHero.tsx
│   │   │   ├── JamCountdown.tsx
│   │   │   ├── JamStatBar.tsx
│   │   │   ├── JamAbout.tsx
│   │   │   ├── JamPrizes.tsx
│   │   │   ├── JamSchedule.tsx
│   │   │   ├── JamFAQ.tsx
│   │   │   ├── JamCTA.tsx
│   │   │   ├── JamDonation.tsx
│   │   │   ├── PromoHeader.tsx     ← Banner promocional de JAMs
│   │   │   └── index.ts
│   │   ├── registry.ts             ← Registro de todas las JAMs conocidas
│   │   ├── types.ts                ← Tipos específicos de JAMs
│   │   └── index.ts
│   │
│   ├── catalog/                    ← Catálogo principal de juegos
│   │   ├── components/
│   │   │   ├── hero/               ← Mosaico hero de la homepage
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   ├── CompactStat.tsx
│   │   │   │   ├── ProgressDots.tsx
│   │   │   │   ├── TabButton.tsx
│   │   │   │   ├── categoryPresets.ts
│   │   │   │   └── index.ts
│   │   │   ├── GameCard.tsx        ← Tarjeta de juego (grid/lista)
│   │   │   ├── GameGrid.tsx        ← Contenedor grid masonry
│   │   │   ├── GameList.tsx        ← Vista de lista compacta
│   │   │   ├── GameCounter.tsx     ← Contador de juegos filtrados
│   │   │   ├── FilterPanel.tsx     ← Panel de filtros avanzados
│   │   │   ├── SearchBar.tsx       ← Buscador con debounce
│   │   │   ├── AlphaFilter.tsx     ← Filtro alfabético A-Z
│   │   │   ├── ViewModeToggle.tsx  ← Toggle Grid/Lista
│   │   │   ├── GameJamPlusSection.tsx  ← Sección JAM+ en el catálogo
│   │   │   ├── Highlights.tsx      ← Carrusel de juegos destacados
│   │   │   ├── HighlightCard.tsx   ← Tarjeta de juego destacado
│   │   │   ├── HeroMosaic.tsx      ← Mosaico principal de la homepage
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useCatalogFilters.ts  ← Estado global de filtros del catálogo
│   │   │   ├── useGameStats.ts       ← Likes y visitas en tiempo real
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── game-detail/                ← Vista de detalle de un juego
│   │   ├── components/
│   │   │   ├── CoverImage.tsx      ← Imagen de portada con fallback
│   │   │   ├── ScreenshotLightbox.tsx  ← Galería de capturas de pantalla
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── contributors/               ← Página de créditos/contribuidores
│       ├── components/
│       │   ├── ContributorCard.tsx ← Tarjeta de colaborador del proyecto
│       │   └── index.ts
│       └── index.ts
│
├── pages/                          ← Orquestadores de rutas (sin lógica propia)
│   ├── CatalogPage.tsx
│   ├── GameDetailPage.tsx
│   ├── AboutPage.tsx
│   ├── DeveloperPage.tsx
│   ├── GameJamGalleryPage.tsx
│   ├── GameJamsPage.tsx
│   ├── JamListPage.tsx
│   ├── JamDetailPage.tsx
│   ├── ChartsPage.tsx
│   ├── CalendarPage.tsx
│   ├── AddGamePage.tsx
│   ├── NotFoundPage.tsx
│   ├── Redirect.tsx
│   └── index.ts
│
├── types/                          ← Tipos compartidos globales
│   ├── interfaces/
│   │   ├── Game.ts
│   │   ├── Developer.ts
│   │   └── PageProps.ts
│   ├── enums.ts
│   └── types.ts
│
├── utils/                          ← Utilidades puras
│   ├── analytics.ts
│   ├── gameUtils.ts
│   └── stringUtils.ts
│
├── spacetimedb/                    ← Integración SpacetimeDB
│   ├── SpacetimeDBProvider.tsx
│   ├── config.ts
│   └── module_bindings/
│
└── styles/                         ← CSS global
    ├── global.css
    └── fullcalendar-theme.css
```

---

## Aliases de Importación

Configurados en `vite.config.ts` y `tsconfig.json`:

| Alias | Resuelve a | Propósito |
|---|---|---|
| `@` | `src/` | Alias raíz genérico |
| `@/common` | `src/common/` | Nueva arquitectura — compartidos |
| `@/features` | `src/features/` | Nueva arquitectura — features |
| `@/components` | `src/common/components/` | **Backward compat** (legado) |
| `@/hooks` | `src/common/hooks/` | **Backward compat** (legado) |

### Convención para código nuevo

```typescript
// ✅ NUEVO — usa los aliases específicos
import { Header, Footer } from '@/common/components/layout';
import { GameCard } from '@/features/catalog/components';
import { useCatalogFilters } from '@/features/catalog/hooks';
import { useGamesData } from '@/common/hooks';

// ⚠️ LEGADO — sigue funcionando pero no usar en código nuevo
import { Header, GameCard } from '@/components';
import { useGamesData, useCatalogFilters } from '@/hooks';
```

---

## Cuándo añadir en `common/` vs `features/`

### Añadir a `src/common/components/`

El componente o hook es utilizado por **dos o más features distintas**, o no tiene dependencia conceptual con ninguna feature en particular.

Ejemplos: `Modal`, `BackButton`, `LoadingSpinner`, `useDebounce`, `useMeasure`.

### Añadir a `src/features/<feature>/`

El componente o hook existe **solo para servir a una feature**. Si lo extraes de esa feature, no tendría sentido semántico en otro contexto.

Ejemplos: `GameCard` (solo catálogo), `JamHero` (solo jams), `ContributorCard` (solo créditos).

---

## Cómo añadir una nueva feature

1. **Crear la carpeta** `src/features/<nombre-feature>/`
2. **Estructura mínima**:
   ```
   features/<nombre>/
   ├── components/
   │   └── index.ts     ← barrel de componentes
   └── index.ts         ← barrel público de la feature
   ```
3. **Opcionalmente**, añadir `hooks/` si la feature tiene lógica propia
4. **Exportar desde `index.ts`** todo lo que otras partes del proyecto necesiten
5. **Si la feature necesita una ruta**, crear la page en `src/pages/<NombrePage>.tsx` y registrarla en `src/App.tsx`

### Ejemplo completo

```typescript
// src/features/leaderboard/components/LeaderboardTable.tsx
export default function LeaderboardTable({ ... }) { ... }

// src/features/leaderboard/components/index.ts
export { default as LeaderboardTable } from './LeaderboardTable';

// src/features/leaderboard/index.ts
export * from './components';

// src/pages/LeaderboardPage.tsx
import { LeaderboardTable } from '@/features/leaderboard';
```

---

## Backward Compatibility

Los aliases `@/components` y `@/hooks` siguen funcionando porque apuntan directamente a `src/common/components` y `src/common/hooks` respectivamente. Los barrels (`index.ts`) de `common/` re-exportan **todos** los componentes incluyendo los de features, asegurando que imports como `import { GameCard } from '@/components'` sigan resolviendo correctamente.

Los archivos `src/components/index.ts` y `src/hooks/index.ts` son **shims** que redirigen a sus nuevas ubicaciones — no deben ser modificados directamente.

---

## Reglas del Proyecto

- **No crear archivos directamente en `src/components/` o `src/hooks/`** — son carpetas legadas que solo contienen shims.
- **Un componente de feature NO debe importar de otra feature** — si lo necesita, ese componente debe subir a `common/`.
- **Las páginas son orquestadores** — no contienen lógica de negocio propia; la delegan a features y hooks.
- **Barrel files obligatorios** — cada feature y subdirectorio de `common/` debe tener su `index.ts`.

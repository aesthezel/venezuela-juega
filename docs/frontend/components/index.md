# Biblioteca de Componentes

Arquitectura modular centrada en reutilización. Los componentes están organizados en dos capas:
- **`src/common/components/`** — Compartidos globalmente
- **`src/features/<feature>/components/`** — Específicos de una feature

Para la convención de imports ver [architecture.md](../architecture.md).

---

## Componentes Globales (`src/common/components/`)

### `ui/` — Primitivos ([ui-atoms.md](ui-atoms.md))
Piezas transversales usadas en múltiples features.
- `Modal` — Detalle de juego con hero, stats y media
- `StatusBadge` — Etiqueta de estado de desarrollo (coloreada)
- `StoreButton` — Enlace a tienda con ícono de plataforma
- `BackButton` — Botón de retroceso de navegación
- `PageTransition` — Animaciones de entrada/salida de ruta (GSAP)
- `LoadingSpinner` — Indicador de carga inicial
- `LoadingOverlay` — Overlay de carga sobre contenido existente
- `ScrollToTop` — Botón flotante para volver al inicio

### `layout/` — Shell Visual ([layout.md](layout.md))
Marco visual persistente de la aplicación.
- `Header` — Barra de navegación superior (con búsqueda y rutas)
- `Footer` — Pie de página con enlaces y créditos
- `UserProfile` — Widget de usuario (SpacetimeDB)

### `firefly/` — Sistema de Presencia
Capa visual del sistema de luciérnagas. Ver [firefly-system.md](../firefly-system.md).
- `Firefly` — Orbe de luz que representa un usuario activo
- `FireflyOverlay` — Contenedor que renderiza todas las luciérnagas remotas

### `icons/` — Íconos SVG
Íconos inline como componentes Preact.
- `ArrowLeftIcon`, `ChartBarIcon`, `CloseIcon`, `ExternalLinkIcon`
- `IndicatorLeftIcon`, `IndicatorRightIcon`, `InfoIcon`, `LinkIcon`, `PlusIcon`

---

## Componentes por Feature (`src/features/`)

### `catalog/` — Catálogo de Juegos ([catalog.md](catalog.md))
- `GameCard` — Tarjeta de juego (grid y lista)
- `GameGrid` — Contenedor masonry con `useMeasure`
- `GameList` — Vista de lista compacta con likes en tiempo real
- `GameCounter` — Contador de juegos filtrados activos
- `FilterPanel` — Panel lateral de filtros avanzados (género, plataforma, año…)
- `SearchBar` — Buscador con debounce y sugerencias
- `AlphaFilter` — Filtro alfabético A-Z
- `ViewModeToggle` — Toggle entre vista Grid y Lista
- `GameJamPlusSection` — Sección de JAM+ integrada en el catálogo
- `Highlights` — Carrusel de juegos destacados
- `HighlightCard` — Tarjeta de juego destacado (con indicadores)
- `HeroMosaic` — Mosaico principal de la homepage. Ver [hero-mosaic.md](../hero-mosaic.md)
- `hero/CategoryCard`, `hero/CompactStat`, `hero/ProgressDots`, `hero/TabButton` — Subcomponentes del HeroMosaic

### `game-detail/` — Detalle de Juego
- `CoverImage` — Portada con fallback y lazy loading
- `ScreenshotLightbox` — Galería de capturas con navegación

### `contributors/` — Créditos
- `ContributorCard` — Tarjeta de colaborador del proyecto

### `jam/` — Game Jams
- `JamHero` — Hero principal de la página de una JAM
- `JamCountdown` — Temporizador de cuenta regresiva
- `JamStatBar` — Barra de estadísticas de participación
- `JamAbout`, `JamPrizes`, `JamSchedule`, `JamFAQ`, `JamCTA`, `JamDonation` — Secciones de detalle
- `PromoHeader` — Banner promocional de JAMs en otras páginas

---

## Diseño
- **Responsive**: Layouts adaptables de 320px a ultra-wide
- **Interacciones**: GSAP para transiciones y micro-animaciones
- **Accesibilidad**: Etiquetas semánticas y contrastes WCAG
- **Tailwind CSS + DaisyUI**: Clases utilitarias y componentes temáticos

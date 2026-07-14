# Hooks Personalizados

Los hooks están divididos en dos capas:
- **`src/common/hooks/`** — Lógica global reutilizable en cualquier feature
- **`src/features/<feature>/hooks/`** — Lógica específica de una feature

Para la convención de imports ver [architecture.md](../architecture.md).

---

## Hooks Globales (`src/common/hooks/`)

### Obtención de Datos ([data-fetching.md](data-fetching.md))
- **`useGamesData`** — Motor principal. Descarga y parsea el CSV desde Google Sheets. Separa juegos del catálogo general de los juegos de Game Jam. Debe instanciarse **solo en `App.tsx`** para evitar requests duplicados.
- **`useMetadata`** — Gestiona los meta tags dinámicos (OpenGraph, Twitter Cards) en función de la ruta actual. Se apoya en `useGamesData` para inyectar datos de un juego específico.
- **`useDevelopers`** — Construye perfiles de desarrollador agrupando juegos por autor.

### Presencia en Tiempo Real ([presence.md](presence.md))
- **`useFireflies`** — Conecta con SpacetimeDB para sincronizar la posición del cursor local y recibir las posiciones de otros usuarios. Actualiza cada 2 segundos con throttle para minimizar tráfico.
- **`FireflyContext`** — Proveedor global (`FireflyProvider`) y hooks de consumo (`useFireflyOverlay`, `useFireflyPresence`) que exponen el estado de presencia a cualquier componente del árbol.

### Utilidades UI ([ui-utilities.md](ui-utilities.md))
- **`useDebounce`** — Retrasa la propagación de un valor reactivo. Usado en `SearchBar` para evitar re-renders en cada keystroke.
- **`useMeasure`** — Observa las dimensiones de un elemento DOM con `ResizeObserver`. Clave para los layouts masonry (`GameGrid`) y la tipografía dinámica.
- **`useTextLayout`** — Calcula el número de líneas de un texto dentro de un contenedor medido con `useMeasure`. Permite truncamiento preciso sin CSS puro.

---

## Hooks de Features (`src/features/`)

### `features/catalog/hooks/`
- **`useCatalogFilters`** — Centraliza todo el estado de filtrado del catálogo: búsqueda, filtros activos, rango de años. Retorna los juegos filtrados y los handlers para cada tipo de filtro. Se instancia en `App.tsx` y se pasa como props a `CatalogPage`.
- **`useGameStats`** — Gestiona los likes (❤️) y visitas de un juego en tiempo real mediante SpacetimeDB. Incluye estado de `hasLiked`, `toggleLike`, y contadores. Usado en `GameCard`, `GameList` y `Modal`.

---

## Prácticas

- **Tipado fuerte**: Todos los hooks tienen tipos explícitos en sus parámetros y retorno.
- **Caché en árbol alto**: `useGamesData` y `useCatalogFilters` deben vivir en `App.tsx` — sus datos se pasan como props hacia abajo para evitar requests y cálculos duplicados.
- **Separación de responsabilidades**: Los hooks de features no deben ser importados por `common/` ni por otras features — si se necesita en más de un lugar, debe subir a `common/hooks/`.

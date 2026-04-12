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

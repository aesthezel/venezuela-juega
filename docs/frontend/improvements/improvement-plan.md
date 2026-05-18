# Plan de Mejoras — Venezuela Juega

> Documento generado tras auditoría completa del frontend (Mayo 2026).
> Las mejoras están organizadas por prioridad: **P0 (crítico)** a **P6 (infraestructura)**.

---

## P0 — Bugs en Producción (Corrección Inmediata)

### 1. `CC` suelto causa error de runtime
- **Archivo:** `src/pages/NotFoundPage.tsx:17`
- **Problema:** La función `pickRandomGame` contiene `CC` como statement suelto. Causa `ReferenceError` si se invoca.
- **Solución:** Eliminar la línea `CC`. Si la función no se usa en ningún lado, eliminar todo el bloque muerto (incluye botón comentado en líneas 68-74).

### 2. Sitemap con URLs incorrectas
- **Archivo:** `public/sitemap.xml`
- **Problema:** Todas las URLs usan prefijo `/venezuela-juega/`, legacy de GitHub Pages. El `vite.config.ts` tiene `base: '/'` y el canonical en `index.html` es `https://venezuelajuega.com/` (sin subdirectorio).
- **Solución:** Regenerar sitemap con rutas absolutas `https://venezuelajuega.com/...` sin el prefijo `/venezuela-juega/`.

### 3. Doble instancia de `useGamesData`
- **Archivos:** `src/components/UserProfile.tsx:10` + `src/App.tsx:31`
- **Problema:** `UserProfile` y `App` llaman `useGamesData()` independientemente, resultando en 4 descargas de CSV (2 del sheet principal + 2 de game jams) en paralelo al cargar la app.
- **Solución:** Hoistear `useGamesData` a un `GamesDataContext` compartido o pasar `games` como prop desde `App` a `UserProfile`.

### 4. Formulario de agregar juegos no funciona
- **Archivos:** `src/App.tsx:155`, `src/pages/AddGamePage.tsx:136`
- **Problema:** `onAddNewGame={() => {}}` es un no-op. El formulario completo de `AddGamePage` no persiste datos.
- **Solución:** Implementar la lógica de envío (POST a Google Sheets API, o endpoint de SpacetimeDB, o al menos guardar en localStorage como MVP).

---

## P1 — Arquitectónicos (Refactor Urgente)

### 5. App.tsx es un God Object
- **Archivo:** `src/App.tsx` (179 líneas)
- **Problema:** ~40 `useState`, 10+ handlers inline, toda la lógica de filtrado, estado del modal, ruteo, metadata, y props del catálogo en un solo componente. Cualquier cambio de filtro re-renderiza el árbol completo.
- **Solución:**
  1. Extraer `useCatalogFilters` como custom hook con `useReducer`.
  2. Crear `CatalogContext` para exponer `filteredGames`, `allGenres`, `allPlatforms`, etc.
  3. Mover `catalogPageProps` a un `useMemo` estable.
  4. Componentizar el modal de detalle como ruta independiente (`/game/:slug`) en vez de estado local.

### 6. Sin caché de datos
- **Archivo:** `src/hooks/useGamesData.ts` (294 líneas)
- **Problema:** Cada carga de página descarga y parsea CSVs de ~500KB desde Google Sheets en el main thread. Sin `sessionStorage`, `localStorage`, ni `IndexedDB`. Si Google Sheets está lento, el sitio entero muestra spinner.
- **Solución:**
  1. Implementar caché en `sessionStorage` con timestamp + stale-while-revalidate.
  2. Usar `IndexedDB` (via `idb` o similar) para persistencia cross-session.
  3. Opcional: mover el parseo de Papa Parse a un Web Worker para no bloquear el main thread.

### 7. Sin code splitting
- **Archivos:** `src/App.tsx:5-9` (imports eager), `package.json`
- **Problema:** Chart.js (~240KB), FullCalendar (~260KB), GSAP (~60KB), FontAwesome (4 paquetes) se cargan eager al iniciar la app, incluso si nunca se visita `/charts`, `/calendar`, o `/events`.
- **Solución:**
  ```tsx
  const ChartsPage = lazy(() => import('./pages/ChartsPage'));
  const CalendarPage = lazy(() => import('./pages/CalendarPage'));
  const EventsPage = lazy(() => import('./pages/EventsPage'));
  ```
  Envolver rutas con `<Suspense fallback={<LoadingSpinner />}>`.

### 8. Parseo de CSV frágil (headers hardcodeados)
- **Archivo:** `src/hooks/useGamesData.ts:65-73, 81, 96-103`
- **Problema:** Los headers están hardcodeados en un array `CORRECT_HEADERS` y se machean por índice con `row[i]`. Si Google Sheets cambia el orden de columnas, los datos se corrompen silenciosamente.
- **Solución:** Usar `Papa.parse(csv, { header: true })` para que la primera fila sea usada como keys. Mapear columnas por nombre, no por índice. Agregar validación de columnas requeridas.

### 9. Doble sistema de metadata SEO
- **Archivos:** `src/hooks/useMetadata.ts:34-77` + `src/pages/GameDetailPage.tsx:112-144`
- **Problema:** Ambos manipulan `<meta>` tags simultáneamente al cambiar de ruta. `useMetadata` se llama desde `App`, y `GameDetailPage` también modifica meta tags por su cuenta. Causa race condition.
- **Solución:** Delegar TODA la metadata a `useMetadata` usando el path como fuente de verdad. `GameDetailPage` no debe tocar meta tags; debe exponer datos del juego para que `useMetadata` los consuma.

### 10. Contextos de SpacetimeDB fragmentados
- **Archivos:** `src/spacetimedb/SpacetimeDBProvider.tsx`, `src/hooks/FireflyContext.tsx`
- **Problema:** `SpacetimeDBProvider` y `FireflyContext` se suscriben independientemente a la misma conexión y tabla `firefly`, duplicando iteraciones y suscripciones.
- **Solución:** Hacer que `FireflyContext` consuma datos de `SpacetimeDBContext` en vez de conectarse por separado. Un solo provider maneje la conexión WebSocket y exponga tanto `gameStats` como `fireflies`.

---

## P2 — TypeScript y Tipado

### 11. `@ts-ignore` en variables de entorno
- **Archivo:** `src/hooks/useGamesData.ts:59-62`, `vite-env.d.ts`
- **Problema:** `import.meta.env.VITE_SPREADSHEET_ID` requiere `@ts-ignore` porque falta la declaración de tipos.
- **Solución:** Agregar a `vite-env.d.ts`:
  ```typescript
  interface ImportMetaEnv {
    readonly VITE_SPREADSHEET_ID: string
    readonly VITE_SHEET_NAME: string
    readonly VITE_GAMEJAMSHEET_ID: string
    readonly VITE_GAMEJAMSSETTINGS_NAME: string
    readonly VITE_GAMEJAMSSHEET_NAME: string
    readonly VITE_SPACETIMEDB_URI: string
  }
  ```

### 12. Abuso de `any`
- **Archivos:** `src/App.tsx:79`, `src/hooks/FireflyContext.tsx:108`, `src/spacetimedb/SpacetimeDBProvider.tsx:41,109`, `src/hooks/useFireflies.ts:6`
- **Problema:** SpacetimeDB provider, fireflies, y handlers usan `any` sin restricción.
- **Solución:** Usar los tipos generados de `src/spacetimedb/module_bindings/index.ts`. Declarar interfaces para `Firefly`, `GameStats`, `UserActivity`.

### 13. Alias `@` apunta a root, no a `src/`
- **Archivos:** `vite.config.ts:14`, `tsconfig.json:20-22`
- **Problema:** `@` resuelve a `./` (root del proyecto), forzando imports redundantes como `@/src/types`.
- **Solución:** Cambiar alias a `'@': resolve(__dirname, 'src')` y actualizar todos los imports de `@/src/...` a `@/...`.

### 14. `CatalogPageProps` duplicado
- **Archivo:** `src/types/interfaces/PageProps.ts:3-6, 55-74`
- **Problema:** La interfaz está definida dos veces: una stub (línea 3) y la real (línea 55).
- **Solución:** Eliminar la definición stub (líneas 3-6).

### 15. Filtro por `origin` sin UI
- **Archivos:** `src/App.tsx:56-57,110`, `src/components/CatalogPage.tsx`, `src/components/FilterPanel.tsx`
- **Problema:** La lógica de filtrado soporta `origin`, se computa `allOrigins`, pero `FilterPanel` no expone el filtro al usuario. Código muerto.
- **Solución:** Agregar sección "Origen" al `FilterPanel` o eliminar el filtro no usado del `App.tsx`.

---

## P3 — Rendimiento y Optimización

### 16. GSAP en scroll handlers sin throttling
- **Archivos:** `src/components/Header.tsx:30-63`, `src/components/Footer.tsx:9-68`
- **Problema:** Ambos componentes ejecutan `gsap.to()` en cada evento `scroll` (~60 veces/segundo cada uno durante scroll).
- **Solución:** Reemplazar con `gsap.timeline()` + `ScrollTrigger` para que GSAP maneje el batching vía `requestAnimationFrame`.

### 17. `Chart.register(...registerables)` en scope global
- **Archivo:** `src/pages/ChartsPage.tsx:16`
- **Problema:** Registra TODOS los componentes de Chart.js al importar el módulo, incluso si nunca se visita `/charts`.
- **Solución:** Mover el registro a un `useEffect` dentro del componente, combinado con dynamic import (ver #7).

### 18. HeroMosaic carga 28 imágenes full-resolution
- **Archivo:** `src/components/HeroMosaic.tsx:136`
- **Problema:** 28 portadas full-res simultáneas, especialmente pesado en móvil.
- **Solución:**
  1. Limitar a 12 imágenes en viewports móviles.
  2. Agregar `loading="lazy"` en las imágenes del mosaic.
  3. Agregar `width`/`height` explícitos para evitar CLS.

### 19. Imágenes sin `width`/`height` ni `srcset`
- **Archivo:** `src/components/CoverImage.tsx:20-27`
- **Problema:** Todas las portadas se cargan a resolución completa sin dimensiones explícitas, causando layout shift (CLS).
- **Solución:**
  1. Agregar `width` y `height` en `<img>` para reservar espacio.
  2. Si las imágenes están en un CDN, usar parámetros de transformación (ej. `?width=400`).
  3. Considerar `srcset` con breakpoints responsivos.

### 20. `bootstrap-icons` posiblemente no usado
- **Archivo:** `package.json:25`
- **Problema:** Listado como dependencia pero no se encontró uso en el source. Agrega ~100KB al bundle.
- **Solución:** Verificar imports de `bootstrap-icons` en todo el proyecto. Si no se usa, eliminar del `package.json`.

---

## P4 — Features Pendientes (README TODO)

### 21. Sistema de links extras
- **Estado:** No implementado.
- **Descripción:** Agregar soporte para links adicionales por juego (ej. Discord, itch.io, página oficial).
- **Implementación sugerida:** Agregar columna `extra_links` en Google Sheets con formato `label|url,label|url`. Parsear en `useGamesData` y renderizar en `GameDetailPage`.

### 22. Sistema de redes sociales
- **Estado:** No implementado.
- **Descripción:** Links a redes sociales del proyecto/desarrolladores.
- **Implementación sugerida:** Agregar columna `social_links` en Google Sheets o un sheet separado de configuración.

### 23. Conexión a API de IGDB o similar
- **Estado:** No implementado.
- **Descripción:** Enriquecer datos de juegos con metadata externa (ratings, screenshots, descripciones).
- **Implementación sugerida:** Usar IGDB API v4 con OAuth2 client credentials. Implementar como servicio aparte con caché agresiva para no exceder rate limits.

### 24. Mejorar responsive del calendario en móvil
- **Archivo:** `src/pages/CalendarPage.tsx`
- **Descripción:** FullCalendar en móvil es difícil de usar. La vista de mes no escala bien.
- **Implementación sugerida:** Forzar vista `listWeek` o `listMonth` en viewports < 768px. O usar `dayGrid` con `dayMaxEvents: 2`.

### 25. Caché con IndexedDB
- **Estado:** No implementado.
- **Descripción:** Persistir datos de juegos entre sesiones para carga instantánea.
- **Implementación sugerida:** Usar `idb` (lightweight IndexedDB wrapper). Almacenar `{ data, timestamp, etag }`. En cada carga, hacer HEAD request al CSV para verificar `Last-Modified`.

---

## P5 — Accesibilidad y SEO

### 26. GameCards no navegables por teclado
- **Archivo:** `src/components/GameCard.tsx`
- **Problema:** Cards clickeables no tienen `role="button"`, `tabIndex={0}`, ni `onKeyDown` (Enter/Space).
- **Solución:** Agregar atributos de accesibilidad. Envolver en `<button>` o `<a>` semántico en vez de `<div onClick>`.

### 27. Modal sin focus trap
- **Archivo:** `src/components/Modal.tsx`
- **Problema:** Al abrir el modal, el foco no se mueve dentro. Tabbing puede escapar a elementos detrás del overlay.
- **Solución:**
  1. Mover foco al modal al abrir (`useEffect` + `ref.focus()`).
  2. Implementar focus trap: al hacer Tab en el último elemento focusable, volver al primero.
  3. Cerrar con Escape.

### 28. Filtros no accesibles por teclado
- **Archivo:** `src/components/FilterPanel.tsx:83-96`
- **Problema:** Checkboxes de filtro usan `<div onClick={...}>` sin focus ni rol.
- **Solución:** Reemplazar con `<label><input type="checkbox" /> Texto</label>` nativo. Estilizar con CSS el checkbox nativo o usar uno custom accesible.

### 29. Falta `ld+json` structured data para juegos
- **Archivo:** `src/pages/GameDetailPage.tsx`
- **Problema:** Sin markup `VideoGame` o `SoftwareApplication` schema.org, los buscadores no indexan correctamente los juegos.
- **Solución:** Inyectar `<script type="application/ld+json">` con datos del juego (nombre, descripción, imagen, fecha de lanzamiento, plataformas, género).

### 30. Bajo contraste en texto con opacidad
- **Archivos:** `GameCard.tsx:251`, `CatalogPage.tsx:242`, y uso general de `text-base-content/70`
- **Problema:** `--color-base-content: #eae7ec` sobre `--color-base-200: #18131e` pasa AA, pero `opacity-70` reduce el contraste efectivo por debajo del umbral AA.
- **Solución:** Usar un color más claro en vez de opacidad (ej. `text-base-content/80` → usar un color fijo `#c5c0c9`). Revisar con herramienta de contraste.

---

## P6 — Infraestructura y DevOps

### 31. Sin tests
- **Archivos:** `test/` (directorio vacío o inexistente), `package.json` (vitest, testing-library, happy-dom instalados pero sin uso)
- **Problema:** Cero tests para un sitio en producción. Sin cobertura de hooks, filtros, componentes.
- **Solución:**
  1. Crear `vitest.config.ts` con `environment: 'happy-dom'`.
  2. Tests mínimos: `useGamesData` (parseo de CSV mock), `App` (filtrado de juegos), `GameCard` (renderizado), `SearchBar` (debounce).
  3. Agregar script `"test": "vitest run"` y `"test:watch": "vitest"`.

### 32. SpacetimeDB sin reconexión automática
- **Archivo:** `src/spacetimedb/SpacetimeDBProvider.tsx:105-113`
- **Problema:** Si la conexión WebSocket cae, no hay lógica de reconexión ni estado de error. El sitio sigue funcionando sin features real-time, silenciosamente.
- **Solución:**
  1. Agregar estado `connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'`.
  2. Implementar exponential backoff para reconexión (1s, 2s, 4s, 8s, máx 30s).
  3. Mostrar indicador visual cuando las features real-time no están disponibles.

### 33. `app.css` artefacto legacy en root
- **Archivo:** `app.css` (1500+ líneas)
- **Problema:** CSS compilado de Tailwind/DaisyUI en la raíz del proyecto. No es importado por `index.html` ni usado. Probablemente generado por un script `build:css` legacy.
- **Solución:** Verificar si `vite.config.ts` con `@tailwindcss/vite` lo usa. Si no, eliminar y agregar a `.gitignore`.

### 34. `.env` commiteado a git
- **Archivo:** `.env`
- **Problema:** Contiene `VITE_SPREADSHEET_ID` y `VITE_SHEET_NAME` en el repositorio.
- **Solución:**
  1. Crear `.env.example` con las claves sin valores (o valores placeholder).
  2. Ejecutar `git rm --cached .env` y agregar `.env` al `.gitignore`.
  3. Rotar el Spreadsheet ID si es sensible.

---

## Resumen por Prioridad

| Prioridad | Items | Impacto |
|-----------|-------|---------|
| **P0** | 4 | Bugs en producción — fix inmediato |
| **P1** | 6 | Refactors arquitectónicos de alto impacto |
| **P2** | 5 | TypeScript, tipado, calidad de código |
| **P3** | 5 | Rendimiento, bundle size, UX |
| **P4** | 5 | Features pendientes del roadmap |
| **P5** | 5 | Accesibilidad (WCAG) y SEO |
| **P6** | 4 | Infraestructura, DevOps, testing |

---

## Orden Sugerido de Implementación

1. **Semana 1:** P0 (bugs críticos) + P6.34 (.env en git) + P6.31 (setup de tests)
2. **Semana 2:** P1.3 (doble useGamesData) + P1.8 (parseo CSV frágil) + P1.6 (caché)
3. **Semana 3:** P1.5 (refactor App.tsx) + P1.7 (code splitting)
4. **Semana 4:** P1.9 y P1.10 (metadata + contextos SpacetimeDB)
5. **Semana 5:** P2 (TypeScript) + P3 (rendimiento)
6. **Semanas 6-8:** P4 (features pendientes) + P5 (accesibilidad/SEO)

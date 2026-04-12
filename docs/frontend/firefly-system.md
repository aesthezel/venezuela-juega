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

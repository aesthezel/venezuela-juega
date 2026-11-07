# Debug: bloqueo al cargar la sesión de SpacetimeDB

Modo de traza para reproducir el cuelgue de 1–3 s que ocurre mientras el cliente
establece la conexión con SpacetimeDB y recibe el snapshot inicial.

## Cómo ejecutarlo

### Desde WebStorm

Se añadieron tres configuraciones en `.idea/runConfigurations/`:

| Configuración | Qué hace |
|---|---|
| `dev:debug (Vite + SDB trace)` | Ejecuta `npm run dev:debug` con `VITE_SDB_DEBUG=true`. |
| `Debug: Chrome + SDB trace` | Arranca Vite y abre una sesión de depuración en `http://localhost:5199/?sdbdebug=1`. |
| `build:debug (sourcemaps + SDB trace)` | Build de producción con sourcemaps y traza activada. |

> `build:debug` deja la traza activada en el bundle. Úsalo solo para perfilar
> un build desplegado en un entorno de pruebas, no para el sitio público normal.

La opción recomendada es **Debug: Chrome + SDB trace**: pone breakpoints en
`SpacetimeDBProvider.tsx`, `sdbTrace.ts` y en el SDK si hace falta.

### Desde terminal

```bash
npm run dev:debug
# abrir http://localhost:5199/?sdbdebug=1
```

También se puede activar sin el modo debug:

```text
?sdbdebug=1   activa y lo recuerda en localStorage
?sdbdebug=0   desactiva
```

## Qué instrumenta

- `idle:requested` / `idle:fire`: cuánto tarda el `requestIdleCallback` (timeout 2 s)
  antes de iniciar la conexión.
- `conn:builder-start` → `conn:connected`: handshake y resolución del token.
- `ws:create` / `ws:open` / `ws:close`: ciclo de vida del WebSocket.
- `longtask` marcado con `afterWsMessageMs` / `wsMessageBytes`: tarea que bloqueó
  el hilo principal poco después de un mensaje del servidor. Aquí ocurren la
  descompresión, el decode y la aplicación del snapshot.
- `subscription:requested` → `subscription:applied`: espera total del snapshot.
- `subscription:snapshot`: filas que quedaron en la caché del cliente por tabla.
- `sync:stats` / `sync:activity`: tiempo y filas escaneadas al construir los mapas
  de React/Preact.
- `catalog:*`: cache hit, carga del snapshot JSON y parseo CSV de Google Sheets
  (para detectar si la revalidación en segundo plano compite con SpacetimeDB).
- `longtask`: tareas de más de 50 ms (por defecto) con su duración. Las tareas
  de más de 5 s se marcan como `suspectedPause` (debugger, pestaña congelada,
  suspensión del sistema), no como trabajo de JS.
- `page:pause`, `page:visibility`, `page:freeze`, `page:resume`: confirman si el
  event loop dejó de correr por una pausa externa.
- `loop:lag`: deriva del event loop (detecta bloqueos aunque no haya Long Tasks).
- `resource:slow`: recursos que tardan más de 300 ms.
- `nav:*` / `paint`: TTFB, DOMContentLoaded, load y paint.
- Los WebSockets se etiquetan por `kind`: `spacetimedb`, `vite-hmr` u `other`.
  Las reconexiones de Vite HMR no se mezclan con las métricas de SpacetimeDB.
- `ws:message` solo se registra para payloads ≥ 4 KB; los heartbeats de ~167 B
  van a contadores, no a la timeline.

Cada span medido también se registra con `performance.measure`, así que aparece
en **DevTools → Performance → Timings**.

## Flujo de trabajo

1. Ejecutar `Debug: Chrome + SDB trace`.
2. **Desactiva breakpoints y “Pause on exceptions”** para esta prueba: el
   debugger detiene la página y el trace lo verá como un `longtask` de decenas
   de segundos (`suspectedPause`).
3. Recargar la página con caché desactivada (DevTools → Network → Disable cache).
4. Esperar a que termine el cuelgue.
5. Revisar el panel flotante **SDB TRACE** (abajo a la derecha).
6. Pulsar **Download JSON**.
7. Analizar el archivo:

```bash
npm run trace:analyze -- ./sdb-trace-2026-11-07T....json
```

El analizador imprime timeline, long tasks, spans lentos, filas por tabla y una
sección de diagnóstico. Si el archivo contiene varios JSON concatenados (por
ejemplo, dos `dump()` seguidos), usa el último objeto y avisa por consola.

## API de consola

```js
__SDB_TRACE__.report()    // objeto completo
__SDB_TRACE__.dump()      // JSON string
__SDB_TRACE__.download()  // descarga el JSON
__SDB_TRACE__.copy()      // copia el JSON al portapapeles
__SDB_TRACE__.clear()     // limpia la traza
```

## Cómo aislar la causa

Divide la espera en cuatro tramos y compara con la traza:

| Tramo | Qué mide |
|---|---|
| `idle:requested` → `idle:fire` | Defer del `requestIdleCallback` (máx. 2 s). |
| `conn:builder-start` → `ws:create` | Verificación HTTP del token (`/v1/identity/websocket-token`). |
| `ws:create` → `ws:open` → `conn:connected` | Handshake WebSocket/TLS y mensaje `InitialConnection`. |
| `subscription:requested` → `subscription:applied` | Descarga + decode + apply del snapshot. |

Si en alguno de esos tramos no hay `longtask`, la página **espera red**, no está
bloqueada. Si hay `longtask` con `afterWsMessageMs` pequeño, el bloqueo es el
procesamiento síncrono del snapshot en el SDK.

Si el `longtask` dura más de 5 s, **no lo atribuyas al snapshot**: revisa
`suspectedPause`, `pauseReason`, `page:pause` y `page:visibility`. Una tarea de
50 s con `visibility=visible` y `hasFocus=true` suele ser el debugger pausado o
el sistema suspendido, no un bucle de JavaScript.

## Cómo interpretar el resultado

- Si el pico de `longtask` tiene `afterWsMessageMs` cercano a 0 y dura menos de
  5 s, el coste está en el SDK aplicando el snapshot (decode + `applyOperations`
  + callbacks), no en React.
- Si el `longtask` dura decenas de segundos y `sync:stats`/`sync:activity`
  terminaron en milisegundos, es una pausa externa: debugger, pestaña congelada
  o suspensión del equipo. Tras reanudar suelen llegar varios `ws:message`
  acumulados de golpe.
- Si `subscription:snapshot` muestra `my_activity` o `profile` con miles de
  filas, revisa que la suscripción filtrada siga activa (ver abajo).
- Si `sync:activity` es grande, se está recorriendo toda la tabla y convirtiendo
  cada `playerId` a hex; con la suscripción filtrada debería escanear 0–1 filas.
- Si ves `ws:error`/`ws:close` con `kind=vite-hmr`, es el servidor de Vite, no
  SpacetimeDB. Reinicia `npm run dev:debug` si el servidor se detuvo.
- Si el pico coincide con `resource:slow` o `nav:*`, el problema es de red o de
  carga inicial, no de SpacetimeDB.

## Puntos de código relevantes

| Archivo | Rol |
|---|---|
| `src/spacetimedb/debug/sdbTrace.ts` | Traza, Long Tasks, WebSocket, reporte JSON. |
| `src/spacetimedb/debug/SdbDebugOverlay.tsx` | Panel flotante en desarrollo. |
| `src/spacetimedb/SpacetimeDBProvider.tsx` | Puntos de instrumentación de conexión/suscripción. |
| `src/index.tsx` | Instala la traza antes de cargar el resto de la app. |
| `scripts/analyze-sdb-trace.mjs` | Resumen del JSON exportado. |

## Suscripción actual (implementada)

`SpacetimeDBProvider` ya no usa `subscribeToAllTables()`. Ahora suscribe solo lo
que el cliente consume:

```ts
.subscribe([
  tables.game_stats,
  tables.my_activity.where((row) => row.playerId.eq(identity)),
  tables.profile.where((row) => row.id.eq(identity)),
  tables.firefly,
]);
```

- `game_stats`: todas las filas (catálogo).
- `my_activity`: solo las del jugador actual.
- `profile`: solo la fila del jugador actual (`id` es primary key, filtro indexado).
- `firefly`: presencia de visitantes (tabla pequeña).

Resultado medido en la última prueba: `builder→applied` bajó de ~540 ms a
~333 ms, el snapshot de `profile` pasó de 3.286 filas a 0/1, y el tráfico
SpacetimeDB del arranque bajó de ~120 KB a ~7,6 KB.

`my_activity.player_id` no tiene índice en el esquema generado. La consulta
filtrada funcionó contra el servidor actual, pero conviene añadir ese índice en
el módulo del servidor para que el filtrado sea eficiente también del lado del
servidor.

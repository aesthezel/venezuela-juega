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

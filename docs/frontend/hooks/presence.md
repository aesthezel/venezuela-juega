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

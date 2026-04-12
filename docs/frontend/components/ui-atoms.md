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

# Layout y Estructura

Jerarquía visual + navegación.

## `HeroMosaic`

Impacto visual mosaico dinámico portadas.

### Funcionalidades
- **Parallax**: Fondo reacciona scroll.
- **Panel Stats**: Rotación automática categorías + métricas.
- **Always Dark**: Estética cinematográfica permanente.

*(Detalle en [HeroMosaic](../hero-mosaic.md))*

---

## `PageTransition`

Estandariza entrada páginas.

### Funcionamiento
Usa **GSAP**. Efecto *fade-in* + `translateY` al montar componente. Evita saltos bruscos.

### Ejemplo Uso
```tsx
<PageTransition>
  <MyContent />
</PageTransition>
```

---

## `Modal`

Detalle videojuego.

### Funcionalidades
- **Cierre**: Tecla `Esc`, click fuera, botón.
- **Scroll Lock**: Bloquea fondo.
- **Media**: Trailers YouTube/Vimeo + screenshots.

---

## Mejoras
- **Sticky Header**: Ocultar al bajar, mostrar al subir (móvil).
- **Skeleton Loaders**: Mejorar percepción velocidad (LCP).

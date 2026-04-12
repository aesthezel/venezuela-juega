# Doc Componentes

Arquitectura modular centrada en reutilización + Tailwind CSS.

## Estructura

### 1. Sistema Catálogo ([catalog.md](catalog.md))
Visualización, búsqueda + filtrado.
- `GameGrid` / `GameList`: Contenedores colecciones.
- `GameCard`: Unidad básica videojuego.
- `FilterPanel`: Filtrado avanzado (género, motor, estado, año).
- `SearchBar`: Buscador con sugerencias + debounce.

### 2. Layout ([layout.md](layout.md))
Marco visual app.
- `Header` / `Footer`: Navegación + enlaces.
- `HeroMosaic`: Impacto visual home.
- `PageTransition`: Animaciones entrada GSAP.
- `Modal`: Detalle juegos + media.

### 3. Átomos ([ui-atoms.md](ui-atoms.md))
Piezas UI transversales.
- `StatusBadge`: Etiquetas estado desarrollo color.
- `StoreButton`: Enlaces tiendas + iconos plataforma.
- `LoadingOverlay`: Feedback carga global.

---

## Diseño
- **Responsive**: Ajuste 320px -> Ultra-wide.
- **Interacciones**: GSAP + transiciones CSS.
- **Accesibilidad**: Etiquetas semánticas + contraste.

# Sistema Catálogo

Exploración eficiente base datos juegos venezolanos.

## `FilterPanel`

Gestiona múltiples dimensiones filtrado.

### Funcionalidades
- **Acordeones**: Categorías (Estado, Género, Tiendas, Plataformas, Año).
- **Rango Años**: Selector dual lanzamientos.
- **Badges**: Conteo filtros activos en sección colapsada.
- **Responsive**: Panel lateral/modal en móvil.

### Ejemplo Uso
```tsx
<FilterPanel 
  genres={availableGenres}
  activeFilters={filters}
  onFilterChange={handleFilterChange}
  onClearAll={resetFilters}
/>
```

---

## `GameCard`

Unidad individual videojuego.

### Funcionalidades
- **Hover**: Escala + sombras sutiles.
- **Tiendas**: Iconos dinámicos (Steam, Itch, Play Store).
- **View Transitions**: IDs únicos para transiciones imágenes fluidas.

### Ejemplo Uso
```tsx
<GameCard 
  game={gameData}
  viewMode="grid"
/>
```

---

## `AlphaFilter`

Selector alfabético. Salto rápido por letra. Optimiza navegación.

---

## Mejoras
- **Input Chips**: Selección etiquetas más visual.
- **Virtualización**: `react-window` para >1000 juegos.

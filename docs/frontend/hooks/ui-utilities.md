# Hooks Utilidad UI

Herramientas transversales: fluidez + rendimiento.

## `useDebounce`

Retrasa actualización valor hasta tiempo determinado sin cambios.

### Uso
Optimización `SearchBar`. Filtra catálogo 300ms después dejar escribir.

```tsx
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  const filtered = games.filter(g => g.title.includes(debouncedSearch));
}, [debouncedSearch]);
```

---

## `useTextLayout` / `useMeasure`

Aseguran diseño no rompa con títulos largos.

### `useMeasure`
Obtiene dimensiones físicas (`width`, `height`). Uso: posicionamiento dinámico popups.

### `useTextLayout`
Detecta desbordamiento texto. Permite autosizing/truncado.

---

## Mejoras
- **`useIntersectionObserver`**: Lazy load portadas. Mejora rendimiento móvil.

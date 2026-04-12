# Hooks Gestión Datos

"Cerebro" app: transforma tablas Google Sheets en objetos `Game`.

## `useGamesData`

Usa **Papa Parse** descarga + procesa CSV (Juegos Públicos + Game Jams).

### Funcionamiento
1. Lee variables entorno (URLs CSV).
2. Descarga datos asíncrono.
3. Mapea columnas a interfaz `Game`.
4. Genera **slugs únicos** amigables (`/game/slug`).
5. Limpia URLs (HTTPS) + parsea screenshots/tiendas.

### Ejemplo Uso
```tsx
const { games, jamGames, loading, error } = useGamesData();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;

return <GameGrid games={games} />;
```

### Reuso
- Vistas catálogo completo/filtrado.
- Centralizado en `App.tsx` para proveer datos a rutas.

---

## `useMetadata`

Extrae info semántica para SEO + métricas impacto.
- **Conteo Industria**: Juegos, estudios, géneros dinámicos.
- **Gestión SEO**: Actualiza `<title>` + `<meta description>` según página/juego.

### Ejemplo Uso
```tsx
const stats = useMetadata(games);
// stats.totalGames -> count
```

---

## `useGameStats`

Prepara datos para gráficas (Chart.js/CSS).
- Agrupa juegos por año lanzamiento.
- Filtra proyectos incompletos.

---

## Mejoras
- **Caché IndexDB**: Persistencia local carga instantánea.
- **Validación Zod**: Esquemas para detectar errores CSV antes UI.

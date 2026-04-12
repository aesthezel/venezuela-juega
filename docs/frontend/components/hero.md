# Componentes Hero Internos

Sub-componentes especializados ubicados en `src/components/hero/` para el `HeroMosaic`.

## `CategoryCard`
Tarjetas interactivas diseño GOG.
- **Visual**: Efecto inset, sombras color dinámicas, blur en hover.
- **Datos**: Usa `categoryPresets.ts` para filtros + colores.

## `CompactStat`
Módulos métricas minimalistas.
- **Animación**: Entrada sutil sin parpadeo. Reutiliza estados `useMetadata`.

## `ProgressDots`
Indicador navegación + temporizador.
- **Visual**: Barra progreso indica tiempo hasta siguiente rotación automática.

## `categoryPresets.ts`
Centro configuración. Define:
- `dataSource`: (games/jams).
- `filterFn`: Lógica selección juegos.
- `accentFrom/To`: Colores branding.

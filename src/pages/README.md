# Directorio de páginas

Este directorio contiene todos los componentes de página utilizados en la aplicación Venezuela Juega.

## Estructura

-   `CatalogPage.tsx` - Carga todas tarjetas de juego desde la API
-   `AboutPage.tsx` - La página "Acerca de"
-   `AddGamePage.tsx` - La página tipo formulario para agregar juegos
-   `CalendarPage.tsx` - La página del calendario que usa FullCalendar
-   `ChartsPage.tsx` - Página de gráficos y datos relacionados con la lista de juegos
-   `GameDetailPage.tsx` - Página de detalles del juego

## Uso
Importa los componentes de página desde el punto de exportación central:
```typescript
import { CalendarPage, ChartsPage, AboutPage } from '@/src/pages';
````

Este enfoque proporciona varios beneficios:
1.  Definiciones centralizadas de los componentes de página
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de los componentes de página relacionados
4.  Mantenibilidad mejorada

## Añadir nuevas páginas
Al añadir nuevos componentes de página:
1.  Crea un nuevo archivo con el nombre de la página (p. ej., `ContactPage.tsx`)
2.  Añade comentarios JSDoc para documentar el propósito del componente, sus props y ejemplos de uso
3.  Exporta el componente de página desde el archivo
4.  Añade la exportación al archivo `index.ts`

## Mejores prácticas
- Mantén los componentes de página enfocados en la maquetación y composición
- Usa componentes más pequeños del directorio de componentes para los elementos de la interfaz de usuario
- Usa interfaces de TypeScript para las props
- Incluye comentarios JSDoc completos con ejemplos
- Usa componentes funcionales con hooks
- Sigue el patrón existente de usar clases de Tailwind CSS para los estilos
- Exporta los componentes de página como exportaciones por defecto desde sus archivos
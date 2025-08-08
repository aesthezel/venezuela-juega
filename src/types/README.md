# Directorio de tipos
Este directorio contiene todas las definiciones de tipos, interfaces y enumeraciones (enums) de TypeScript utilizadas en la aplicación Venezuela Juega.

## Estructura
- `enums.ts` - Contiene definiciones de enumeraciones como `GameStatus`
- `types.ts` - Contiene definiciones de tipos como `Page`
- `interfaces/` - Directorio que contiene las definiciones de interfaces
    - `Game.ts` - Interfaz para los objetos de juego
    - `PageProps.ts` - Interfaces para las props de los componentes de página
    - `index.ts` - Reexporta todas las interfaces
- `index.ts` - Reexporta todos los tipos, interfaces y enumeraciones

## Uso
Importa los tipos, interfaces y enumeraciones desde el punto de exportación central:

```typescript
import { Game, GameStatus, Page, CatalogPageProps } from '../types';
```

Este enfoque proporciona varios beneficios:
1.  Definiciones de tipos centralizadas
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de los tipos relacionados
4.  Mantenibilidad mejorada

## Añadir nuevos tipos
Al añadir nuevos tipos:
1.  Colócalos en el archivo apropiado según su categoría
2.  Añade comentarios JSDoc para documentar su propósito y uso
3.  Expórtalos desde el archivo `index.ts` correspondiente
4.  Si creas una nueva categoría, añade un nuevo archivo y actualiza el `index.ts` principal
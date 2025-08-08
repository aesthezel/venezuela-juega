# Directorio de Utilidades

Este directorio contiene funciones de utilidad utilizadas en toda la aplicación Venezuela Juega.

## Estructura

- `stringUtils.ts` - Utilidades de manipulación de cadenas (strings) como `parseStringToArray`
- `gameUtils.ts` - Utilidades relacionadas con juegos como `mapStatus`, `generateSlug` y `ensureUniqueSlug`
- `index.ts` - Reexporta todas las funciones de utilidad

## Uso

Importa las funciones de utilidad desde el punto de exportación central:

```typescript
import { parseStringToArray, generateSlug, mapStatus } from '../utils';
```

Este enfoque proporciona varios beneficios:

1.  Funciones de utilidad centralizadas
2.  Importaciones más sencillas (no es necesario recordar rutas de archivo específicas)
3.  Mejor organización de las funciones relacionadas
4.  Reutilización mejorada entre componentes

## Añadir Nuevas Utilidades

Al añadir nuevas funciones de utilidad:

1.  Determina la categoría apropiada para la función
2.  Añade la función a un archivo existente si encaja en la categoría, o crea un nuevo archivo si es necesario
3.  Añade comentarios JSDoc para documentar el propósito de la función, sus parámetros, el valor de retorno y ejemplos de uso
4.  Exporta la función desde el archivo
5.  Añade la exportación al archivo `index.ts` si estás usando un archivo nuevo

## Mejores Prácticas

- Mantén las funciones de utilidad puras (sin efectos secundarios)
- Haz que las funciones se centren en una única responsabilidad
- Incluye comentarios JSDoc completos con ejemplos
- Usa TypeScript para la seguridad de tipos (*type safety*)
- Considera añadir pruebas unitarias para las funciones complejas
- Agrupa las funciones relacionadas en el mismo archivo
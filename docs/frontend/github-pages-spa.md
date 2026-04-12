# Enrutamiento SPA en GitHub Pages

GitHub Pages no soporta nativamente el enrutamiento de Aplicaciones de Página Única (SPA). Cuando un usuario accede directamente a una ruta que no sea la raíz (ej. `/games/mi-juego`), el servidor de GitHub intenta encontrar un archivo físico en esa ubicación. Al no encontrarlo, devuelve un error 404.

Para solucionar esto, implementamos un workaround técnico que permite deep-linking y actualizaciones de página sin perder el estado del enrutador.

## Arquitectura del Workaround

El sistema se basa en la interceptación del error 404 y la redirección controlada utilizando tres archivos clave:

### 1. `public/404.html` (El Interceptor)
Este archivo es la pieza fundamental. GitHub Pages sirve automáticamente `404.html` para cualquier ruta no encontrada.

*   **Función**: Captura la `location.pathname` y `location.search` originales.
*   **Redirección**: Redirige al navegador a la raíz de la aplicación pasando la ruta original en un parámetro de consulta (ej. `/?p=/games/mi-juego`).
*   **Detección de Base**: Incluye lógica para detectar si el sitio corre en un dominio personalizado (`venezuelajuega.com`) o en el dominio de GitHub (`*.github.io`). Esto asegura que la ruta base (`/` vs `/venezuela-juega/`) se calcule correctamente para evitar bucles de redirección.

### 2. `index.html` (El Restaurador Temprano)
Ubicado en el `<head>`, este script se ejecuta antes de que se descarguen los archivos JS pesados.

*   **Función**: Revisa si existe el parámetro `p` en la URL.
*   **Limpieza**: Si existe, utiliza `window.history.replaceState` para cambiar la URL del navegador de vuelta a la ruta original capturada, eliminando el parámetro `p` de la vista del usuario.
*   **Beneficio**: Esto ocurre tan rápido que el usuario rara vez nota el cambio de URL, y el router de Preact encuentra la ruta correcta ya establecida en el historial al inicializarse.

### 3. `index.tsx` (La Garantía de Consistencia)
El punto de entrada de la aplicación React/Preact.

*   **Función**: Refuerza la lógica de restauración y maneja casos de borde como la preservación de múltiples parámetros de consulta o hashes (`#`).
*   **Integración**: Asegura que el estado inicial de la aplicación coincida exactamente con lo que el usuario esperaba visitar, permitiendo que `preact-router` renderice el componente adecuado (como `GameDetailPage` o `NotFoundPage`).

## Ventajas de esta Implementación

1.  **Soporte de Deep Links**: Los usuarios pueden compartir enlaces directos a juegos específicos y funcionarán correctamente.
2.  **SEO y UX**: Aunque GitHub devuelve un código 404 inicialmente, el usuario termina viendo el contenido correcto en menos de un segundo.
3.  **Manejo de Errores**: Si el usuario introduce una ruta que realmente no existe en nuestra aplicación, el router restaurará la URL y luego mostrará nuestro componente `NotFoundPage.tsx` personalizado, en lugar de una página de error genérica del servidor.
4.  **Portabilidad**: Funciona tanto en entornos de desarrollo local como en producción (GitHub Pages) sin cambios manuales.

## Notas Técnicas
Este workaround está basado en el patrón de [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) pero optimizado para el sistema de construcción de Vite y soporte de dominios personalizados.

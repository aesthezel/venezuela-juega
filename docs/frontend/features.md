# Características y Funcionalidades

Venezuela Juega ofrece una experiencia rica en funcionalidades orientadas al descubrimiento de videojuegos.

## 0. Hero Interactivo (Showcase)
- **Mosaico Dinámico**: Fondo con arte de juegos venezolanos que utiliza efectos de parallax mediante GSAP.
- **Métricas en Tiempo Real**: Visualización de estadísticas clave (total de juegos, estudios, desarrolladores).
- **Categorías Inteligentes**: Acceso directo a colecciones filtradas (PC, Móvil, Consolas, Demos) con rotación automática.
- [Ver documentación detallada](hero-mosaic.md).

## 1. Catálogo Interactivo
- **Vistas Duales**: Permite alternar entre una vista de **Grid** (inspirada en Steam) y una vista de **Lista** para facilitar la lectura rápida.
- **Masonry Grid**: Utiliza `@chenglou/pretext` para manejar un diseño de rejilla fluida que se adapta al contenido de las portadas sin dejar espacios vacíos innecesarios.
- **Buscador en tiempo real**: Filtra instantáneamente por título o desarrollador mientras el usuario escribe.

## 2. Filtros Avanzados
Los usuarios pueden refinar su búsqueda utilizando múltiples criterios:
- **Estado del proyecto**: Filtrar por juegos publicados, en desarrollo, acceso anticipado, cancelados, etc.
- **Plataformas**: Búsqueda por PC, Web, Mobile, Consolas, entre otras.
- **Géneros**: Navegación por etiquetas (RPG, Acción, Plataformas, etc.).
- **Tiendas**: Filtrar según dónde se pueden adquirir o jugar (Steam, Itch.io, Play Store).

## 3. Detalles del Juego (Modal y Slug)
- **Modal de Detalle**: Al seleccionar un juego, se abre una vista enriquecida con:
    - **Hero dinámico**: Una imagen de fondo impactante basada en el arte del juego.
    - **Layout 60/40**: Información organizada jerárquicamente.
    - **Videos Interactivos**: Trailers de YouTube o videos directos de Steam que se reproducen automáticamente o al hacer hover.
- **URLs Amigables (Slugs)**: Cada juego tiene su propia página estática accesible mediante un ID de texto legible (`/game/nombe-del-juego`).

## 4. Calendario de Lanzamientos
Integración con **FullCalendar** para visualizar:
- Fecha de lanzamientos pasados y futuros.
- Eventos importantes de la industria.
- Permite a los desarrolladores y fans planificar su agenda de juegos.

## 5. Estadísticas y Charts
Sección dedicada (integrada con **Chart.js**) que muestra:
- Distribución de juegos por género.
- Plataformas más populares para el desarrollo nacional.
- Evolución de lanzamientos por año.

## 6. Galería de Game Jams
Espacio exclusivo para eventos como la **GameJam+ 25/26**, donde se muestran:
- Rankings de organizaciones locales.
- Juegos clasificados como proyectos de Game Jam.

## 7. Optimización y Accesibilidad
- **Responsive Design**: Totalmente optimizado para su uso en dispositivos móviles mediante un menú hamburguesa y layouts adaptables.
- **SEO Ready**: Inyección de metadatos (OpenGraph/Twitter Cards) para que al compartir un link en redes sociales, se vea la portada del juego y su descripción.
- **Micro-animaciones**: Uso de **GSAP** para transiciones suaves y efectos de scroll en el Header y Footer.

## 8. Sistema de Presencia (Luciérnagas)
- **Gamificación**: Representación visual de otros visitantes activos como orbes de luz (luciérnagas) que vuelan por la página.
- **Tiempo Real**: Sincronización instantánea mediante **SpacetimeDB** con actualizaciones de posición cada 2 segundos.
- **Efectos Orgánicos**: Movimiento suave (lerp) y "revoloteo" aleatorio mediante GSAP para simular vida en los cursores de otros usuarios.
- **No Obstructivo**: Capa visual de solo lectura que no interfiere con la interacción del usuario.

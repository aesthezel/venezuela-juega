# Venezuela Juega
Este repositorio sirve como una aplicación web que se despliega en [venezuelajuega.com](https://venezuelajuega.com) que organiza y presenta videojuegos desarrollados en Venezuela. La plataforma permite explorar, filtrar y descubrir juegos venezolanos de la manera más intuitiva, buscando ofrecer información detallada sobre cada título.

## 🎯 Características principales
- **Catálogo de juegos**: Visualización completa de videojuegos venezolanos
- **Filtros avanzados**: Búsqueda por género, plataforma y estado de desarrollo
- **Juegos destacados**: Sección especial para títulos destacados
- **Vista de calendario**: Visualización de lanzamientos por fechas
- **Estadísticas**: Gráficos y análisis del ecosistema de videojuegos
- **Detalles del juego**: Páginas individuales con información completa
- **Modo responsivo**: Optimizado para dispositivos móviles y escritorio

## 🛠️ Tecnologías utilizadas
### Librerías principales
- **Preact** 10.22.1
- **SpacetimeDB** 2.1.0
- **TypeScript** 5.8.2
- **Preact Router** 4.1.2
- **Vite** 6.2.0
- **GSAP** 3.13.0

### Librerías anexadas estáticas
- **Tailwind CSS** 4.0.0
- **Chart.js** 4.5.1
- **Bootstrap Icons** 1.13.1
- **FullCalendar** 6.1.15

### Librerías extras
- **Papa Parse** 5.5.3
- **Dotenv** 17.3.1
- **FontAwesome** 7.0.0
- **Vitest** 3.2.4
- **Happy DOM** 18.0.1
- **Pretext** 0.0.4

## 🚀 Funcionalidades del sitio web

### 1. Gestión de datos
- **Fuente de datos**: Google Sheets como CMS
- **Parser CSV**: Procesamiento automático de datos
- **Validación**: Mapeo y validación de estados de juegos
- **Generación de slugs**: URLs amigables para cada juego
- **Pre-renderizado de Metadatos**: Script de post-build para inyectar SEO (OpenGraph/Twitter) en cada juego.

### 2. Interfaz de usuario
- **Búsqueda en tiempo real**: Búsqueda con debounce
- **Filtros múltiples**: Por estado, género y plataforma
- **Previsualización de Videos**: Trailers incrustados en hover (YouTube y Steam)
- **Modal de detalles**: Vista enriquecida con Hero dinámico y layout 60/40

## 📋 TO-DO
- [x] Scraping de CSV de la lista de videojuegos
- [x] Parseo de datos de la lista de videojuegos
- [x] Gráficos
- [x] Buscador en tiempo real
- [x] Completación en la búsqueda
- [x] Filtros de búsqueda
- [x] Modal de detalles
- [x] Página de contacto
- [x] Calendario de lanzamientos
- [x] Página con slug de los juegos por separado
- [x] Ajustar la sección del header y footer para cuando se hace scroll se retraigan
- [x] Cambiar de modo grid a modo listado
- [x] Modo lista y búsqueda por #-A-Z para los juegos
- [x] Burger menu en versión móvil
- [x] Agregar capturas de pantalla a los juegos
- [x] Conexión a API de STEAM para obtener datos de los juegos
- [x] Solucionar los tamaños de los grid, mejorar el responsive
- [x] Solucionar persistencia del router cuando se cambia de página
- [x] Añadir botón para ir a tiendas y la página de steam (si la tiene)
- [x] Analíticas en tiempo real
- [x] Ajuste de metadatos a nivel servidor cuando navegas por paginas
- [x] Filtro de ordenar búsqueda por un rango de fecha de lanzamiento
- [x] Filtro para ordenar juegos por tiendas
- [x] Juego destacado mejor proporcionado
- [x] Añadida página de eventos especiales como la GJ+ 25/26
- [x] Mejora de estadisticas en la sección de calendario
- [x] Creación de páginas con resultados de juegos hechos en la GJ+ 25/26
- [x] Componente Hero para presentación de página
- [x] Mejora de disposición de los filtros
- [x] Migración a Tailwind CSS v4 local
- [x] Mejoras de accesibilidad, UI/UX y soporte para animaciones
- [x] Agregar trailers a los juegos interactivos desde YouTube o Steam
- [x] Ajustar metadatos pre-renderizados para cada juego y página
- [x] Agregado el paquete @chenglou/pretext para mejor manejo de textos
- [x] MANSORY GRID VIEW ahora si funciona gracias a pretext
- [x] Solucionar el problema de los tamaños de las imágenes en el grid
- [ ] Agregar sistema de links extras
- [ ] Agregar sistema de redes sociales
- [ ] Conexión a API de IGDB o similar
- [ ] Terminar formulario para agregar nuevos juegos
- [ ] Optimizar el filtrado del CSV para mejorar el rendimiento
- [ ] Mejorar el responsive del calendario en

### Tiempo real
- [x] Integrar SpacetimeDB y inicio de futuras implementaciones
- [x] Sistema de me gusta, favoritos y visitas en tiempo real
- [x] Sistema de experiencia ganada por el usuario
- [x] Luciernagas

## 🤝 Colaboración
Proyecto libre para colaboraciones, puedes hacer un fork y posteriormente solicitar Pull Request con los cambios, se tomará una revisión de dichos cambios y un chequeo respectivo antes de ser aceptados y mezclados.
También se puede efectuar cualquier issue que se detecte.

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
- **TypeScript** 5.8.2
- **Preact Router** 4.1.2
- **Vite** 6.2.0
- **GSAP** 3.13.0

### Librerías anexadas estáticas
- **Tailwind CSS**
- **Chart.js**
- **Bootstrap Icons** 1.11.3
- **FullCalendar** 6.1.18

### Librerías extras
- **Papa Parse** 5.5.3
- **FontAwesome** 7.0.0
- **Vitest** 3.2.4
- **Happy DOM** 18.0.1

## 🚀 Funcionalidades del sitio web

### 1. Gestión de datos
- **Fuente de datos**: Google Sheets como CMS
- **Parser CSV**: Procesamiento automático de datos
- **Validación**: Mapeo y validación de estados de juegos
- **Generación de slugs**: URLs amigables para cada juego

### 2. Interfaz de usuario
- **Búsqueda en tiempo real**: Búsqueda con debounce
- **Filtros múltiples**: Por estado, género y plataforma
- **Modal de detalles**: Vista

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
- [ ] Solucionar persistencia del router cuando se cambia de página 
- [ ] Conexión a API de tiendas para obtener precios de los juegos
- [ ] Conexión a API de IGDB o similar
- [ ] Terminar formulario para agregar nuevos juegos
- [ ] Agregar capturas de pantalla a los juegos
- [ ] Agregar trailers a los juegos
- [ ] Añadir un preview animado de los screenshots cuando haces clic en una GameCard
- [ ] Optimizar el filtrado del CSV para mejorar el rendimiento
- [ ] Mejorar el responsive del calendario en mobile
- [ ] Solucionar los tamaños de los grid, mejorar el responsive
- [ ] Mansory grid view (Intentar nuevamente a ver si se logra)

## 🤝 Colaboración
Proyecto libre para colaboraciones, puedes hacer un fork y posteriormente solicitar Pull Request con los cambios, se tomará una revisión de dichos cambios y un chequeo respectivo antes de ser aceptados y mezclados.
También se puede efectuar cualquier issue que se detecte.

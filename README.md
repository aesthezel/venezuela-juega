# Venezuela Juega
Este repositorio sirve como una aplicación web que se despliega en [venezuelajuega.com](https://venezuelajuega.com) que organiza y presenta videojuegos desarrollados en Venezuela. La plataforma permite explorar, filtrar y descubrir juegos venezolanos de la manera más intuitiva, buscando ofrecer información detallada sobre cada título.

## 🎯 Características Principales
- **Catálogo de Juegos**: Visualización completa de videojuegos venezolanos
- **Filtros Avanzados**: Búsqueda por género, plataforma y estado de desarrollo
- **Juegos Destacados**: Sección especial para títulos destacados
- **Vista de Calendario**: Visualización de lanzamientos por fechas
- **Estadísticas**: Gráficos y análisis del ecosistema de videojuegos
- **Detalles del Juego**: Páginas individuales con información completa
- **Modo Responsivo**: Optimizado para dispositivos móviles y escritorio

## 🛠️ Tecnologías utilizadas
### Librerias principales
- **Preact** 10.22.1
- **TypeScript** 5.8.2
- **Preact Router** 4.1.2
- **Vite** 6.2.0
- **Tailwind CSS**

### Librerias extras
- **Papa Parse** 5.5.3
- **FontAwesome**
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
- [ ] Conexión a API de tiendas para obtener precios de los juegos
- [ ] Conexión a API de IGDB o similar
- [ ] Terminar formulario para agregar nuevos juegos
- [ ] Agregar capturas de pantalla a los juegos
- [ ] Agregar trailers a los juegos
- [ ] Añadir un preview animado de los screenshots cuando haces click en una GameCard

## 🤝 Colaboración
Proyecto libre para colaboraciones, puedes hacer un fork y posteriormente solicitar Pull Request con los cambios, se tomará una revisión de dichos cambios y un chequeo respectivo antes de ser aceptados y mezclados.
También se puede efectuar cualquier issue que se detecte.

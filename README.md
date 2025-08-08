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

## 🛠️ Tecnologías Utilizadas
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

## 🚀 Funcionalidades del Sistema

### 1. Gestión de Datos
- **Fuente de Datos**: Google Sheets como CMS
- **Parser CSV**: Procesamiento automático de datos
- **Validación**: Mapeo y validación de estados de juegos
- **Generación de Slugs**: URLs amigables para cada juego

### 2. Interfaz de Usuario
- **Búsqueda en tiempo real**: Búsqueda con debounce
- **Filtros Múltiples**: Por estado, género y plataforma
- **Modal de Detalles**: Vista
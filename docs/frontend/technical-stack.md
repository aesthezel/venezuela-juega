# Stack Tecnológico

El proyecto utiliza tecnologías modernas enfocadas en el rendimiento, la interactividad y la facilidad de mantenimiento.

## Core
- **Preact 10.x**: Alternativa ligera a React con el mismo ecosistema de hooks, proporcionando un bundle size mucho menor y mejor rendimiento en dispositivos móviles.
- **TypeScript 5.x**: Tipado estático en todo el proyecto (Tipos definidos en `src/types`) para evitar errores en tiempo de ejecución.
- **Vite 6.x**: Herramienta de construcción ultrarrápida y servidor de desarrollo.

## Estilizacion y UI
- **Tailwind CSS v4**: Framework de utilidades para un diseño consistente y rápido de iterar. Se utiliza de forma local.
- **GSAP (GreenSock)**: Motor de animaciones utilizado para micro-interacciones, efectos parallax y transiciones de UI.
- **Bootstrap Icons & FontAwesome**: Sets de iconos para la interfaz de usuario.

## Visualización y Datos
- **Papa Parse**: Librería robusta para el procesamiento de archivos CSV/Google Sheets.
- **Chart.js**: Utilizada para las gráficas de analytics de la industria en la sección de estadísticas.
- **FullCalendar**: Maneja la vista de calendario de lanzamientos.
- **@chenglou/pretext**: Biblioteca de vanguardia para la medición aritmética de textos, fundamental para la implementación del **Masonry Grid** sin reflows de layout.

## Estructura del Proyecto
```
src/
├── components/   # Componentes reutilizables (Botones, Cards, Header, etc.)
├── hooks/        # Lógica de hooks personalizados (useGamesData, useMetadata)
├── pages/        # Componentes de página (Catalog, Details, JamGallery)
├── styles/       # Configuraciones globales de Tailwind y CSS general
├── types/        # Definiciones de Interfaces y Enums globales
├── utils/        # Funciones puras (Formateo de fechas, slugs, mapeos)
└── spacetimedb/  # Configuraciones y bindings para el backend distribuido
```

# Lógica de Negocio y Gestión de Datos

La arquitectura de Venezuela Juega está diseñada para ser ligera, mantenible y fácil de actualizar por personal no técnico.

## 1. Google Sheets como CMS
El proyecto utiliza **Google Sheets** como su base de datos principal (CMS). Esto permite que la comunidad o administradores actualicen la lista de juegos sin tocar el código.
- **Papa Parse**: Se encarga de descargar y parsear el CSV de la hoja de cálculo en tiempo real.
- **Configuración**: Las URLs de las hojas se gestionan mediante variables de entorno (`VITE_SPREADSHEET_ID`, `VITE_SHEET_NAME`).

## 2. Procesamiento de Datos (Hooks y Utils)
- **`useGamesData`**: Es el hook central que orquestra la descarga del CSV y la transformación de datos crudos a objetos de tipo `Game`.
- **Validación y Mapeo**:
    - **GameStatus**: Un enum que normaliza estados como "En Desarrollo" o "Early Access" para que el filtrado sea consistente.
    - **GameOrigin**: Identifica si el juego viene de una Game Jam, es un proyecto personal o profesional.
- **Generación de Slugs**: Convierte títulos con caracteres especiales (acentos, ñ, espacios) en cadenas seguras para URLs mediante lógica de limpieza personalizada.

## 3. SEO y Pre-renderizado
Dado que es una SPA (Single Page Application), el SEO puede ser un reto. Venezuela Juega implementa un script de "post-build" que:
- Lee los slugs de los juegos.
- Genera archivos de metadatos para que rastreadores de RRSS (Twitter, Discord, Facebook) puedan ver la información de cada ficha individual sin necesidad de ejecutar JavaScript.

## 4. Estado de los Proyectos
La lógica de negocio define criterios específicos para los estados de cada juego:
- **Released/Publicado**: El juego está disponible para el público general.
- **In Development**: Proyectos activos.
- **Lost Media**: Juegos que se sabe que existieron pero cuyos archivos no están disponibles actualmente (importante para la preservación histórica).

## 5. Integración con APIs de Terceros
- **Steam API**: Obtiene datos adicionales y URLs de trailers de forma dinámica cuando se proporciona un `appid`.
- **YouTube/Vimeo**: Lógica para extraer IDs de video para incrustar trailers rápidamente.

## 6. Evolución: SpacetimeDB
Próximamente, el proyecto integrará **SpacetimeDB** para:
- Implementar un sistema de autenticación de usuarios.
- Permitir que los desarrolladores envíen sus propios juegos directamente desde la web.
- Gestión de perfiles y favoritos en tiempo real.

# HeroMosaic Component

El `HeroMosaic` es el componente principal de la página de inicio de Venezuela Juega. Sirve como la primera impresión visual del sitio y ofrece una puerta de entrada dinámica al catálogo de juegos y estadísticas de la industria.

## Arquitectura Modular

El componente fue refactorado para separar la lógica de presentación en sub-componentes especializados ubicados en `src/components/hero/`:

- **`CategoryCard`**: Tarjetas visuales para las categorías principales. Inspiradas en el diseño de GOG, presentan un estilo "inset" con sombras de color, desenfoque al pasar el cursor y escalado interactivo.
- **`CompactStat`**: Módulos minimalistas para mostrar métricas clave (total de juegos, estudios, años de historia, etc.).
- **`TabButton`**: Botones estilizados para alternar entre las vistas del panel central.
- **`ProgressDots`**: Indicador visual de navegación entre pestañas que incluye una barra de progreso para la rotación automática.
- **`categoryPresets.ts`**: Archivo de configuración centralizado que define los filtros, colores e iconos de cada categoría.

## Funcionalidades Principales

### 1. Panel de Exhibición (Showcase)
El centro del Hero permite alternar entre dos vistas principales:
- **Explorar (Categorías)**: Una fila deslizable de tarjetas que filtran el catálogo por plataformas (PC, Móvil, Consolas) o estados (Lanzados, Demos).
- **Métricas (Estadísticas)**: Un resumen visual del impacto de la industria nacional, calculado dinámicamente a partir de la base de datos de juegos y jams.

### 2. Rotación Automática y Auto-pausa
El componente alterna automáticamente entre las pestañas "Explorar" y "Métricas" cada 10 segundos. 
- **Barra de Progreso**: Los puntos de navegación inferiores muestran visualmente cuánto tiempo queda para el siguiente cambio.
- **Interacción Inteligente**: Si el usuario coloca el cursor sobre el panel de exhibición, el temporizador se pausa automáticamente para permitir una interacción sin interrupciones.

### 3. Fondo de Mosaico Animado
Utiliza una cuadrícula de 28 juegos aleatorios con portadas reales.
- **GSAP Parallax**: La cuadrícula tiene una animación de escala inicial y responde al scroll del usuario con un desplazamiento vertical suave (parallax).
- **Filtros Visuales**: Las imágenes están desaturadas y oscurecidas por defecto para priorizar la legibilidad del texto frontal, recuperando color al pasar el cursor (en dispositivos compatibles).

### 4. Responsividad Crítica
- **Desktop**: Layout amplio con navegación por flechas y hover effects detallados.
- **Mobile**: 
    - El mosaico de fondo se simplifica a menos columnas.
    - Las métricas pasan de una cuadrícula a un carrusel interactivo con flechas laterales y puntos de navegación propios.
    - Las tarjetas de categorías se adaptan para ser el foco de la pantalla mediante scroll-snap.

## Lógica de Filtrado y Datos

El componente utiliza `CATEGORY_PRESETS` para generar las vistas filtradas. Cada preset define:
- `dataSource`: Si debe buscar en juegos publicados (`games`), proyectos de Game Jam (`jams`) o ambos (`all`).
- `filterFn` / `filterRecord`: Reglas de filtrado para seleccionar los juegos que pertenecen a esa categoría.
- `accentFrom` / `accentTo`: Colores de marca para las tarjetas y los iconos de estadísticas.

## Cómo Extenderlo

### Añadir una nueva Categoría
Para añadir una nueva categoría al Hero, simplemente edita `src/components/hero/categoryPresets.ts` y añade un nuevo objeto al array `CATEGORY_PRESETS`. El componente detectará automáticamente el cambio, calculará el conteo de juegos y seleccionará una imagen de fondo aleatoria válida de entre los juegos que coincidan con el filtro.

### Modificar Animaciones
La mayoría de las animaciones están manejadas por:
1. **GSAP**: Para la lógica de ScrollTrigger y entrada del mosaico de fondo.
## Estética y Temas

A diferencia del resto del sitio, el `HeroMosaic` mantiene una **estética oscura cinematográfica** de forma permanente, independientemente de si la aplicación está en modo claro o oscuro.

- **`hero-always-dark`**: Esta clase CSS asegura que los contrastes y colores de la sección hero no cambien al activar el tema claro, preservando la atmósfera "gamer" y la legibilidad de los textos dorados/blancos sobre el mosaico de juegos.
- **Gradientes de Contraste**: El componente utiliza gradientes radiales y lineales fijos para asegurar que el centro de la pantalla siempre sea el punto focal y que las imágenes del mosaico no interfieran con la interfaz de usuario.


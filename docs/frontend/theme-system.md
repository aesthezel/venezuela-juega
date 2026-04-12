# Sistema de Temas (Light/Dark Mode)

Este documento describe la arquitectura y el funcionamiento del sistema de temas de **Venezuela Juega**, el cual permite alternar entre un modo oscuro (predeterminado) y un modo claro con una transición visual suave.

## Arquitectura del Sistema

El sistema se basa en tres pilares fundamentales:
1. **Estado Global**: Administrado por `ThemeContext`.
2. **Inversión de Tokens**: Re-mapeado automático de colores de Tailwind v4 mediante variables CSS.
3. **Persistencia y Rendimiento**: Prevención de destellos (FOUC) mediante detección temprana.

---

## 1. ThemeContext

Ubicación: `src/hooks/ThemeContext.tsx`

Es el responsable de orquestar el cambio de estado y aplicar las persistencias necesarias.

### Funcionamiento
- **Estado Inicial**: Determina el tema basándose en `localStorage` (llave `vj-theme`). Si no existe, el valor predeterminado es `dark`.
- **Efecto de Aplicación**: Al cambiar el estado, actualiza la clase del elemento `<html>` (`.light` o `.dark`) y el atributo `data-theme`.
- **Transición**: Integra el **View Transitions API** para realizar un efecto de "revelación de logo" (logo reveal) al cambiar de tema.
- **Efecto de Logo**: El nuevo tema se revela a través del logo de la aplicación, el cual escala desde el centro de la pantalla.
- **Fases de Animación**: El logo aparece rápidamente (10% de la duración), se mantiene visible un momento para reforzar la identidad de marca, y finalmente se expande masivamente para revelar el contenido completo.

```typescript
const toggleTheme = () => {
    const switchTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    if (!document.startViewTransition) {
        switchTheme();
    } else {
        document.startViewTransition(switchTheme);
    }
};
```

---

## 2. Estrategia de Inversión de Tokens (CSS)

Ubicación: `src/styles/global.css`

En lugar de añadir clases `dark:` de forma manual en cientos de componentes, el sistema utiliza una técnica de **inversión de tokens** a nivel de motor de estilos.

### Tailwind v4 Configuration
Para habilitar el modo oscuro basado en clases (requerido por Tailwind v4), se utiliza la directiva:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Inversión de Escala
Definimos los colores base de la aplicación (Escala Slate) en el bloque `@theme`. Cuando la clase `.light` está activa, re-definimos esas mismas variables en el `@layer theme`:

- **Oscuro (Default)**: `slate-950` es negro profundo (#0d0a11).
- **Claro (.light)**: `slate-950` se convierte en un gris muy claro (#f5f3f7).

Este enfoque garantiza que cualquier componente que use clases estándar de Tailwind como `bg-slate-950` o `text-slate-200` se adapte **automáticamente** sin cambios en el código del componente.

### Secciones Scoped (`hero-always-dark`)
Para mantener la estética cinematográfica de la sección Hero (mosaico de juegos), se utiliza la clase `.hero-always-dark`. Esta clase restaura los tokens oscuros dentro de ese contenedor, incluso si el sitio está en modo claro.

---

## 3. Prevención de Destellos (FOUC)

Para evitar el "flash" de luz blanca al cargar la app en modo oscuro (o viceversa), se implementó un script de bloqueo en el `<head>` de `index.html`.

```html
<script>
    (function() {
        try {
            var t = localStorage.getItem('vj-theme');
            if (t === 'light' || t === 'dark') {
                document.documentElement.className = t;
            }
        } catch(e) {}
    })();
</script>
```

Este script se ejecuta antes de que el navegador renderice el cuerpo de la página, asegurando que el tema correcto esté aplicado desde el primer frame.

---

## 4. Efectos Visuales y Glassmorphism

El sistema adapta dinámicamente:
- **Scrollbars**: Cambian de color y opacidad según el tema.
- **Glass Panel**: La utilidad `.glass-panel` ajusta su desenfoque y opacidad de fondo (`white/75` en claro vs `slate-950/70` en oscuro).
- **Logos**: Se aplica un filtro `invert` condicional mediante CSS para asegurar la visibilidad del logo blanco sobre fondos claros.

---

## 5. Mejores Prácticas para Desarrolladores

Para mantener la compatibilidad con el sistema de temas:
1. **Usa Tokens de Slate**: Prefiere `bg-slate-900` sobre colores hexadecimales fijos.
2. **Evita Hardcoding**: Si necesitas un color específico para un tema, usa las variantes de Tailwind: `bg-white dark:bg-slate-950`.
3. **Semántica**: Los tokens están invertidos. Recuerda que `slate-50` es el texto más oscuro en el tema claro.

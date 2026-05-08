# Guía de Design Tokens — Venezuela Juega

> Referencia práctica para mantener y extender el sistema de tokens de diseño del proyecto.

## Arquitectura de Tokens

El sistema usa **3 capas** (Tailwind v4 CSS-first):

```
@theme { Primitivos }      →  Valores raw de color, tipografía
:root  { Semánticos }       →  Variables CSS con propósito (glass, layout)
Componentes (clases TW)     →  bg-surface-900, text-brand-gold, etc.
```

### Regla de Oro

> **Nunca** sobrescribas nombres de paleta de Tailwind (`slate-*`, `cyan-*`, `blue-*`).  
> Usa nombres **semánticos propios**: `surface-*`, `brand-*`, `accent-*`.

---

## Inventario de Tokens Actuales

### Surface (escala oscura principal)

| Token | Hex | Uso típico |
|-------|-----|------------|
| `surface-950` | `#0d0a11` | Fondo más profundo, body |
| `surface-900` | `#18131e` | Fondos de sección, sidebar |
| `surface-800` | `#221a2a` | Cards, inputs, contenedores |
| `surface-700` | `#2c1b2e` | Bordes, divisores |
| `surface-600` | `#3b2a3d` | Bordes secundarios |
| `surface-500` | `#5b4a5d` | Texto deshabilitado |
| `surface-400` | `#9c8a9d` | Texto secundario, iconos |
| `surface-300` | `#d4cfd6` | Texto body |
| `surface-200` | `#eae7ec` | Texto principal |
| `surface-100` | `#fff4e0` | Texto destacado (warm) |
| `surface-50`  | `#ffffff` | Blanco puro |

### Brand (bandera venezolana)

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-gold` | `#f2b63d` | Amarillo principal, highlights |
| `brand-blue` | `#457cd6` | Azul principal, links |
| `brand-red` | `#e34262` | Rojo principal, errores |
| `brand-red-dark` | `#94353d` | Rojo oscuro, estados críticos |
| `brand-warm-white` | `#fff4e0` | Blanco cálido |

### Accent (paleta suplementaria)

| Token | Hex | Uso |
|-------|-----|-----|
| `accent-teal` | `#8fcccb` | Teal claro, highlights interactivos |
| `accent-teal-dark` | `#449489` | Teal primario, botones CTA |
| `accent-teal-deep` | `#285763` | Teal oscuro, sombras |
| `accent-indigo` | `#4b3b9c` | Violeta, scrollbar hover |
| `accent-indigo-dark` | `#2f2b5c` | Violeta oscuro |
| `accent-lime` | `#b4ba47` | Lima/verde claro |
| `accent-lime-dark` | `#6d8c32` | Lima oscuro |
| `accent-orange` | `#d46e33` | Naranja |
| `accent-mauve` | `#9c656c` | Mauve/rosado |
| `accent-mauve-dark` | `#57253b` | Mauve oscuro |
| `accent-mauve-deep` | `#2c1b2e` | Mauve profundo |

### Status (estados de juegos)

| Token | Hex | Estado |
|-------|-----|--------|
| `status-released` | `#16a34a` | Lanzado |
| `status-in-development` | `#f2b63d` | En desarrollo |
| `status-on-hold` | `#71717a` | En pausa |
| `status-canceled` | `#94353d` | Cancelado |
| `status-demo` | `#4ade80` | Demo lanzado |
| `status-prototype` | `#e4e4e7` | Prototipo |
| `status-lost` | `#fecaca` | Media perdida |
| `status-early` | `#449489` | Acceso anticipado |
| `status-recovered` | `#457cd6` | Recuperado |
| `status-unknown` | `#18181b` | Desconocido |

### Store (marcas de tiendas)

| Token | Hex | Tienda |
|-------|-----|--------|
| `store-steam` / `store-steam-hover` | `#172337` / `#2a475e` | Steam |
| `store-itch` / `store-itch-hover` | `#fa5c5c` / `#ff7f7f` | Itch.io |
| `store-nintendo` / `store-nintendo-hover` | `#e60012` / `#ff334f` | Nintendo |
| `store-playstation` / `store-playstation-hover` | `#0070d1` / `#0084f7` | PlayStation |
| `store-xbox` / `store-xbox-hover` | `#107b10` / `#00bfff` | Xbox |
| `store-google-play` / `store-google-play-hover` | `#00a185` / `#00c9a6` | Play Store |
| `store-apple` / `store-apple-hover` | `#000000` / `#333333` | App Store |
| `store-meta` / `store-meta-hover` | `#0078ff` / `#3391ff` | Meta |
| `store-gog` / `store-gog-hover` | `#c99aff` / `#3391ff` | GOG |

---

## Cómo Agregar Nuevos Tokens

### 1. Agregar un color primitivo

En `src/styles/global.css`, dentro del bloque `@theme`:

```css
@theme {
  /* ─── Tu nueva categoría ─── */
  --color-mi-nuevo-token: #hexcolor;
}
```

### 2. Usarlo en componentes

```tsx
// Tailwind lo genera automáticamente como clase
<div className="bg-mi-nuevo-token text-mi-nuevo-token">
```

### 3. Si es un token semántico (con propósito)

Agréguelo en `:root` como variable CSS:

```css
:root {
  --mi-variable: var(--color-mi-nuevo-token);
}
```

---

## Convenciones de Nombres

| Prefijo | Cuándo usarlo | Ejemplo |
|---------|--------------|---------|
| `surface-` | Escala de grises/oscuros del fondo | `surface-800` |
| `brand-` | Colores de identidad de marca | `brand-gold` |
| `accent-` | Colores decorativos/highlight | `accent-teal-dark` |
| `status-` | Estados de juegos | `status-released` |
| `store-` | Colores de marca de tiendas | `store-steam` |

### Reglas:
1. **Usar sufijos descriptivos** en vez de números arbitrarios: `-dark`, `-deep`, `-hover`
2. **Agrupar en familias**: `accent-teal`, `accent-teal-dark`, `accent-teal-deep`
3. **No sobrescribir paletas de Tailwind**: nunca `--color-slate-*` ni `--color-cyan-*`
4. **Token para cada uso**: no reutilizar el mismo hex en múltiples tokens a menos que sea intencional

---

## Tokens Semánticos en `:root`

Tokens de mayor nivel para efectos y layout:

```css
:root {
  --header-height: 80px;
  --primary-glow: conic-gradient(...);
  
  /* Glass morphism */
  --glass-bg: rgba(24, 19, 30, 0.4);
  --glass-border: rgba(255, 244, 224, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-card-bg: rgba(255, 255, 255, 0.03);
  --glass-card-border: rgba(255, 255, 255, 0.05);
}
```

---

## Patrones Anti (NO hacer)

| ❌ Incorrecto | ✅ Correcto |
|---|---|
| `bg-[#172337]` | `bg-store-steam` |
| `text-[#f2b63d]` | `text-brand-gold` |
| `--color-slate-900: #custom` | `--color-surface-900: #custom` |
| `bg-cyan-500` (overriding cyan) | `bg-accent-teal-dark` |
| `rgba(6, 182, 212, 0.3)` inline | Crear `--glass-*` token en `:root` |

---

## Checklist para Nuevos Componentes

- [ ] ¿Usas solo tokens de `@theme` para colores? (nunca hex raw)
- [ ] ¿Las sombras con `rgba()` están en `:root` como variables?
- [ ] ¿Los nombres de clase usan `surface-*`, `brand-*`, `accent-*`?
- [ ] ¿Los colores de hover/active usan tokens (ej. `hover:bg-store-steam-hover`)?
- [ ] ¿No se sobrescriben nombres de Tailwind por defecto?

---

## Próximos Pasos de Estandarización

### Pendientes de tokenizar:

1. **Sombras con rgba en inline styles**  
   Componentes como `GameCard.tsx`, `GameDetailPage.tsx`, `Modal.tsx` usan `shadow-[0_0_12px_rgba(...)]`. Crear tokens:
   ```css
   @theme {
     --shadow-glow-teal: 0 0 12px rgba(68, 148, 137, 0.3);
     --shadow-glow-red: 0 0 8px rgba(244, 63, 94, 0.5);
   }
   ```

2. **CalendarPage (FullCalendar overrides)**  
   ~30 valores `rgba(6, 182, 212, ...)` en un bloque `<style>` inline. Migrar a variables CSS.

3. **GameJamPage `gray-*` references**  
   ~30 usos de `text-gray-300/400` que podrían estandarizarse a `text-surface-300/400`.

4. **CategoryPresets `accentFrom`/`accentTo`**  
   Los colores en `categoryPresets.ts` son hex raw dinámicos. Considerar crear un mapping a los tokens CSS.

5. **Colores de gradiente dinámicos**  
   `GameJamsPage.tsx` genera gradientes con hex dinámico desde datos. No tokenizable directamente, pero documentar como excepción aceptada.

---

## Referencia Rápida: Migración de Nombres

| Antes (hijacked) | Después (token propio) |
|---|---|
| `slate-950` | `surface-950` |
| `slate-900` → `900` | `surface-900` → `900` |
| `cyan-400` | `accent-teal` |
| `cyan-500` | `accent-teal-dark` |
| `yellow-300/400/500` | `brand-gold` |
| `blue-400/500/600` | `brand-blue` |
| `red-400/500` | `brand-red` |
| `red-600` | `brand-red-dark` |
| `indigo-400/500` | `accent-indigo` |
| `emerald-300/400` | `accent-lime` |
| `orange-300/400/500` | `accent-orange` |
| `purple-300/400` | `accent-mauve` |

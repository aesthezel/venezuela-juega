# Game Jams CMS — Venezuela Juega

Este directorio almacena los eventos de Game Jams del sitio web. El sistema carga e indexa automáticamente cualquier archivo `.md` o `.json` colocado aquí mediante Vite (`import.meta.glob`).

## Cómo añadir un nuevo Game Jam

Simplemente crea un archivo `.md` (ej: `mi-nuevo-jam.md`) en esta carpeta con la siguiente estructura:

```markdown
---
slug: mi-nuevo-jam
edition: "2026"
name: "Mi Nuevo Game Jam"
shortName: "Mi Jam"
tagline: "Crea juegos increíbles en 48 horas"
status: upcoming # 'draft' | 'upcoming' | 'open' | 'active' | 'voting' | 'ended'
startDate: 2026-10-10T10:00:00-04:00
endDate: 2026-10-12T20:00:00-04:00
submissionUrl: "https://itch.io/jam/mi-jam"
platform: "itch.io"
heroGradient: "from-[#1a0a0d] via-[#0d0a11] to-[#0a0d1a]"
accentColor: "#e34262"
accentTextColor: "#ffffff"
isCharity: false
layout:
  - hero
  - stats
  - about
  - prizes
  - schedule
  - reglas-clave
  - faq
  - cta
---

:::about {title: "¿Por qué esta jam?", subtitle: "Construye y aprende"}
### 🚀 Objetivos
Texto explicativo...
:::

:::sponsors
- Global Game Jam | https://logo.svg | https://globalgamejam.org
:::

:::schedule {title: "CRONOGRAMA"}
- [📝 Registro](2026-10-01 -> 2026-10-09): Inscripciones abiertas.
- [🎮 Desarrollo](2026-10-10 -> 2026-10-12): 48 horas de código.
:::

:::prizes
### 🏆 Mejor Juego
Emoji: 🏆
Color: warning
Descripción: El mejor proyecto general.
:::

:::custom {id: "reglas-clave", title: "Reglas Oficiales", badge: "IMPORTANTE"}
Texto libre con soporte para:
- Listas
- **Negritas** y *cursivas*
- Enlaces como [Venezuela Juega](https://venezuelajuega.com)
:::

:::faq
### ¿Cuánto cuesta participar?
La participación es completamente libre y gratuita.
:::
```

### Formato alternativo en JSON
También puedes crear archivos `.json` con el schema completo de `JamEvent`.

## Sección de juegos de la edición

Puedes mostrar los juegos que se desarrollaron en la jam usando los IDs de la hoja **Games** del spreadsheet de jams. Basta con declarar `games:` en el frontmatter:

```yaml
games: 90-101          # rango inclusivo
# games: [90, 91, 92]  # lista explícita
# games: 90, 91, 92    # string separado por comas
gamesTitle: "Juegos de la GameJam+"          # opcional
gamesSubtitle: "Prototipos creados en 2026"  # opcional
```

La sección se inserta automáticamente antes del `faq` si no la incluyes en `layout`. Para ubicarla manualmente, agrega `games` en el layout:

```yaml
layout:
  - hero
  - about
  - schedule
  - games
  - faq
```

También existe el bloque equivalente (útil para sobrescribir los IDs o el título desde el cuerpo):

```markdown
:::games {ids: "90-101", title: "Juegos de esta edición", subtitle: "48 horas de creatividad"}
:::
```

Los IDs corresponden a la columna numérica final de la hoja `Games`; los juegos se muestran en el orden en que los declares y las IDs inexistentes se ignoran.

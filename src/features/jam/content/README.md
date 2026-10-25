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

Puedes mostrar los juegos que se desarrollaron en la jam enlazando el evento con su sede del spreadsheet. En el frontmatter declara el **UID de la sede** (`JamSettings`) y la edición se toma automáticamente del año:

```yaml
jamUid: "8"                                  # UID de la sede en JamSettings
edition: "2026"                              # año usado para filtrar la edición
gamesTitle: "Juegos de la Women Game Jam"    # opcional
gamesSubtitle: "Prototipos creados en 2026"  # opcional
```

Reglas de resolución:

- Se muestran los juegos de la hoja **Games** cuyo `Jam_Org_UID` coincide con `jamUid`.
- Si `edition` es un año de 4 dígitos (ej. `"2026"`), se filtra también por `Jam_Edition`.
- Si `edition` no es un año (ej. `"i"`), se usa el año de `startDate`. Los juegos sin `Jam_Edition` se incluyen siempre, porque la hoja no siempre rellena esa columna.
- Los juegos se ordenan por su ID de la hoja.

La sección se inserta automáticamente antes del `faq` si no la incluyes en `layout`. Para ubicarla manualmente:

```yaml
layout:
  - hero
  - about
  - schedule
  - games
  - faq
```

> Si necesitas mostrar juegos puntuales, también puedes sobrescribir el título/subtítulo con `gamesTitle` y `gamesSubtitle`, pero la selección siempre se hace por sede + edición.

# Recursos CMS — Venezuela Juega

Este directorio almacena los documentos, guías y papers del sitio. El sistema carga e indexa automáticamente cualquier archivo `.md` colocado aquí mediante Vite (`import.meta.glob`).

> Los archivos `README.md` y los que comienzan con `_` o `.` se ignoran (útiles para borradores de trabajo).

## Cómo añadir un recurso

Crea un archivo `.md` (ej: `mi-guia.md`) con frontmatter y cuerpo markdown:

```markdown
---
slug: mi-guia
title: "Título del recurso"
subtitle: "Una línea que acompaña al título"          # opcional
description: "Resumen corto para SEO y cards."        # obligatorio para SEO
category: technical                                    # legal | business | technical | academic | community | funding
tags: [unreal, pipeline, optimizacion]
status: draft                                          # draft | published | archived
author: "Tu Nombre"
authorUrl: "https://tusitio.com"                       # opcional
publishedDate: 2026-10-01
updatedDate: 2026-10-15                                # opcional
icon: "🛠️"                                             # opcional (por defecto usa el de la categoría)
accentColor: "#00a185"                                 # opcional
coverImage: "https://..."                              # opcional
featured: false                                        # opcional: destaca en el listado
order: 10                                              # opcional: orden manual
relatedSlugs: [otra-guia]                              # opcional
layout: [hero, meta, body, toc, sources, related]      # opcional
---

## Introducción
...
```

## Sintaxis soportada

### Headings

`##` y `###` generan la tabla de contenidos (TOC) automáticamente con anchors
únicos (soporta acentos y headings repetidos).

### Callouts

```markdown
:::info {title: "Dato importante"}
Texto del bloque.
:::

:::warning {title: "Atención"}
Texto del bloque.
:::

:::tip
Los callouts disponibles son: `info`, `note`, `tip`, `warning`, `danger`, `success`.
:::
```

### Fuentes y referencias

```markdown
:::sources
- [SAPI - Servicio Autónomo de Propiedad Intelectual](https://sapi.gob.ve/)
- [WIPO](https://www.wipo.int/)
:::
```

### Secciones libres

```markdown
:::custom {id: "mi-seccion", title: "Título", badge: "NUEVO", theme: "base-200"}
Contenido markdown libre.
:::
```

También puedes usar `:::markdown`, `:::section` y `:::embed {url: "https://..."}`.

### Markdown de bloques

- Párrafos, listas con `-`, listas numeradas con `1.`, citas con `>`
- Bloques de código con \`\`\`lenguaje
- En el texto inline: **negrita**, *cursiva*, `código`, [enlaces](https://url) e imágenes.

## Estados

| Estado | Visible en `/docs` | Accesible por URL directa |
|---|---|---|
| `draft` | No | Sí (con badge "Borrador") |
| `published` | Sí | Sí |
| `archived` | No | Sí (con badge "Archivado") |

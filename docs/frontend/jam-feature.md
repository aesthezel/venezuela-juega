# Sistema de Features y Game Jams

Este documento explica cómo funciona el patrón arquitectónico en `src/features/` y toma como caso de estudio la nueva funcionalidad de **Game Jams**.

## 1. El Sistema de Features (`src/features/`)

El frontend de Venezuela Juega utiliza una **arquitectura feature-based** (orientada a características). En lugar de agrupar archivos por tipo técnico (todos los componentes juntos, todos los hooks juntos), agrupamos por dominio de negocio.

- **Encapsulamiento**: Todo lo que pertenece exclusivamente a una funcionalidad (ej. Catálogo, Jams, Detalle de Juego) vive dentro de su propia carpeta en `src/features/<nombre>/`.
- **Independencia**: Las features no deben depender de otras features. Si dos features necesitan compartir un componente, este debe moverse a `src/common/`.
- **API Pública (Barrels)**: Cada feature expone solo lo que el resto de la aplicación necesita a través de su archivo `index.ts`.

Para más detalles técnicos sobre los alias y convenciones de carpetas, consulta la [Arquitectura del Proyecto](architecture.md).

---

## 2. La Feature de Jams (`src/features/jam/`)

La funcionalidad de Game Jams es un excelente ejemplo de cómo aplicar este sistema. Está diseñada para ser modular, fácil de mantener y extensible para futuros eventos, ya sean benéficos o competitivos.

### Estructura Interna

```
src/features/jam/
├── components/           # UI específica de la vista de Jams
│   ├── JamHero.tsx       # Cabecera principal con logo, gradiente y cuenta regresiva
│   ├── JamDonation.tsx   # Sección de donaciones (para jams benéficas)
│   ├── JamSchedule.tsx   # Calendario y fases de la jam
│   ├── JamFAQ.tsx        # Preguntas frecuentes dinámicas
│   ├── JamCTA.tsx        # Call-to-action para participar/donar
│   └── index.ts          # Barrel de componentes
├── registry.ts           # Base de datos local (configuración) de todas las Jams
├── types.ts              # Modelos de datos e interfaces (JamEvent, JamPhase, etc.)
└── index.ts              # Exporta el registro y los componentes
```

### El Registro (`registry.ts`) y Modelos (`types.ts`)

En lugar de consultar una base de datos externa para los detalles del evento, utilizamos un registro local en código (`registry.ts`). Esto permite iterar rápidamente y mantener la configuración fuertemente tipada usando TypeScript.

- **`JamEvent`**: Es la interfaz principal. Define el estado de la jam (`upcoming`, `open`, `active`, `ended`), fechas, enlaces de donación/participación, gradientes personalizados (`heroGradient`), logotipo, premios, preguntas frecuentes y fases.
- **Tipos Flexibles**: Permite configurar jams con enfoques diferentes. Por ejemplo, usando la propiedad `isCharity: true`, el sistema renderizará automáticamente el componente `JamDonation` en lugar del componente de premios.

### Sistema de Componentes (`components/`)

Los componentes de la feature de Jams son "tontos" en el sentido de que reciben un objeto `jam: JamEvent` por props y se encargan puramente de la presentación:

- **`JamHero`**: Muestra el título, la placa del estado (ej. "INSCRIPCIONES ABIERTAS"), y una cuenta regresiva (`JamCountdown`) calculada automáticamente basada en `jam.startDate`. Soporta imágenes de fondo o gradientes CSS dinámicos (Tailwind).
- **Secciones Dinámicas**: Componentes como `JamFAQ` o `JamSchedule` iteran sobre los arrays configurados en el evento específico del `registry`. 

---

## 3. Integración con Páginas (Routing)

La feature exporta sus piezas para ser orquestadas por las páginas (en `src/pages/`), las cuales están conectadas al Router (Preact Router).

- **`JamDetailPage.tsx`**: Es el componente de página que captura el slug y la edición desde la URL (ej. `/jam/juntos/2026`). 
  1. Utiliza la función `getJamBySlug(jamName, edition)` del registro para buscar los datos del evento.
  2. Inyecta los metadatos (SEO, título de página).
  3. Ensambla la página importando y renderizando los componentes de la feature (`JamHero`, `JamSchedule`, `JamFAQ`, etc.) pasándoles el objeto del evento.

Si el slug no coincide con ninguno registrado, la página se encarga de mostrar un estado "Jam no encontrada".

## Beneficios de esta aproximación

1. **Escalabilidad**: Crear una nueva Jam para el próximo año es tan simple como añadir un nuevo objeto al array en `registry.ts`.
2. **Mantenibilidad**: Si hay un bug en el header de las Jams, sabemos exactamente que está en `src/features/jam/components/JamHero.tsx`, sin mezclarlo con el Header global de la aplicación.
3. **Flexibilidad Visual**: El registro permite sobreescribir colores de acento (`accentColor`), logotipos y fondos, dándole a cada Jam su propia identidad visual sin alterar la estructura del código.

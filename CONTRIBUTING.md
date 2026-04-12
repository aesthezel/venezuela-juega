# Contribuye al proyecto

¡Gracias por tu interés en colaborar con **Venezuela Juega**! Este proyecto tiene como objetivo centralizar y dar visibilidad al talento nacional en el desarrollo de videojuegos.

Para que podamos trabajar juntos de la mejor manera, por favor sigue estas instrucciones:

## 1. Primeros pasos

### Crear un fork
Para contribuir, no puedes subir cambios directamente a este repositorio. Debes crear tu propio **fork**:
1. Haz clic en el botón "Fork" en la esquina superior derecha de este repositorio.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/{tu-usuario}/venezuela-juega.git
   ```

### Para entender el proyecto
Antes de empezar a codificar, es **obligatorio** leer la carpeta [`docs/`](./docs) para entender la arquitectura, el stack técnico y la lógica de negocio del proyecto:
- [Documentación Frontend](./docs/frontend)
- [Documentación Backend](./docs/backend)

## 2. Flujo de trabajo

### Ramas y cambios
1. Crea una rama para tu cambio: `git checkout -b feature/mi-nueva-caracteristica`.
2. Realiza tus cambios siguiendo las convenciones del proyecto.
3. Asegúrate de que el proyecto compila y no tiene errores de linting.

### Pull Requests (PR)
Una vez que tus cambios estén listos en tu fork:
1. Sube los cambios a tu repositorio: `git push origin feature/mi-nueva-caracteristica`.
2. Abre un **Pull Request** hacia la rama `pull-requests` del repositorio original.
3. **Notifica los cambios**: El PR debe incluir una descripción clara de qué se cambió, por qué se cambió y cualquier información relevante para la revisión (capturas de pantalla si es un cambio visual).

## 3. Entorno de desarrollo

Este proyecto utiliza **npm** como manejador de paquetes.

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Comandos útiles
| Tarea | Comando |
|-------|---------|
| Validar tipos | `npx tsc --noEmit` |
| Ejecutar tests | `npx vitest` |
| Linting | `npx eslint .` |

## 4. Convenciones técnicas

Para mantener la consistencia del código, sigue estas reglas:

- **Framework**: [Preact](https://preactjs.com/) con hooks (`useState`, `useEffect`, `useMemo`).
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/).
- **Base de Datos**: [SpacetimeDB](https://spacetimedb.com/) para funcionalidades en tiempo real.
- **Modelos**: Todos los modelos compartidos deben estar en `src/types.ts`.
- **Tests**: Usamos `vitest` + `Testing Library for Preact`. Los tests se encuentran en la carpeta `test/`.

## 5. ¿Necesitas ayuda?

Si tienes dudas sobre cómo implementar algo o encuentras un error, puedes abrir un **Issue** para discutirlo antes de empezar a trabajar en el código.

---
¡Gracias por sumarte a la comunidad de desarrolladores de Venezuela!

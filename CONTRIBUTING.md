# Guía de contribución a Minka

## Dónde trabajar

| Repositorio | Responsabilidad | Puerto local habitual |
| --- | --- | --- |
| `minka-platform` | Docker Compose y revisiones de los submódulos | — |
| [`minka-mobile`](minka-mobile/README.md) | App React Native para Android e iOS | `8081` para Metro |
| [`minka-backend`](minka-backend/README.md) | API NestJS y PostgreSQL | `4000` para la API, `5432` para la base |
| [`minka-web`](minka-web/README.md) | App web en Next.js | `3000` |

Clona la plataforma con sus submódulos. Para un clon existente, `git submodule update --init --recursive` prepara las revisiones que la plataforma tiene fijadas. Revisa los cambios locales antes de actualizar.

```sh
git clone --recurse-submodules https://github.com/cliffdaniel/minka-platform.git
cd minka-platform
```

Abre la raíz de `minka-platform` como carpeta de trabajo en Claude Code o Codex para cargar las instrucciones compartidas. Si trabajas con un clon independiente de un submódulo, consulta esta guía desde la plataforma y el README del submódulo para sus comandos.

## Cómo hacer cambios

- Revisa `git status --short --branch` en el repositorio que vas a editar. Conserva los cambios que ya estaban en el árbol de trabajo y mantén el diff enfocado en la tarea.
- Si modificas un contrato de API o de autenticación, revisa los consumidores web y móvil afectados. Para cambios de esquema, verifica el camino de actualización de una base existente con datos de prueba.
- Registra cada funcionalidad nueva o modificada en [FEATURES.md](FEATURES.md). Documenta en Swagger la entrada, respuesta, permisos y errores esperados de cada endpoint que agregues o cambies.
- Mantén credenciales, tokens y datos personales fuera de Git y de los logs. Usa variables de entorno para secretos y valores de ejemplo en la documentación.
- Usa `npm ci --legacy-peer-deps` al preparar las dependencias locales desde el lockfile. Mobile requiere Node.js 22.13 o posterior. Incluye los cambios al lockfile cuando cambien dependencias y deja fuera del commit los artefactos generados por las verificaciones.

## Estándar de código

- Usa TypeScript para código de aplicación y JavaScript moderno donde corresponda, como en scripts y archivos de configuración. Prefiere módulos ES, `const` y `let`, y `async` y `await`. Trata las entradas externas sin un tipo conocido como `unknown` y valídalas antes de usarlas. Usa `import type` para tipos que solo existen durante la compilación y conserva los imports de valor que requieren los decoradores o la inyección de dependencias.
- Usa nombres que expliquen la intención y el vocabulario del dominio, como `useSession` o `GetUpcomingEventsUseCase`. Conserva las convenciones, nombres y ubicaciones de los archivos vecinos. Coloca el cambio en el módulo responsable y actualiza sus consumidores si necesitas mover un archivo o cambiar su contrato.
- Mantén funciones y archivos enfocados en una responsabilidad. Separa una parte cuando tenga un propósito propio y la extracción facilite entenderla o probarla. Conserva juntas las partes que cambian juntas.
- Busca primero componentes, estilos, casos de uso, validaciones y clientes de API existentes. Extrae lógica común cuando comparte el mismo comportamiento y significado. Elige la implementación más directa que cubra el caso y tenga un punto claro de extensión cuando haga falta.
- Ejecuta `npm run lint` en cada submódulo que cambies. Para aplicar las correcciones automáticas de ESLint, usa `npm run lint -- --fix` y revisa el diff resultante.

## Arquitectura

Aplica DDD para organizar las funcionalidades por dominio y Clean Architecture para mantener las dependencias hacia adentro.

| Capa | Responsabilidad |
| --- | --- |
| `domain` | Entidades, reglas del negocio y contratos expresados con el vocabulario del dominio. |
| `application` | Casos de uso que coordinan las reglas y dependen de los contratos que necesitan. |
| `infrastructure` | Adaptadores de base de datos, HTTP, almacenamiento y servicios externos. |
| `presentation` o `interfaces` | Pantallas, rutas y controladores que traducen entradas y respuestas. Los módulos, rutas o hooks de entrada pueden ensamblar el caso de uso con sus adaptadores. |

Ubica primero el comportamiento y el módulo que lo posee. Una operación sencilla puede tener un solo caso de uso o reutilizar el que ya existe. Introduce un contrato cuando proteja un límite real, como persistencia o un servicio externo. Mantén el formato de transporte y los detalles de frameworks fuera de las reglas nuevas del dominio. Conserva la estructura de un módulo existente cuando el cambio sea puntual y deja cualquier migración de arquitectura para el cambio que la necesite.

## Cómo verificar

Ejecuta los comandos desde el repositorio correspondiente. Cubre el comportamiento que cambió y agrega una prueba de regresión si las pruebas existentes dejan ese caso sin cubrir.

| Cambios en | Verificación |
| --- | --- |
| Mobile | `npm run lint`, `npm run typecheck` y `npm test -- --runInBand`. Si cambia una pantalla o un flujo, pruébalo en el emulador o dispositivo correspondiente. Para un componente del catálogo, usa `npm run storybook` en lugar del Metro normal y recarga la app. |
| Backend | `npm run lint`, `npm run build` y `npm test -- --runInBand`. Para API o persistencia, ejecuta `npm run test:e2e -- --runInBand` con `DATABASE_URL` configurada para una base local de pruebas. |
| Web | `npm run lint`, `npm test` (Vitest) y `npm exec -- tsc --noEmit --incremental false`. Para cambios de UI, abre la página afectada en el navegador. Para cambios de empaquetado, ejecuta `npm run build`. |
| Plataforma | `docker compose config --quiet`. Si cambia cómo arranca un servicio, levántalo y comprueba que responda. |

Para probar autenticación en móvil, inicia PostgreSQL y el backend desde la raíz con `docker compose up -d postgres minka-backend`. Desde `minka-mobile`, ejecuta `npm start` en una terminal y `npm run android` en otra. La compilación nativa de iOS se verifica desde macOS con Xcode siguiendo el README de Mobile.

## Cómo entregar cambios

1. Revisa `git diff` y `git status` en los repositorios afectados. Agrupa los cambios en commits que describan un resultado concreto.
2. Cuando corresponda publicar cambios de un submódulo, publica primero sus commits y después actualiza y publica su referencia en `minka-platform`. Así el commit al que apunta la plataforma se puede descargar.
3. En la entrega, indica qué cambió, qué comandos o flujos verificaste y qué queda pendiente por comprobar. Si una verificación falla, incluye el error relevante y el repositorio afectado.

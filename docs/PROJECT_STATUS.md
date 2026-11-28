# Estado de Minka Platform

Verificado el 2026-11-27 ejecutando los comandos de CONTRIBUTING.md.

| Repositorio | lint | typecheck / build | pruebas | Notas |
| --- | --- | --- | --- | --- |
| minka-backend | OK | `npm run build` OK | `npm test` OK (1 prueba) | e2e no ejecutado (necesita `DATABASE_URL`). |
| minka-web | OK | `tsc` y `npm run build` OK | Playwright 5/5 OK | Verificado en navegador y a 390 px. |
| minka-mobile | OK (tras corregir) | `npm run typecheck` OK | `npm test` OK (4/4, tras corregir) | Sin verificación en emulador. |
| plataforma | — | `docker compose config` OK | — | Servicios no levantados. |

## Funcionalidades (según FEATURES.md y los commits)

Terminadas e integradas en backend, web y mobile: acceso por rol, panel de bienvenida, publicación de eventos con múltiples modalidades, perfil del organizador con logo y catálogos Storybook.

En progreso: rediseño de los controles de formulario (ver HANDOFF.md).

## Deuda y riesgos conocidos

- `DB_SYNC=true` por defecto en `docker-compose.yml`: el esquema se sincroniza solo, sin migraciones versionadas por defecto.
- Backend con una sola prueba unitaria. La cobertura real está en e2e, que requiere base de datos.
- Node local 22.12.0, pero Mobile pide 22.13 o superior. Las pruebas pasaron igual.
- La base local existente no arranca con `DB_SYNC=true` (rol `admin` heredado): requiere la migración de roles.

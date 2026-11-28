# Estado de Minka Platform

Verificado el 2026-11-27 ejecutando los comandos de CONTRIBUTING.md.

| Repositorio | lint | typecheck / build | pruebas | Notas |
| --- | --- | --- | --- | --- |
| minka-backend | OK | `npm run build` OK | `npm test` OK (7 pruebas) | e2e no ejecutado (necesita `DATABASE_URL`). |
| minka-web | OK | `tsc` y `npm run build` OK | Vitest 45/45, Playwright e2e 5/5 y 453 historias OK | Verificado en navegador y a 390 px. |
| minka-mobile | OK (tras corregir) | `npm run typecheck` OK | `npm test` OK (418/418, todas las historias) | Android compila e instala; sin revisión visual en Android ni iOS. |
| plataforma | — | `docker compose config` OK | — | Servicios no levantados. |

## Funcionalidades (según FEATURES.md y los commits)

Terminadas e integradas en backend, web y mobile: acceso por rol, panel de bienvenida, publicación de eventos con múltiples modalidades, perfil del organizador con logo y catálogos Storybook. Desde el 2026-11-28 todas las pantallas (navegación incluida) se arman con los componentes del catálogo.

En progreso: rediseño de los controles de formulario (ver HANDOFF.md).

## Deuda y riesgos conocidos

- `DB_SYNC=true` por defecto en `docker-compose.yml`: el esquema se sincroniza solo, sin migraciones versionadas por defecto.
- Backend con pocas pruebas unitarias: solo `AuthService` (cuentas de organizador y registro) y el controlador raíz. El resto se cubre con e2e, que requiere base de datos.
- Node local 22.12.0, pero Mobile pide 22.13 o superior. Las pruebas pasaron igual.
- La base local ya está migrada (5 migraciones, `admin` → `super_admin`) y no contiene organizadores ni eventos.

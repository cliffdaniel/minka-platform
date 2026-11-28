# Handoff entre agentes

Última actualización: 2026-11-27, Claude Code (continúa a Codex).

## Última tarea
Codex trabajaba en corregir los controles de formulario, a petición del usuario: select, selector de fecha y de hora, input de archivo (logo) demasiado «nativo» y doble borde en todos los inputs. El usuario descartó Figma («olvidemos figma, solo haz un perfecto trabajo con la UI»). No existe un Figma propio: el Design System de referencia es `docs/design-system/`. Codex se detuvo el 2026-11-26 por límite de uso (vuelve el 1 de diciembre de 2026), justo antes de validar los controles en navegador y en Android.

## Estado (commiteado el 2026-11-27, sin push)
- Plataforma: `README.md` y `docs/design-system/{controles,design-system,reference}.css|js` modificados. Archivos nuevos: AGENTS.md, CLAUDE.md, CONTRIBUTING.md, docs/HANDOFF.md, docs/PROJECT_STATUS.md.
- minka-web: `Input`, `PasswordInput`, `SearchSelect`, `ScheduleField`, `ClockPicker`, `OrganizerProfileForm`, layout del dashboard y Storybook modificados; nuevos `Input/fields.css`, `Organizers/OrganizerLogoField.tsx` y `Organizers/upload.css`.
- minka-mobile: componentes `Input`, `PasswordInput`, `OrganizerLogoField`, `PickerSheet`, `CalendarPicker`, `ClockPicker`, `ScheduleField` y `SearchSelect` modificados.
- minka-backend: `dist/` dejó de versionarse (ya estaba en .gitignore). No hay cambios de código.

## Decisiones de esta sesión
- `minka-mobile/__tests__/App.test.tsx`: la prueba de login usa `findAllByType(Input)[0]`. `PasswordInput` ahora envuelve a `Input` y la prueba encontraba dos.
- `minka-mobile/.eslintrc.js`: `Input` se suma a las excepciones de `react/jsx-props-no-spreading`, junto a `TextInput` y `TouchableOpacity`, porque `PasswordInput` reenvía las props de `Input`.
- AGENTS.md pasa a ser la fuente neutral y CLAUDE.md la importa.

## Verificación en web (2026-11-27)
Storybook en Chrome (escritorio) y la app real con Playwright a 390 px. Un solo borde, foco visible, select, calendario y reloj funcionando. Corregido: «Noviembre De»; cuadrícula de horas sin scroll interno; fecha y hora en una columna a menos de ~330 px; el primer campo inválido queda bajo la cabecera pegajosa; `lang="es"` y título «Minka» (era «Create Next App»). La prueba de perfil espera ahora «Subir logo» en el estado vacío.

Errores de campo: resueltos con `ValidatedForm` (`src/presentation/components/Form/ValidatedForm.tsx`), que intercepta el evento `invalid`, traduce el mensaje y lo pasa a `Input` y `SearchSelect` por contexto. Cubierto por `tests/field-validation.spec.ts`.

Para correr el e2e: backend en :4000 con una base desechable, web compilada (`npm run build` + `next start`; el modo dev cuelga el evento `load` desde 127.0.0.1) y variables `MINKA_{ORGANIZER,RUNNER,ADMIN}_{EMAIL,PASSWORD}` y `MINKA_PROFILE_TEST_{EMAIL,PASSWORD}`. El backend limita los logins por minuto: usa `--workers=1` y espera entre corridas. La prueba de eventos no es idempotente con datos previos.

La base local `minka-platform_postgres_data` (`minka_db`) se migró el 2026-11-27 con `DB_SYNC=false` y `DB_MIGRATIONS_RUN=true`: se aplicaron las 5 migraciones y su único usuario, `admin@minka.pe`, pasó de `admin` a `super_admin`. Ya arranca con `DB_SYNC=true`. No hay organizadores ni eventos en esa base. El respaldo previo no se versionó.

## Pruebas de historias (2026-11-27)
- Web: `npm run test:stories` (`tests/storybook/stories.spec.ts`, config `playwright.storybook.config.ts`) recorre las 101 historias del build estático: render, `play`, consola y axe (serious y critical). Sirve el build con `python3 -m http.server` en el puerto 6007.
- Mobile: `__tests__/stories.test.tsx` renderiza las 92 historias con un compositor mínimo (aplica `args`, `render` y `decorators`). No usa `@storybook/react` porque es solo ESM y Jest 29 no lo transforma. No ejecuta los `play`.
- Defecto de producto corregido: en `SearchSelect` web, «Cargar más resultados» y «Reintentar» cerraban el popup y abortaban la carga porque el botón recibía el foco y luego se deshabilitaba. Ahora evitan el cambio de foco con `onMouseDown`.
- Historias corregidas: «Keyboard Dismissal» (el clic de `userEvent` no enfoca un `<summary>`) y «Choose Date/Time» (carrera con el `<dialog>` que tarda en desmontarse). `asyncUtilTimeout` sube a 5 s en `.storybook/preview.tsx`.
- No se volvió a correr el e2e de Playwright tras el cambio en `SearchSelect`.

## Pruebas ejecutadas
Ver tabla en [PROJECT_STATUS.md](PROJECT_STATUS.md). Todo lo ejecutado pasa. Falta la verificación visual.

## Pendiente, por orden
1. Verificar los controles en el navegador (foco, error, deshabilitado, subida del logo, calendario y reloj) a anchos móvil, tablet y escritorio. Comprobar que ya no hay doble borde.
2. Verificar lo mismo en Android (`docker compose up -d postgres minka-backend`, luego `npm start` y `npm run android` en `minka-mobile`).
3. Ejecutar `npm run test:e2e` en minka-web con el backend arriba.
4. Confirmar que el catálogo `docs/design-system/` coincide con los controles implementados.
5. Push: submódulos primero y plataforma después, solo con aprobación del usuario.
6. Android e iOS: el usuario decidió cerrar el desarrollo sin verificación en emulador. Sí se comprobó que Android compila e instala (`npm run android`, emulador `MinkaPhone`, `BUILD SUCCESSFUL`), pero los controles de Mobile no se revisaron visualmente en Android ni en iOS. Queda como verificación pendiente antes de publicar una versión móvil.

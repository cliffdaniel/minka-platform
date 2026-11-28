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

## Pruebas ejecutadas
Ver tabla en [PROJECT_STATUS.md](PROJECT_STATUS.md). Todo lo ejecutado pasa. Falta la verificación visual.

## Pendiente, por orden
1. Verificar los controles en el navegador (foco, error, deshabilitado, subida del logo, calendario y reloj) a anchos móvil, tablet y escritorio. Comprobar que ya no hay doble borde.
2. Verificar lo mismo en Android (`docker compose up -d postgres minka-backend`, luego `npm start` y `npm run android` en `minka-mobile`).
3. Ejecutar `npm run test:e2e` en minka-web con el backend arriba.
4. Confirmar que el catálogo `docs/design-system/` coincide con los controles implementados.
5. Push: submódulos primero y plataforma después, solo con aprobación del usuario.
6. Verificación en Android e iOS: el usuario la pidió después de la de web.

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

## Sistema de diseño (HTML)
Actualizado el 2026-11-27 para reflejar lo hecho en la sesión: errores de campo propios (`accesibilidad.html`, `patrones.html`), pruebas de historias y la regla del foco en listas remotas (`equipo.html`, `accesibilidad.html`) y el campo de subida de logo con su estado vacío (`patrones.html`, `patrones.js`, `.sr-only` en `controles.css`). El prototipo del logo ahora usa `.minka-upload*` en lugar del `<input type="file">` nativo. Verificado solo con comprobaciones del DOM en un navegador; no se revisó el aspecto visual de las páginas.

## Sistema de diseño completo (2026-11-28)
El usuario pidió un catálogo real: antes había 2 átomos y 7 moléculas, sin paleta ni tipografía visibles. Ahora, en Web y Mobile, con los nombres de [inventario.md](design-system/inventario.md):
- 8 fundamentos (Colors con hex y contraste WCAG, Typography, Spacing, Radius, Elevation, Layout, Motion, Iconography).
- 56 átomos, 22 moléculas, 16 organismos y 3 plantillas. Se eliminó el nivel Páginas; sus interacciones pasaron a `Organisms/AuthForm`, `OrganizerForm` y `EventForm`.
- Web: componentes en `minka-web/src/presentation/components/ui/` con estilos solo con tokens (`ui.css`), historias en `src/stories/{foundations,atoms,molecules,organisms,templates}`. Mobile: `src/presentation/components/{ui,molecules,organisms}` y `src/theme/tokens.ts`.
- Web tiene la capa de tokens generada (`tokens.css`); antes definía 10 variables y usaba hex sueltos. `.account-theme` ahora alias de los tokens.
- Pruebas: Web 360 historias en navegador (`npm run test:stories`), 31 unitarias (Vitest) y 5 e2e; Mobile 263 pruebas, incluidas todas las historias y la sincronización con `tokens.json`.
- Se corrigieron defectos que las pruebas encontraron: Chip con botón anidado, spinner con `role="status"` dentro de Button y `FormField` pasando `invalid` a un `<input>`.

Decisiones abiertas:
- **Tipografía:** resuelta el 2026-11-28, Geist es la oficial. Ver la sección siguiente.
- Mobile dibuja los íconos con `View` porque no hay `react-native-svg`; los de disciplina son monogramas, no pictogramas. Las historias de Mobile no ejecutan `play` y no se vieron en emulador.
- Web no tiene ningún componente que use los átomos nuevos fuera de Storybook salvo `Button`: el resto de la app sigue con sus estilos y se migrará por pantallas.
- El respaldo `minka_db_before_roles.sql` del scratchpad se perdió en una limpieza del directorio. La migración ya estaba verificada.

## Tipografía oficial: Geist (2026-11-28)
- `tokens.json` (v0.3) gana el grupo `font` (`sans`, `mono`). Web lo recibe en `tokens.css`; la hoja de la app y `ui.css` usan `var(--font-geist-sans, Geist)` para que Storybook y la app compartan la misma cadena de respaldo.
- Storybook web carga Geist con archivos locales (`.storybook/fonts`, `preview-head.html`), sin depender de la red. El sitio de documentación y los diagramas también (`docs/design-system/fonts`).
- Mobile: seis TTF en `assets/fonts` enlazados a Android (`android/app/src/main/assets/fonts`) e iOS (`UIAppFonts` y el proyecto Xcode) con `react-native-asset`. `applyGlobalFont()` sustituye `Text` y `TextInput` de `react-native` para elegir el archivo según el peso. Se verificó con una prueba que renderiza ambos. **No se probó en un emulador ni en un dispositivo, y el proyecto iOS no se compiló.**
- Limitación: Geist no tiene un ExtraBold estático, así que en Mobile el peso display usa Bold.

## Organismos genéricos y padding de Storybook (2026-11-28)
- El usuario rechazó los organismos por ser específicos de Minka. Ahora hay 16 organismos genéricos en Web y Mobile (Navbar, Sidebar, TabBar, Footer, Hero, PageHeader, Form, FilterBar, DataTable, Dialog, Drawer, CollectionView, StatsGrid, Accordion, Wizard, Timeline) con datos neutros en sus historias. Lo específico pasó a `Product/` sin cambiar su lógica. Moléculas nuevas: Card, DropdownMenu, AvatarGroup y un FileUpload genérico que `OrganizerLogoField` compone.
- `Dialog` web no se centraba porque el reset de Tailwind quita el `margin: auto` de `<dialog>`. Corregido y con una historia que lo comprueba.
- Padding: la envoltura del tema en `.storybook/preview.tsx` pone el fondo y 24 px de padding en Docs y en cada historia; `preview-head.html` anula los márgenes propios de Storybook (incluido un borde transparente de 8 px del zoom). Se midieron 1.112 vistas (todas las historias y páginas de Docs a 1000 y 390 px): ninguna con contenido a menos de 24 px del borde. Se corrigieron Tabs, Stepper, Wizard, Pagination, FileUpload y Skeleton en pantallas estrechas.
- Resuelto el 2026-11-28 (sección siguiente).

## Todo el producto compone el catálogo (2026-11-28)
- **Navegación del dashboard (Web y Mobile).** `DashboardShell` usa la plantilla genérica `DashboardLayout`:
  - `AppSidebar` es `Sidebar` con `collapsed="auto"`, que pasa a riel en tablet;
  - `AppTabBar` es `TabBar`;
  - `AppTopBar` es `Navbar` con `IconButton` para volver y `Button` «Nuevo evento»;
  - `AccountMenu` es `DropdownMenu` con `Avatar`;
  - en Web, cerrar sesión va en `SignOutAccountMenu`. `shell.css` quedó solo con ajustes de producto.
- **Cambios en componentes genéricos:**
  - Web: `href` y `linkAs` en `Button`, `IconButton`, `MenuItem`, `DropdownMenu`, `Navbar`, `Sidebar` y `TabBar`, para usar `next/link`. `Navbar.leading`, `DropdownMenu.header`, `Sidebar collapsed="auto"`.
  - Plantillas genéricas `DashboardLayout` y `AuthLayout` (Web y Mobile). `Panel` pasó al catálogo de moléculas.
  - Mobile: `DropdownMenu` en modo `sheet`, y `Avatar`, `Card`, `Dialog`, `Navbar` y `TabBar` con props nuevas. Se eliminó `PickerSheet`; `Dialog` lo reemplaza.
- **Resto del producto.** Hero, panel, tarjetas, listas, usuarios, formularios, acceso, perfil del organizador y portada se rearmaron con átomos, moléculas y organismos del catálogo (ver la tabla de Producto en el inventario). La portada web usa la marca verde.
- **Contrato que cambió en Web:**
  - `DashboardShell` ya no recibe `accountAction`; acepta `account` opcional para Storybook.
  - Las opciones del menú de la cuenta son `menuitem`, y las e2e se actualizaron.
  - `Button` ya no es `'use client'`, para poder recibir `linkAs` desde páginas de servidor.
- **Pendiente menor (Web):** `Hero` sin `eyebrow`, `Grid` sin auto-fit, `Inline` sin `justify` y la falta de un componente fieldset/legend se resuelven hoy con estilos puntuales en producto.

## Organizador en los eventos y página pública (2026-11-28)
- **Backend:**
  - Cada evento lleva `organizer` (`id`, `name`, `city`, `logoUrl`): en `/api/events`, `/upcoming`, `/:id` y en `races` de `/api/dashboard`.
  - `logoUrl` es relativo a la API y versionado.
  - Endpoints públicos nuevos: `GET /api/organizers/{id}` y `GET /api/organizers/{id}/logo`.
  - Arquitectura:
    - puerto `OrganizerDirectory` en `users/domain` y adaptador TypeORM, que calcula el resumen en una sola consulta y la versión del logo con `md5` en SQL;
    - `EventPresenter` en `events`;
    - caso de uso `GetOrganizerPage` en el módulo nuevo `organizers`.
- **Web:**
  - Página pública en `/organizadores/{id}`.
  - `EventCard` muestra «Organiza …».
  - `Link` acepta `linkAs`; `Avatar` acepta `decorative`. Mobile no tiene `decorative`.
- **Mobile:**
  - `EventCard` con el organizador y pantalla `Organizer`.
  - `ListItem.accessibilityLabel`.
  - El logo de las historias usa `placehold.co`: sin red no se ve en Storybook.
- **Pendiente:** el logo sigue guardado como base64 en la base. Moverlo a almacenamiento de archivos cambiaría solo el adaptador y el endpoint del logo.


Ver tabla en [PROJECT_STATUS.md](PROJECT_STATUS.md). Todo lo ejecutado pasa. Falta la verificación visual.

## Pendiente, por orden
1. Verificar los controles en el navegador (foco, error, deshabilitado, subida del logo, calendario y reloj) a anchos móvil, tablet y escritorio. Comprobar que ya no hay doble borde.
2. Verificar lo mismo en Android (`docker compose up -d postgres minka-backend`, luego `npm start` y `npm run android` en `minka-mobile`).
3. Ejecutar `npm run test:e2e` en minka-web con el backend arriba.
4. Confirmar que el catálogo `docs/design-system/` coincide con los controles implementados.
5. Push: submódulos primero y plataforma después, solo con aprobación del usuario.
6. Android e iOS: el usuario decidió cerrar el desarrollo sin verificación en emulador. Sí se comprobó que Android compila e instala (`npm run android`, emulador `MinkaPhone`, `BUILD SUCCESSFUL`), pero los controles de Mobile no se revisaron visualmente en Android ni en iOS. Queda como verificación pendiente antes de publicar una versión móvil.

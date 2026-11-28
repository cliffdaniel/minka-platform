# Inventario del sistema de diseño Minka

Fuente única de qué componentes existen y cómo se llaman. Web y Mobile implementan **los mismos nombres**, con los tokens de [tokens.json](tokens.json). Los textos visibles van en español; los nombres de componentes, props y títulos de Storybook van en inglés, como en cualquier sistema de diseño.

## Reglas

- Niveles de Atomic Design en Storybook: `Foundations`, `Atoms`, `Molecules`, `Organisms`, `Templates`. No hay nivel `Pages`: una pantalla es una composición de plantillas y no pertenece al catálogo.
- Título de historia: `Atoms/Button`, `Molecules/FormField`, etc. Un archivo de historias por componente.
- Un átomo no importa otros átomos con lógica propia. Una molécula compone átomos. Un organismo compone moléculas y átomos.
- Colores, espaciado, radios, tamaños de texto, sombras y tiempos salen de los tokens. Nada de hex sueltos en componentes.
- No se cambia la identidad visual (verde `#265846`) ni la tipografía de la app.
- Cada componente documenta sus variantes, estados (normal, foco, deshabilitado, error, carga cuando aplique) y tamaños en historias.

## Fundamentos (Foundations)

| Historia | Contenido |
| --- | --- |
| `Foundations/Colors` | Todos los colores de `tokens.json` agrupados (marca, neutros, estados), con nombre, valor y contraste contra el fondo. |
| `Foundations/Typography` | Escala (caption, label, body, section, display), pesos, interlineados y la familia real de la app. |
| `Foundations/Spacing` | Escala `space.1` a `space.12` con su medida visual. |
| `Foundations/Radius` | `compact`, `field`, `panel`, `hero`, `pill`. |
| `Foundations/Elevation` | Sombras y capas (`layers`). |
| `Foundations/Layout` | Anchos de barra, rail, altura de barras, tamaño mínimo de toque, breakpoints. |
| `Foundations/Motion` | Duraciones `fast` y `standard`. |
| `Foundations/Iconography` | Todos los íconos del sistema en una cuadrícula con su nombre. |

## Átomos (Atoms), 56

| # | Nombre | Variantes y props principales |
| --- | --- | --- |
| 1 | `Button` | `variant`: primary, secondary, outline, ghost, danger. `size`: sm, md, lg. `loading`, `disabled`, `leadingIcon`, `fullWidth` |
| 2 | `IconButton` | `icon`, `label` (accesible), `variant`, `size` |
| 3 | `Link` | `href`, `tone`: brand, muted. `external` |
| 4 | `Input` | `type`, `size`, `invalid`, `disabled`, `leading`, `trailing` |
| 5 | `Textarea` | `rows`, `invalid`, `disabled`, `maxLength` con contador |
| 6 | `Select` | opciones nativas, `invalid`, `disabled`, `placeholder` |
| 7 | `Checkbox` | `checked`, `indeterminate`, `disabled`, `invalid` |
| 8 | `Radio` | `checked`, `disabled` |
| 9 | `Switch` | `checked`, `disabled`, `size` |
| 10 | `Slider` | `min`, `max`, `step`, `value`, `disabled` |
| 11 | `Label` | `required`, `optional` |
| 12 | `HelperText` | texto de ayuda de campo |
| 13 | `ErrorText` | mensaje de error de campo, `role="alert"` |
| 14 | `Icon` | `name`, `size`, `tone` |
| 15 | `Badge` | `tone`: neutral, brand, success, warning, danger, info. `size` |
| 16 | `StatusDot` | `tone`, `pulse` |
| 17 | `Counter` | número con tope (`99+`) |
| 18 | `Tag` | etiqueta de texto, `tone` |
| 19 | `Chip` | `selected`, `removable`, `disabled` |
| 20 | `Avatar` | `src`, `name` (iniciales), `size` |
| 21 | `Logo` | marca Minka, `variant`: full, mark |
| 22 | `Spinner` | `size`, `tone` |
| 23 | `Skeleton` | `shape`: line, block, circle |
| 24 | `ProgressBar` | `value`, `max`, `tone` |
| 25 | `ProgressCircle` | `value`, `size` |
| 26 | `Divider` | `orientation`, `label` |
| 27 | `Heading` | `level` 1-4, `tone` |
| 28 | `Text` | `size`: body, label, caption. `weight`, `tone` |
| 29 | `Caption` | texto secundario pequeño |
| 30 | `Kbd` | tecla de teclado |
| 31 | `InlineCode` | código en línea |
| 32 | `Tooltip` | `content`, `placement` |
| 33 | `Surface` | `elevation`: flat, raised. `padding`, `radius` |
| 34 | `Stack` | apila con `gap` y `align` |
| 35 | `Inline` | fila con `gap`, `wrap`, `align` |
| 36 | `Grid` | columnas con `gap` |
| 37 | `Container` | ancho máximo centrado |
| 38 | `Spacer` | espacio fijo con token |
| 39 | `Image` | `src`, `alt`, `ratio`, `fit` |
| 40 | `Thumbnail` | imagen cuadrada con borde y radio |
| 41 | `VisuallyHidden` | texto solo para lectores de pantalla |
| 42 | `SkipLink` | salto al contenido |
| 43 | `Time` | fecha y hora en horario de Perú |
| 44 | `ToggleButton` | `pressed`, `variant` |
| 45 | `Tab` | `selected`, `disabled` |
| 46 | `MenuItem` | `icon`, `tone`, `disabled` |
| 47 | `ListItem` | `leading`, `trailing`, `selected` |
| 48 | `Breadcrumb` | un tramo del camino, `current` |
| 49 | `PaginationButton` | `page`, `current`, `disabled` |
| 50 | `Rating` | `value`, `max`, solo lectura |
| 51 | `FocusRing` | demostración y utilidad del foco |
| 52 | `Banner` | franja de aviso, `tone` |
| 53 | `DisciplineIcon` | running, athletics, trail, triathlon, duathlon, cycling, swimming, fitness, other |
| 54 | `DisciplineBadge` | disciplina con ícono y nombre |
| 55 | `EventStatusBadge` | draft, published, completed, cancelled |
| 56 | `RoleBadge` | super_admin, organizer, runner |

## Moléculas (Molecules), 22

`FormField` (etiqueta, campo, ayuda y error), `PasswordInput`, `SearchField`, `SearchSelect`, `DatePicker`, `TimePicker`, `ScheduleField`, `DisciplineSelect`, `FileUpload`, `Alert`, `Toast`, `Breadcrumbs`, `Pagination`, `Tabs`, `SegmentedControl`, `ButtonGroup`, `Stepper`, `EmptyState`, `StatCard`, `AccountMenu`, `EventProgramDetails`, `Panel`.

## Organismos (Organisms), 14

`EventForm`, `EventCard`, `EventList`, `OrganizerProfileForm`, `OrganizerForm`, `AuthForm`, `Dialog`, `DataTable`, `Sidebar`, `TabBar`, `TopBar`, `DashboardHero`, `DashboardOverview` y `UsersPanel`. Mobile añade `EventPanel` (el panel de eventos con carga y error); en Web ese comportamiento vive en `EventList`.

## Plantillas (Templates), 3

`DashboardLayout` (con navegación por rol), `AuthLayout`, `FormLayout`.

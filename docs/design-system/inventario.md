# Inventario del sistema de diseño Minka

Fuente única de qué componentes existen y cómo se llaman. Web y Mobile implementan **los mismos nombres**, con los tokens de [tokens.json](tokens.json). Los textos visibles van en español; los nombres de componentes, props y títulos de Storybook van en inglés, como en cualquier sistema de diseño.

## Reglas

- Niveles de Atomic Design en Storybook: `Foundations`, `Atoms`, `Molecules`, `Organisms`, `Templates`. No hay nivel `Pages`: una pantalla es una composición de plantillas y no pertenece al catálogo.
- Título de historia: `Atoms/Button`, `Molecules/FormField`, etc. Un archivo de historias por componente.
- Un átomo no importa otros átomos con lógica propia. Una molécula compone átomos. Un organismo compone moléculas y átomos.
- Colores, espaciado, radios, tamaños de texto, sombras y tiempos salen de los tokens. Nada de hex sueltos en componentes.
- No se cambia la identidad visual (verde `#265846`). La tipografía oficial es **Geist** (y **Geist Mono** para código y teclas), en Web, Android e iOS; los tokens `font.sans` y `font.mono` de `tokens.json` la definen. Los archivos están en `docs/design-system/fonts/` (Web y documentación), `minka-web/.storybook/fonts/` (Storybook) y `minka-mobile/assets/fonts/` (Mobile), con su licencia OFL.
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
| 1 | `Button` | `variant`: primary, secondary, outline, ghost, danger. `size`: sm, md, lg. `loading`, `disabled`, `leadingIcon`, `fullWidth`. Con `href` es un enlace con el mismo aspecto |
| 2 | `IconButton` | `icon`, `label` (accesible), `variant`, `size`. Con `href` es un enlace |
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
| 46 | `MenuItem` | `icon`, `tone`, `disabled`, `href` |
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

Piezas genéricas que componen átomos. Ninguna conoce el dominio de Minka.

`FormField`, `PasswordInput`, `SearchField`, `SearchSelect`, `DatePicker`, `TimePicker`, `ScheduleField`, `FileUpload` (genérico: `label`, `help`, `accept`, `preview`, `error`), `Alert`, `Toast`, `Breadcrumbs`, `Pagination`, `Tabs`, `SegmentedControl`, `ButtonGroup`, `Stepper`, `EmptyState`, `StatCard`, `Panel`, `Card` (`media`, `title`, `meta`, `actions`), `DropdownMenu` (disparador + `MenuItem`, `header`, opciones con `href`) y `AvatarGroup`. `Panel` (`title`, `description`, `action`, `id`) vive en el catálogo, no en el producto.

## Organismos (Organisms), 16

Secciones completas que componen moléculas y átomos. **Son genéricos: reciben datos y contenido por props y no conocen eventos, organizadores ni roles.** Si un componente nombra algo de Minka, es de producto y va en el grupo `Product`.

**Enlaces del router.** `Button`, `IconButton`, `MenuItem`, `DropdownMenu`, `Navbar`, `Sidebar` y `TabBar` aceptan `href` y, en Web, `linkAs` (por defecto `a`; la app pasa `next/link` para navegar sin recargar). En Mobile la navegación va por `onPress`/`onSelect`.

| Nombre | Para qué sirve | Props principales |
| --- | --- | --- |
| `Navbar` | Barra superior | `brand`, `leading` (por ejemplo volver), `items` (`label`, `href`, `current`), `actions`, `onMenu` en pantallas pequeñas |
| `Sidebar` | Navegación lateral | `sections` (`title`, `items` con `id`, `label`, `icon`, `href`, `current`, `badge`), `collapsed` (`true` o `'auto'`: riel en tablet), `header`, `footer` |
| `TabBar` | Destinos principales en móvil | `items` (`id`, `label`, `icon`, `badge`, `href`), `value`, `onChange` |
| `Footer` | Pie de página | `brand`, `columns` (`title`, `links`), `legal` |
| `Hero` | Bloque de bienvenida | `title`, `description`, `actions`, `media`, `align` |
| `PageHeader` | Cabecera de pantalla | `title`, `description`, `breadcrumbs`, `status`, `actions` |
| `Form` | Formulario por campos | `fields` (`type`: text, email, password, textarea, select, checkbox, switch; `name`, `label`, `required`, `helper`, `options`), `onSubmit(values)`, `submitLabel`, `pending`, `error` y validación con mensajes |
| `FilterBar` | Búsqueda y filtros | `search`, `filters` (`id`, `label`, `options`), `value`, `onChange`, `onClear` |
| `DataTable` | Tabla de datos | `columns`, `rows`, `rowKey`, `sort`, `onSortChange`, `loading`, `emptyTitle` |
| `Dialog` | Diálogo modal centrado | `open`, `title`, `onClose`, `children`, `actions` |
| `Drawer` | Panel lateral | `open`, `side`, `title`, `onClose`, `children`, `actions` |
| `CollectionView` | Lista o cuadrícula con estados | `items`, `renderItem`, `layout`, `loading`, `error`, `onRetry`, `emptyTitle` |
| `StatsGrid` | Cuadrícula de métricas | `title`, `stats` (`label`, `value`, `delta`, `tone`, `icon`) |
| `Accordion` | Secciones plegables | `items` (`id`, `title`, `content`), `multiple` |
| `Wizard` | Flujo por pasos | `steps` (`id`, `label`, `content`, `valid`), `onFinish`, `value` |
| `Timeline` | Línea de actividad | `items` (`id`, `title`, `description`, `time`, `icon`, `tone`) |

## Producto (Product)

Componentes que usan el vocabulario de Minka. Se documentan en Storybook bajo `Product/` para probarlos, pero **no forman parte del sistema de diseño**: son envoltorios finos que **componen** los componentes genéricos de arriba y no traen estilos propios de navegación, paneles ni formularios.

| Producto | Compone |
| --- | --- |
| `DashboardShell` | Plantilla `DashboardLayout` con `AppSidebar`, `AppTopBar` y `AppTabBar` |
| `AppSidebar` | `Sidebar` con `collapsed="auto"`, `Logo` y los destinos del rol |
| `AppTabBar` | `TabBar` con los destinos del rol |
| `AppTopBar` | `Navbar` con `IconButton` para volver, el título, `Button` «Nuevo evento» y el menú de la cuenta |
| `AccountMenu` | `DropdownMenu` con `Avatar`, nombre y rol en `header`, perfil y cierre de sesión |
| `AuthPageLayout` | Plantilla `AuthLayout` con `Logo` y la foto de Minka |
| `DashboardHero`, `DashboardOverview` | `Hero` y `StatsGrid` |
| `EventCard`, `EventList`, `UsersPanel` | `Card`, `CollectionView`, `ListItem` con `Avatar` y `RoleBadge` |
| `EventForm`, `OrganizerForm`, `OrganizerProfileForm`, `AuthForm` | `FormField`, `Input`, `Textarea`, `Stack`, `Inline`, `Alert` |
| `EventProgramDetails`, `DisciplineSelect` | `Accordion`, `Surface`, `Time`, `Link`, `SearchSelect` |

## Plantillas (Templates), 3

Genéricas, con zonas por props:

- `DashboardLayout`: `sidebar`, `topbar` y `tabbar`. La barra superior queda fija. El lateral se oculta y aparece `tabbar` en móvil. Incluye el salto al contenido.
- `AuthLayout`: `brand`, `title`, `description`, `media` y el formulario como hijo.
- `FormLayout`: `title`, `description`, `aside`.

Mobile implementa `DashboardLayout` (`topbar`, `sidebar`, `tabbar`, `wideFrom`) y `AuthLayout` (`brand`, `tagline`, `footnote`) con los mismos nombres.

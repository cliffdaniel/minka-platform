# Funcionalidades de Minka

Actualiza este registro cuando agregues o cambies una funcionalidad. Describe quién la usa, en qué superficies está disponible y qué endpoints la respaldan. El contrato de la API vive en Swagger UI (`/api/docs`) y OpenAPI JSON (`/api/docs-json`).

## Acceso por rol y panel de bienvenida

Disponible en Web, Mobile y Backend. El usuario ingresa con correo y contraseña. El backend valida su sesión y carga el panel correspondiente a su rol.

| Rol | Acceso en Web y Mobile |
| --- | --- |
| Super administrador (`super_admin`) | Puede consultar todas las cuentas y carreras, dar de alta organizadores y publicar carreras. |
| Organizador (`organizer`) | Puede publicar carreras de running y consultar las que creó. |
| Runner (`runner`) | Puede registrarse por su cuenta y consultar las próximas carreras publicadas. |

El rol se asigna en el backend. El alta pública crea únicamente runners. El super administrador inicial se habilita con `MINKA_ADMIN_PASSWORD`. Web guarda la sesión en una cookie `HttpOnly` y Mobile usa el almacén seguro del dispositivo. El cierre de sesión revoca el token en el backend.

El panel de bienvenida usa una interfaz clara en Web y Mobile. Muestra el resumen de carreras del rol, una lista con sus estados y un acceso directo a la publicación para organizadores y super administradores. En Web, los formularios de acceso y del panel se montan en el navegador para evitar que los cambios de autocompletado en el HTML inicial interrumpan la hidratación.

La navegación principal usa Inicio y Carreras en los tres roles, y Usuarios para el super administrador. Web ofrece sidebar en escritorio, rail en tableta y tabs en pantallas estrechas. Mobile usa una barra superior y tabs con áreas seguras. El menú de cuenta contiene el cierre de sesión. «Nueva carrera» abre el formulario en una pantalla propia en Mobile y Web estrecha. En escritorio lleva al formulario junto al listado. Los componentes y sus estados se pueden revisar en Storybook.

## Publicación de carreras

El organizador o el super administrador ingresa el nombre, la ciudad, el lugar de partida y una fecha futura. La carrera queda publicada al guardarse. Los formularios muestran la hora de Perú y la API recibe una fecha ISO 8601 con zona horaria. El autor se toma de la sesión activa.

| Endpoint | Acceso y comportamiento |
| --- | --- |
| `POST /api/auth/register` | Público. Crea un runner e inicia su sesión. |
| `POST /api/auth/login` | Público. Valida credenciales y devuelve una sesión con el rol. |
| `GET /api/auth/me` | Sesión activa. Devuelve el perfil autenticado. |
| `POST /api/auth/logout` | Token Bearer. Revoca la sesión. |
| `GET /api/dashboard` | Sesión activa. Devuelve el perfil y los datos asignados al rol. |
| `GET /api/users` y `GET /api/users/{id}` | Super administrador. Devuelve perfiles de cuentas. |
| `POST /api/users/organizers` | Super administrador. Crea la cuenta de un organizador. |
| `GET /api/events`, `GET /api/events/upcoming` y `GET /api/events/{id}` | Público. Consulta carreras publicadas. |
| `POST /api/events` | Organizador o super administrador. Crea y publica una carrera. |

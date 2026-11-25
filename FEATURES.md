# Funcionalidades de Minka

Actualiza este registro cuando agregues o cambies una funcionalidad. Describe quién la usa, en qué superficies está disponible y qué endpoints la respaldan. El contrato de la API vive en Swagger UI (`/api/docs`) y OpenAPI JSON (`/api/docs-json`).

## Acceso por rol y panel de bienvenida

Disponible en Web, Mobile y Backend. El usuario ingresa con correo y contraseña. El backend valida su sesión y carga el panel correspondiente a su rol.

| Rol | Acceso en Web y Mobile |
| --- | --- |
| Super administrador (`super_admin`) | Consulta todas las cuentas y eventos, da de alta organizadores y publica eventos. |
| Organizador (`organizer`) | Publica eventos deportivos, consulta los que creó y edita el perfil de su organización. |
| Runner (`runner`) | Puede registrarse por su cuenta y consultar los próximos eventos publicados. |

El alta pública crea únicamente runners. El super administrador inicial se habilita con `MINKA_ADMIN_PASSWORD`. Web guarda la sesión en una cookie `HttpOnly` y Mobile usa el almacén seguro del dispositivo. El cierre de sesión revoca el token en el backend.

Inicio y Eventos están disponibles en los tres roles y Usuarios queda reservado para super administradores. Web ofrece sidebar, rail o pestañas según el tamaño. Mobile usa una barra superior y pestañas con áreas seguras. El menú de cuenta contiene el cierre de sesión y da acceso al perfil del organizador.

## Publicación de eventos deportivos

«Nuevo evento» abre el formulario en una pantalla propia en Mobile y Web estrecha. En escritorio lleva al formulario junto al listado. Se registran el nombre, la disciplina, la modalidad opcional, la ciudad, el lugar del evento y una fecha futura. El autor se toma de la sesión y el evento queda publicado al guardarse.

Las disciplinas disponibles incluyen running, atletismo, trail, triatlón, duatlón, ciclismo, natación, fitness competitivo y otra disciplina. La modalidad permite distinguir formatos como maratón, 10K o sprint. Los eventos anteriores conservan su información y quedan clasificados como running. Los formularios muestran la hora de Perú y la API recibe una fecha ISO 8601 con zona horaria.

## Perfil del organizador

Disponible desde el menú de cuenta en Web y Mobile. El organizador puede guardar su nombre público, razón social, ciudad, correo de contacto, sitio web, descripción y un logo PNG o JPG de hasta 512 KB. El nombre público es obligatorio y los demás campos son opcionales. El logo se puede reemplazar o quitar. El perfil se guarda por separado de la cuenta de acceso y solo su titular puede consultarlo y modificarlo por estos endpoints.

## Endpoints

| Endpoint | Acceso y comportamiento |
| --- | --- |
| `POST /api/auth/register` | Público. Crea un runner e inicia su sesión. |
| `POST /api/auth/login` | Público. Valida credenciales y devuelve una sesión con el rol. |
| `GET /api/auth/me` | Sesión activa. Devuelve la cuenta autenticada. |
| `POST /api/auth/logout` | Token Bearer. Revoca la sesión. |
| `GET /api/dashboard` | Sesión activa. Devuelve la cuenta y los datos asignados al rol. Conserva la clave `races` para clientes existentes e incluye eventos de todas las disciplinas. |
| `GET /api/users` y `GET /api/users/{id}` | Super administrador. Devuelven cuentas. |
| `POST /api/users/organizers` | Super administrador. Crea la cuenta de un organizador. |
| `GET /api/users/organizers/me/profile` | Organizador autenticado. Devuelve su perfil o los valores iniciales de su cuenta. |
| `PUT /api/users/organizers/me/profile` | Organizador autenticado. Guarda su perfil. Omitir `logoDataUrl` conserva el logo y enviar `null` lo quita. |
| `GET /api/events`, `GET /api/events/upcoming` y `GET /api/events/{id}` | Público. Consultan eventos publicados. |
| `POST /api/events` | Organizador o super administrador. Crea y publica un evento con disciplina y modalidad opcional. Si un cliente anterior omite la disciplina, se usa running. |

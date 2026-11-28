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

«Nuevo evento» abre el formulario en una pantalla propia en Mobile y Web estrecha. En escritorio lleva al formulario junto al listado. Se registran el nombre, la disciplina, la ciudad, el lugar de inicio y la fecha y hora de inicio. La llegada y la fecha y hora de fin son opcionales. Un evento puede durar horas o abarcar varios días. El autor se toma de la sesión.

Cada modalidad puede indicar su nombre, categorías, salida, llegada, fechas y horas propias y un enlace a un trayecto público de Garmin Connect. Sin horario de inicio o lugar propio se usan los datos generales correspondientes. Si se indica fin para el evento, la programación de sus modalidades debe quedar dentro de ese intervalo. Web y Mobile muestran los detalles y enlaces en el listado del rol. El horario se captura con el calendario y el selector de hora de Minka y se muestra en hora de Perú. Se puede escribir la fecha u hora directamente. La disciplina usa un selector autocompletable con búsqueda local.

Las disciplinas incluyen running, atletismo, trail, triatlón, duatlón, ciclismo, natación, fitness competitivo y otra disciplina. La migración conserva el evento y convierte la modalidad anterior en un elemento de la lista. En la API, `modality` sigue disponible para clientes anteriores y corresponde a la primera modalidad.

## Perfil del organizador

Disponible desde el menú de cuenta en Web y Mobile. El organizador puede guardar su nombre público, razón social, ciudad, correo de contacto, sitio web, descripción y un logo PNG o JPG de hasta 512 KB. El nombre público es obligatorio y los demás campos son opcionales. El logo se puede reemplazar o quitar. El perfil se guarda por separado de la cuenta de acceso y solo su titular puede consultarlo y modificarlo por estos endpoints.

## Validación de formularios

Los formularios de Web (acceso, registro, evento, organizador y perfil) muestran los errores de campo con el estilo de Minka y en español, junto al campo y con `aria-invalid`. Al enviar con errores el foco pasa al primer campo inválido. El error desaparece al editar el campo. Mobile ya mostraba sus errores en línea.

## Catálogos de interfaz

Storybook Web y Mobile organizan los componentes de producción y sus composiciones por fundamentos, átomos, moléculas, organismos, plantillas y páginas. Cubren los tres roles, navegación, acceso, registro runner, usuarios, perfil y eventos con sus horarios y modalidades. Las historias usan datos de demostración para enviar formularios y revisar validación, carga, errores, reintento y confirmaciones de forma aislada. Web incluye documentación de componentes, tamaños de vista, pruebas de interacción y el panel de accesibilidad. El selector autocompletable muestra variantes de búsqueda local y remota paginada con un endpoint simulado. Consulta la [guía de Storybook](docs/design-system/equipo.html#storybook).

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
| `GET /api/events`, `GET /api/events/upcoming` y `GET /api/events/{id}` | Público. Consultan eventos publicados con horarios, lugares y modalidades. `upcoming` incluye eventos futuros y en curso. |
| `POST /api/events` | Organizador o super administrador. Crea y publica un evento con programación y modalidades opcionales. Si un cliente anterior omite la disciplina, se usa running. |

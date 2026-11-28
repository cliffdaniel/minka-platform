# Instrucciones para agentes (Codex, Claude Code y otros)

Fuente compartida. Lee primero [CONTRIBUTING.md](CONTRIBUTING.md): estructura, estándar de código, arquitectura DDD/Clean, verificación por repositorio y entrega. Después lee [docs/HANDOFF.md](docs/HANDOFF.md) para saber dónde quedó el trabajo y [FEATURES.md](FEATURES.md) para las funcionalidades y endpoints.

## Contexto rápido

- `minka-platform` es el orquestador (Docker Compose + submódulos Git). Los tres submódulos tienen su propio historial: `minka-backend` (NestJS + PostgreSQL, rama `main`), `minka-web` (Next.js, rama `master`) y `minka-mobile` (React Native, rama `main`).
- El Design System vive en [docs/design-system/](docs/design-system/index.html) (tokens en `tokens.json` y `tokens.css`). Web y Mobile lo implementan con Storybook. No se crean colores, tipografías ni componentes fuera de él. No hay archivo Figma propio: no uses Figma como referencia.
- Diagramas de arquitectura y de base de datos: [docs/diagramas/](docs/diagramas/index.html).

## Reglas que no se pueden fallar

- Revisa `git status` antes de editar y conserva cambios ajenos (de Codex, de Claude o del usuario). Sin `reset --hard`, `clean`, `push --force`, push ni merge sin autorización.
- Un cambio que cruza submódulos se publica primero en el submódulo y luego se actualiza la referencia en la plataforma.
- `minka-backend/dist` es salida de build y no se versiona. Nunca lo agregues con `git add -f`.
- Sin migraciones destructivas, sin `docker compose down -v`, sin cambiar puertos. `DB_SYNC` es `true` por defecto en el compose: no lo uses como estrategia de migración.
- Secretos solo por variables de entorno. `.env*` no se versiona.
- No elimines pruebas ni desactives reglas de lint o TypeScript para que algo pase.
- Cada funcionalidad nueva o cambiada se registra en FEATURES.md y cada endpoint en Swagger.

## Varias sesiones

Reparte por área (web, mobile, backend, design system) y no edites los mismos archivos. Si dos agentes trabajan a la vez, usa ramas o `git worktree` separados. Un cambio de contrato de API o de Design System se anota en HANDOFF.md para el otro lado.

## Al terminar un bloque de trabajo

Actualiza [docs/HANDOFF.md](docs/HANDOFF.md) y [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

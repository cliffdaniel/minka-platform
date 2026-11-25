# Minka Platform

Repositorio orquestador de la plataforma Minka. Gestiona los tres proyectos independientes via Git submodules y los levanta en conjunto mediante Docker Compose.

La [biblioteca de diagramas](docs/diagramas/index.html) reúne la arquitectura y el esquema de PostgreSQL en páginas HTML que se pueden abrir localmente en el navegador.

## Repositorios

| Proyecto | Tecnología | Puerto |
|---|---|---|
| [minka-web](./minka-web) | Next.js 15 (App Router, Tailwind CSS) | `3000` |
| [minka-backend](./minka-backend) | NestJS 11 (TypeScript) | `4000` |
| [minka-mobile](./minka-mobile) | React Native (Metro Bundler) | `8081` |

## Requisitos

- [Docker](https://www.docker.com/) >= 24
- [Docker Compose](https://docs.docker.com/compose/) >= 2
- [Git](https://git-scm.com/) >= 2.20
- [Make](https://www.gnu.org/software/make/)

## Setup inicial

### 1. Crear los repositorios en GitHub

Crea tres repositorios en GitHub (pueden ser privados):
- `minka-web`
- `minka-backend`
- `minka-mobile`

### 2. Actualizar las URLs de los submodules

Edita `.gitmodules` y reemplaza `YOUR_GITHUB_USERNAME` con tu usuario u organización de GitHub:

```bash
# Ejemplo con usuario "acme-org"
git config -f .gitmodules submodule.minka-web.url https://github.com/acme-org/minka-web.git
git config -f .gitmodules submodule.minka-backend.url https://github.com/acme-org/minka-backend.git
git config -f .gitmodules submodule.minka-mobile.url https://github.com/acme-org/minka-mobile.git
```

### 3. Hacer push de cada subrepo a GitHub

```bash
# minka-web
cd minka-web
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/minka-web.git
git push -u origin main

# minka-backend
cd ../minka-backend
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/minka-backend.git
git push -u origin main

# minka-mobile
cd ../minka-mobile
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/minka-mobile.git
git push -u origin main
```

### 4. Clonar el proyecto (en una máquina nueva)

```bash
git clone --recurse-submodules https://github.com/YOUR_GITHUB_USERNAME/minka-platform.git
cd minka-platform
make init
```

## Comandos

```bash
make up        # Levanta todos los servicios (producción)
make up-dev    # Levanta en modo desarrollo con hot reload
make down      # Detiene los servicios
make build     # Reconstruye las imágenes Docker
make logs      # Logs de todos los servicios en tiempo real
make ps        # Estado de los contenedores
make clean     # Elimina contenedores, imágenes y volúmenes
make help      # Muestra todos los comandos disponibles
```

## Variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Defecto |
|---|---|---|
| `POSTGRES_USER` | Usuario de la base de datos | `minka` |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos | `minka_secret` |
| `POSTGRES_DB` | Nombre de la base de datos | `minka_db` |
| `POSTGRES_PORT` | Puerto expuesto de Postgres | `5432` |
| `BACKEND_PORT` | Puerto del API NestJS | `4000` |
| `WEB_PORT` | Puerto del web Next.js | `3000` |
| `METRO_PORT` | Puerto del Metro bundler | `8081` |
| `NEXT_PUBLIC_API_URL` | URL pública del API (usada en el browser) | `http://localhost:4000` |

## Arquitectura

```
┌─────────────────────────────────────────────┐
│              minka-network (Docker)          │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐  │
│  │  minka-web   │───▶│  minka-backend   │  │
│  │  Next.js     │    │  NestJS API      │  │
│  │  :3000       │    │  :4000           │  │
│  └──────────────┘    └────────┬─────────┘  │
│                               │            │
│                      ┌────────▼─────────┐  │
│                      │    postgres       │  │
│                      │    :5432         │  │
│                      └──────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  minka-mobile-metro (Metro Bundler)   │  │
│  │  :8081  ◀── dispositivo físico/emu   │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Notas sobre React Native

El Metro Bundler corre dentro de Docker en el puerto `8081`. Para conectar tu dispositivo/emulador:

- **Android Emulator**: el emulador usa `10.0.2.2` como host de la máquina anfitriona. Configura la app para apuntar a `http://10.0.2.2:4000` para el API.
- **Dispositivo físico**: usa la IP local de tu máquina (`ifconfig` / `ip addr`).
- **iOS Simulator**: usa `http://localhost:4000` directamente.

## Estructura del repositorio

```
minka-platform/
├── .gitmodules            ← URLs de los tres submodules
├── docker-compose.yml     ← Orquestación producción
├── docker-compose.dev.yml ← Overrides desarrollo (hot reload)
├── .env.example           ← Template de variables de entorno
├── Makefile               ← Comandos de conveniencia
├── minka-web/             ← Submodule: Next.js
├── minka-backend/         ← Submodule: NestJS
└── minka-mobile/          ← Submodule: React Native
```

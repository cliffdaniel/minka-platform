.PHONY: help init up up-dev down build logs ps shell-backend shell-web clean

# Default target
help:
	@echo ""
	@echo "  Minka Platform — Comandos disponibles"
	@echo "  ─────────────────────────────────────"
	@echo "  make init          Inicializa/actualiza git submodules y copia .env"
	@echo "  make up            Levanta todos los servicios en producción"
	@echo "  make up-dev        Levanta todos los servicios en modo desarrollo (hot reload)"
	@echo "  make down          Detiene y elimina los contenedores"
	@echo "  make build         Reconstruye las imágenes Docker"
	@echo "  make logs          Muestra logs de todos los servicios"
	@echo "  make logs-backend  Muestra logs del backend"
	@echo "  make logs-web      Muestra logs del web"
	@echo "  make logs-mobile   Muestra logs del metro bundler"
	@echo "  make ps            Lista el estado de los contenedores"
	@echo "  make shell-backend Abre una shell en el contenedor del backend"
	@echo "  make shell-web     Abre una shell en el contenedor del web"
	@echo "  make clean         Elimina contenedores, imágenes y volúmenes"
	@echo ""

# Inicializa submodules y crea .env si no existe
init:
	@echo "→ Inicializando git submodules..."
	git submodule update --init --recursive
	@echo "→ Actualizando submodules a la última versión..."
	git submodule update --remote
	@if [ ! -f .env ]; then \
		echo "→ Creando .env desde .env.example..."; \
		cp .env.example .env; \
		echo "  ✓ .env creado. Por favor revisa y actualiza los valores."; \
	else \
		echo "  .env ya existe, omitiendo."; \
	fi

# Levanta todos los servicios (producción)
up:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker compose up -d

# Levanta todos los servicios en modo desarrollo
up-dev:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Detiene los servicios
down:
	docker compose down

# Reconstruye las imágenes
build:
	docker compose build

# Logs de todos los servicios
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f minka-backend

logs-web:
	docker compose logs -f minka-web

logs-mobile:
	docker compose logs -f minka-mobile-metro

# Estado de los contenedores
ps:
	docker compose ps

# Shell en backend
shell-backend:
	docker compose exec minka-backend sh

# Shell en web
shell-web:
	docker compose exec minka-web sh

# Limpieza total
clean:
	docker compose down --rmi all --volumes --remove-orphans

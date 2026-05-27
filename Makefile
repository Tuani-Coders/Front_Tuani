COMPOSE_FILE ?= docker-compose.dev.yml

.PHONY: help up down restart clean logs build prod dev test test-ci

help:
	@echo "Available targets:"
	@echo "  make up          Start services in detached mode using";
	@echo "                   docker compose -f $(COMPOSE_FILE) up --force-recreate --build -d"
	@echo "  make down        Stop and remove containers"
	@echo "  make restart     Restart services"
	@echo "  make clean       Remove containers, networks, images and volumes"
	@echo "  make logs        Follow container logs"
	@echo "  make build       Build images"
	@echo "  make dev         Set COMPOSE_FILE=docker-compose.dev.yml and start dev"
	@echo "  make prod        Set COMPOSE_FILE=docker-compose.yml and start production"
	@echo "  make test        Run npm test inside the app container"
	@echo "  make test-ci     Run CI tests inside the app container"

up:
	docker compose -f $(COMPOSE_FILE) up --force-recreate --build -d

down:
	docker compose -f $(COMPOSE_FILE) down

restart:
	docker compose -f $(COMPOSE_FILE) restart

clean:
	docker compose -f $(COMPOSE_FILE) down --rmi local --volumes --remove-orphans

logs:
	docker compose -f $(COMPOSE_FILE) logs -f

build:
	docker compose -f $(COMPOSE_FILE) build

dev:
	$(MAKE) COMPOSE_FILE=docker-compose.dev.yml up

prod:
	$(MAKE) COMPOSE_FILE=docker-compose.yml up

# Run tests inside the app service container. Requires npm test to be configured.
test:
	docker compose -f $(COMPOSE_FILE) run --rm app npm test

test-ci:
	CI=true docker compose -f $(COMPOSE_FILE) run --rm app npm test

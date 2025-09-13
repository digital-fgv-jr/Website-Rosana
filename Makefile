.PHONY: help build-frontend build-backend deploy-frontend deploy-backend up down logs

help:
	@echo "Available targets:"
	@echo "  build-frontend   Build only the frontend (nginx) image"
	@echo "  build-backend    Build only the backend image"
	@echo "  deploy-frontend  Up only nginx (no-deps) [BUILD=1 to build]"
	@echo "  deploy-backend   Up only backend (no-deps) [BUILD=1 to build]"
	@echo "  up               docker compose up -d (all)"
	@echo "  down             docker compose down"
	@echo "  logs             docker compose logs -f"

build-frontend:
	./scripts/build-frontend.sh

build-backend:
	./scripts/build-backend.sh

deploy-frontend:
	BUILD=$(BUILD) ./scripts/deploy-frontend.sh

deploy-backend:
	BUILD=$(BUILD) ./scripts/deploy-backend.sh

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f


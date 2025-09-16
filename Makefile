# Makefile for Docker Compose Management
.PHONY: help build up down logs clean test backup restore

# Default environment
ENV ?= dev

# Help command
help:
	@echo "Available commands:"
	@echo "  make build         - Build all Docker images"
	@echo "  make up            - Start all services (development)"
	@echo "  make up-prod       - Start all services (production)"
	@echo "  make down          - Stop all services"
	@echo "  make logs          - View logs from all services"
	@echo "  make logs-f        - Follow logs from all services"
	@echo "  make clean         - Remove all containers and volumes"
	@echo "  make test          - Run tests in containers"
	@echo "  make backup        - Backup database"
	@echo "  make restore       - Restore database from backup"
	@echo "  make ssl           - Generate SSL certificates"
	@echo "  make monitor       - Start monitoring services"

# Build images
build:
	docker-compose build

# Development environment
up:
	docker-compose up -d
	@echo "Services started! Access:"
	@echo "  Frontend: http://localhost"
	@echo "  Backend:  http://localhost:3000"
	@echo "  Database: localhost:5432"

# Production environment
up-prod:
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production services started!"

# Stop services
down:
	docker-compose down

down-prod:
	docker-compose -f docker-compose.prod.yml down

# View logs
logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f database

# Clean everything
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Run tests
test:
	docker-compose exec backend yarn test
	docker-compose exec frontend yarn test

# Database operations
backup:
	@mkdir -p backups
	docker-compose exec -T database pg_dump -U postgres appointments > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created in backups/"

restore:
	@read -p "Enter backup file name: " backup; \
	docker-compose exec -T database psql -U postgres appointments < backups/$$backup

# SSL certificates
ssl:
	docker-compose -f docker-compose.prod.yml --profile ssl-setup run --rm certbot

# Monitoring
monitor:
	docker-compose -f docker-compose.prod.yml --profile monitoring up -d
	@echo "Monitoring services started:"
	@echo "  Prometheus: http://localhost:9090"
	@echo "  Grafana:    http://localhost:3001"

# Development helpers
dev-setup:
	cp .env.example .env
	@echo "Environment file created. Please edit .env with your settings."

dev-reset:
	docker-compose down -v
	docker-compose up --build -d

# Production helpers
prod-deploy:
	git pull origin main
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml up -d

# Health checks
health:
	@echo "Checking service health..."
	@docker-compose ps
	@echo "\nTesting endpoints..."
	@curl -f http://localhost/health || echo "Frontend health check failed"
	@curl -f http://localhost:3000/health || echo "Backend health check failed"

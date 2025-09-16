# Docker Deployment Guide - Sistema de Gestión de Turnos

Este documento explica cómo desplegar el sistema completo usando Docker y Docker Compose

## 🐳 Arquitectura Docker

### Servicios Incluidos

1. **Frontend (React + Vite + Nginx)**: Interfaz de usuario servida por Nginx
2. **Backend (NestJS)**: API REST con autenticación JWT
3. **Database (PostgreSQL)**: Base de datos relacional
4. **Reverse Proxy (Nginx)**: Proxy inverso con SSL/TLS

### Estructura de Archivos Docker

```
├── docker-compose.yml              # Configuración desarrollo/testing
├── docker-compose.prod.yml         # Configuración producción
├── .env.example                    # Variables de entorno ejemplo
├── apps/
│   ├── backend/
│   │   └── Dockerfile              # Imagen backend NestJS
│   └── frontend/
│       ├── Dockerfile              # Imagen frontend React
│       └── nginx.conf              # Configuración Nginx frontend
└── docker/
    ├── init-db.sql                 # Script inicialización BD
    └── nginx/
        └── nginx.conf              # Configuración proxy reverso
```

## 🚀 Despliegue Local

### Prerrequisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM mínimo

### ⚠️ Configuración de Seguridad

**IMPORTANTE**: Antes del primer despliegue, configure las credenciales:

1. **Copie el archivo de ejemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Genere contraseñas seguras**:
   ```bash
   # Generar contraseña de base de datos
   echo "DB_PASSWORD=$(openssl rand -base64 32)" >> .env
   
   # Generar secreto JWT
   echo "JWT_SECRET=$(openssl rand -base64 64)" >> .env
   ```

3. **Nunca commite archivos .env** (ya están en .gitignore)

**Credenciales por defecto (solo desarrollo)**:
- Admin: admin@example.com / admin123
- ⚠️ **CAMBIAR EN PRODUCCIÓN**
- 10GB espacio en disco

### Configuración Inicial

1. **Clonar variables de entorno:**
```bash
cp .env.example .env
```

2. **Editar variables según necesidades:**
```bash
nano .env
```

3. **Construir y ejecutar servicios:**
```bash
# Desarrollo/Testing
docker-compose up --build

# Producción
docker-compose -f docker-compose.prod.yml up --build -d
```

### Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Acceder al contenedor de base de datos
docker-compose exec database psql -U postgres -d appointments

# Backup de base de datos
docker-compose exec database pg_dump -U postgres appointments > backup.sql

# Restaurar base de datos
docker-compose exec -T database psql -U postgres appointments < backup.sql

# Limpiar volúmenes (CUIDADO: elimina datos)
docker-compose down -v
```

#### Configuración en el Servidor
```bash
# 1. Actualizar variables de entorno
echo "DOMAIN=yourdomain.com" >> .env
echo "EMAIL=admin@yourdomain.com" >> .env

# 2. Generar certificados SSL iniciales
docker-compose -f docker-compose.prod.yml --profile ssl-setup run --rm certbot

# 3. Configurar renovación automática
echo "0 12 * * * /usr/local/bin/docker-compose -f /path/to/docker-compose.prod.yml run --rm certbot renew" | crontab -
```

```yaml
# docker-compose.prod.yml
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

services:
  backend:
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
```

### Vault Integration (Avanzado)

```bash
# Usar HashiCorp Vault para secretos
docker run -d --name vault \
  -p 8200:8200 \
  --cap-add=IPC_LOCK \
  vault:latest
```

## 🔄 Reverse Proxy

### ¿Qué es un Reverse Proxy?

Un **reverse proxy** actúa como intermediario entre los clientes y los servidores backend:

#### Funciones Principales:
1. **Load Balancing**: Distribuye requests entre múltiples instancias
2. **SSL Termination**: Maneja cifrado/descifrado HTTPS
3. **Caching**: Almacena respuestas para mejorar performance
4. **Security**: Filtra requests maliciosos
5. **Compression**: Comprime respuestas (gzip)
6. **Rate Limiting**: Controla número de requests por IP

#### Configuración Nginx

```nginx
# Upstream para load balancing
upstream backend {
    server backend:3000;
    # server backend2:3000;  # Para múltiples instancias
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    
    # API routes con rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend/;
        
        # Headers para preservar información del cliente
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Health Checks

Todos los servicios incluyen health checks:

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **Puerto ya en uso:**
```bash
sudo netstat -tulpn | grep :80
sudo fuser -k 80/tcp
```

2. **Permisos SSL:**
```bash
sudo chown -R 1000:1000 docker/nginx/ssl/
chmod 600 docker/nginx/ssl/private.key
```

3. **Memoria insuficiente:**
```bash
# Verificar uso de memoria
docker stats
# Aumentar swap si es necesario
sudo fallocate -l 2G /swapfile
```

4. **Base de datos no conecta:**
```bash
# Verificar logs
docker-compose logs database
# Verificar conectividad
docker-compose exec backend ping database
```

### Comandos de Diagnóstico

```bash
# Estado de todos los servicios
docker-compose ps

# Uso de recursos
docker stats

# Logs en tiempo real
docker-compose logs -f --tail=100

# Inspeccionar red
docker network inspect arquitecturalimpia_app-network

# Verificar volúmenes
docker volume ls
docker volume inspect arquitecturalimpia_postgres_data
```

## 🚀 Despliegue Automatizado

### CI/CD con GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull origin main
            docker-compose -f docker-compose.prod.yml up --build -d
```

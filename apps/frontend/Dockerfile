# Simple React + Vite frontend build
FROM node:18-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock ./
COPY apps/frontend/package.json ./apps/frontend/

# Enable corepack and install dependencies
RUN corepack enable
RUN yarn install

# Copy frontend source
COPY apps/frontend ./apps/frontend

# Build frontend
WORKDIR /app/apps/frontend
RUN yarn build

# Production nginx server
FROM nginx:alpine

# Copy built app to nginx html directory
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Copy nginx configurations
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/frontend/nginx-standalone.conf /etc/nginx/conf.d/standalone.conf

EXPOSE 80

# Install wget for health checks
RUN apk add --no-cache wget

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

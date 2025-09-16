# Simple Node.js backend build
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Copy all source files
COPY . .

# Enable corepack and install dependencies
RUN corepack enable
RUN yarn install

# Set environment
ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["yarn", "workspace", "backend", "run", "start:dev"]

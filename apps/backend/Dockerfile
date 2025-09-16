FROM node:18-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Enable corepack and install dependencies
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
RUN corepack enable && yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . /app

WORKDIR /app/apps/backend

# Command to run the application
CMD ["yarn", "start:dev"]

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

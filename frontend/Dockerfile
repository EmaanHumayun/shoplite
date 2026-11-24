# ==============================================================================
# ShopLite Frontend Microservice Dockerfile
# Multi-stage production build: Node.js 20 builder + Nginx Alpine runner
# Cloud Crafters Architecture
# ==============================================================================

# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full frontend application source
COPY . .

# Build production assets via Vite
RUN npm run build

# ==============================================================================
# Production Stage (Nginx Alpine Web Server)
# ==============================================================================
FROM nginx:alpine AS runner

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with reverse proxy definitions
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install curl for container health check
RUN apk --no-cache add curl

EXPOSE 80

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

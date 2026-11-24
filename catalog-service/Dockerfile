# ==============================================================================
# ShopLite Catalog Microservice Dockerfile
# Multi-stage production build using Node.js 20 on Alpine Linux
# ==============================================================================

# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (only production deps needed in final image)
COPY package*.json ./
RUN npm ci --omit=dev

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Add security: Create non-root system environment
ENV NODE_ENV=production
ENV PORT=4000

# Install curl for healthcheck probe
RUN apk add --no-cache curl

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/

# Change ownership to non-root user 'node'
RUN chown -R node:node /app

USER node

EXPOSE 4000

# Container Healthcheck Probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "src/server.js"]

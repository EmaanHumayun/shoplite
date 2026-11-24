# ==============================================================================
# ShopLite Inventory Microservice Dockerfile
# Multi-stage production build using Go 1.22 on Alpine Linux
# Cloud Crafters Architecture
# ==============================================================================

# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy module definitions and pre-download modules
COPY go.mod go.sum* ./
RUN go mod download || true

# Copy full service source code
COPY . .

# Compile statically linked binary with stripped debug symbols for small footprint
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o inventory-service .

# ==============================================================================
# Runner Stage (Ultra-minimal Alpine production image)
# ==============================================================================
FROM alpine:3.19 AS runner

WORKDIR /app

# Install runtime dependencies: ca-certificates for TLS and curl for HEALTHCHECK
RUN apk --no-cache add ca-certificates curl tzdata

# Create dedicated non-root application user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled binary from builder stage
COPY --from=builder /app/inventory-service .

# Grant execute rights and assign ownership
RUN chown -R appuser:appgroup /app

USER appuser

ENV PORT=5000
EXPOSE 5000

# Periodic health check against local endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["./inventory-service"]

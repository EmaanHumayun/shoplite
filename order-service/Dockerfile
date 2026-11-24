# ==============================================================================
# ShopLite Order Microservice Dockerfile
# Multi-stage production build using Eclipse Temurin 17 (Java) on Alpine Linux
# Cloud Crafters Architecture
# ==============================================================================

# Build Stage
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and build executable jar
COPY src/ ./src/
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Production Runner Stage
# ==============================================================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Install curl for container HEALTHCHECK
RUN apk --no-cache add curl tzdata

# Create dedicated non-root application user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled jar artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Grant ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

ENV PORT=8080
EXPOSE 8080

# Periodic health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

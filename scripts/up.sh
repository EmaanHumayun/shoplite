#!/usr/bin/env bash
# ==============================================================================
# ShopLite Local Infrastructure Startup Script
# Cloud Crafters
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting ShopLite Multi-Service Microservices Stack"
echo "=========================================================="

# Check Docker availability
if ! command -v docker &> /dev/null; then
    echo "Error: docker command not found. Please ensure Docker is running." >&2
    exit 1
fi

# Ensure docker compose is available
DOCKER_COMPOSE="docker compose"
if ! $DOCKER_COMPOSE version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

# Build and start all services in detached mode
echo "Building container images and bringing up stack..."
$DOCKER_COMPOSE up -d --build

echo "Waiting for services to become healthy..."
$DOCKER_COMPOSE ps

echo "=========================================================="
echo " ShopLite Services are Running:"
echo " - Frontend:          http://localhost"
echo " - Catalog Service:   http://localhost:4000/health"
echo " - Inventory Service: http://localhost:5000/health"
echo " - Order Service:     http://localhost:8080/health"
echo " - PostgreSQL:        localhost:5432"
echo "=========================================================="

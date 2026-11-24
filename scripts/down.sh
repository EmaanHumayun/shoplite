#!/usr/bin/env bash
# ==============================================================================
# ShopLite Infrastructure Shutdown Script
# Cloud Crafters
# ==============================================================================

set -euo pipefail

DOCKER_COMPOSE="docker compose"
if ! $DOCKER_COMPOSE version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

if [[ "${1:-}" == "--volumes" || "${1:-}" == "-v" ]]; then
    echo "Stopping ShopLite stack and removing named volumes..."
    $DOCKER_COMPOSE down -v --remove-orphans
else
    echo "Stopping ShopLite stack (volumes preserved)..."
    $DOCKER_COMPOSE down --remove-orphans
fi

echo "ShopLite stack stopped."

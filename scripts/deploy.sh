#!/usr/bin/env bash
# ==============================================================================
# ShopLite EC2 Host Deployment Script
# Cloud Crafters
# ==============================================================================

set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-southeast-2}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-793593623544}"
REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
TAG="${IMAGE_TAG:-latest}"

echo "=========================================================="
echo " Deploying ShopLite on EC2 Instance"
echo " Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo " Image Tag: $TAG"
echo "=========================================================="

# Authenticate with Amazon ECR
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$REGISTRY"

# Pull latest images
echo "Pulling latest microservice container images..."
docker pull "$REGISTRY/shoplite-frontend:$TAG" || true
docker pull "$REGISTRY/shoplite-catalog:$TAG" || true
docker pull "$REGISTRY/shoplite-inventory:$TAG" || true
docker pull "$REGISTRY/shoplite-orders:$TAG" || true

# Relaunch containers using Docker Compose
DOCKER_COMPOSE="docker compose"
if ! $DOCKER_COMPOSE version &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
fi

if [ -f "docker-compose.yml" ]; then
    echo "Updating containers via docker compose..."
    $DOCKER_COMPOSE up -d --remove-orphans
fi

# Clean up dangling and unused images
echo "Cleaning up dangling images..."
docker image prune -f

echo "ShopLite deployment completed successfully."

#!/usr/bin/env bash
# ==============================================================================
# ShopLite ECR Build and Push Script
# Cloud Crafters
# ==============================================================================

set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-southeast-2}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-793593623544}"
REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
TAG="${1:-latest}"

echo "=========================================================="
echo " Authenticating Docker with Amazon ECR"
echo " Registry: $REGISTRY"
echo " Tag:      $TAG"
echo "=========================================================="

aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$REGISTRY"

SERVICES=(
    "frontend:shoplite-frontend"
    "catalog-service:shoplite-catalog"
    "inventory-service:shoplite-inventory"
    "order-service:shoplite-orders"
)

for entry in "${SERVICES[@]}"; do
    DIR="${entry%%:*}"
    REPO="${entry##*:}"

    if [ -s "$DIR/Dockerfile" ]; then
        echo "Building and pushing $REPO..."
        docker build -t "$REGISTRY/$REPO:$TAG" -t "$REGISTRY/$REPO:latest" "$DIR"
        docker push "$REGISTRY/$REPO:$TAG"
        docker push "$REGISTRY/$REPO:latest"
        echo "Successfully pushed $REPO"
    fi
done

echo "All images pushed to ECR successfully."

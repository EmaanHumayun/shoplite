#!/usr/bin/env bash
# ==============================================================================
# ShopLite Automated SSL Certificate Renewal Script
# Technology: Bash + Let's Encrypt / Certbot + Nginx / Docker
# Team: Cloud Crafters (ShopLite DevOps Infrastructure)
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Configuration Variables
# ------------------------------------------------------------------------------
DOMAIN="${SSL_DOMAIN:-shoplite.click}"
CERT_DIR="${CERT_DIR:-/etc/letsencrypt/live/$DOMAIN}"
CERT_FILE="$CERT_DIR/fullchain.pem"
LOG_DIR="/var/log/shoplite"
LOG_FILE="$LOG_DIR/ssl-renewal.log"
EXPIRATION_THRESHOLD_DAYS=30
DRY_RUN=false
FORCE_RENEW=false

# ------------------------------------------------------------------------------
# CLI Flag Parsing
# ------------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE_RENEW=true
            shift
            ;;
        --domain)
            DOMAIN="$2"
            CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
            CERT_FILE="$CERT_DIR/fullchain.pem"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [--dry-run] [--force] [--domain example.com]"
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

# ------------------------------------------------------------------------------
# Logging Helpers
# ------------------------------------------------------------------------------
mkdir -p "$LOG_DIR" 2>/dev/null || true

log() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    local log_entry="[$timestamp] [$level] $message"
    echo "$log_entry"
    if [ -w "$LOG_DIR" ] || [ -w "$LOG_FILE" ]; then
        echo "$log_entry" >> "$LOG_FILE" 2>/dev/null || true
    fi
}

log "INFO" "=========================================================="
log "INFO" " Starting ShopLite SSL Certificate Renewal Check"
log "INFO" " Target Domain: $DOMAIN"
log "INFO" " Certificate:   $CERT_FILE"
log "INFO" "=========================================================="

# ------------------------------------------------------------------------------
# Dependency Verification
# ------------------------------------------------------------------------------
if ! command -v certbot &> /dev/null; then
    log "ERROR" "Certbot binary not found. Please install certbot (apt install certbot)."
    exit 1
fi

if ! command -v openssl &> /dev/null; then
    log "ERROR" "OpenSSL binary not found."
    exit 1
fi

# ------------------------------------------------------------------------------
# Certificate Expiration Evaluation
# ------------------------------------------------------------------------------
NEEDS_RENEWAL=false

if [ ! -f "$CERT_FILE" ]; then
    log "WARN" "Certificate file $CERT_FILE does not exist. Initial issuance or renewal required."
    NEEDS_RENEWAL=true
else
    # Check if certificate expires within threshold seconds (days * 86400)
    THRESHOLD_SECONDS=$((EXPIRATION_THRESHOLD_DAYS * 86400))
    if openssl x509 -checkend "$THRESHOLD_SECONDS" -noout -in "$CERT_FILE" &> /dev/null; then
        EXP_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d= -f2)
        log "INFO" "Certificate is valid. Expiration date: $EXP_DATE (> $EXPIRATION_THRESHOLD_DAYS days remaining)."
    else
        log "WARN" "Certificate expires within $EXPIRATION_THRESHOLD_DAYS days. Renewal required."
        NEEDS_RENEWAL=true
    fi
fi

if [ "$FORCE_RENEW" = true ]; then
    log "INFO" "Force flag detected. Proceeding with renewal regardless of expiration."
    NEEDS_RENEWAL=true
fi

# ------------------------------------------------------------------------------
# Execution of Renewal
# ------------------------------------------------------------------------------
if [ "$NEEDS_RENEWAL" = false ]; then
    log "INFO" "No renewal required at this time. Exiting cleanly."
    exit 0
fi

CERTBOT_CMD="certbot renew --no-self-upgrade"

if [ "$DRY_RUN" = true ]; then
    log "INFO" "Executing in DRY-RUN simulation mode..."
    CERTBOT_CMD="$CERTBOT_CMD --dry-run"
fi

log "INFO" "Running: $CERTBOT_CMD"
if eval "$CERTBOT_CMD"; then
    log "INFO" "Certbot renewal command executed successfully."
else
    log "ERROR" "Certbot renewal failed with error code $?."
    exit 1
fi

# ------------------------------------------------------------------------------
# Post-Renewal Hook: Reload Nginx Web Server
# ------------------------------------------------------------------------------
if [ "$DRY_RUN" = false ]; then
    log "INFO" "Reloading web server to apply renewed SSL certificates..."
    
    # Method 1: Docker Container (ShopLite Frontend)
    if command -v docker &> /dev/null && docker ps --format '{{.Names}}' | grep -q 'shoplite-frontend'; then
        log "INFO" "Reloading Nginx inside shoplite-frontend Docker container..."
        docker exec shoplite-frontend nginx -s reload
        log "INFO" "Docker Nginx reloaded successfully."
    # Method 2: Systemd host Nginx service
    elif command -v systemctl &> /dev/null && systemctl is-active --quiet nginx; then
        log "INFO" "Reloading host systemd Nginx service..."
        systemctl reload nginx
        log "INFO" "Host Nginx reloaded successfully."
    else
        log "WARN" "No active Nginx service found to reload. Please verify manual reload."
    fi
fi

log "INFO" "ShopLite SSL renewal process finished successfully."
exit 0

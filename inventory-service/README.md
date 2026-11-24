# ShopLite Inventory Service

The Inventory Service is a high-performance Go microservice responsible for inventory tracking, stock adjustments, and replenishment monitoring for the ShopLite e-commerce platform.

## Architecture

- **Language:** Go 1.22
- **Database:** PostgreSQL (shared `shoplite` database)
- **Port:** 5000 (configurable via `PORT` environment variable)
- **Container:** Multi-stage Alpine container (< 25MB runtime image)

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` or `/api/health` | Health check probe returning service and DB status |
| `GET` | `/inventory` or `/api/inventory` | List all inventory items with joined product metadata |
| `GET` | `/inventory/:sku` | Get inventory stock for specific product SKU |
| `POST` | `/inventory/:sku/adjust` | Increment or decrement stock atomically |

### Adjust Stock Request Format

```json
POST /api/inventory/SHP-LTH-01/adjust
Content-Type: application/json

{
  "amount": 5,
  "reason": "shipment_received"
}
```

## Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | HTTP server listening port |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_NAME` | `shoplite` | Database name |
| `DB_SSLMODE` | `disable` | SSL mode (`disable`, `require`) |

## Running Tests

```bash
go test -v ./...
```

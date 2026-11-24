# ShopLite Order Service

The Order Service is a robust Java Spring Boot microservice responsible for order lifecycle management, status updates, and order analytics for the ShopLite e-commerce platform.

## Architecture

- **Framework:** Spring Boot 3.2.5 (Java 17)
- **Data Access:** Spring Data JPA + Hibernate
- **Database:** PostgreSQL (shared `shoplite` database)
- **Port:** 8080 (configurable via `PORT` environment variable)
- **Container:** Multi-stage Eclipse Temurin JRE Alpine container

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` or `/api/health` | Health check probe returning service and DB status |
| `GET` | `/orders` or `/api/orders` | Retrieve list of all orders sorted by date descending |
| `GET` | `/orders/:id` | Get single order by order number or ID |
| `PATCH` | `/orders/:id/status` | Update order fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |

## Running Tests

```bash
mvn test
```

# ShopLite — Catalog Microservice Backend

**Service:** Catalog API  
**Team:** Cloud Crafters (Emaan Humayun & Ishtiaq Ahmad)  
**Technology:** Node.js 20, Express 4, PostgreSQL 16 (`pg`), dotenv, cors  
**Port:** `4000` (Default)

---

## 1. Overview

The **Catalog Service** manages product definitions, SKUs, categories, pricing, descriptions, and media assets for the ShopLite multi-service platform. It interfaces with PostgreSQL on the internal `backend-net` bridge and exposes a RESTful JSON API consumed by the React + Vite frontend and the Orders service.

---

## 2. Directory Structure

```text
catalog-service/
├── .dockerignore              # Excludes node_modules, tests, and env secrets
├── .env.example               # Template environment configuration
├── Dockerfile                 # Multi-stage production container build (Alpine)
├── package.json               # Node.js dependencies and scripts
├── README.md                  # Comprehensive setup and API documentation
├── src/
│   ├── app.js                 # Express application setup and middleware
│   ├── server.js              # HTTP server listener and graceful shutdown
│   ├── config/
│   │   └── db.js              # PostgreSQL pg.Pool connection manager
│   ├── controllers/
│   │   └── productController.js # HTTP request handler and response formatting
│   ├── middleware/
│   │   ├── errorHandler.js    # Centralized PostgreSQL error and status handler
│   │   └── validateProduct.js # Request payload validation (400 Bad Request)
│   ├── models/
│   │   └── productModel.js    # Parameterized SQL queries preventing injection
│   └── routes/
│       ├── healthRoutes.js    # GET /health probe
│       └── productRoutes.js   # CRUD /api/products router
└── test/
    └── product.test.js        # Automated integration test suite (pg-mem & supertest)
```

---

## 3. Environment Variables

Create a local `.env` file from `.env.example`:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `4000` | HTTP port for the Express application |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `DB_HOST` | `localhost` | PostgreSQL host (`db` in Docker Compose) |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `shoplite_db` | Database name |
| `DB_USER` | `shoplite_user` | Database user |
| `DB_PASSWORD` | `shoplite_password` | Database user password |
| `DB_POOL_MAX` | `20` | Maximum connections in `pg.Pool` |
| `DB_TIMEOUT_MS`| `5000` | Pool idle client timeout |
| `DATABASE_URL` | *(Optional)* | Full PostgreSQL connection string (takes precedence) |
| `CORS_ORIGIN` | `*` | Allowed CORS origins for frontend access |

---

## 4. Setup and Local Execution

### Install Dependencies:
```bash
cd catalog-service
npm install
```

### Run Tests:
```bash
npm test
```
*Executes the in-memory integration test suite validating all 34 assertions (CRUD, unique SKU, health, 400 validation, 404 handling).*

### Start Local Development Server:
```bash
npm run dev
```

### Start Production Server:
```bash
npm start
```

---

## 5. REST API Specifications

### 5.1 Health Check Probe
- **Endpoint:** `GET /health`
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "shoplite-catalog-service",
  "uptime": "142s",
  "timestamp": "2026-11-23T22:30:00.000Z",
  "database": {
    "status": "connected",
    "latency": "4ms",
    "serverTime": "2026-11-23T22:30:00.000Z"
  }
}
```

---

### 5.2 List Products
- **Endpoint:** `GET /api/products`
- **Query Parameters:**
  - `category` *(optional)*: Filter by category (e.g. `?category=Apparel`)
  - `search` *(optional)*: Search term matching name, SKU, or category
  - `limit` *(optional)*: Limit returned items (default: 50)
  - `offset` *(optional)*: Pagination offset (default: 0)
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "sku": "SHP-LTH-01",
    "name": "Artisan Leather Weekender",
    "description": "Full-grain Tuscan calfskin duffle bag with solid brass hardware.",
    "category": "Leather Goods",
    "price": 345.00,
    "image_url": "https://images.unsplash.com/photo-1547949003-9792a18a2601",
    "imageUrl": "https://images.unsplash.com/photo-1547949003-9792a18a2601",
    "created_at": "2026-11-23T22:00:00.000Z",
    "updated_at": "2026-11-23T22:00:00.000Z"
  }
]
```

---

### 5.3 Get Product by ID
- **Endpoint:** `GET /api/products/:id`
- **Response (200 OK):**
```json
{
  "id": 1,
  "sku": "SHP-LTH-01",
  "name": "Artisan Leather Weekender",
  "description": "Full-grain Tuscan calfskin duffle bag.",
  "category": "Leather Goods",
  "price": 345.00,
  "image_url": "https://images.unsplash.com/photo-1547949003-9792a18a2601",
  "imageUrl": "https://images.unsplash.com/photo-1547949003-9792a18a2601",
  "created_at": "2026-11-23T22:00:00.000Z",
  "updated_at": "2026-11-23T22:00:00.000Z"
}
```
- **Error Response (404 Not Found):**
```json
{
  "error": "Not Found",
  "message": "Product with ID \"999\" was not found in the catalog."
}
```

---

### 5.4 Create Product
- **Endpoint:** `POST /api/products`
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Merino Wool Beanie",
  "sku": "SHP-APP-15",
  "category": "Apparel",
  "price": 45.00,
  "description": "Warm ribbed knit beanie made from 100% merino wool.",
  "imageUrl": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531"
}
```
- **Response (201 Created):** Returns the created product with generated `id`, `created_at`, and `updated_at`.
- **Validation Error (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "message": "Invalid product input data",
  "details": ["Product name is required and cannot be empty."]
}
```
- **Duplicate SKU Error (409 Conflict):**
```json
{
  "error": "Conflict Error",
  "message": "A product with this unique SKU already exists."
}
```

---

### 5.5 Update Product
- **Endpoint:** `PUT /api/products/:id`
- **Request Body:** Supports partial or complete field updates:
```json
{
  "price": 320.00,
  "name": "Artisan Leather Weekender (Updated Edition)"
}
```
- **Response (200 OK):** Returns updated product record with updated timestamp.

---

### 5.6 Delete Product
- **Endpoint:** `DELETE /api/products/:id`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Product \"Artisan Leather Weekender\" (ID: 1) has been removed from catalog.",
  "deleted": {
    "id": 1,
    "sku": "SHP-LTH-01",
    "name": "Artisan Leather Weekender"
  }
}
```

---

## 6. Docker Containerization

### Build Image:
```bash
docker build -t shoplite/catalog-service:latest -f catalog-service/Dockerfile catalog-service/
```

### Run Container:
```bash
docker run -d \
  --name shoplite-catalog \
  -p 4000:4000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=shoplite_password \
  shoplite/catalog-service:latest
```

The container runs as non-root user `node` on Alpine Linux with built-in HTTP health check monitoring.

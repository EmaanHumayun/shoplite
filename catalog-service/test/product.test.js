/**
 * ShopLite Catalog Service - Comprehensive Integration Test Suite
 * Tests:
 * 1. GET /health - Database connectivity and health check
 * 2. GET /api/products - Product listing with filter & search
 * 3. POST /api/products - Product creation with validation
 * 4. GET /api/products/:id - Single product retrieval
 * 5. PUT /api/products/:id - Product update
 * 6. DELETE /api/products/:id - Product deletion
 * 7. Invalid Input Handling - 400 Bad Request
 * 8. Duplicate SKU Constraint - 409 Conflict
 * 9. Nonexistent ID - 404 Not Found
 */

const request = require('supertest');
const { newDb } = require('pg-mem');
const db = require('../src/config/db');

// Setup in-memory PostgreSQL engine
const memDb = newDb();

// Register NOW() function
memDb.public.registerFunction({
  name: 'now',
  returns: memDb.public.getType('timestamp with time zone'),
  implementation: () => new Date(),
});

// Initialize PostgreSQL schema with constraints and triggers
memDb.public.none(`
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX idx_products_sku ON products(sku);
  CREATE INDEX idx_products_category ON products(category);
`);

// Connect in-memory pool to our application
const memPool = memDb.adapters.createPg().Pool;
const testPool = new memPool();
db.setPool(testPool);

const app = require('../src/app');

// Test runner helper
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const assert = (condition, message) => {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
};

async function runTests() {
  console.log('=================================================================');
  console.log(' Starting ShopLite Catalog Service Integration Test Suite');
  console.log('=================================================================\n');

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Healthcheck
    // -------------------------------------------------------------------------
    console.log('[Test Group 1]: Health Check Endpoint');
    const healthRes = await request(app).get('/health');
    assert(healthRes.status === 200, 'GET /health returns HTTP 200 OK');
    assert(healthRes.body.status === 'healthy', 'Health status is "healthy"');
    assert(healthRes.body.service === 'shoplite-catalog-service', 'Service identifier is correct');
    assert(healthRes.body.database && healthRes.body.database.status === 'connected', 'Database reports "connected"');

    // -------------------------------------------------------------------------
    // TEST 2: Initial Empty Products List
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 2]: Empty Product Catalog');
    const emptyRes = await request(app).get('/api/products');
    assert(emptyRes.status === 200, 'GET /api/products returns HTTP 200 OK');
    assert(Array.isArray(emptyRes.body) && emptyRes.body.length === 0, 'Catalog starts empty');

    // -------------------------------------------------------------------------
    // TEST 3: Create Valid Product (POST /api/products)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 3]: Product Creation (Valid Input)');
    const newProductPayload = {
      name: 'Artisan Leather Briefcase',
      sku: 'SHP-LTH-99',
      category: 'Leather Goods',
      price: 295.50,
      description: 'Handcrafted Italian vegetable tanned leather briefcase.',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    };

    const createRes = await request(app)
      .post('/api/products')
      .send(newProductPayload);

    assert(createRes.status === 201, 'POST /api/products returns HTTP 201 Created');
    assert(createRes.body.id !== undefined, 'Created product has generated ID');
    assert(createRes.body.name === newProductPayload.name, 'Product name matches payload');
    assert(createRes.body.sku === newProductPayload.sku, 'Product SKU matches payload');
    assert(createRes.body.price === 295.50, 'Product price parsed as valid number');
    assert(createRes.body.imageUrl === newProductPayload.imageUrl, 'imageUrl alias populated for frontend');

    const createdId = createRes.body.id;

    // -------------------------------------------------------------------------
    // TEST 4: Get Product By ID (GET /api/products/:id)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 4]: Retrieve Product by ID');
    const getOneRes = await request(app).get(`/api/products/${createdId}`);
    assert(getOneRes.status === 200, 'GET /api/products/:id returns HTTP 200 OK');
    assert(getOneRes.body.id === createdId, 'Returned product has expected ID');
    assert(getOneRes.body.sku === 'SHP-LTH-99', 'Returned product SKU is correct');

    // -------------------------------------------------------------------------
    // TEST 5: Update Product (PUT /api/products/:id)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 5]: Product Update');
    const updatePayload = {
      name: 'Artisan Leather Briefcase (Special Edition)',
      price: 349.00,
      category: 'Leather Goods',
      sku: 'SHP-LTH-99',
    };

    const updateRes = await request(app)
      .put(`/api/products/${createdId}`)
      .send(updatePayload);

    assert(updateRes.status === 200, 'PUT /api/products/:id returns HTTP 200 OK');
    assert(updateRes.body.name === updatePayload.name, 'Product name updated successfully');
    assert(updateRes.body.price === 349.00, 'Product price updated successfully');

    // -------------------------------------------------------------------------
    // TEST 6: Validation Errors (POST /api/products with invalid data)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 6]: Input Validation (400 Bad Request)');
    const missingNameRes = await request(app)
      .post('/api/products')
      .send({ sku: 'SHP-TEST-01', category: 'Apparel', price: 50.00 });
    assert(missingNameRes.status === 400, 'Missing name returns HTTP 400 Bad Request');
    assert(missingNameRes.body.error === 'Validation Error', 'Error type is "Validation Error"');

    const negativePriceRes = await request(app)
      .post('/api/products')
      .send({ name: 'Invalid Product', sku: 'SHP-TEST-02', category: 'Apparel', price: -25.00 });
    assert(negativePriceRes.status === 400, 'Negative price returns HTTP 400 Bad Request');

    const missingSkuRes = await request(app)
      .post('/api/products')
      .send({ name: 'No SKU Product', category: 'Apparel', price: 50.00 });
    assert(missingSkuRes.status === 400, 'Missing SKU returns HTTP 400 Bad Request');

    // -------------------------------------------------------------------------
    // TEST 7: Duplicate SKU Handling (409 Conflict)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 7]: Unique SKU Constraint Violation (409 Conflict)');
    const duplicateSkuRes = await request(app)
      .post('/api/products')
      .send({
        name: 'Duplicate Briefcase',
        sku: 'SHP-LTH-99', // Already exists!
        category: 'Leather Goods',
        price: 300.00,
      });

    assert(duplicateSkuRes.status === 409, 'Duplicate SKU returns HTTP 409 Conflict');
    assert(duplicateSkuRes.body.error === 'Conflict Error', 'Conflict error message received');

    // -------------------------------------------------------------------------
    // TEST 8: Nonexistent Product Retrieval (404 Not Found)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 8]: Nonexistent Entity Handling (404 Not Found)');
    const notFoundGet = await request(app).get('/api/products/99999');
    assert(notFoundGet.status === 404, 'GET nonexistent ID returns HTTP 404 Not Found');

    const notFoundPut = await request(app).put('/api/products/99999').send({
      name: 'Ghost Product',
      sku: 'SHP-GHOST',
      category: 'Apparel',
      price: 10,
    });
    assert(notFoundPut.status === 404, 'PUT nonexistent ID returns HTTP 404 Not Found');

    const notFoundDelete = await request(app).delete('/api/products/99999');
    assert(notFoundDelete.status === 404, 'DELETE nonexistent ID returns HTTP 404 Not Found');

    // -------------------------------------------------------------------------
    // TEST 9: Delete Product (DELETE /api/products/:id)
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 9]: Product Deletion');
    const deleteRes = await request(app).delete(`/api/products/${createdId}`);
    assert(deleteRes.status === 200, 'DELETE /api/products/:id returns HTTP 200 OK');
    assert(deleteRes.body.success === true, 'Delete response indicates success');

    // Confirm it is gone
    const verifyDelete = await request(app).get(`/api/products/${createdId}`);
    assert(verifyDelete.status === 404, 'Deleted product is no longer found (404)');

    // -------------------------------------------------------------------------
    // TEST 10: Product Catalog Listing & Search
    // -------------------------------------------------------------------------
    console.log('\n[Test Group 10]: Multiple Products & Filtering');
    await request(app).post('/api/products').send({ name: 'Wool Beanie', sku: 'SHP-WOL-01', category: 'Apparel', price: 35.00 });
    await request(app).post('/api/products').send({ name: 'Gold Signet Ring', sku: 'SHP-GLD-02', category: 'Watches & Jewelry', price: 420.00 });
    await request(app).post('/api/products').send({ name: 'Ceramic Mug', sku: 'SHP-MUG-03', category: 'Home & Living', price: 28.00 });

    const allListRes = await request(app).get('/api/products');
    assert(allListRes.status === 200, 'GET /api/products returns HTTP 200 OK');
    assert(allListRes.body.length === 3, 'Catalog has exactly 3 items');

    const filterCategoryRes = await request(app).get('/api/products?category=Apparel');
    assert(filterCategoryRes.body.length === 1 && filterCategoryRes.body[0].sku === 'SHP-WOL-01', 'Category filtering operates accurately');

    const searchRes = await request(app).get('/api/products?search=Ring');
    assert(searchRes.body.length === 1 && searchRes.body[0].sku === 'SHP-GLD-02', 'Search query filter operates accurately');

    // -------------------------------------------------------------------------
    // Test Summary
    // -------------------------------------------------------------------------
    console.log('\n=================================================================');
    console.log(` TEST EXECUTION SUMMARY: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
    console.log('=================================================================');

    if (failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Unhandled Test Runner Exception:', err);
    process.exit(1);
  }
}

runTests();

-- =============================================================================
-- ShopLite Database Schema & Seed Data
-- Services: Catalog API, Inventory API & Order API (PostgreSQL 16)
-- Cloud Crafters Architecture
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Products Table (Catalog Service)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
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

-- Indexes for fast lookup on search, filter, and ordering
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial products matching frontend requirements
INSERT INTO products (sku, name, category, price, description, image_url)
VALUES
    ('SHP-LTH-01', 'Artisan Leather Weekender', 'Leather Goods', 345.00, 'Full-grain Tuscan calfskin duffle bag with solid brass hardware and water-resistant lining.', 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80'),
    ('SHP-WCH-02', 'Heritage Chronograph Watch', 'Watches & Jewelry', 520.00, 'Automatic mechanical movement with sapphire crystal glass and interchangeable strap.', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80'),
    ('SHP-APP-03', 'Cashmere Knit Cardigan', 'Apparel', 280.00, '100% Mongolian two-ply cashmere with mother-of-pearl buttons in oat heather.', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80'),
    ('SHP-HOM-04', 'Minimalist Brass Desk Lamp', 'Home & Living', 185.00, 'Spun brushed brass with integrated warm 2700K dimmable LED and woven textile cord.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'),
    ('SHP-FTW-05', 'Venetian Suede Loafers', 'Footwear', 260.00, 'Hand-stitched Italian suede loafers with supple calfskin lining and flexible leather sole.', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80'),
    ('SHP-FRG-06', 'Botanical Room Diffuser', 'Fragrance', 68.00, 'Essential oils of cedarwood, black amber and bergamot in apothecary amber glass bottle.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'),
    ('SHP-HOM-07', 'Handcrafted Ceramic Tableware Set', 'Home & Living', 145.00, 'Stoneware clay dinner plates and bowls featuring speckled matte glaze finish.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80'),
    ('SHP-LTH-08', 'Slim Bi-Fold Card Wallet', 'Leather Goods', 75.00, 'Vegetable tanned bridle leather with hand-beveled edges and six card slots.', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80'),
    ('SHP-APP-09', 'Merino Wool Turtleneck', 'Apparel', 195.00, 'Fine-gauge extra-fine Australian merino wool with ribbed cuffs and hem.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'),
    ('SHP-WCH-10', 'Bauhaus Minimalist Automatic', 'Watches & Jewelry', 410.00, 'Sleek white dial with tempered blue hands and mesh stainless steel band.', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (sku) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Inventory Table (Inventory Service)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reorder_level INT NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_inventory_product_id UNIQUE (product_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed initial inventory linked to products
INSERT INTO inventory (product_id, quantity, reorder_level)
SELECT id,
       CASE id
           WHEN 1 THEN 45
           WHEN 2 THEN 18
           WHEN 3 THEN 8   -- low stock alert (< 10)
           WHEN 4 THEN 25
           WHEN 5 THEN 14
           WHEN 6 THEN 35
           WHEN 7 THEN 20
           WHEN 8 THEN 50
           WHEN 9 THEN 12
           WHEN 10 THEN 28
           ELSE 20
       END,
       10
FROM products
ON CONFLICT (product_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Orders & Order Items Tables (Order Service)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'Credit Card',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    sku VARCHAR(100),
    name VARCHAR(255),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Seed initial orders matching frontend requirements
INSERT INTO orders (id, order_number, customer_name, customer_email, total_amount, status, payment_method)
VALUES
    (1, 'ORD-8941', 'Sophia Montgomery', 'sophia.m@example.com', 653.40, 'Processing', 'Credit Card'),
    (2, 'ORD-8940', 'Marcus Sterling', 'm.sterling@domain.co.uk', 520.00, 'Delivered', 'PayPal'),
    (3, 'ORD-8939', 'Elena Rostova', 'elena.rostova@techcorp.io', 302.40, 'Shipped', 'Credit Card'),
    (4, 'ORD-8938', 'Julian Vance', 'jvance@designstudio.ny', 185.00, 'Processing', 'Apple Pay'),
    (5, 'ORD-8937', 'Aria Chen', 'aria.chen@cloudventures.com', 765.00, 'Pending', 'Credit Card')
ON CONFLICT (order_number) DO NOTHING;

-- Reset sequence to prevent ID collisions on future insertions
SELECT setval('orders_id_seq', (SELECT COALESCE(MAX(id), 1) FROM orders));

INSERT INTO order_items (order_id, product_id, sku, name, quantity, unit_price, subtotal)
VALUES
    (1, 1, 'SHP-LTH-01', 'Artisan Leather Weekender', 1, 345.00, 345.00),
    (1, 5, 'SHP-FTW-05', 'Venetian Suede Loafers', 1, 260.00, 260.00),
    (2, 2, 'SHP-WCH-02', 'Heritage Chronograph Watch', 1, 520.00, 520.00),
    (3, 3, 'SHP-APP-03', 'Cashmere Knit Cardigan', 1, 280.00, 280.00),
    (4, 4, 'SHP-HOM-04', 'Minimalist Brass Desk Lamp', 1, 185.00, 185.00),
    (5, 1, 'SHP-LTH-01', 'Artisan Leather Weekender', 1, 345.00, 345.00),
    (5, 10, 'SHP-WCH-10', 'Bauhaus Minimalist Automatic', 1, 410.00, 410.00)
ON CONFLICT DO NOTHING;

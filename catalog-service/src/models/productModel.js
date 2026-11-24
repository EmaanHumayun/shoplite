const db = require('../config/db');

class ProductModel {
  static async findAll({ category, search, limit = 50, offset = 0 } = {}) {
    let queryText = `
      SELECT id, sku, name, description, category, price, image_url, created_at, updated_at
      FROM products
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All Categories') {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      queryText += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(sku) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`;
    }

    params.push(parseInt(limit, 10) || 50);
    queryText += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    params.push(parseInt(offset, 10) || 0);
    queryText += ` OFFSET $${params.length}`;

    const { rows } = await db.query(queryText, params);
    return rows;
  }

  static async findById(id) {
    const queryText = `
      SELECT id, sku, name, description, category, price, image_url, created_at, updated_at
      FROM products
      WHERE id = $1
    `;
    const { rows } = await db.query(queryText, [id]);
    return rows[0] || null;
  }

  static async findBySku(sku) {
    const queryText = `
      SELECT id, sku, name, description, category, price, image_url, created_at, updated_at
      FROM products
      WHERE sku = $1
    `;
    const { rows } = await db.query(queryText, [sku]);
    return rows[0] || null;
  }

  static async create({ name, description, category, price, sku, image_url }) {
    const queryText = `
      INSERT INTO products (name, description, category, price, sku, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, sku, name, description, category, price, image_url, created_at, updated_at
    `;
    const params = [
      name.trim(),
      description ? description.trim() : null,
      category.trim(),
      parseFloat(price),
      sku.trim().toUpperCase(),
      image_url ? image_url.trim() : null,
    ];
    const { rows } = await db.query(queryText, params);
    return rows[0];
  }

  static async update(id, { name, description, category, price, sku, image_url }) {
    const queryText = `
      UPDATE products
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        price = COALESCE($4, price),
        sku = COALESCE($5, sku),
        image_url = COALESCE($6, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, sku, name, description, category, price, image_url, created_at, updated_at
    `;
    const params = [
      name ? name.trim() : null,
      description !== undefined ? description : null,
      category ? category.trim() : null,
      price !== undefined && price !== null ? parseFloat(price) : null,
      sku ? sku.trim().toUpperCase() : null,
      image_url !== undefined ? image_url : null,
      id,
    ];
    const { rows } = await db.query(queryText, params);
    return rows[0] || null;
  }

  static async delete(id) {
    const queryText = `
      DELETE FROM products
      WHERE id = $1
      RETURNING id, sku, name
    `;
    const { rows } = await db.query(queryText, [id]);
    return rows[0] || null;
  }

  static async count() {
    const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM products');
    return rows[0].count;
  }
}

module.exports = ProductModel;

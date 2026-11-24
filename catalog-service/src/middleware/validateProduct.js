/**
 * Product Input Validation Middleware
 */
const validateProduct = (req, res, next) => {
  const isPost = req.method === 'POST';
  const { name, price, category, sku, image_url, imageUrl, description } = req.body;
  const errors = [];

  // Normalize image_url if provided as imageUrl
  if (imageUrl !== undefined && image_url === undefined) {
    req.body.image_url = imageUrl;
  }

  // Name validation
  if (isPost || name !== undefined) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Product name is required and cannot be empty.');
    } else if (name.trim().length > 255) {
      errors.push('Product name cannot exceed 255 characters.');
    }
  }

  // SKU validation
  if (isPost || sku !== undefined) {
    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      errors.push('Product SKU is required.');
    } else if (sku.trim().length > 100) {
      errors.push('Product SKU cannot exceed 100 characters.');
    }
  }

  // Category validation
  if (isPost || category !== undefined) {
    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push('Category is required.');
    } else if (category.trim().length > 100) {
      errors.push('Category cannot exceed 100 characters.');
    }
  }

  // Price validation
  if (isPost || price !== undefined) {
    const numPrice = parseFloat(price);
    if (price === undefined || price === null || isNaN(numPrice)) {
      errors.push('A valid numeric price is required.');
    } else if (numPrice < 0) {
      errors.push('Price cannot be negative.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid product input data',
      details: errors,
    });
  }

  next();
};

module.exports = validateProduct;

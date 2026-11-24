const ProductModel = require('../models/productModel');

/**
 * Normalizes product record for both snake_case and camelCase consumers
 */
const formatProductResponse = (product) => {
  if (!product) return null;
  return {
    ...product,
    imageUrl: product.image_url, // camelCase alias for frontend
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
  };
};

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, limit, offset } = req.query;
    const products = await ProductModel.findAll({ category, search, limit, offset });
    res.status(200).json(products.map(formatProductResponse));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Product with ID "${id}" was not found in the catalog.`,
      });
    }
    res.status(200).json(formatProductResponse(product));
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, sku, image_url, imageUrl } = req.body;
    const resolvedImageUrl = image_url || imageUrl || null;

    const newProduct = await ProductModel.create({
      name,
      description,
      category,
      price,
      sku,
      image_url: resolvedImageUrl,
    });

    res.status(201).json(formatProductResponse(newProduct));
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, sku, image_url, imageUrl } = req.body;
    const resolvedImageUrl = image_url !== undefined ? image_url : imageUrl;

    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Product with ID "${id}" does not exist to update.`,
      });
    }

    const updated = await ProductModel.update(id, {
      name,
      description,
      category,
      price,
      sku,
      image_url: resolvedImageUrl,
    });

    res.status(200).json(formatProductResponse(updated));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.delete(id);
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Product with ID "${id}" does not exist to delete.`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Product "${deleted.name}" (ID: ${deleted.id}) has been removed from catalog.`,
      deleted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

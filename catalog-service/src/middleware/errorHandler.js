/**
 * Centralized Application Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // PostgreSQL error code handling
  if (err.code === '23505') {
    // Unique violation (e.g. duplicate SKU)
    return res.status(409).json({
      error: 'Conflict Error',
      message: 'A product with this unique SKU already exists.',
      detail: err.detail,
    });
  }

  if (err.code === '23514') {
    // Check constraint violation (e.g. price < 0)
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Check constraint violation on product data.',
      detail: err.detail,
    });
  }

  if (err.code === '22P02') {
    // Invalid text representation (e.g. invalid integer ID)
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid parameter syntax or ID format.',
    });
  }

  // Custom client errors
  if (err.statusCode && err.statusCode < 500) {
    return res.status(err.statusCode).json({
      error: err.name || 'Client Error',
      message: err.message,
    });
  }

  console.error('[Internal Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message,
  });
};

module.exports = errorHandler;

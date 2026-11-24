const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(` ShopLite Catalog Service listening on port ${PORT}`);
  console.log(` Health Probe: http://localhost:${PORT}/health`);
  console.log(` Products API: http://localhost:${PORT}/api/products`);
  console.log(` Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`========================================================`);
});

// Graceful Shutdown
const handleShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down Catalog Service...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await db.pool.end();
      console.log('PostgreSQL connection pool drained.');
      process.exit(0);
    } catch (err) {
      console.error('Error during pool draining:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

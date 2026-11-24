const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /health
router.get('/', async (req, res) => {
  try {
    const dbStatus = await db.testConnection();
    res.status(200).json({
      status: 'healthy',
      service: 'shoplite-catalog-service',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        latency: `${dbStatus.latencyMs}ms`,
        serverTime: dbStatus.serverTime,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      service: 'shoplite-catalog-service',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        error: error.message,
      },
    });
  }
});

module.exports = router;

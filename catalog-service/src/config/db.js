const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Determine configuration: DATABASE_URL takes priority, else discrete variables
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'shoplite_db',
      user: process.env.DB_USER || 'shoplite_user',
      password: process.env.DB_PASSWORD || 'shoplite_password',
      max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
      idleTimeoutMillis: parseInt(process.env.DB_TIMEOUT_MS, 10) || 10000,
      connectionTimeoutMillis: 5000,
    };

let activePool = new Pool(poolConfig);

activePool.on('error', (err) => {
  console.error('[Database Pool Error]: Unexpected error on idle client', err);
});

module.exports = {
  get pool() {
    return activePool;
  },
  setPool(customPool) {
    activePool = customPool;
  },
  query: async (text, params) => {
    const start = Date.now();
    const res = await activePool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('[DB Query]', { text: text.trim().slice(0, 100), duration: `${duration}ms`, rows: res.rowCount });
    }
    return res;
  },
  testConnection: async () => {
    const start = Date.now();
    const res = await activePool.query('SELECT NOW() AS server_time');
    const latency = Date.now() - start;
    return {
      connected: true,
      latencyMs: latency,
      serverTime: res.rows[0].server_time,
    };
  },
};

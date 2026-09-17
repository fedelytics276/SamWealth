import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: process.env.MOBU_DB_HOST || 'localhost',
  port: parseInt(process.env.MOBU_DB_PORT || '5432'),
  user: process.env.MOBU_DB_USER || 'fedeanalytics',
  password: process.env.MOBU_DB_PASSWORD || '',
  database: process.env.MOBU_DB_NAME || 'mobu_dev',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

export default pool;

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper to get a single row
export async function queryOne(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

// Helper to get all rows
export async function queryAll(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows;
}

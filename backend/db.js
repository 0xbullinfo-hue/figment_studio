/**
 * PostgreSQL connection pool
 */

import pg from 'pg';
import { config } from './config.js';
import { logger } from './logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (error) => {
  logger.error('PostgreSQL pool error', { error: error.message });
});

export async function connectDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    logger.info('Database connection established');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Database connection failed', {
      message,
      databaseUrl: config.databaseUrl,
    });
    throw new Error(`Database connection failed: ${message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

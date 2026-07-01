#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes schema.sql to initialize or update database
 * 
 * Usage: npm run db:migrate
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not set in environment');
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });

  try {
    console.log('📦 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    // Read schema.sql
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Execute schema
    console.log('🔧 Running migrations...');
    await client.query(schema);
    console.log('✅ Migrations completed');

    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('\n📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();

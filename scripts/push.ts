import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/db/schema';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

if (!process.env.DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN environment variable is not set');
}

async function main() {
  console.log('🚀 Pushing schema to Turso database...');

  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  try {
    // Test connection
    await client.execute('SELECT 1');
    console.log('✨ Connected to database');

    // Push schema
    await db.run('PRAGMA foreign_keys = ON');
    console.log('✨ Schema pushed successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to push schema:', error);
    process.exit(1);
  }
}

main();
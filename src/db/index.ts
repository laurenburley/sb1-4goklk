import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.VITE_DATABASE_URL || 'file:local.db',
  authToken: import.meta.env.VITE_DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export async function connectDb() {
  try {
    console.log('Attempting to connect to database...');
    await client.execute('SELECT 1');
    console.log('✨ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export { db as database };
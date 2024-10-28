import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '../src/db';
import * as dotenv from 'dotenv';

dotenv.config();

// Run migrations
async function main() {
  try {
    console.log('🚀 Starting database migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('✨ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
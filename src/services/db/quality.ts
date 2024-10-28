import { database as db } from '../../db';
import { qualityTests, testParameters, qualitySamples, sampleCustody } from '../../db/schema';
import { Test, Sample } from '../../types/quality';
import { eq } from 'drizzle-orm';

// Tests
export async function getAllTests(): Promise<Test[]> {
  const tests = await db.select().from(qualityTests);
  const testIds = tests.map(t => t.id);
  
  const parameters = await db
    .select()
    .from(testParameters)
    .where(eq(testParameters.testId, testIds));

  return tests.map(test => ({
    ...test,
    parameters: parameters.filter(p => p.testId === test.id),
  }));
}

export async function getTestById(id: string): Promise<Test | null> {
  const [test] = await db
    .select()
    .from(qualityTests)
    .where(eq(qualityTests.id, id));

  if (!test) return null;

  const parameters = await db
    .select()
    .from(testParameters)
    .where(eq(testParameters.testId, id));

  return {
    ...test,
    parameters,
  };
}

export async function createTest(test: Omit<Test, 'id'>): Promise<Test> {
  const id = crypto.randomUUID();
  const { parameters, ...testData } = test;

  await db.insert(qualityTests).values({
    ...testData,
    id,
  });

  if (parameters?.length) {
    await db.insert(testParameters).values(
      parameters.map(param => ({
        ...param,
        id: crypto.randomUUID(),
        testId: id,
      }))
    );
  }

  return getTestById(id) as Promise<Test>;
}

export async function updateTest(id: string, test: Partial<Test>): Promise<Test> {
  const { parameters, ...testData } = test;

  await db
    .update(qualityTests)I'll fix the LibSQL client import issue and update all affected files with their complete contents.

<boltArtifact id="fix-libsql-imports" title="Fix LibSQL client imports">
<boltAction type="file" filePath="src/db/index.ts">
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Helper function to ensure database connection
export async function connectDb() {
  try {
    console.log('Attempting to connect to database...');
    await db.execute('SELECT 1');
    console.log('✨ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export { db as database };
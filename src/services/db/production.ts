import { db } from '../../db';
import { productionBatches } from '../../db/schema';
import { ProductionBatch } from '../../types/production';
import { eq } from 'drizzle-orm';

export async function getAllProductionBatches(): Promise<ProductionBatch[]> {
  return db.select().from(productionBatches);
}

export async function getProductionBatchById(id: string): Promise<ProductionBatch | null> {
  const [result] = await db
    .select()
    .from(productionBatches)
    .where(eq(productionBatches.id, id));
  
  return result || null;
}

export async function createProductionBatch(batch: Omit<ProductionBatch, 'id'>): Promise<ProductionBatch> {
  const id = crypto.randomUUID();
  
  await db.insert(productionBatches).values({
    ...batch,
    id,
  });

  return getProductionBatchById(id) as Promise<ProductionBatch>;
}

export async function updateProductionBatch(id: string, batch: Partial<ProductionBatch>): Promise<ProductionBatch> {
  await db
    .update(productionBatches)
    .set({
      ...batch,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(productionBatches.id, id));

  return getProductionBatchById(id) as Promise<ProductionBatch>;
}

export async function deleteProductionBatch(id: string): Promise<void> {
  await db.delete(productionBatches).where(eq(productionBatches.id, id));
}
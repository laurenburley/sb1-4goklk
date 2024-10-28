import { z } from 'zod';

export const SpiritType = {
  GIN: 'Gin',
  VODKA: 'Vodka',
  WHISKEY: 'Whiskey',
  RUM: 'Rum',
  BRANDY: 'Brandy',
} as const;

export const BatchStatus = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  QUALITY_CHECK: 'Quality Check',
  ARCHIVED: 'Archived',
} as const;

export const productionBatchSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  productionDate: z.string(),
  spiritType: z.nativeEnum(SpiritType),
  ingredients: z.string(),
  volumeProduced: z.number(),
  volumeUnit: z.enum(['L', 'GAL']),
  abv: z.number().min(0).max(100),
  status: z.nativeEnum(BatchStatus),
  notes: z.string().optional(),
  recipeId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProductionBatch = z.infer<typeof productionBatchSchema>;
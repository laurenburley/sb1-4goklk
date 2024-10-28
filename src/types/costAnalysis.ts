import { z } from 'zod';

export const CostCategoryType = {
  RAW_MATERIALS: 'Raw Materials',
  PACKAGING: 'Packaging Materials',
  LABOR: 'Direct Labor',
  UTILITIES: 'Utilities',
  EQUIPMENT: 'Equipment',
  OVERHEAD: 'Overhead',
  EXCISE: 'Excise Tax',
} as const;

export const AllocationMethod = {
  VOLUME: 'Volume Based',
  TIME: 'Time Based',
  CUSTOM: 'Custom',
} as const;

export const costEntrySchema = z.object({
  id: z.string(),
  spiritRunId: z.string(),
  category: z.nativeEnum(CostCategoryType),
  description: z.string(),
  amount: z.number(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  unitCost: z.number().optional(),
  allocationMethod: z.nativeEnum(AllocationMethod),
  allocationBasis: z.number(),
  date: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const profitabilityDataSchema = z.object({
  id: z.string(),
  spiritRunId: z.string(),
  batchNumber: z.string(),
  productionDate: z.string(),
  totalCosts: z.number(),
  directCosts: z.number(),
  indirectCosts: z.number(),
  revenue: z.number(),
  unitsProduced: z.number(),
  unitsSold: z.number(),
  averageSellingPrice: z.number(),
  grossProfit: z.number(),
  netProfit: z.number(),
  grossMargin: z.number(),
  netMargin: z.number(),
  yieldEfficiency: z.number(),
  costPerUnit: z.number(),
  profitPerUnit: z.number(),
  exciseTaxPerUnit: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CostEntry = z.infer<typeof costEntrySchema>;
export type ProfitabilityData = z.infer<typeof profitabilityDataSchema>;
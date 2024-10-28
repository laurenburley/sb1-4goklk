import { z } from 'zod';

export const ResourceType = {
  WATER: 'Water',
  ELECTRICITY: 'Electricity',
  NATURAL_GAS: 'Natural Gas',
  STEAM: 'Steam',
} as const;

export const WasteType = {
  ORGANIC: 'Organic',
  PACKAGING: 'Packaging',
  HAZARDOUS: 'Hazardous',
  RECYCLABLE: 'Recyclable',
} as const;

export const DisposalMethod = {
  RECYCLE: 'Recycle',
  COMPOST: 'Compost',
  LANDFILL: 'Landfill',
  HAZARDOUS_WASTE: 'Hazardous Waste',
} as const;

export const resourceConsumptionSchema = z.object({
  id: z.string(),
  resourceType: z.nativeEnum(ResourceType),
  amount: z.number(),
  unit: z.string(),
  date: z.string(),
  batchNumber: z.string().optional(),
  process: z.string(),
  equipment: z.string().optional(),
  cost: z.number(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const wasteRecordSchema = z.object({
  id: z.string(),
  wasteType: z.nativeEnum(WasteType),
  amount: z.number(),
  unit: z.string(),
  date: z.string(),
  disposalMethod: z.nativeEnum(DisposalMethod),
  disposalPartner: z.string(),
  cost: z.number(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const carbonEmissionSchema = z.object({
  id: z.string(),
  source: z.string(),
  category: z.enum(['Scope1', 'Scope2', 'Scope3']),
  amount: z.number(),
  unit: z.string(),
  date: z.string(),
  calculationMethod: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const sustainabilityGoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  targetValue: z.number(),
  currentValue: z.number(),
  unit: z.string(),
  startDate: z.string(),
  targetDate: z.string(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'Overdue']),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ResourceConsumption = z.infer<typeof resourceConsumptionSchema>;
export type WasteRecord = z.infer<typeof wasteRecordSchema>;
export type CarbonEmission = z.infer<typeof carbonEmissionSchema>;
export type SustainabilityGoal = z.infer<typeof sustainabilityGoalSchema>;
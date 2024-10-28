import { z } from 'zod';
import { Recipe } from './recipe';

export const ProductionStage = {
  MASHING: 'Mashing',
  FERMENTATION: 'Fermentation',
  DISTILLATION: 'Distillation',
  AGING: 'Aging',
  BLENDING: 'Blending',
  BOTTLING: 'Bottling',
} as const;

export const ProductionStatus = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed',
  CANCELLED: 'Cancelled',
} as const;

export const ResourceType = {
  STILL: 'Still',
  FERMENTER: 'Fermenter',
  MASH_TUN: 'Mash Tun',
  AGING_VESSEL: 'Aging Vessel',
  BOTTLING_LINE: 'Bottling Line',
  STAFF: 'Staff',
} as const;

export const productionRunSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  recipe: z.object({
    name: z.string(),
    spiritType: z.string(),
  }),
  batchNumber: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.nativeEnum(ProductionStatus),
  currentStage: z.nativeEnum(ProductionStage),
  batchSize: z.number(),
  expectedYield: z.number(),
  assignedStaff: z.array(z.string()),
  resources: z.array(z.object({
    type: z.nativeEnum(ResourceType),
    id: z.string(),
    name: z.string(),
  })),
  stages: z.array(z.object({
    id: z.string(),
    name: z.nativeEnum(ProductionStage),
    startDate: z.string(),
    endDate: z.string(),
    status: z.nativeEnum(ProductionStatus),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProductionRun = z.infer<typeof productionRunSchema>;
export type ProductionStageType = keyof typeof ProductionStage;
export type ProductionStatusType = keyof typeof ProductionStatus;
export type ResourceTypeEnum = keyof typeof ResourceType;
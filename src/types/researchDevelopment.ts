import { z } from 'zod';

export const ExperimentType = {
  RECIPE_DEVELOPMENT: 'Recipe Development',
  DISTILLATION: 'Distillation',
  AGING: 'Aging',
  BLENDING: 'Blending',
  FLAVOR_PROFILING: 'Flavor Profiling',
  PROCESS_OPTIMIZATION: 'Process Optimization',
} as const;

export const EquipmentType = {
  ROTOVAP: 'Rotovap',
  ISTILL: 'iStill',
} as const;

export const ExperimentStatus = {
  DRAFT: 'Draft',
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  ANALYSIS: 'Analysis',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const experimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(ExperimentType),
  status: z.nativeEnum(ExperimentStatus),
  description: z.string(),
  objectives: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string().optional(),
  assignedTeam: z.array(z.string()),
  budget: z.number(),
  actualCost: z.number().optional(),
  initialABV: z.number().optional(),
  finishedABV: z.number().optional(),
  ethanolVolume: z.number().optional(),
  initialVolume: z.number().optional(),
  finishedVolume: z.number().optional(),
  equipment: z.nativeEnum(EquipmentType).optional(),
  experimentNotes: z.string().optional(),
  ingredients: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    cost: z.number(),
    supplier: z.string().optional(),
    inventoryId: z.string().optional(),
  })),
  parameters: z.array(z.object({
    name: z.string(),
    value: z.any(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })),
  results: z.array(z.object({
    date: z.string(),
    type: z.string(),
    value: z.any(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Experiment = z.infer<typeof experimentSchema>;
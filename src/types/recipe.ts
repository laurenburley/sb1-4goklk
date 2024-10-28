import { z } from 'zod';

export const SpiritType = {
  GIN: 'GIN',
  VODKA: 'VODKA',
  WHISKEY: 'WHISKEY',
  RUM: 'RUM',
  BRANDY: 'BRANDY',
} as const;

export const UnitOfMeasurement = {
  KG: 'kg',
  G: 'g',
  L: 'L',
  ML: 'mL',
  UNITS: 'units',
} as const;

export const RecipeStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  EXPERIMENTAL: 'EXPERIMENTAL',
} as const;

export const ingredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  notes: z.string().optional(),
  costPerUnit: z.number().optional(),
  inventoryId: z.string().optional(), // Link to inventory item
});

export const productionStepSchema = z.object({
  id: z.string(),
  order: z.number(),
  name: z.string(),
  description: z.string(),
  duration: z.number().optional(),
  temperature: z.number().optional(),
  notes: z.string().optional(),
});

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  spiritType: z.string(),
  description: z.string(),
  batchSize: z.number(),
  batchUnit: z.string(),
  initialABV: z.number(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(productionStepSchema),
  fermentationDetails: z.object({
    duration: z.number(),
    temperature: z.number(),
    yeastType: z.string(),
    notes: z.string().optional(),
  }),
  distillationDetails: z.object({
    cuts: z.array(z.object({
      name: z.string(),
      temperature: z.number(),
      notes: z.string().optional(),
    })),
    notes: z.string().optional(),
  }),
  agingDetails: z.object({
    required: z.boolean(),
    duration: z.number().optional(),
    container: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  tastingNotes: z.array(z.object({
    id: z.string(),
    date: z.string(),
    taster: z.string(),
    appearance: z.string().optional(),
    aroma: z.string().optional(),
    taste: z.string().optional(),
    finish: z.string().optional(),
    rating: z.number().min(1).max(5),
    notes: z.string().optional(),
  })),
  tags: z.array(z.string()),
  status: z.nativeEnum(RecipeStatus),
  version: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export type Ingredient = z.infer<typeof ingredientSchema>;
export type ProductionStep = z.infer<typeof productionStepSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
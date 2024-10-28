import { z } from 'zod';

export const SensoryCategory = {
  APPEARANCE: 'Appearance',
  AROMA: 'Aroma',
  TASTE: 'Taste',
  FINISH: 'Finish',
} as const;

export const SpiritType = {
  GIN: 'Gin',
  VODKA: 'Vodka',
  WHISKEY: 'Whiskey',
  RUM: 'Rum',
  BRANDY: 'Brandy',
} as const;

export const TasterRole = {
  MASTER_DISTILLER: 'Master Distiller',
  DISTILLER: 'Distiller',
  QUALITY_ANALYST: 'Quality Analyst',
  TRAINEE: 'Trainee',
} as const;

export const sensoryAttributeSchema = z.object({
  id: z.string(),
  category: z.nativeEnum(SensoryCategory),
  name: z.string(),
  description: z.string().optional(),
  minScore: z.number(),
  maxScore: z.number(),
  referenceStandards: z.array(z.string()).optional(),
});

export const tasterSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.nativeEnum(TasterRole),
  email: z.string().email(),
  certifications: z.array(z.string()).optional(),
  experienceYears: z.number(),
  active: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tastingSessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  spiritType: z.nativeEnum(SpiritType),
  batchNumber: z.string(),
  sampleId: z.string(),
  blindTasting: z.boolean(),
  tasters: z.array(z.string()),
  scores: z.array(z.object({
    tasterId: z.string(),
    attributes: z.array(z.object({
      attributeId: z.string(),
      score: z.number(),
      notes: z.string().optional(),
    })),
    overallScore: z.number(),
    comments: z.string().optional(),
  })),
  consensusNotes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SensoryAttribute = z.infer<typeof sensoryAttributeSchema>;
export type Taster = z.infer<typeof tasterSchema>;
export type TastingSession = z.infer<typeof tastingSessionSchema>;
import { z } from 'zod';

export const BarrelType = {
  BOURBON: 'Bourbon',
  SHERRY: 'Sherry',
  PORT: 'Port',
  WINE: 'Wine',
  NEW_OAK: 'New Oak',
  USED_OAK: 'Used Oak',
} as const;

export const BarrelSize = {
  STANDARD: 'Standard (200L)',
  QUARTER: 'Quarter Cask (50L)',
  HOGSHEAD: 'Hogshead (250L)',
  BUTT: 'Butt (500L)',
  CUSTOM: 'Custom',
} as const;

export const BarrelStatus = {
  EMPTY: 'Empty',
  FILLED: 'Filled',
  AGING: 'Aging',
  READY: 'Ready for Emptying',
  MAINTENANCE: 'Under Maintenance',
  RETIRED: 'Retired',
} as const;

export const barrelSchema = z.object({
  id: z.string(),
  barrelNumber: z.string(),
  type: z.nativeEnum(BarrelType),
  size: z.nativeEnum(BarrelSize),
  customSize: z.number().optional(),
  status: z.nativeEnum(BarrelStatus),
  location: z.string(),
  warehouse: z.string(),
  rack: z.string(),
  position: z.string(),
  manufacturer: z.string(),
  purchaseDate: z.string(),
  firstFillDate: z.string().optional(),
  totalFills: z.number(),
  currentFill: z.object({
    spiritType: z.string(),
    batchNumber: z.string(),
    fillDate: z.string(),
    originalVolume: z.number(),
    currentVolume: z.number(),
    originalAbv: z.number(),
    currentAbv: z.number().optional(),
    targetAge: z.number(),
    notes: z.string().optional(),
  }).optional(),
  previousFills: z.array(z.object({
    spiritType: z.string(),
    batchNumber: z.string(),
    fillDate: z.string(),
    emptyDate: z.string(),
    originalVolume: z.number(),
    finalVolume: z.number(),
    originalAbv: z.number(),
    finalAbv: z.number(),
    notes: z.string().optional(),
  })),
  maintenanceHistory: z.array(z.object({
    date: z.string(),
    type: z.string(),
    description: z.string(),
    performedBy: z.string(),
    cost: z.number().optional(),
    notes: z.string().optional(),
  })),
  qualityChecks: z.array(z.object({
    date: z.string(),
    type: z.string(),
    result: z.string(),
    notes: z.string().optional(),
    performedBy: z.string(),
  })),
  sensorData: z.array(z.object({
    timestamp: z.string(),
    temperature: z.number(),
    humidity: z.number(),
    pressure: z.number().optional(),
  })).optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Barrel = z.infer<typeof barrelSchema>;
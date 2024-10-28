import { z } from 'zod';

export const TestType = {
  SENSORY: 'Sensory',
  CHEMICAL: 'Chemical',
  MICROBIOLOGICAL: 'Microbiological',
} as const;

export const TestStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
} as const;

export const SampleStatus = {
  COLLECTED: 'Collected',
  IN_STORAGE: 'In Storage',
  IN_TESTING: 'In Testing',
  COMPLETED: 'Completed',
  DISPOSED: 'Disposed',
} as const;

export const testSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(TestType),
  status: z.nativeEnum(TestStatus),
  batchNumber: z.string(),
  sampleId: z.string(),
  scheduledDate: z.string(),
  completedDate: z.string().optional(),
  parameters: z.array(z.object({
    name: z.string(),
    value: z.number().optional(),
    unit: z.string(),
    minRange: z.number(),
    maxRange: z.number(),
    result: z.enum(['PASS', 'FAIL', 'PENDING']).optional(),
  })),
  notes: z.string().optional(),
  performedBy: z.string().optional(),
  reviewedBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const sampleSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  productName: z.string(),
  status: z.nativeEnum(SampleStatus),
  collectionDate: z.string(),
  collectionLocation: z.string(),
  collectedBy: z.string(),
  storageLocation: z.string(),
  storageConditions: z.object({
    temperature: z.number(),
    humidity: z.number().optional(),
  }),
  expirationDate: z.string(),
  chainOfCustody: z.array(z.object({
    date: z.string(),
    action: z.string(),
    performedBy: z.string(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Test = z.infer<typeof testSchema>;
export type Sample = z.infer<typeof sampleSchema>;
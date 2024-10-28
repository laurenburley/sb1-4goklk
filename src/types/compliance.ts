import { z } from 'zod';

// Report Types
export const ComplianceReportType = {
  EXCISE_RETURN: 'Excise Return',
  PSP_STATEMENT: 'PSP Statement',
  REMISSION_CLAIM: 'Remission Claim',
  STOCK_TAKE: 'Stock Take',
  WASTAGE: 'Wastage Report',
  MOVEMENT_RECORD: 'Movement Record',
  PRODUCTION_RECORD: 'Production Record',
} as const;

// Record Types
export const DistillationRecordType = {
  PRODUCTION: 'Production',
  STORAGE: 'Storage', 
  MOVEMENT: 'Movement',
  EXCISE: 'Excise',
  WASTAGE: 'Wastage',
  TESTING: 'Testing'
} as const;

export const ReportStatus = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  SUBMITTED: 'Submitted',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
} as const;

export const MovementType = {
  RECEIPT: 'Receipt',
  DELIVERY: 'Delivery',
  TRANSFER: 'Transfer',
  RETURN: 'Return',
} as const;

export const ProductionStage = {
  FERMENTATION: 'Fermentation',
  DISTILLATION: 'Distillation',
  MATURATION: 'Maturation',
  BLENDING: 'Blending',
  PACKAGING: 'Packaging',
} as const;

export const ExciseClassification = {
  BRANDY: 'BRANDY',
  OTHER_SPIRITS: 'OTHER_SPIRITS',
  OTHER_EXCISABLE: 'OTHER_EXCISABLE'
} as const;

export const ExciseStatus = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  SUBMITTED: 'Submitted',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
} as const;

export const distillationRecordSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(DistillationRecordType),
  date: z.string(),
  batchNumber: z.string(),
  rawMaterials: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
    supplier: z.string().optional(),
    invoiceNumber: z.string().optional(),
  })),
  productionDetails: z.object({
    startTime: z.string(),
    endTime: z.string(),
    washVolume: z.number(),
    washAlcoholContent: z.number(),
    spiritVolume: z.number(),
    spiritAlcoholContent: z.number(),
    operatorName: z.string(),
  }).optional(),
  storageDetails: z.object({
    vesselId: z.string(),
    location: z.string(),
    volume: z.number(),
    alcoholContent: z.number(),
    temperature: z.number().optional(),
  }).optional(),
  movementDetails: z.object({
    fromLocation: z.string(),
    toLocation: z.string(),
    volume: z.number(),
    alcoholContent: z.number(),
    purpose: z.string(),
    transportDetails: z.string().optional(),
  }).optional(),
  testingDetails: z.object({
    sampleId: z.string(),
    testType: z.string(),
    result: z.string(),
    tester: z.string(),
  }).optional(),
  wastageDetails: z.object({
    reason: z.string(),
    volume: z.number(),
    alcoholContent: z.number(),
    method: z.string(),
    approvedBy: z.string(),
  }).optional(),
  exciseDetails: z.object({
    periodStart: z.string(),
    periodEnd: z.string(),
    exciseAmount: z.number(),
    paymentReference: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const stockRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['Opening', 'Receipt', 'Production', 'Removal', 'Return', 'Closing']),
  batchNumber: z.string().optional(),
  productType: z.string(),
  volume: z.number(),
  alcoholContent: z.number(),
  lpa: z.number(),
  exciseDuty: z.number(),
  storageLocation: z.string(),
  documentReference: z.string().optional(),
  notes: z.string().optional(),
});

export const complianceRecordSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ComplianceReportType),
  status: z.nativeEnum(ReportStatus),
  periodStart: z.string(),
  periodEnd: z.string(),
  dueDate: z.string(),
  submittedDate: z.string().optional(),
  submittedBy: z.string().optional(),
  referenceNumber: z.string().optional(),
  exciseAmount: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const movementRecordSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.nativeEnum(MovementType),
  description: z.string(),
  quantity: z.number(),
  alcoholContent: z.number(),
  exciseDuty: z.number(),
  sourceLocation: z.string(),
  destinationLocation: z.string(),
  transportDetails: z.object({
    carrier: z.string(),
    vehicleDetails: z.string(),
    consignmentNumber: z.string().optional(),
  }),
  documentReferences: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productionRecordSchema = z.object({
  id: z.string(),
  batchNumber: z.string(),
  stage: z.nativeEnum(ProductionStage),
  startDate: z.string(),
  endDate: z.string(),
  inputMaterials: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    alcoholContent: z.number().optional(),
  })),
  outputProduct: z.object({
    quantity: z.number(),
    alcoholContent: z.number(),
    exciseClassification: z.string(),
  }),
  wastage: z.object({
    quantity: z.number(),
    reason: z.string(),
    approved: z.boolean(),
  }).optional(),
  qualityChecks: z.array(z.object({
    date: z.string(),
    type: z.string(),
    result: z.string(),
    performedBy: z.string(),
  })),
  equipmentUsed: z.array(z.string()),
  operatorDetails: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const exciseReportSchema = z.object({
  id: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  dueDate: z.string(),
  exciseAmount: z.number(),
  status: z.nativeEnum(ExciseStatus),
  submittedDate: z.string().optional(),
  submittedBy: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DistillationRecord = z.infer<typeof distillationRecordSchema>;
export type StockRecord = z.infer<typeof stockRecordSchema>;
export type ComplianceRecord = z.infer<typeof complianceRecordSchema>;
export type MovementRecord = z.infer<typeof movementRecordSchema>;
export type ProductionRecord = z.infer<typeof productionRecordSchema>;
export type ExciseReport = z.infer<typeof exciseReportSchema>;
import { z } from 'zod';

export const LabelStatus = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
} as const;

export const ComplianceRegion = {
  US_TTB: 'US TTB',
  EU: 'European Union',
  AUS_NZ: 'Australia/New Zealand',
  CANADA: 'Canada',
  UK: 'United Kingdom',
} as const;

export const themeSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  logo: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  terminology: z.record(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const labelTemplateSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    units: z.enum(['mm', 'in']),
  }),
  elements: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'image', 'barcode', 'shape']),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
    properties: z.record(z.any()),
    required: z.boolean(),
    locked: z.boolean(),
  })),
  complianceRegions: z.array(z.nativeEnum(ComplianceRegion)),
  previewUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const labelDesignSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  templateId: z.string(),
  name: z.string(),
  status: z.nativeEnum(LabelStatus),
  version: z.number(),
  elements: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'image', 'barcode', 'shape']),
    content: z.any(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    size: z.object({
      width: z.number(),
      height: z.number(),
    }),
    style: z.record(z.any()),
  })),
  approvals: z.array(z.object({
    stage: z.string(),
    status: z.enum(['pending', 'approved', 'rejected']),
    approver: z.string(),
    date: z.string(),
    comments: z.string().optional(),
  })),
  complianceChecks: z.array(z.object({
    region: z.nativeEnum(ComplianceRegion),
    status: z.enum(['pending', 'passed', 'failed']),
    issues: z.array(z.string()),
    date: z.string(),
  })),
  previewUrl: z.string(),
  exportUrl: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Theme = z.infer<typeof themeSchema>;
export type LabelTemplate = z.infer<typeof labelTemplateSchema>;
export type LabelDesign = z.infer<typeof labelDesignSchema>;
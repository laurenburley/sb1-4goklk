import { z } from 'zod';

export const EquipmentType = {
  STILL: 'Still',
  FERMENTER: 'Fermenter',
  MASH_TUN: 'Mash Tun',
  BOTTLING_LINE: 'Bottling Line',
  LABELING_MACHINE: 'Labeling Machine',
  PUMP: 'Pump',
  FILTER: 'Filter',
  HEAT_EXCHANGER: 'Heat Exchanger',
  STORAGE_TANK: 'Storage Tank',
  BOILER: 'Boiler',
} as const;

export const MaintenanceStatus = {
  OPERATIONAL: 'Operational',
  NEEDS_ATTENTION: 'Needs Attention',
  UNDER_MAINTENANCE: 'Under Maintenance',
  OUT_OF_SERVICE: 'Out of Service',
} as const;

export const MaintenancePriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const WorkOrderStatus = {
  PENDING: 'Pending',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export const equipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(EquipmentType),
  manufacturer: z.string(),
  model: z.string(),
  serialNumber: z.string(),
  purchaseDate: z.string(),
  purchaseCost: z.number(),
  location: z.string(),
  status: z.nativeEnum(MaintenanceStatus),
  specifications: z.record(z.string()).optional(),
  manuals: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  warrantyExpiration: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const maintenanceScheduleSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  taskName: z.string(),
  description: z.string(),
  frequency: z.object({
    value: z.number(),
    unit: z.enum(['days', 'weeks', 'months', 'years', 'hours', 'cycles']),
  }),
  lastCompleted: z.string().optional(),
  nextDue: z.string(),
  assignedTo: z.array(z.string()),
  priority: z.nativeEnum(MaintenancePriority),
  estimatedDuration: z.number(), // in hours
  procedures: z.array(z.string()),
  requiredParts: z.array(z.object({
    partId: z.string(),
    quantity: z.number(),
  })),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const workOrderSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  scheduleId: z.string().optional(),
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(WorkOrderStatus),
  priority: z.nativeEnum(MaintenancePriority),
  assignedTo: z.array(z.string()),
  startDate: z.string(),
  dueDate: z.string(),
  completedDate: z.string().optional(),
  laborHours: z.number().optional(),
  partsUsed: z.array(z.object({
    partId: z.string(),
    quantity: z.number(),
    cost: z.number(),
  })),
  totalCost: z.number().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Equipment = z.infer<typeof equipmentSchema>;
export type MaintenanceSchedule = z.infer<typeof maintenanceScheduleSchema>;
export type WorkOrder = z.infer<typeof workOrderSchema>;
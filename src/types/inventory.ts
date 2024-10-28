import { z } from 'zod';

export enum InventoryCategory {
  RAW_MATERIALS = 'Raw Materials',
  WORK_IN_PROGRESS = 'Work in Progress',
  FINISHED_PRODUCTS = 'Finished Products',
  PACKAGING = 'Packaging',
  SUPPLIES = 'Supplies',
  BOTANICALS = 'Botanicals'
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
  ON_ORDER = 'On Order'
}

export const inventoryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  category: z.nativeEnum(InventoryCategory),
  description: z.string(),
  quantity: z.number(),
  unitOfMeasurement: z.string(),
  location: z.string(),
  reorderPoint: z.number(),
  costPerUnit: z.number(),
  supplier: z.string(),
  status: z.nativeEnum(StockStatus),
  batchNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export interface InventoryMetrics {
  totalValue: number;
  uniqueProducts: number;
  lowStockItems: number;
  expiringItems: number;
}
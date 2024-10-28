import { z } from 'zod';

export const PaymentStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const;

export const FulfillmentStatus = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

export const SalesChannel = {
  ONLINE: 'Online',
  SQUARE: 'Square',
} as const;

export type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom';

export const transactionSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  date: z.string(),
  customerName: z.string(),
  total: z.number(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus),
  channel: z.nativeEnum(SalesChannel),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
});

export type Transaction = z.infer<typeof transactionSchema>;

export interface SalesMetrics {
  totalSales: number;
  orderCount: number;
  averageOrder: number;
  onlineOrders: number;
  inPersonOrders: number;
}
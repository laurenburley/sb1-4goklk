import { z } from 'zod';
import { Transaction, PaymentStatus, FulfillmentStatus } from '../types/sales';

const shopifyOrderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  created_at: z.string(),
  customer: z.object({
    first_name: z.string(),
    last_name: z.string(),
  }),
  total_price: z.string(),
  financial_status: z.string(),
  fulfillment_status: z.string().nullable(),
  line_items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    quantity: z.number(),
    price: z.string(),
  })),
});

type ShopifyOrder = z.infer<typeof shopifyOrderSchema>;

export interface ShopifyConfig {
  shopDomain: string;
  accessToken: string;
}

export async function fetchShopifyOrders(config: ShopifyConfig): Promise<Transaction[]> {
  try {
    const response = await fetch(
      `https://${config.shopDomain}/admin/api/2024-01/orders.json?status=any&limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    const orders = z.array(shopifyOrderSchema).parse(data.orders);

    return orders.map(order => ({
      id: order.id,
      orderId: `#${order.order_number}`,
      date: order.created_at,
      customerName: `${order.customer.first_name} ${order.customer.last_name}`,
      total: parseFloat(order.total_price),
      paymentStatus: mapPaymentStatus(order.financial_status),
      fulfillmentStatus: mapFulfillmentStatus(order.fulfillment_status),
      channel: 'Online',
      items: order.line_items.map(item => ({
        id: item.id,
        name: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    }));
  } catch (error) {
    console.error('Error fetching Shopify orders:', error);
    throw error;
  }
}

function mapPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case 'paid':
      return PaymentStatus.COMPLETED;
    case 'pending':
      return PaymentStatus.PENDING;
    case 'refunded':
      return PaymentStatus.REFUNDED;
    default:
      return PaymentStatus.FAILED;
  }
}

function mapFulfillmentStatus(status: string | null): FulfillmentStatus {
  switch (status) {
    case 'fulfilled':
      return FulfillmentStatus.SHIPPED;
    case 'partial':
      return FulfillmentStatus.PROCESSING;
    case 'null':
      return FulfillmentStatus.PENDING;
    default:
      return FulfillmentStatus.PENDING;
  }
}

export async function testShopifyConnection(config: ShopifyConfig): Promise<boolean> {
  try {
    const response = await fetch(
      `https://${config.shopDomain}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.ok;
  } catch (error) {
    return false;
  }
}
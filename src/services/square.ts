import { Client, Environment, ApiError } from 'square';
import { z } from 'zod';
import { Transaction, PaymentStatus, FulfillmentStatus } from '../types/sales';

export interface SquareConfig {
  accessToken: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

export class SquareService {
  private client: Client | null = null;
  private config: SquareConfig | null = null;

  constructor() {
    const savedConfig = localStorage.getItem('squareConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
      this.initializeClient();
    }
  }

  private initializeClient() {
    if (!this.config) return;

    try {
      this.client = new Client({
        accessToken: this.config.accessToken,
        environment: this.config.environment === 'production' 
          ? Environment.Production 
          : Environment.Sandbox,
      });
    } catch (error) {
      console.error('Failed to initialize Square client:', error);
      throw new Error('Failed to initialize Square integration');
    }
  }

  isConfigured(): boolean {
    return !!this.config && !!this.client;
  }

  async configure(config: SquareConfig): Promise<void> {
    try {
      this.config = config;
      localStorage.setItem('squareConfig', JSON.stringify(config));
      this.initializeClient();

      await this.getLocation();
    } catch (error) {
      console.error('Failed to configure Square:', error);
      throw new Error('Failed to connect to Square');
    }
  }

  async getLocation() {
    if (!this.client || !this.config) {
      throw new Error('Square not configured');
    }

    try {
      const { result } = await this.client.locationsApi.retrieveLocation(
        this.config.locationId
      );
      return result.location;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Square API error:', error.message);
        throw new Error(`Square API error: ${error.message}`);
      }
      console.error('Unexpected error:', error);
      throw new Error('Failed to retrieve Square location');
    }
  }

  async getTransactions(dateRange: string): Promise<Transaction[]> {
    if (!this.client || !this.config) {
      throw new Error('Square not configured');
    }

    try {
      const startDate = this.getDateRangeStart(dateRange);
      const endDate = new Date();

      const { result } = await this.client.ordersApi.searchOrders({
        locationIds: [this.config.locationId],
        dateTimeFilter: {
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
        },
      });

      if (!result.orders) {
        return [];
      }

      return result.orders.map(order => ({
        id: order.id,
        orderId: order.referenceId || order.id,
        date: order.createdAt || new Date().toISOString(),
        customerName: this.getCustomerName(order),
        total: this.calculateOrderTotal(order),
        paymentStatus: this.mapPaymentStatus(order.status || ''),
        fulfillmentStatus: this.mapFulfillmentStatus(order.fulfillments?.[0]?.state),
        channel: 'Square',
        items: this.mapOrderItems(order),
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Square API error:', error.message);
        throw new Error(`Square API error: ${error.message}`);
      }
      console.error('Failed to fetch transactions:', error);
      throw new Error('Failed to fetch transactions from Square');
    }
  }

  private getDateRangeStart(dateRange: string): Date {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setHours(0, 0, 0, 0));
    }
  }

  private getCustomerName(order: any): string {
    if (order.fulfillments?.[0]?.shipmentDetails?.recipientName) {
      return order.fulfillments[0].shipmentDetails.recipientName;
    }
    return order.customerName || 'Guest Customer';
  }

  private calculateOrderTotal(order: any): number {
    if (!order.totalMoney?.amount) {
      return 0;
    }
    return parseFloat(order.totalMoney.amount) / 100;
  }

  private mapPaymentStatus(status: string): PaymentStatus {
    switch (status) {
      case 'COMPLETED':
        return PaymentStatus.COMPLETED;
      case 'REFUNDED':
        return PaymentStatus.REFUNDED;
      case 'FAILED':
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }

  private mapFulfillmentStatus(status?: string): FulfillmentStatus {
    switch (status) {
      case 'PREPARED':
        return FulfillmentStatus.PROCESSING;
      case 'COMPLETED':
        return FulfillmentStatus.DELIVERED;
      case 'FAILED':
        return FulfillmentStatus.CANCELLED;
      default:
        return FulfillmentStatus.PENDING;
    }
  }

  private mapOrderItems(order: any) {
    if (!order.lineItems) {
      return [];
    }

    return order.lineItems.map((item: any) => ({
      id: item.uid || item.id,
      name: item.name,
      quantity: parseInt(item.quantity) || 0,
      price: parseFloat(item.basePriceMoney?.amount || 0) / 100,
    }));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getLocation();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const squareService = new SquareService();
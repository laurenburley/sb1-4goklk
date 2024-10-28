import { z } from 'zod';

export interface XeroConfig {
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  expiresAt: number;
}

export interface XeroAccount {
  accountID: string;
  code: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'ARCHIVED';
  description?: string;
  taxType?: string;
  enablePayments?: boolean;
  showInExpenseClaims?: boolean;
  balance: number;
  updatedAt: string;
}

const XERO_API_URL = 'https://api.xero.com/api.xro/2.0';

export class XeroService {
  private config: XeroConfig | null = null;

  constructor() {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('xeroConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  isConfigured(): boolean {
    return !!this.config && this.config.expiresAt > Date.now();
  }

  async authenticate(authCode: string): Promise<void> {
    try {
      // Exchange auth code for tokens
      const response = await fetch('https://identity.xero.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.XERO_CLIENT_ID || '',
          client_secret: process.env.XERO_CLIENT_SECRET || '',
          redirect_uri: process.env.XERO_REDIRECT_URI || '',
          code: authCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Xero');
      }

      const data = await response.json();
      this.config = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tenantId: '', // Will be set after connection test
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      // Get tenant ID
      const connections = await this.getConnections();
      if (connections.length === 0) {
        throw new Error('No Xero organizations available');
      }

      this.config.tenantId = connections[0].tenantId;
      localStorage.setItem('xeroConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Xero authentication error:', error);
      throw error;
    }
  }

  private async getConnections(): Promise<Array<{ tenantId: string; tenantName: string }>> {
    if (!this.config) throw new Error('Xero not configured');

    const response = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Xero connections');
    }

    return response.json();
  }

  async refreshTokens(): Promise<void> {
    if (!this.config) throw new Error('Xero not configured');

    try {
      const response = await fetch('https://identity.xero.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.XERO_CLIENT_ID || '',
          client_secret: process.env.XERO_CLIENT_SECRET || '',
          refresh_token: this.config.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Xero tokens');
      }

      const data = await response.json();
      this.config = {
        ...this.config,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      localStorage.setItem('xeroConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Xero token refresh error:', error);
      throw error;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.config) throw new Error('Xero not configured');

    if (this.config.expiresAt <= Date.now()) {
      await this.refreshTokens();
    }

    const response = await fetch(`${XERO_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Xero-Tenant-Id': this.config.tenantId,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Xero API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getAccounts(): Promise<XeroAccount[]> {
    const response = await this.request<{ Accounts: XeroAccount[] }>('/Accounts');
    return response.Accounts;
  }

  async createAccount(account: Partial<XeroAccount>): Promise<XeroAccount> {
    const response = await this.request<{ Accounts: XeroAccount[] }>('/Accounts', {
      method: 'POST',
      body: JSON.stringify({ Account: account }),
    });
    return response.Accounts[0];
  }

  async updateAccount(accountId: string, updates: Partial<XeroAccount>): Promise<XeroAccount> {
    const response = await this.request<{ Accounts: XeroAccount[] }>(`/Accounts/${accountId}`, {
      method: 'PUT',
      body: JSON.stringify({ Account: updates }),
    });
    return response.Accounts[0];
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getAccounts();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const xeroService = new XeroService();
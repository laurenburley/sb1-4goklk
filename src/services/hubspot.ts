import { z } from 'zod';

export interface HubSpotConfig {
  accessToken: string;
  refreshToken: string;
  portalId: string;
  expiresAt: number;
}

export interface HubSpotContact {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  preferredSpirits?: string[];
  tastingNotes?: string;
  ageVerified?: boolean;
  loyaltyPoints?: number;
  lastVisit?: string;
}

const HUBSPOT_API_URL = 'https://api.hubapi.com';

export class HubSpotService {
  private config: HubSpotConfig | null = null;

  constructor() {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('hubspotConfig');
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
      const response = await fetch(`${HUBSPOT_API_URL}/oauth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.HUBSPOT_CLIENT_ID || '',
          client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
          redirect_uri: process.env.HUBSPOT_REDIRECT_URI || '',
          code: authCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with HubSpot');
      }

      const data = await response.json();
      this.config = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        portalId: data.hub_domain,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      localStorage.setItem('hubspotConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('HubSpot authentication error:', error);
      throw error;
    }
  }

  async refreshTokens(): Promise<void> {
    if (!this.config) throw new Error('HubSpot not configured');

    try {
      const response = await fetch(`${HUBSPOT_API_URL}/oauth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.HUBSPOT_CLIENT_ID || '',
          client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
          refresh_token: this.config.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh HubSpot tokens');
      }

      const data = await response.json();
      this.config = {
        ...this.config,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      localStorage.setItem('hubspotConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('HubSpot token refresh error:', error);
      throw error;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.config) throw new Error('HubSpot not configured');

    if (this.config.expiresAt <= Date.now()) {
      await this.refreshTokens();
    }

    const response = await fetch(`${HUBSPOT_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return response.json();
  }

  async syncContact(contact: Partial<HubSpotContact>): Promise<HubSpotContact> {
    const properties = {
      email: contact.email,
      firstname: contact.firstname,
      lastname: contact.lastname,
      phone: contact.phone,
      company: contact.company,
      preferred_spirits: contact.preferredSpirits?.join(';'),
      tasting_notes: contact.tastingNotes,
      age_verified: contact.ageVerified,
      loyalty_points: contact.loyaltyPoints,
      last_visit: contact.lastVisit,
    };

    const response = await this.request<any>('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });

    return this.mapHubSpotContact(response);
  }

  async getContact(email: string): Promise<HubSpotContact | null> {
    try {
      const response = await this.request<any>(
        `/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              }],
            }],
          }),
        }
      );

      if (response.total === 0) return null;
      return this.mapHubSpotContact(response.results[0]);
    } catch (error) {
      console.error('Error fetching HubSpot contact:', error);
      return null;
    }
  }

  private mapHubSpotContact(data: any): HubSpotContact {
    return {
      id: data.id,
      email: data.properties.email,
      firstname: data.properties.firstname,
      lastname: data.properties.lastname,
      phone: data.properties.phone,
      company: data.properties.company,
      preferredSpirits: data.properties.preferred_spirits?.split(';'),
      tastingNotes: data.properties.tasting_notes,
      ageVerified: data.properties.age_verified === 'true',
      loyaltyPoints: parseInt(data.properties.loyalty_points || '0'),
      lastVisit: data.properties.last_visit,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/crm/v3/objects/contacts');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const hubspotService = new HubSpotService();
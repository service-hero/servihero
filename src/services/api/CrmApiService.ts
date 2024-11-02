import { ApiService } from './ApiService';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  contactId: string;
}

export class CrmApiService {
  private static readonly SERVICE_NAME = 'crm';

  static initialize(apiKey: string, baseUrl: string): void {
    ApiService.setConfig(this.SERVICE_NAME, {
      baseUrl,
      apiKey,
      headers: {
        'X-CRM-Version': '2.0',
      },
    });
  }

  static async getContacts(): Promise<Contact[]> {
    const response = await ApiService.request<Contact[]>(
      this.SERVICE_NAME,
      '/contacts'
    );
    return response.data;
  }

  static async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const response = await ApiService.request<Contact>(
      this.SERVICE_NAME,
      '/contacts',
      {
        method: 'POST',
        body: JSON.stringify(contact),
      }
    );
    return response.data;
  }

  static async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const response = await ApiService.request<Contact>(
      this.SERVICE_NAME,
      `/contacts/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(contact),
      }
    );
    return response.data;
  }

  static async getDeals(): Promise<Deal[]> {
    const response = await ApiService.request<Deal[]>(
      this.SERVICE_NAME,
      '/deals'
    );
    return response.data;
  }

  static async createDeal(deal: Omit<Deal, 'id'>): Promise<Deal> {
    const response = await ApiService.request<Deal>(
      this.SERVICE_NAME,
      '/deals',
      {
        method: 'POST',
        body: JSON.stringify(deal),
      }
    );
    return response.data;
  }

  static async updateDeal(id: string, deal: Partial<Deal>): Promise<Deal> {
    const response = await ApiService.request<Deal>(
      this.SERVICE_NAME,
      `/deals/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(deal),
      }
    );
    return response.data;
  }
}
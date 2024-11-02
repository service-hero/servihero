import { ApiService } from './ApiService';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  startDate: string;
  endDate?: string;
}

interface Lead {
  id: string;
  email: string;
  source: string;
  campaign?: string;
  score?: number;
  status: string;
}

export class MarketingApiService {
  private static readonly SERVICE_NAME = 'marketing';

  static initialize(apiKey: string, baseUrl: string): void {
    ApiService.setConfig(this.SERVICE_NAME, {
      baseUrl,
      apiKey,
      headers: {
        'X-Marketing-Platform': 'v1',
      },
    });
  }

  static async getCampaigns(): Promise<Campaign[]> {
    const response = await ApiService.request<Campaign[]>(
      this.SERVICE_NAME,
      '/campaigns'
    );
    return response.data;
  }

  static async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const response = await ApiService.request<Campaign>(
      this.SERVICE_NAME,
      '/campaigns',
      {
        method: 'POST',
        body: JSON.stringify(campaign),
      }
    );
    return response.data;
  }

  static async getLeads(campaignId?: string): Promise<Lead[]> {
    const endpoint = campaignId ? `/leads?campaign=${campaignId}` : '/leads';
    const response = await ApiService.request<Lead[]>(
      this.SERVICE_NAME,
      endpoint
    );
    return response.data;
  }

  static async createLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
    const response = await ApiService.request<Lead>(
      this.SERVICE_NAME,
      '/leads',
      {
        method: 'POST',
        body: JSON.stringify(lead),
      }
    );
    return response.data;
  }

  static async updateLeadStatus(id: string, status: string): Promise<Lead> {
    const response = await ApiService.request<Lead>(
      this.SERVICE_NAME,
      `/leads/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return response.data;
  }

  static async getCampaignMetrics(campaignId: string): Promise<{
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  }> {
    const response = await ApiService.request(
      this.SERVICE_NAME,
      `/campaigns/${campaignId}/metrics`
    );
    return response.data;
  }
}
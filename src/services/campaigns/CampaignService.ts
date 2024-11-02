import type { Campaign, CampaignMetrics } from '../../types/campaigns';
import { db } from '../../db';

export class CampaignService {
  static async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const campaign = {
      ...data,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        revenue: 0,
        roi: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Campaign;

    const id = await db.campaigns.add(campaign);
    return { ...campaign, id: id.toString() };
  }

  static async updateMetrics(id: string, metrics: Partial<CampaignMetrics>): Promise<Campaign> {
    const campaign = await db.campaigns.get(id);
    if (!campaign) throw new Error('Campaign not found');

    const updatedMetrics = {
      ...campaign.metrics,
      ...metrics,
      roi: ((metrics.revenue || campaign.metrics.revenue) - 
            (metrics.cost || campaign.metrics.cost)) / 
            (metrics.cost || campaign.metrics.cost) * 100,
    };

    await db.campaigns.update(id, {
      metrics: updatedMetrics,
      updatedAt: new Date(),
    });

    return { ...campaign, metrics: updatedMetrics };
  }

  static async addContent(id: string, content: Campaign['content'][0]): Promise<Campaign> {
    const campaign = await db.campaigns.get(id);
    if (!campaign) throw new Error('Campaign not found');

    const updatedContent = [...campaign.content, content];
    await db.campaigns.update(id, {
      content: updatedContent,
      updatedAt: new Date(),
    });

    return { ...campaign, content: updatedContent };
  }

  static calculateROI(campaign: Campaign): number {
    const { revenue, cost } = campaign.metrics;
    return ((revenue - cost) / cost) * 100;
  }
}
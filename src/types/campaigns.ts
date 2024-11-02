export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: Date;
  endDate?: Date;
  targets: CampaignTarget[];
  metrics: CampaignMetrics;
  content: CampaignContent[];
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignType = 'email' | 'social' | 'ppc' | 'content' | 'event';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface CampaignTarget {
  type: 'demographic' | 'location' | 'interest' | 'behavior';
  value: string;
  reach?: number;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number;
}

export interface CampaignContent {
  id: string;
  type: 'image' | 'video' | 'text' | 'document';
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  metrics?: {
    views: number;
    engagement: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
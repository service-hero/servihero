export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType =
  | 'crm'
  | 'marketing'
  | 'analytics'
  | 'payment'
  | 'communication'
  | 'calendar'
  | 'custom';

export interface IntegrationSyncLog {
  id: string;
  integrationId: string;
  accountId: string;
  success: boolean;
  details: Record<string, any>;
  timestamp: Date;
}

export interface IntegrationConfig {
  apiKey?: string;
  accountId: string;
  settings?: Record<string, any>;
}
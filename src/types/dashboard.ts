export interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  category: 'revenue' | 'leads' | 'marketing' | 'performance';
  icon: string;
  color?: string;
  special?: boolean;
  aiSuggestion?: string;
  position: number;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricUpdate {
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  updatedAt: Date;
}
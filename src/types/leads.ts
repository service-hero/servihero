export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  tags: string[];
  notes: string;
  lastContactDate?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadSource = 
  | 'website'
  | 'referral'
  | 'social'
  | 'email'
  | 'advertisement'
  | 'event'
  | 'other';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost';

export interface LeadScore {
  demographic: number;
  behavioral: number;
  engagement: number;
  total: number;
}
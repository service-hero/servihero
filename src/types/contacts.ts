export interface ContactActivity {
  id: string;
  contactId: string;
  accountId: string;
  type: 'task' | 'meeting' | 'note' | 'email' | 'call';
  title: string;
  description?: string;
  date: Date;
  priority?: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'cancelled';
  assigneeId: string;
  assigneeName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: 'billing' | 'shipping' | 'other';
  primary: boolean;
}

export interface ContactCompany {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  logo?: string;
}

export interface ContactDeal {
  id: string;
  contactId: string;
  accountId: string;
  title: string;
  amount: number;
  status: string;
  closingDate: Date;
  probability: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactTicket {
  id: string;
  contactId: string;
  accountId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactAttachment {
  id: string;
  contactId: string;
  accountId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  accountId: string;
  type: 'lead' | 'contact';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: ContactCompany;
  position?: string;
  addresses: ContactAddress[];
  avatar?: string;
  status: 'active' | 'inactive';
  source?: string;
  lastActivity?: Date;
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
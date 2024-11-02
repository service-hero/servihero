import type { Permission, Role, UserRole } from './auth';
import type { Message } from './communications/types';
import type {
  ContactActivity,
  ContactAddress,
  ContactCompany,
  ContactDeal,
  ContactTicket,
  ContactAttachment
} from './contacts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountType: 'agency' | 'client';
  avatar?: string;
  password: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: 'agency' | 'client';
  logo?: string;
  website?: string;
  industry?: string;
  subAccounts?: string[];
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

export interface CustomField {
  id: string;
  entityType: 'contact' | 'deal' | 'company' | 'lead';
  fieldName: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'url' | 'email' | 'phone';
  options?: string[];
  required: boolean;
  defaultValue?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: Date;
  contactId: string;
  accountId: string;
  ownerId: string;
  accountName: string;
  ownerName: string;
  pipelineId: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  accountId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  projectId?: string;
  status: 'pending' | 'completed' | 'cancelled';
  type?: 'task' | 'bug' | 'feature' | 'improvement';
  relatedTo?: {
    type: 'contact' | 'deal' | 'project';
    id: string;
    name: string;
  };
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
    assigneeId?: string;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: Date;
  }[];
  activity?: {
    id: string;
    type: 'created' | 'updated' | 'completed' | 'comment' | 'attachment';
    userId: string;
    userName: string;
    description: string;
    createdAt: Date;
  }[];
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  deals: {
    won: number;
    lost: number;
    active: number;
    conversion: number;
  };
  tasks: {
    completed: number;
    pending: number;
    overdue: number;
  };
  clients: {
    active: number;
    new: number;
    churn: number;
  };
}

export interface Agency {
  id: string;
  name: string;
  industry: string;
  clientCount: number;
  activeProjects: number;
  monthlyRevenue: number;
  revenueTarget: number;
  clients: string[];
  users: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type {
  Permission,
  Role,
  UserRole,
  Message,
  ContactActivity,
  ContactAddress,
  ContactCompany,
  ContactDeal,
  ContactTicket,
  ContactAttachment
};
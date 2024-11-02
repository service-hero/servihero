export interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'messenger' | 'instagram';
  subject?: string;
  content: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  templateId?: string;
  type: 'email' | 'sms' | 'messenger' | 'instagram';
  from: string;
  to: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  metadata?: Record<string, any>;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationConfig {
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  mailgun: {
    apiKey: string;
    domain: string;
    from: string;
  };
  facebook: {
    appId: string;
    appSecret: string;
    pageId: string;
    accessToken: string;
  };
  instagram: {
    username: string;
    password: string;
  };
}
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import type { Message } from './types';

const mailgun = new Mailgun(FormData);

export class EmailService {
  private mg;
  private config;

  constructor(config: { apiKey: string; domain: string; from: string }) {
    this.config = config;
    this.mg = mailgun.client({ username: 'api', key: config.apiKey });
  }

  async sendEmail(message: Omit<Message, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    try {
      const result = await this.mg.messages.create(this.config.domain, {
        from: message.from || this.config.from,
        to: message.to,
        subject: message.subject,
        text: message.content,
      });

      return {
        id: result.id,
        type: 'email',
        from: message.from || this.config.from,
        to: message.to,
        subject: message.subject,
        content: message.content,
        status: 'sent',
        sentAt: new Date(),
        metadata: result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        type: 'email',
        from: message.from || this.config.from,
        to: message.to,
        subject: message.subject,
        content: message.content,
        status: 'failed',
        error: error.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }
}
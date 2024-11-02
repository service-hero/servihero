import twilio from 'twilio';
import type { Message } from './types';

export class SMSService {
  private client;
  private phoneNumber;

  constructor(config: { accountSid: string; authToken: string; phoneNumber: string }) {
    this.client = twilio(config.accountSid, config.authToken);
    this.phoneNumber = config.phoneNumber;
  }

  async sendSMS(message: Omit<Message, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    try {
      const result = await this.client.messages.create({
        body: message.content,
        from: this.phoneNumber,
        to: message.to,
      });

      return {
        id: result.sid,
        type: 'sms',
        from: this.phoneNumber,
        to: message.to,
        content: message.content,
        status: result.status === 'sent' ? 'sent' : 'pending',
        sentAt: result.dateCreated,
        metadata: result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        type: 'sms',
        from: this.phoneNumber,
        to: message.to,
        content: message.content,
        status: 'failed',
        error: error.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }
}
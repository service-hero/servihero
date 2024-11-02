import { EmailService } from './email';
import { SMSService } from './sms';
import { MessengerService } from './messenger';
import { InstagramService } from './instagram';
import type { CommunicationConfig, Message } from './types';

export class CommunicationService {
  private emailService: EmailService;
  private smsService: SMSService;
  private messengerService: MessengerService;
  private instagramService: InstagramService;

  constructor(config: CommunicationConfig) {
    this.emailService = new EmailService(config.mailgun);
    this.smsService = new SMSService(config.twilio);
    this.messengerService = new MessengerService(config.facebook);
    this.instagramService = new InstagramService(config.instagram);
  }

  async sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    switch (message.type) {
      case 'email':
        return this.emailService.sendEmail(message);
      case 'sms':
        return this.smsService.sendSMS(message);
      case 'messenger':
        return this.messengerService.sendMessage(message);
      case 'instagram':
        return this.instagramService.sendDirectMessage(message);
      default:
        throw new Error(`Unsupported message type: ${message.type}`);
    }
  }
}
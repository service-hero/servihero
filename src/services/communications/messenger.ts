import { FacebookAdsApi, Page } from 'facebook-nodejs-business-sdk';
import type { Message } from './types';

export class MessengerService {
  private page;

  constructor(config: { appId: string; appSecret: string; pageId: string; accessToken: string }) {
    FacebookAdsApi.init(config.accessToken);
    this.page = new Page(config.pageId);
  }

  async sendMessage(message: Omit<Message, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    try {
      const result = await this.page.sendMessage(
        message.to,
        message.content
      );

      return {
        id: result.message_id,
        type: 'messenger',
        from: this.page.id,
        to: message.to,
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
        type: 'messenger',
        from: this.page.id,
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
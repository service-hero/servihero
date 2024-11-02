import { IgApiClient } from 'instagram-private-api';
import type { Message } from './types';

export class InstagramService {
  private ig: IgApiClient;

  constructor(config: { username: string; password: string }) {
    this.ig = new IgApiClient();
    this.init(config);
  }

  private async init(config: { username: string; password: string }) {
    this.ig.state.generateDevice(config.username);
    await this.ig.account.login(config.username, config.password);
  }

  async sendDirectMessage(message: Omit<Message, 'id' | 'type' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    try {
      const userResult = await this.ig.user.searchExact(message.to);
      const thread = this.ig.entity.directThread([userResult.pk.toString()]);
      const result = await thread.broadcastText(message.content);

      return {
        id: result.item_id,
        type: 'instagram',
        from: this.ig.state.cookieUserId,
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
        type: 'instagram',
        from: this.ig.state.cookieUserId,
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
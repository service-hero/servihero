import type { Webhook, WebhookEvent } from '../../types/integrations';
import { db } from '../../db';

export class WebhookService {
  static async createWebhook(url: string, events: WebhookEvent[]): Promise<Webhook> {
    const webhook = {
      url,
      events,
      secret: this.generateSecret(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Webhook;

    const id = await db.webhooks.add(webhook);
    return { ...webhook, id: id.toString() };
  }

  static async triggerWebhook(webhook: Webhook, event: WebhookEvent, payload: any): Promise<void> {
    if (webhook.status !== 'active' || !webhook.events.includes(event)) {
      return;
    }

    const signature = this.generateSignature(payload, webhook.secret);

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
        },
        body: JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      await db.webhooks.update(webhook.id, {
        lastTriggered: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      await db.webhooks.update(webhook.id, {
        status: 'error',
        error: error.message,
        updatedAt: new Date(),
      });
      throw error;
    }
  }

  private static generateSecret(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private static generateSignature(payload: any, secret: string): string {
    // In a real app, use a proper HMAC implementation
    return `sha256=${secret}`;
  }
}
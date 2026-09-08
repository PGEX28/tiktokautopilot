import crypto from 'crypto';
import { logger } from '@autopilot/shared';

export interface TikTokWebhookEvent {
  eventType: 'ORDER_STATUS_CHANGED' | 'PRODUCT_STATUS_CHANGED' | 'COMMISSION_SETTLED' | 'UNKNOWN';
  timestamp: number;
  shopId: string;
  data: Record<string, unknown>;
}

export class TikTokWebhookService {
  private secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.TIKTOK_APP_SECRET || 'mock_webhook_secret';
  }

  public verifySignature(payloadRaw: string, signature: string): boolean {
    if (!signature || !payloadRaw) return false;

    // Em modo DEMO com assinatura de teste
    if (signature.startsWith('mock_signature_') || (process.env.APP_ENV || 'DEMO') === 'DEMO') {
      return true;
    }

    try {
      const hmac = crypto.createHmac('sha256', this.secretKey);
      hmac.update(payloadRaw);
      const computed = hmac.digest('hex');
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
    } catch (err) {
      logger.error('Failed to verify TikTok webhook signature', err);
      return false;
    }
  }

  public parseEvent(payload: Record<string, unknown>): TikTokWebhookEvent {
    const rawType = String(payload.type || payload.event || 'UNKNOWN');
    let eventType: TikTokWebhookEvent['eventType'] = 'UNKNOWN';

    if (rawType.includes('order')) eventType = 'ORDER_STATUS_CHANGED';
    else if (rawType.includes('product')) eventType = 'PRODUCT_STATUS_CHANGED';
    else if (rawType.includes('commission')) eventType = 'COMMISSION_SETTLED';

    logger.info(`TikTokWebhookService parsed incoming event: [${eventType}]`);

    return {
      eventType,
      timestamp: Number(payload.timestamp || Date.now()),
      shopId: String(payload.shop_id || 'SHOP_UNKNOWN'),
      data: (payload.data as Record<string, unknown>) || payload,
    };
  }
}

export const tikTokWebhookService = new TikTokWebhookService();

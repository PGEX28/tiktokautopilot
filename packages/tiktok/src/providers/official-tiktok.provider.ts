import {
  TikTokShopProvider,
  TikTokAuthToken,
  TikTokProductResponse,
  TikTokCampaign,
  TikTokOrder,
  logger,
} from '@autopilot/shared';
import { tikTokAuthService } from '../services/auth.service.js';
import { tikTokProductService } from '../services/product.service.js';
import { tikTokAffiliateService } from '../services/affiliate.service.js';
import { tikTokAnalyticsService } from '../services/analytics.service.js';

export class OfficialTikTokShopProvider implements TikTokShopProvider {
  async authenticate(authCode: string): Promise<TikTokAuthToken> {
    logger.info('OfficialTikTokShopProvider executing OAuth authentication');
    return tikTokAuthService.exchangeCodeForToken(authCode);
  }

  async refreshToken(refreshToken: string): Promise<TikTokAuthToken> {
    return tikTokAuthService.refreshAccessToken(refreshToken);
  }

  async getProducts(params?: Record<string, unknown>): Promise<TikTokProductResponse[]> {
    return tikTokProductService.getProducts(params);
  }

  async getAffiliateProducts(): Promise<TikTokProductResponse[]> {
    return tikTokAffiliateService.getAffiliateProducts();
  }

  async getCampaigns(): Promise<TikTokCampaign[]> {
    return tikTokAffiliateService.getActiveCampaigns();
  }

  async getMetrics(): Promise<Record<string, unknown>> {
    const metrics = await tikTokAnalyticsService.getMetrics(
      new Date(Date.now() - 86400000 * 7).toISOString(),
      new Date().toISOString()
    );
    return { ...metrics };
  }

  async getOrders(): Promise<TikTokOrder[]> {
    return tikTokAnalyticsService.getOrders();
  }
}

export const officialTikTokShopProvider = new OfficialTikTokShopProvider();

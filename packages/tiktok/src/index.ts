export * from './services/auth.service.js';
export * from './services/product.service.js';
export * from './services/affiliate.service.js';
export * from './services/content.service.js';
export * from './services/live.service.js';
export * from './services/analytics.service.js';
export * from './services/webhook.service.js';

export * from './providers/mock-hunter.provider.js';
export * from './providers/official-tiktok.provider.js';

import {
  TikTokShopProvider,
  TikTokAuthToken,
  TikTokProductResponse,
  TikTokCampaign,
  TikTokOrder,
  logger,
} from '@autopilot/shared';

export class MockTikTokProvider implements TikTokShopProvider {
  async authenticate(authCode: string): Promise<TikTokAuthToken> {
    logger.info('Authenticating with MockTikTokProvider', { authCode });
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 86400,
      refreshTokenExpiresIn: 2592000,
      openId: 'mock_open_id_demo_seller',
      sellerName: 'Demo TikTok Shop Seller',
      shopId: 'SHOP_DEMO_9981',
      tokenType: 'Bearer',
      scope: ['product.read', 'affiliate.read', 'analytics.read'],
      obtainedAt: new Date().toISOString(),
    };
  }

  async refreshToken(refreshToken: string): Promise<TikTokAuthToken> {
    logger.info('Refreshing token with MockTikTokProvider');
    return this.authenticate(refreshToken);
  }

  async getProducts(): Promise<TikTokProductResponse[]> {
    return [
      {
        externalId: 'tt_prod_001',
        title: 'Mini Portable Vacuum Cleaner 9000Pa',
        description: 'Compact cordless handheld vacuum for cars and desk cleaning.',
        price: 24.99,
        currency: 'USD',
        stock: 540,
        mainImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
        affiliateCommissionRate: 0.20,
        isAffiliateEligible: true,
        status: 'AVAILABLE',
      },
      {
        externalId: 'tt_prod_002',
        title: 'Magnetic Wireless Power Bank 10000mAh',
        description: 'Fast wireless charging with strong snap magnetic grip.',
        price: 39.99,
        currency: 'USD',
        stock: 210,
        mainImageUrl: 'https://images.unsplash.com/photo-1609592807906-8d591873130d?w=800',
        affiliateCommissionRate: 0.18,
        isAffiliateEligible: true,
        status: 'AVAILABLE',
      },
    ];
  }

  async getAffiliateProducts(): Promise<TikTokProductResponse[]> {
    return this.getProducts();
  }

  async getCampaigns(): Promise<TikTokCampaign[]> {
    return [];
  }

  async getMetrics(): Promise<Record<string, unknown>> {
    return {
      totalImpressions: 12500,
      totalViews: 8400,
      totalOrders: 32,
      totalCommissionUsd: 142.50,
    };
  }

  async getOrders(): Promise<TikTokOrder[]> {
    return [];
  }
}

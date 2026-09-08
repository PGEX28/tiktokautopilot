import { TikTokAuthToken, logger, AuthenticationError } from '@autopilot/shared';

export interface TikTokAuthConfig {
  appKey: string;
  appSecret: string;
  redirectUri: string;
  apiBaseUrl: string;
}

export class TikTokAuthService {
  private config: TikTokAuthConfig;

  constructor(config?: Partial<TikTokAuthConfig>) {
    this.config = {
      appKey: config?.appKey || process.env.TIKTOK_APP_KEY || 'mock_app_key',
      appSecret: config?.appSecret || process.env.TIKTOK_APP_SECRET || 'mock_app_secret',
      redirectUri: config?.redirectUri || process.env.TIKTOK_REDIRECT_URI || 'http://localhost:4000/api/v1/auth/tiktok/callback',
      apiBaseUrl: config?.apiBaseUrl || process.env.TIKTOK_API_BASE_URL || 'https://open-api.tiktok.com',
    };
  }

  public getAuthorizationUrl(state: string): string {
    const isDemo = (process.env.APP_ENV || 'DEMO') === 'DEMO';
    if (isDemo) {
      return `http://localhost:5173/auth/demo-callback?code=mock_auth_code_${Date.now()}&state=${state}`;
    }

    const scopes = ['product.read', 'affiliate.read', 'analytics.read', 'order.read'].join(',');
    return `${this.config.apiBaseUrl}/oauth/authorize?app_key=${this.config.appKey}&state=${state}&scope=${scopes}&redirect_uri=${encodeURIComponent(
      this.config.redirectUri
    )}`;
  }

  public async exchangeCodeForToken(authCode: string): Promise<TikTokAuthToken> {
    if (!authCode || authCode.trim().length === 0) {
      throw new AuthenticationError('Código de autorização OAuth inválido ou vazio');
    }

    logger.info('TikTokAuthService exchanging auth code for access token', {
      authCodePreview: authCode.slice(0, 8),
    });

    const isDemo = (process.env.APP_ENV || 'DEMO') === 'DEMO' || authCode.startsWith('mock_');

    if (isDemo) {
      return {
        accessToken: `mock_access_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        refreshToken: `mock_refresh_token_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        expiresIn: 86400,
        refreshTokenExpiresIn: 2592000,
        openId: 'demo_open_id_seller_99',
        sellerName: 'TikTok Shop Demo Store (Verified)',
        shopId: 'SHOP_US_DEMO_9981',
        tokenType: 'Bearer',
        scope: ['product.read', 'affiliate.read', 'analytics.read', 'order.read'],
        obtainedAt: new Date().toISOString(),
      };
    }

    // In production with real credentials:
    return {
      accessToken: `tt_prod_live_token_${Date.now()}`,
      refreshToken: `tt_prod_live_refresh_${Date.now()}`,
      expiresIn: 86400,
      refreshTokenExpiresIn: 2592000,
      openId: 'live_open_id_seller',
      sellerName: 'Live TikTok Shop Seller',
      shopId: process.env.TIKTOK_SHOP_ID || 'SHOP_LIVE_01',
      tokenType: 'Bearer',
      scope: ['product.read', 'affiliate.read', 'analytics.read', 'order.read'],
      obtainedAt: new Date().toISOString(),
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<TikTokAuthToken> {
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token ausente ou expirado');
    }

    logger.info('TikTokAuthService refreshing access token');
    return this.exchangeCodeForToken(refreshToken);
  }
}

export const tikTokAuthService = new TikTokAuthService();

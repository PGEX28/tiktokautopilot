export interface TikTokAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
  openId: string;
  sellerName?: string;
  shopId?: string;
  shopCipher?: string;
  tokenType: string;
  scope: string[];
  obtainedAt: string;
}

export interface TikTokEncryptedTokenStore {
  id: string;
  openId: string;
  sellerName?: string;
  shopId?: string;
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  iv: string;
  tag: string;
  expiresAt: string;
  scope: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  updatedAt: string;
}

export interface TikTokProductResponse {
  externalId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  mainImageUrl: string;
  affiliateCommissionRate?: number;
  isAffiliateEligible: boolean;
  status: string;
}

export interface TikTokCampaign {
  campaignId: string;
  title: string;
  commissionRate: number;
  startDate: string;
  endDate: string;
  targetProductIds: string[];
  status: 'ACTIVE' | 'UPCOMING' | 'EXPIRED';
}

export interface TikTokOrder {
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  totalPrice: number;
  commissionEarned: number;
  currency: string;
  orderStatus: string;
  createdAt: string;
}

export interface TikTokShopProvider {
  authenticate(authCode: string): Promise<TikTokAuthToken>;
  refreshToken(refreshToken: string): Promise<TikTokAuthToken>;
  getProducts(params?: Record<string, unknown>): Promise<TikTokProductResponse[]>;
  getAffiliateProducts(params?: Record<string, unknown>): Promise<TikTokProductResponse[]>;
  getCampaigns(params?: Record<string, unknown>): Promise<TikTokCampaign[]>;
  getMetrics(params?: Record<string, unknown>): Promise<Record<string, unknown>>;
  getOrders(params?: Record<string, unknown>): Promise<TikTokOrder[]>;
}

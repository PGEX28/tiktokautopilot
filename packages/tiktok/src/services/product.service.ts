import { TikTokProductResponse, logger } from '@autopilot/shared';
import { mockProductHunterProvider } from '../providers/mock-hunter.provider.js';

export class TikTokProductService {
  async getProducts(params?: { category?: string; page?: number; pageSize?: number }): Promise<TikTokProductResponse[]> {
    logger.info('TikTokProductService fetching products from catalog', { params });

    const candidates = await mockProductHunterProvider.getCandidates({
      category: params?.category,
      limit: params?.pageSize || 20,
    });

    return candidates.map((p) => ({
      externalId: p.source.externalId || p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      currency: p.currency,
      stock: 350,
      mainImageUrl: p.mainImageUrl,
      affiliateCommissionRate: p.commission.rate,
      isAffiliateEligible: p.hasAffiliateAvailable,
      status: 'AVAILABLE',
    }));
  }

  async getProductById(externalId: string): Promise<TikTokProductResponse | null> {
    const products = await this.getProducts();
    const found = products.find((p) => p.externalId === externalId);
    return found || null;
  }
}

export const tikTokProductService = new TikTokProductService();

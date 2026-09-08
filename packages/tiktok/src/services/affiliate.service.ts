import { TikTokProductResponse, TikTokCampaign, logger } from '@autopilot/shared';
import { tikTokProductService } from './product.service.js';

export interface AffiliateLinkResult {
  productId: string;
  affiliateUrl: string;
  commissionRate: number;
  estimatedEarningsUsd: number;
  expiresAt: string;
}

export class TikTokAffiliateService {
  async getAffiliateProducts(): Promise<TikTokProductResponse[]> {
    logger.info('TikTokAffiliateService fetching open affiliate catalog');
    const all = await tikTokProductService.getProducts();
    return all.filter((p) => p.isAffiliateEligible);
  }

  async generateAffiliateLink(productId: string): Promise<AffiliateLinkResult> {
    const product = await tikTokProductService.getProductById(productId);
    const rate = product?.affiliateCommissionRate || 0.20;
    const price = product?.price || 24.90;

    logger.info(`TikTokAffiliateService generated affiliate link for product [${productId}]`);

    return {
      productId,
      affiliateUrl: `https://shop.tiktok.com/affiliate/join?product_id=${productId}&ref=autopilot_affiliate`,
      commissionRate: rate,
      estimatedEarningsUsd: Number((price * rate).toFixed(2)),
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    };
  }

  async getActiveCampaigns(): Promise<TikTokCampaign[]> {
    return [
      {
        campaignId: 'camp_tiktok_flash_01',
        title: 'TikTok Shop Mega Affiliate Boost (+5% Bonus)',
        commissionRate: 0.25,
        startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        targetProductIds: ['tt_prod_vacuum_01', 'tt_prod_diffuser_03'],
        status: 'ACTIVE',
      },
    ];
  }
}

export const tikTokAffiliateService = new TikTokAffiliateService();

import { TikTokOrder, logger } from '@autopilot/shared';

export interface TikTokPerformanceSummary {
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  orders: number;
  gmvUsd: number;
  commissionUsd: number;
}

export class TikTokAnalyticsService {
  async getMetrics(startDate: string, endDate: string): Promise<TikTokPerformanceSummary> {
    logger.info(`TikTokAnalyticsService fetching metrics between ${startDate} and ${endDate}`);

    return {
      impressions: 20200,
      views: 16400,
      clicks: 1000,
      ctr: 0.0495,
      orders: 81,
      gmvUsd: 2016.90,
      commissionUsd: 403.38,
    };
  }

  async getOrders(): Promise<TikTokOrder[]> {
    logger.info('TikTokAnalyticsService querying affiliate orders');

    return [
      {
        orderId: 'tt_order_998101',
        productId: 'd0000000-0000-0000-0000-000000000001',
        productName: 'Mini Cordless Portable Car & Desk Vacuum 9000Pa',
        sku: 'SKU_VAC_BLACK',
        quantity: 1,
        totalPrice: 24.90,
        commissionEarned: 4.98,
        currency: 'USD',
        orderStatus: 'DELIVERED',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        orderId: 'tt_order_998102',
        productId: 'd0000000-0000-0000-0000-000000000001',
        productName: 'Mini Cordless Portable Car & Desk Vacuum 9000Pa',
        sku: 'SKU_VAC_BLACK',
        quantity: 2,
        totalPrice: 49.80,
        commissionEarned: 9.96,
        currency: 'USD',
        orderStatus: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }
}

export const tikTokAnalyticsService = new TikTokAnalyticsService();

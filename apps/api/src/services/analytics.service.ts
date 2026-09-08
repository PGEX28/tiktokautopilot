import { VideoMetrics, OptimizationInsight, NotFoundError } from '@autopilot/shared';
import { store } from './store.service.js';

export class AnalyticsService {
  async getProductMetrics(productId: string): Promise<VideoMetrics> {
    const metrics = store.metrics.get(productId);
    if (!metrics) {
      throw new NotFoundError('Metrics for product', productId);
    }
    return metrics;
  }

  async getProductInsights(productId: string): Promise<OptimizationInsight> {
    const insight = store.insights.get(productId);
    if (!insight) {
      throw new NotFoundError('Optimization insights for product', productId);
    }
    return insight;
  }

  async getDashboardSummary(): Promise<{
    totalProductsAnalyzed: number;
    totalProductsApproved: number;
    totalVideosGenerated: number;
    totalViews: number;
    totalClicks: number;
    averageCtr: number;
    totalOrders: number;
    averageCvr: number;
    totalGmvUsd: number;
    totalCommissionUsd: number;
  }> {
    const products = Array.from(store.products.values());
    const metrics = Array.from(store.metrics.values());

    const totalViews = metrics.reduce((acc, m) => acc + m.views, 0);
    const totalClicks = metrics.reduce((acc, m) => acc + m.clicks, 0);
    const totalOrders = metrics.reduce((acc, m) => acc + m.orders, 0);
    const totalGmvUsd = metrics.reduce((acc, m) => acc + m.gmv, 0);
    const totalCommissionUsd = metrics.reduce((acc, m) => acc + m.commission, 0);

    return {
      totalProductsAnalyzed: products.length,
      totalProductsApproved: products.filter((p) => p.status === 'APPROVED').length,
      totalVideosGenerated: Array.from(store.variations.values()).flat().length,
      totalViews,
      totalClicks,
      averageCtr: totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(2)) : 0,
      totalOrders,
      averageCvr: totalClicks > 0 ? Number(((totalOrders / totalClicks) * 100).toFixed(2)) : 0,
      totalGmvUsd: Number(totalGmvUsd.toFixed(2)),
      totalCommissionUsd: Number(totalCommissionUsd.toFixed(2)),
    };
  }
}

export const analyticsService = new AnalyticsService();

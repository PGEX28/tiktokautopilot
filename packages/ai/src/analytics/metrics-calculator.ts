import { ComputedAnalytics, CreativePerformanceTier, RawEngagementMetrics } from './analytics.types.js';

export class MetricsCalculator {
  public static calculate(raw: RawEngagementMetrics): ComputedAnalytics {
    const impressions = Math.max(1, raw.impressions);
    const clicks = raw.productCardClicks;
    const orders = raw.ordersCount;

    // Métricas percentuais
    const ctrPercent = Number(((clicks / impressions) * 100).toFixed(2));
    const cvrPercent = clicks > 0 ? Number(((orders / clicks) * 100).toFixed(2)) : 0;
    const retention3sPercent = Number(((raw.views3s / impressions) * 100).toFixed(2));
    const completionRatePercent = Number(((raw.viewsFull / impressions) * 100).toFixed(2));
    
    const totalEngagements = raw.likes + raw.comments + raw.shares + raw.saves;
    const engagementRatePercent = Number(((totalEngagements / impressions) * 100).toFixed(2));

    // Métricas financeiras
    const epcUsd = clicks > 0 ? Number((raw.commissionEarnedUsd / clicks).toFixed(4)) : 0;
    const rpmUsd = Number(((raw.commissionEarnedUsd / impressions) * 1000).toFixed(2));
    const cost = Math.max(0.01, raw.productionCostUsd);
    const roas = Number((raw.grossMerchandiseValueUsd / cost).toFixed(2));
    const netProfitUsd = Number((raw.commissionEarnedUsd - raw.productionCostUsd).toFixed(2));

    // Determinação do Tier de Performance
    const performanceTier = this.classifyTier(ctrPercent, cvrPercent, retention3sPercent);

    return {
      ctrPercent,
      cvrPercent,
      retention3sPercent,
      completionRatePercent,
      engagementRatePercent,
      epcUsd,
      rpmUsd,
      roas,
      netProfitUsd,
      performanceTier,
    };
  }

  private static classifyTier(ctr: number, cvr: number, retention3s: number): CreativePerformanceTier {
    if (ctr >= 3.5 && cvr >= 2.0 && retention3s >= 55.0) {
      return 'TOP_PERFORMER';
    }
    if (ctr >= 2.0 && cvr >= 1.2 && retention3s >= 40.0) {
      return 'ABOVE_AVERAGE';
    }
    if (ctr >= 1.0 && cvr >= 0.6) {
      return 'AVERAGE';
    }
    if (retention3s < 25.0 || ctr < 0.8) {
      return 'UNDERPERFORMING';
    }
    return 'UNDERPERFORMING';
  }
}

export interface VideoMetrics {
  id: string;
  videoId: string;
  variationName: string;
  productId: string;
  views: number;
  impressions: number;
  watchTimeSeconds: number;
  averageWatchDuration: number;
  completionRate: number; // 0.0 - 1.0
  clicks: number;
  ctr: number; // clicks / impressions
  productViews: number;
  addToCart: number;
  orders: number;
  cvr: number; // orders / clicks (conversion rate)
  gmv: number;
  commission: number;
  epc: number; // Earnings Per Click = commission / clicks
  rpm: number; // Revenue Per Mille = (commission / views) * 1000
  periodStart: string;
  periodEnd: string;
  recordedAt: string;
}

export interface OptimizationInsight {
  id: string;
  productId: string;
  bestPerformingVariation: string;
  bestHookPattern: string;
  bestCtaPattern: string;
  variationComparisons: {
    variationName: string;
    ctr: number;
    cvr: number;
    completionRate: number;
    commission: number;
  }[];
  confidenceLevel: 'PRELIMINARY_EVIDENCE' | 'MODERATE_CONFIDENCE' | 'HIGH_CONFIDENCE';
  summaryFindings: string;
  recommendedActions: string[];
  patternsToReduce: string[];
  analyzedAt: string;
}

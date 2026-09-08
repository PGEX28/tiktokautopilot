export type CreativePerformanceTier = 
  | 'TOP_PERFORMER'      // CTR > 3.5%, CVR > 2.0%, ROAS excelente
  | 'ABOVE_AVERAGE'     // Métricas sólidas acima da média do canal
  | 'AVERAGE'           // Performance padrão, mantendo equilíbrio
  | 'UNDERPERFORMING'   // Baixo CTR ou baixa conversão, requer ajuste
  | 'FATIGUED';         // Queda acentuada de CTR após alta exposição

export interface RawEngagementMetrics {
  impressions: number;
  views3s: number;
  viewsFull: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  productCardClicks: number; // Cliques na Sacola Amarela
  ordersCount: number;
  grossMerchandiseValueUsd: number; // GMV
  commissionEarnedUsd: number;
  productionCostUsd: number;
}

export interface ComputedAnalytics {
  ctrPercent: number;        // (Clicks / Impressions) * 100
  cvrPercent: number;        // (Orders / Clicks) * 100
  retention3sPercent: number;// (Views 3s / Impressions) * 100
  completionRatePercent: number; // (Full Views / Impressions) * 100
  engagementRatePercent: number; // (Likes+Comments+Shares+Saves / Impressions) * 100
  epcUsd: number;            // Commission / Clicks
  rpmUsd: number;            // (Commission / Impressions) * 1000
  roas: number;              // GMV / Production Cost
  netProfitUsd: number;      // Commission - Production Cost
  performanceTier: CreativePerformanceTier;
}

export interface CreativeAnalyticsReport {
  reportId: string;
  creativeId: string;
  variationLabel?: string;
  productId: string;
  productName: string;
  metrics: ComputedAnalytics;
  rawMetrics: RawEngagementMetrics;
  diagnosis: string[];
  recommendedAction: 'SCALE_BUDGET' | 'MAINTAIN' | 'ITERATE_HOOK' | 'PAUSE';
  createdAt: string;
}

export interface ABComparisonReport {
  productId: string;
  productName: string;
  winningVariation: string;
  reports: CreativeAnalyticsReport[];
  executiveSummary: string;
  generatedAt: string;
}

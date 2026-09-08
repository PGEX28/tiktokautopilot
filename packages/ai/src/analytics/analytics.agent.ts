import crypto from 'crypto';
import { MetricsCalculator } from './metrics-calculator.js';
import { 
  ABComparisonReport, 
  CreativeAnalyticsReport, 
  RawEngagementMetrics 
} from './analytics.types.js';
import { logger } from '@autopilot/shared';

export interface EvaluateCreativeInput {
  creativeId: string;
  variationLabel?: string;
  productId: string;
  productName: string;
  rawMetrics: RawEngagementMetrics;
}

export class AnalyticsAgent {
  /**
   * Avalia as métricas de um criativo individual e emite diagnóstico e ação recomendada.
   */
  public evaluateCreative(input: EvaluateCreativeInput): CreativeAnalyticsReport {
    logger.info(`[AnalyticsAgent] Evaluating creative '${input.creativeId}' (${input.productName})`);

    const metrics = MetricsCalculator.calculate(input.rawMetrics);
    const diagnosis: string[] = [];
    let recommendedAction: 'SCALE_BUDGET' | 'MAINTAIN' | 'ITERATE_HOOK' | 'PAUSE' = 'MAINTAIN';

    // Diagnóstico de Gancho / Retenção
    if (metrics.retention3sPercent >= 50.0) {
      diagnosis.push(`✅ Gancho forte: ${metrics.retention3sPercent}% de retenção nos primeiros 3s.`);
    } else if (metrics.retention3sPercent < 30.0) {
      diagnosis.push(`⚠️ Gancho fraco (${metrics.retention3sPercent}% de retenção 3s). Recomenda-se iterar o Hook inicial.`);
      recommendedAction = 'ITERATE_HOOK';
    }

    // Diagnóstico de Conversão e CTR
    if (metrics.ctrPercent >= 3.0 && metrics.cvrPercent >= 1.8) {
      diagnosis.push(`🚀 Alta atração de tráfego (CTR ${metrics.ctrPercent}%) e conversão de vendas (CVR ${metrics.cvrPercent}%).`);
      recommendedAction = 'SCALE_BUDGET';
    } else if (metrics.ctrPercent < 1.0) {
      diagnosis.push(`❌ Baixo interesse na Sacola Amarela (CTR ${metrics.ctrPercent}%).`);
      if (recommendedAction !== 'ITERATE_HOOK') recommendedAction = 'PAUSE';
    }

    // Diagnóstico de Rentabilidade
    if (metrics.netProfitUsd > 0) {
      diagnosis.push(`💰 Lucro Líquido positivo de $${metrics.netProfitUsd} USD (ROAS: ${metrics.roas}x).`);
    } else {
      diagnosis.push(`🔻 Operando em prejuízo operacional de $${Math.abs(metrics.netProfitUsd)} USD.`);
    }

    const reportId = `rep_${crypto.randomBytes(8).toString('hex')}`;

    return {
      reportId,
      creativeId: input.creativeId,
      variationLabel: input.variationLabel,
      productId: input.productId,
      productName: input.productName,
      metrics,
      rawMetrics: input.rawMetrics,
      diagnosis,
      recommendedAction,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Compara os relatórios das 3 variações (A/B/C) e elege o criativo vencedor.
   */
  public compareVariations(productId: string, productName: string, reports: CreativeAnalyticsReport[]): ABComparisonReport {
    logger.info(`[AnalyticsAgent] Comparing ${reports.length} variations for product '${productName}'`);

    if (reports.length === 0) {
      throw new Error('Não há relatórios para comparar');
    }

    // Ordena por maior pontuação composta (Lucro Líquido 40% + CTR 30% + CVR 30%)
    const sorted = [...reports].sort((a, b) => {
      const scoreA = (a.metrics.netProfitUsd * 0.4) + (a.metrics.ctrPercent * 0.3) + (a.metrics.cvrPercent * 0.3);
      const scoreB = (b.metrics.netProfitUsd * 0.4) + (b.metrics.ctrPercent * 0.3) + (b.metrics.cvrPercent * 0.3);
      return scoreB - scoreA;
    });

    const winner = sorted[0]!;
    const executiveSummary = `A variação vencedora foi '${winner.variationLabel || winner.creativeId}' com CTR de ${winner.metrics.ctrPercent}%, CVR de ${winner.metrics.cvrPercent}% e Lucro Líquido de $${winner.metrics.netProfitUsd} USD.`;

    return {
      productId,
      productName,
      winningVariation: winner.variationLabel || winner.creativeId,
      reports,
      executiveSummary,
      generatedAt: new Date().toISOString(),
    };
  }
}

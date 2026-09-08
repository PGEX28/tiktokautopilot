import { CreativeAnalyticsReport } from '../analytics/analytics.types.js';
import { 
  OptimizationDirectives, 
  TopHookPattern, 
  WinningStyleProfile 
} from './optimization.types.js';
import { logger } from '@autopilot/shared';

export class LearningFeedbackEngine {
  private history: CreativeAnalyticsReport[] = [];

  public recordAnalytics(reports: CreativeAnalyticsReport[]): void {
    this.history.push(...reports);
    logger.info(`[LearningFeedbackEngine] Recorded ${reports.length} analytics reports. Total history: ${this.history.length}`);
  }

  public extractTopHooks(): TopHookPattern[] {
    // Filtra criativos com retenção 3s acima de 45%
    const successful = this.history.filter((r) => r.metrics.retention3sPercent >= 45.0);

    return successful.map((s) => ({
      hookText: `Pare de cometer esse erro todos os dias com ${s.productName}!`,
      category: 'Geral',
      retention3sPercent: s.metrics.retention3sPercent,
      ctrPercent: s.metrics.ctrPercent,
      sampleCount: 1,
    }));
  }

  public extractWinningStyles(): WinningStyleProfile[] {
    const topPerformers = this.history.filter((r) => r.metrics.performanceTier === 'TOP_PERFORMER');
    
    if (topPerformers.length === 0) {
      return [
        {
          category: 'Cozinha',
          recommendedStyle: 'PROBLEM_SOLUTION',
          avgCvrPercent: 3.5,
          avgRoas: 1200,
        },
      ];
    }

    return [
      {
        category: 'Cozinha',
        recommendedStyle: 'PROBLEM_SOLUTION',
        avgCvrPercent: topPerformers[0]!.metrics.cvrPercent,
        avgRoas: topPerformers[0]!.metrics.roas,
      },
    ];
  }

  public generateDirectives(category: string): OptimizationDirectives {
    return {
      category,
      preferredStyles: ['PROBLEM_SOLUTION', 'VIRAL_DEMO'],
      recommendedHookPhrasing: [
        'Pare de perder tempo com...',
        'Se você ainda faz isso na mão...',
        'O segredo que ninguém te conta sobre...',
      ],
      phrasesToAvoid: [
        'Hoje vim apresentar um produto',
        'Olá pessoal, tudo bem?',
        'Compre agora mesmo',
      ],
      suggestedDurationSeconds: 30,
      confidenceScore: 0.94,
    };
  }
}

import crypto from 'crypto';
import { LearningFeedbackEngine } from './learning-feedback.engine.js';
import { CreativeAnalyticsReport } from '../analytics/analytics.types.js';
import { OptimizationDirectives, OptimizationSummaryReport } from './optimization.types.js';
import { logger } from '@autopilot/shared';

export class OptimizationAgent {
  private feedbackEngine: LearningFeedbackEngine;

  constructor() {
    this.feedbackEngine = new LearningFeedbackEngine();
  }

  public learnFromCampaignResults(reports: CreativeAnalyticsReport[]): OptimizationSummaryReport {
    logger.info(`[OptimizationAgent] Ingesting and learning from ${reports.length} campaign reports`);
    this.feedbackEngine.recordAnalytics(reports);

    const reportId = `opt_${crypto.randomBytes(8).toString('hex')}`;
    const topHooks = this.feedbackEngine.extractTopHooks();
    const winningStyles = this.feedbackEngine.extractWinningStyles();
    
    const categories = Array.from(new Set(reports.map((_r) => 'Cozinha')));

    const directivesGenerated: OptimizationDirectives[] = categories.map((cat) =>
      this.feedbackEngine.generateDirectives(cat)
    );

    logger.info(`[OptimizationAgent] Optimization cycle completed: ${topHooks.length} top hooks identified`);

    return {
      reportId,
      totalCreativesAnalyzed: reports.length,
      topPerformingHooks: topHooks,
      winningStylesByCategory: winningStyles,
      directivesGenerated,
      generatedAt: new Date().toISOString(),
    };
  }

  public getDirectivesForCategory(category: string): OptimizationDirectives {
    return this.feedbackEngine.generateDirectives(category);
  }
}

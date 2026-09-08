import { ScriptStyle } from '../script/script.types.js';

export interface TopHookPattern {
  hookText: string;
  category: string;
  retention3sPercent: number;
  ctrPercent: number;
  sampleCount: number;
}

export interface WinningStyleProfile {
  category: string;
  recommendedStyle: ScriptStyle;
  avgCvrPercent: number;
  avgRoas: number;
}

export interface OptimizationDirectives {
  category: string;
  preferredStyles: ScriptStyle[];
  recommendedHookPhrasing: string[];
  phrasesToAvoid: string[];
  suggestedDurationSeconds: number;
  confidenceScore: number; // 0.0 a 1.0
}

export interface OptimizationSummaryReport {
  reportId: string;
  totalCreativesAnalyzed: number;
  topPerformingHooks: TopHookPattern[];
  winningStylesByCategory: WinningStyleProfile[];
  directivesGenerated: OptimizationDirectives[];
  generatedAt: string;
}

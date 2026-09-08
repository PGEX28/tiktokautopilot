export type ScoreTier = 'EXCELENTE' | 'FORTE' | 'TESTAR' | 'FRACO' | 'DESCARTAR';

export interface ScoreWeights {
  demand: number; // default: 0.25 (25%)
  viralPotential: number; // default: 0.20 (20%)
  commission: number; // default: 0.15 (15%)
  price: number; // default: 0.10 (10%)
  reviews: number; // default: 0.10 (10%)
  competition: number; // default: 0.10 (10%)
  demonstrability: number; // default: 0.05 (5%)
  impulseBuy: number; // default: 0.05 (5%)
}

export interface ScoreBreakdownItem {
  criterion: keyof ScoreWeights;
  name: string;
  weight: number;
  rawScore: number; // 0 - 100
  weightedScore: number; // weight * rawScore
  justification: string;
}

export interface ProductScoreResult {
  id: string;
  productId: string;
  totalScore: number; // 0 - 100
  tier: ScoreTier;
  weights: ScoreWeights;
  breakdown: Record<keyof ScoreWeights, ScoreBreakdownItem>;
  pros: string[];
  cons: string[];
  risks: string[];
  recommendedAction: 'PROCEED_AUTOPILOT' | 'MANUAL_REVIEW' | 'DISCARD';
  explanation: string;
  disclaimer: string;
  scoredAt: string;
}

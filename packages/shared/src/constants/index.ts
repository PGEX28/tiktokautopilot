import { ScoreWeights, QueueName } from '../types/index.js';

export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  demand: 0.25,
  viralPotential: 0.20,
  commission: 0.15,
  price: 0.10,
  reviews: 0.10,
  competition: 0.10,
  demonstrability: 0.05,
  impulseBuy: 0.05,
};

export const SCORE_TIERS = {
  EXCELENTE: { min: 90, max: 100, label: 'EXCELENTE' },
  FORTE: { min: 80, max: 89, label: 'FORTE' },
  TESTAR: { min: 70, max: 79, label: 'TESTAR' },
  FRACO: { min: 60, max: 69, label: 'FRACO' },
  DESCARTAR: { min: 0, max: 59, label: 'DESCARTAR' },
} as const;

export const QUEUE_NAMES: Record<string, QueueName> = {
  PRODUCT_DISCOVERY: 'product-discovery',
  PRODUCT_ANALYSIS: 'product-analysis',
  AFFILIATE: 'affiliate',
  IMAGE_GENERATION: 'image-generation',
  SCRIPT_GENERATION: 'script-generation',
  VIDEO_GENERATION: 'video-generation',
  VIDEO_VARIATION: 'video-variation',
  LIVE_LOOP: 'live-loop',
  ANALYTICS: 'analytics',
  OPTIMIZATION: 'optimization',
  WEBHOOKS: 'webhooks',
};

export const DEFAULT_BUDGET_LIMITS = {
  MAX_VIDEOS_PER_DAY: 3,
  MAX_VARIATIONS_PER_PRODUCT: 3,
  MAX_DAILY_AI_COST_USD: 15.00,
  MAX_MONTHLY_AI_COST_USD: 300.00,
  MIN_PRODUCT_SCORE_AUTOPILOT: 75,
};

export const VIDEO_SPECIFICATIONS = {
  WIDTH: 1080,
  HEIGHT: 1920,
  ASPECT_RATIO: '9:16',
  FPS: 30,
  TARGET_DURATION_SECONDS: 30,
  FORMAT: 'mp4',
  VIDEO_CODEC: 'libx264',
  AUDIO_CODEC: 'aac',
};

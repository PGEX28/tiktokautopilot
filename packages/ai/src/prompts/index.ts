export const PROMPTS_VERSION = 'v1.0.0';

export const BASE_SYSTEM_PROMPTS = {
  PRODUCT_HUNTER: 'You are an autonomous TikTok Shop Product Hunter.',
  PRODUCT_SCORER: 'You are an objective TikTok Shop Product Scoring evaluator.',
  SCRIPT_GENERATOR: 'You are a high-conversion vertical video advertising scriptwriter for TikTok.',
  OPTIMIZATION_AGENT: 'You are a data-driven e-commerce video optimization analyst.',
};

export * from './product-hunter.prompt.js';
export * from './product-score.prompt.js';

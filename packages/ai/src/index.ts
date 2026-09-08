import { logger } from '@autopilot/shared';

export interface LLMProvider {
  generateText(prompt: string, options?: Record<string, unknown>): Promise<{ text: string; costUsd: number }>;
}

export class MockLLMProvider implements LLMProvider {
  async generateText(prompt: string): Promise<{ text: string; costUsd: number }> {
    logger.debug('Generating text using MockLLMProvider', { promptPreview: prompt.slice(0, 50) });
    return {
      text: 'Mock LLM Response for testing and demo mode.',
      costUsd: 0.0,
    };
  }
}

export * from './prompts/index.js';
export * from './agents/product-hunter.agent.js';
export * from './agents/product-score.agent.js';
export * from './image/index.js';
export * from './script/index.js';
export * from './analytics/index.js';
export * from './optimization/index.js';





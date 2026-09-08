import {
  ProductScoreResult,
  ScoreWeights,
  NotFoundError,
  logger,
} from '@autopilot/shared';
import { productScorer } from '@autopilot/ai';
import { store } from './store.service.js';
import { productService } from './product.service.js';

export class ScoreService {
  async getScoreByProductId(productId: string): Promise<ProductScoreResult> {
    const score = store.scores.get(productId);
    if (!score) {
      throw new NotFoundError('ProductScore for product', productId);
    }
    return score;
  }

  async calculateScore(productId: string, customWeights?: Partial<ScoreWeights>): Promise<ProductScoreResult> {
    const product = await productService.getProductById(productId);
    const scoreResult = productScorer.evaluateProduct(product, customWeights);

    store.scores.set(productId, scoreResult);
    logger.info(`Score calculated and stored for product [${productId}]: ${scoreResult.totalScore} (${scoreResult.tier})`);
    return scoreResult;
  }
}

export const scoreService = new ScoreService();

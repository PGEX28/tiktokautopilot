import { ImageProvider } from './providers/base.provider.js';
import { MockImageProvider } from './providers/mock-image.provider.js';
import { ImagePromptBuilder } from './image-prompt.builder.js';
import { 
  BatchImageGenerationRequest, 
  GeneratedImageResult, 
  ImageGenerationOptions, 
  ImageShotType 
} from './image.types.js';
import { logger } from '@autopilot/shared';

export interface ImageAgentConfig {
  provider?: ImageProvider;
  defaultShotTypes?: ImageShotType[];
  maxCostPerBatchUsd?: number;
}

export class ImageGenerationAgent {
  private provider: ImageProvider;
  private defaultShotTypes: ImageShotType[];
  private maxCostPerBatchUsd: number;

  constructor(config: ImageAgentConfig = {}) {
    this.provider = config.provider || new MockImageProvider();
    this.defaultShotTypes = config.defaultShotTypes || ['HERO_STUDIO', 'CLOSEUP_DETAIL', 'LIFESTYLE_IN_USE'];
    this.maxCostPerBatchUsd = config.maxCostPerBatchUsd || 1.00; // Limite de $1 por lote de imagens
  }

  public setProvider(provider: ImageProvider): void {
    this.provider = provider;
  }

  public async generateSingleImage(options: ImageGenerationOptions): Promise<GeneratedImageResult> {
    logger.info(`[ImageAgent] Generating ${options.aspectRatio} (${options.shotType}) image via ${this.provider.providerName}`);
    return this.provider.generateImage(options);
  }

  public async generateProductImageKit(request: BatchImageGenerationRequest): Promise<{
    productId: string;
    images: GeneratedImageResult[];
    totalCostUsd: number;
    totalTimeMs: number;
  }> {
    const startTime = Date.now();
    const shotsToGenerate = request.shotTypes && request.shotTypes.length > 0 
      ? request.shotTypes 
      : this.defaultShotTypes;

    const stylePreset = request.stylePreset || 'TIKTOK_VIRAL_AESTHETIC';
    const aspectRatio = request.aspectRatio || '9:16';

    const images: GeneratedImageResult[] = [];
    let accumulatedCost = 0;

    logger.info(`[ImageAgent] Starting Image Kit generation for product '${request.productName}' (${shotsToGenerate.length} shots)`);

    for (const shot of shotsToGenerate) {
      const { prompt, negativePrompt } = ImagePromptBuilder.buildPrompt({
        productName: request.productName,
        category: request.productCategory,
        description: request.productDescription,
        shotType: shot,
        stylePreset,
        aspectRatio,
      });

      const options: ImageGenerationOptions = {
        prompt,
        negativePrompt,
        aspectRatio,
        shotType: shot,
        stylePreset,
      };

      const estimatedCost = this.provider.estimateCost(options);
      if (accumulatedCost + estimatedCost > this.maxCostPerBatchUsd) {
        logger.warn(`[ImageAgent] Budget limit exceeded for product ${request.productId}. Stopping batch.`);
        break;
      }

      const generated = await this.provider.generateImage(options);
      images.push(generated);
      accumulatedCost += generated.costUsd;
    }

    const totalTimeMs = Date.now() - startTime;
    logger.info(`[ImageAgent] Completed kit for '${request.productName}': ${images.length} images, total cost $${accumulatedCost.toFixed(4)} (${totalTimeMs}ms)`);

    return {
      productId: request.productId,
      images,
      totalCostUsd: Number(accumulatedCost.toFixed(4)),
      totalTimeMs,
    };
  }
}

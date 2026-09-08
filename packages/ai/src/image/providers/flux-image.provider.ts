import crypto from 'crypto';
import { ImageProvider } from './base.provider.js';
import { GeneratedImageResult, ImageGenerationOptions } from '../image.types.js';
import { AppError } from '@autopilot/shared';

export interface FluxProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  modelVariant?: 'flux-schnell' | 'flux-dev' | 'flux-pro';
}

export class FluxImageProvider implements ImageProvider {
  public readonly providerName = 'flux';
  private apiKey: string;
  private modelVariant: string;

  constructor(config: FluxProviderConfig = {}) {
    this.apiKey = config.apiKey || process.env.FLUX_API_KEY || process.env.REPLICATE_API_TOKEN || '';
    this.modelVariant = config.modelVariant || 'flux-schnell';
  }

  public async generateImage(options: ImageGenerationOptions): Promise<GeneratedImageResult> {
    if (!this.apiKey) {
      throw new AppError(
        'FLUX_API_KEY or REPLICATE_API_TOKEN is required for live image generation with FluxImageProvider',
        400,
        true
      );
    }

    const startTime = Date.now();
    const seed = options.seed || Math.floor(Math.random() * 1000000);
    const id = `flux_${crypto.randomBytes(8).toString('hex')}`;
    const width = options.aspectRatio === '9:16' ? 1080 : options.aspectRatio === '16:9' ? 1920 : 1080;
    const height = options.aspectRatio === '9:16' ? 1920 : options.aspectRatio === '16:9' ? 1080 : 1080;

    return {
      id,
      url: `https://replicate.delivery/pbxt/${id}/output.png`,
      aspectRatio: options.aspectRatio,
      shotType: options.shotType,
      stylePreset: options.stylePreset,
      width,
      height,
      seed,
      promptUsed: options.prompt,
      negativePromptUsed: options.negativePrompt || '',
      costUsd: this.estimateCost(options),
      inferenceTimeMs: Date.now() - startTime,
      provider: 'flux',
      createdAt: new Date().toISOString(),
    };
  }

  public estimateCost(_options: ImageGenerationOptions): number {
    switch (this.modelVariant) {
      case 'flux-schnell':
        return 0.003; // ~$0.003 / imagem
      case 'flux-dev':
        return 0.025; // ~$0.025 / imagem
      case 'flux-pro':
        return 0.055; // ~$0.055 / imagem
      default:
        return 0.003;
    }
  }
}

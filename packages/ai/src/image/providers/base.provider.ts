import { GeneratedImageResult, ImageGenerationOptions } from '../image.types.js';

export interface ImageProvider {
  readonly providerName: 'mock' | 'flux' | 'midjourney' | 'dalle';
  generateImage(options: ImageGenerationOptions): Promise<GeneratedImageResult>;
  estimateCost(options: ImageGenerationOptions): number;
}

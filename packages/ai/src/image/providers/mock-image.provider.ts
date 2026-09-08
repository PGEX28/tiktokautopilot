import crypto from 'crypto';
import { ImageProvider } from './base.provider.js';
import { GeneratedImageResult, ImageGenerationOptions } from '../image.types.js';

export class MockImageProvider implements ImageProvider {
  public readonly providerName = 'mock';

  public async generateImage(options: ImageGenerationOptions): Promise<GeneratedImageResult> {
    const startTime = Date.now();
    const seed = options.seed || Math.floor(Math.random() * 1000000);
    const id = `img_${crypto.randomBytes(8).toString('hex')}`;

    const width = options.aspectRatio === '9:16' ? 1080 : options.aspectRatio === '16:9' ? 1920 : 1080;
    const height = options.aspectRatio === '9:16' ? 1920 : options.aspectRatio === '16:9' ? 1080 : 1080;

    // Simula pequena latência de geração (50ms)
    await new Promise((resolve) => setTimeout(resolve, 50));

    const mockUrl = `https://cdn.tiktokautopilot.io/renders/${id}_${options.aspectRatio.replace(':', 'x')}_s${seed}.png`;

    return {
      id,
      url: mockUrl,
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
      provider: 'mock',
      createdAt: new Date().toISOString(),
    };
  }

  public estimateCost(_options: ImageGenerationOptions): number {
    // Custo estimado padrão para mock: $0.003 por imagem
    return 0.003;
  }
}

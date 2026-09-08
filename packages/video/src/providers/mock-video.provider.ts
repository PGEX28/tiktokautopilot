import crypto from 'crypto';
import { VideoProvider } from './base-video.provider.js';
import { VideoClipGenerationOptions, VideoClipResult } from '../video.types.js';

export class MockVideoProvider implements VideoProvider {
  public readonly providerName = 'mock';

  public async generateClip(options: VideoClipGenerationOptions): Promise<VideoClipResult> {
    const startTime = Date.now();
    const id = `clip_${crypto.randomBytes(8).toString('hex')}`;
    const duration = options.durationSeconds || 5;

    // Simulação rápida para testes (60ms)
    await new Promise((resolve) => setTimeout(resolve, 60));

    const mockVideoUrl = `https://cdn.tiktokautopilot.io/videos/${id}_${options.sectionType.toLowerCase()}_${duration}s.mp4`;

    return {
      id,
      sectionType: options.sectionType,
      url: mockVideoUrl,
      durationSeconds: duration,
      width: 1080,
      height: 1920,
      fps: options.fps || 30,
      costUsd: this.estimateCost(duration),
      inferenceTimeMs: Date.now() - startTime,
      provider: 'mock',
      createdAt: new Date().toISOString(),
    };
  }

  public estimateCost(durationSeconds: number): number {
    // Estimativa mock de vídeo: ~$0.01 por segundo de vídeo gerado
    return Number((durationSeconds * 0.01).toFixed(4));
  }
}

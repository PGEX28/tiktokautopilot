import { VideoVariation, LiveLoopConfig, NotFoundError, logger } from '@autopilot/shared';
import { store } from './store.service.js';

export class VideoService {
  async getVariationsByProductId(productId: string): Promise<VideoVariation[]> {
    const variations = store.variations.get(productId);
    if (!variations || variations.length === 0) {
      throw new NotFoundError('Video variations for product', productId);
    }
    return variations;
  }

  async getLiveLoopByProductId(productId: string): Promise<LiveLoopConfig> {
    const liveLoop = store.liveLoops.get(productId);
    if (!liveLoop) {
      throw new NotFoundError('Live loop for product', productId);
    }
    return liveLoop;
  }

  async createLiveLoop(params: {
    productId: string;
    title: string;
    variationIdsOrder: string[];
    transitionType?: 'NONE' | 'FADE' | 'SLIDE';
    transitionDurationSeconds?: number;
    productCardOverlay?: boolean;
    ctaTextOverlay?: string;
  }): Promise<LiveLoopConfig> {
    const loopId = `loop_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const liveLoop: LiveLoopConfig = {
      id: loopId,
      productId: params.productId,
      title: params.title,
      variationIdsOrder: params.variationIdsOrder,
      transitionType: params.transitionType || 'FADE',
      transitionDurationSeconds: params.transitionDurationSeconds || 0.5,
      productCardOverlay: params.productCardOverlay ?? true,
      ctaTextOverlay: params.ctaTextOverlay || 'OFERTA DISPONÍVEL NA SACOLINHA',
      finalVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
      durationSeconds: params.variationIdsOrder.length * 30,
      status: 'READY',
      instructionsForLiveHost: 'Arquivo pronto para transmissão em formato 9:16 vertical (1080x1920). Adicione na vitrine da Live no TikTok Shop.',
      createdAt: new Date().toISOString(),
    };

    store.liveLoops.set(params.productId, liveLoop);
    logger.info(`Live loop created for product [${params.productId}] with sequence ${params.variationIdsOrder.join('->')}`);
    return liveLoop;
  }
}

export const videoService = new VideoService();

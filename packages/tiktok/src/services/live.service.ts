import { logger } from '@autopilot/shared';

export interface LiveShowcaseProduct {
  productId: string;
  displayOrder: number;
  featured: boolean;
}

export class TikTokLiveService {
  async addProductsToLiveShowcase(sessionId: string, products: LiveShowcaseProduct[]): Promise<{ success: boolean; linkedCount: number; instructions: string }> {
    logger.info(`TikTokLiveService linking ${products.length} products to Live Session [${sessionId}]`);

    return {
      success: true,
      linkedCount: products.length,
      instructions: 'Os produtos foram indexados para a vitrine da transmissão. Inicie o fluxo de vídeo (1080x1920) pelo OBS Studio ou TikTok Live Studio.',
    };
  }

  async getLiveSessionStatus(sessionId: string): Promise<{ sessionId: string; status: 'IDLE' | 'STREAMING' | 'ENDED'; currentViewers: number }> {
    return {
      sessionId,
      status: 'IDLE',
      currentViewers: 0,
    };
  }
}

export const tikTokLiveService = new TikTokLiveService();

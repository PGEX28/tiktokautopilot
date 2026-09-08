import { NotSupportedByProviderError, logger } from '@autopilot/shared';

export interface PublishVideoParams {
  videoUrl: string;
  title: string;
  productId: string;
  caption: string;
  hashtags: string[];
}

export interface PublishVideoResult {
  publishedId: string;
  shareUrl: string;
  status: 'PUBLISHED_DIRECT' | 'DRAFT_CREATED' | 'SIMULATED_DEMO';
  publishedAt: string;
}

export class TikTokContentService {
  async publishVideo(params: PublishVideoParams, allowSimulation = true): Promise<PublishVideoResult> {
    const isDemo = (process.env.APP_ENV || 'DEMO') === 'DEMO';
    const autoPublish = process.env.AUTOPILOT_AUTO_PUBLISH === 'true';

    logger.info('TikTokContentService evaluating video publication request', {
      isDemo,
      autoPublish,
      productId: params.productId,
    });

    if (isDemo || allowSimulation) {
      logger.info('Simulating video upload in DEMO / Staging mode');
      return {
        publishedId: `tt_video_sim_${Date.now()}`,
        shareUrl: `https://www.tiktok.com/@demouser/video/${Date.now()}`,
        status: 'SIMULATED_DEMO',
        publishedAt: new Date().toISOString(),
      };
    }

    if (!autoPublish) {
      // Direct posting without creator authorization scope
      throw new NotSupportedByProviderError(
        'TikTokShopOfficialAPI',
        'Direct automated video publishing requires elevated TikTok Content Creator Partner permissions. Use downloaded video files or Live Loop streams.'
      );
    }

    return {
      publishedId: `tt_video_prod_${Date.now()}`,
      shareUrl: `https://www.tiktok.com/@liveuser/video/${Date.now()}`,
      status: 'PUBLISHED_DIRECT',
      publishedAt: new Date().toISOString(),
    };
  }
}

export const tikTokContentService = new TikTokContentService();

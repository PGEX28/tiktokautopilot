import { VideoClipGenerationOptions, VideoClipResult } from '../video.types.js';

export interface VideoProvider {
  readonly providerName: 'mock' | 'luma' | 'runway' | 'kling';
  generateClip(options: VideoClipGenerationOptions): Promise<VideoClipResult>;
  estimateCost(durationSeconds: number): number;
}

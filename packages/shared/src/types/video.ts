export type VideoVariationId = 'A' | 'B' | 'C' | string;

export interface VideoClip {
  sceneIndex: number;
  videoUrl: string;
  durationSeconds: number;
  hasAudio: boolean;
}

export interface VideoVariation {
  id: string;
  projectId: string;
  productId: string;
  variationName: VideoVariationId;
  angleStrategy: 'PROBLEM_SOLUTION' | 'DEMONSTRATION' | 'OFFER_CURIOSITY' | string;
  scriptId: string;
  resolution: '1080x1920';
  aspectRatio: '9:16';
  durationSeconds: number;
  videoUrl: string;
  thumbnailUrl: string;
  audioVoiceoverUrl?: string;
  backgroundMusicUrl?: string;
  subtitlesUrl?: string;
  provider: string;
  costUsd: number;
  status: 'PENDING' | 'RENDERING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface LiveLoopConfig {
  id: string;
  productId: string;
  title: string;
  variationIdsOrder: VideoVariationId[]; // e.g. ['A', 'B', 'C', 'A', 'B', 'C']
  transitionType: 'NONE' | 'FADE' | 'SLIDE';
  transitionDurationSeconds: number;
  productCardOverlay: boolean;
  ctaTextOverlay?: string;
  finalVideoUrl?: string;
  durationSeconds?: number;
  status: 'READY' | 'GENERATING' | 'FAILED';
  instructionsForLiveHost: string;
  createdAt: string;
}

export interface VideoGenProvider {
  generateVideoScene(prompt: string, durationSeconds: number, referenceImageUrl?: string): Promise<{ videoUrl: string; costUsd: number }>;
}

export interface TTSVoiceProvider {
  generateVoiceover(text: string, voiceId?: string): Promise<{ audioUrl: string; durationSeconds: number; costUsd: number }>;
}

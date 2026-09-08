export type VideoResolution = '1080x1920'; // 9:16 vertical nativo TikTok
export type VideoFramerate = 30 | 60;

export interface VideoClipResult {
  id: string;
  sectionType: string;
  url: string;
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  costUsd: number;
  inferenceTimeMs: number;
  provider: 'mock' | 'luma' | 'runway' | 'kling';
  createdAt: string;
}

export interface AudioVoiceoverResult {
  id: string;
  url: string;
  durationSeconds: number;
  language: string;
  voiceId: string;
  wordCount: number;
  costUsd: number;
  synthesisTimeMs: number;
  provider: 'mock-tts' | 'elevenlabs' | 'openai-tts';
  createdAt: string;
}

export interface VideoClipGenerationOptions {
  sectionType: string;
  durationSeconds: number;
  visualPrompt: string;
  sourceImageUrl?: string;
  resolution?: VideoResolution;
  fps?: VideoFramerate;
  motionIntensity?: number; // 1 a 10
}

export interface TTSGenerationOptions {
  text: string;
  voiceId?: string;
  language?: string;
  speed?: number;
}

export interface FullVideoCompositionManifest {
  manifestId: string;
  productId: string;
  scriptId: string;
  totalDurationSeconds: number;
  clips: VideoClipResult[];
  voiceover: AudioVoiceoverResult;
  resolution: VideoResolution;
  fps: number;
  totalCostUsd: number;
  totalProcessingTimeMs: number;
  createdAt: string;
}

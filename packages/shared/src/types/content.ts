export type ScriptStyle =
  | 'curiosity'
  | 'problem_solution'
  | 'before_after'
  | 'review'
  | 'offer'
  | 'demonstration';

export interface ScriptSection {
  timeRange: string; // e.g. "0-3s"
  stage: 'HOOK' | 'PROBLEM' | 'DEMONSTRATION' | 'BENEFITS' | 'CTA';
  spokenAudioText: string;
  onScreenText: string;
  visualSceneDescription: string;
  cameraAngleOrTransition: string;
  durationSeconds: number;
}

export interface ScriptModel {
  id: string;
  productId: string;
  variationName: 'A' | 'B' | 'C' | string;
  style: ScriptStyle;
  hookText: string;
  sections: ScriptSection[];
  totalEstimatedDurationSeconds: number; // ~30s
  caption: string;
  hashtags: string[];
  ctaUrlOrStickerText: string;
  generationPrompt: string;
  provider: string;
  model: string;
  costUsd: number;
  createdAt: string;
}

export interface GeneratedImage {
  id: string;
  productId: string;
  variationName?: string;
  aspectRatio: '9:16' | '1:1';
  imageUrl: string;
  storagePath: string;
  promptUsed: string;
  negativePrompt?: string;
  provider: string;
  model: string;
  costUsd: number;
  width: number;
  height: number;
  createdAt: string;
}

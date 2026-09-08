import { GeneratedScript, ScriptStyle } from '@autopilot/ai';
import { FullVideoCompositionManifest } from '../video.types.js';

export type VariationLabel = 'VARIATION_A' | 'VARIATION_B' | 'VARIATION_C';

export interface VideoVariationItem {
  label: VariationLabel;
  name: string;
  style: ScriptStyle;
  hookAngle: string;
  script: GeneratedScript;
  videoManifest: FullVideoCompositionManifest;
  targetTikTokTags: string[];
}

export interface ABCVariationsBundle {
  bundleId: string;
  productId: string;
  productName: string;
  category: string;
  variations: {
    variationA: VideoVariationItem; // Problem / Solution
    variationB: VideoVariationItem; // Viral / Demonstration
    variationC: VideoVariationItem; // Curiosity / Urgency Offer
  };
  totalCostUsd: number;
  totalDurationSeconds: number;
  generatedAt: string;
}

export interface VariationsEngineRequest {
  productId: string;
  productName: string;
  productCategory: string;
  productFeatures?: string[];
  productPainPoints?: string[];
  targetAudience?: string;
}

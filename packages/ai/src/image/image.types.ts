export type ImageAspectRatio = '9:16' | '1:1' | '16:9';

export type ImageShotType = 
  | 'HERO_STUDIO'       // Foto principal em estúdio com fundo neutro / gradiente moderno
  | 'CLOSEUP_DETAIL'    // Detalhe de textura, botões, acabamento e material
  | 'LIFESTYLE_IN_USE'  // Produto sendo usado no cotidiano (ex: cozinha, escritório, treino)
  | 'UNBOXING_PREMIUM'  // Embalagem e apresentação de alta qualidade
  | 'TRANSFORMATION'    // Comparação de impacto visual ou benefício direto

export type ImageStylePreset = 
  | 'TIKTOK_VIRAL_AESTHETIC' // Cores vibrantes, iluminação jovem e contraste nítido
  | 'MINIMALIST_LUXURY'      // Tons pastéis, sombras suaves, ar premium
  | 'TECH_CYBER'             // Iluminação neon/LED, tons escuros e reflexos metálicos
  | 'ORGANIC_NATURAL'        // Luz natural do sol, plantas e madeira

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: ImageAspectRatio;
  shotType: ImageShotType;
  stylePreset: ImageStylePreset;
  width?: number;
  height?: number;
  seed?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
}

export interface GeneratedImageResult {
  id: string;
  url: string;
  aspectRatio: ImageAspectRatio;
  shotType: ImageShotType;
  stylePreset: ImageStylePreset;
  width: number;
  height: number;
  seed: number;
  promptUsed: string;
  negativePromptUsed: string;
  costUsd: number;
  inferenceTimeMs: number;
  provider: 'mock' | 'flux' | 'midjourney' | 'dalle';
  createdAt: string;
}

export interface BatchImageGenerationRequest {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription?: string;
  targetAudience?: string;
  shotTypes?: ImageShotType[];
  stylePreset?: ImageStylePreset;
  aspectRatio?: ImageAspectRatio;
}

import { 
  ImageAspectRatio, 
  ImageShotType, 
  ImageStylePreset 
} from './image.types.js';


export interface PromptBuildOptions {
  productName: string;
  category: string;
  description?: string;
  shotType: ImageShotType;
  stylePreset: ImageStylePreset;
  aspectRatio: ImageAspectRatio;
}

export class ImagePromptBuilder {
  private static readonly BASE_POSITIVE_MODIFIERS = [
    'commercial product photography',
    'shot on 85mm lens',
    'f/2.8 aperture',
    'soft diffuse studio lighting',
    '8k UHD',
    'hyper-detailed',
    'clean sharp focus',
    'professional color grading',
    'award-winning product shot',
  ];

  private static readonly UNIVERSAL_NEGATIVE_PROMPT = [
    'low quality',
    'blurry',
    'distorted',
    'pixelated',
    'ugly',
    'deformed',
    'watermark',
    'signature',
    'unreadable text',
    'grainy',
    'bad anatomy',
    'extra limbs',
    'missing fingers',
    'amateur photo',
    'overexposed',
    'underexposed',
  ].join(', ');

  public static buildPrompt(options: PromptBuildOptions): { prompt: string; negativePrompt: string } {
    const shotDescription = this.getShotDescription(options.shotType, options.productName);
    const styleDescription = this.getStyleDescription(options.stylePreset);
    const framing = options.aspectRatio === '9:16' ? 'vertical 9:16 frame for mobile screen, centered subject with balanced negative space' : 'balanced composition';

    const promptParts = [
      shotDescription,
      options.description ? `Features highlighted: ${options.description}` : '',
      styleDescription,
      framing,
      ...this.BASE_POSITIVE_MODIFIERS,
    ].filter(Boolean);

    return {
      prompt: promptParts.join(', '),
      negativePrompt: this.UNIVERSAL_NEGATIVE_PROMPT,
    };
  }

  private static getShotDescription(shotType: ImageShotType, productName: string): string {
    switch (shotType) {
      case 'HERO_STUDIO':
        return `Hero studio shot of ${productName}, immaculate condition, elevated on a sleek modern geometric podium with soft rim lighting`;
      case 'CLOSEUP_DETAIL':
        return `Macro extreme close-up of ${productName}, highlighting premium texture, intricate build quality, and fine craftsmanship`;
      case 'LIFESTYLE_IN_USE':
        return `Dynamic lifestyle scene featuring ${productName} seamlessly being used in a real modern environment, authentic aesthetic`;
      case 'UNBOXING_PREMIUM':
        return `Satisfying unboxing moment of ${productName}, nestled inside premium matte packaging with accessories neatly organized`;
      case 'TRANSFORMATION':
        return `Eye-catching before/after product impact shot of ${productName}, showing dramatic efficiency and visual satisfaction`;
      default:
        return `Professional studio photo of ${productName}`;
    }
  }

  private static getStyleDescription(stylePreset: ImageStylePreset): string {
    switch (stylePreset) {
      case 'TIKTOK_VIRAL_AESTHETIC':
        return 'vibrant trendy TikTok color palette, pop lighting, energetic and fresh contrast, high viral appeal';
      case 'MINIMALIST_LUXURY':
        return 'Nordic minimalist luxury aesthetic, subtle neutral pastel tones, smooth ambient shadows, elegance';
      case 'TECH_CYBER':
        return 'futuristic tech aesthetic, subtle cyan and magenta neon accents, dark sleek aluminum finish, premium tech vibe';
      case 'ORGANIC_NATURAL':
        return 'warm golden hour sunbeams, organic background with gentle indoor botanical elements, earthy authentic tones';
      default:
        return 'clean commercial advertising style';
    }
  }
}

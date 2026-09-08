export type ScriptSectionType = 
  | 'HOOK'           // 0-3s: Quebra de padrão auditivo e visual
  | 'PROBLEM'        // 3-8s: Identificação da dor e identificação do espectador
  | 'DEMONSTRATION'   // 8-18s: Demonstração prática do produto resolvendo o problema
  | 'BENEFITS'       // 18-25s: 2 a 3 benefícios-chave tangíveis e diferenciais
  | 'CTA';           // 25-30s: Chamada para ação explícita (TikTok Shop / Sacola Amarela)

export type ScriptStyle = 
  | 'PROBLEM_SOLUTION'      // Foco em dor extrema e alívio imediato
  | 'VIRAL_DEMO'            // Foco visual e satisfatório de uso do produto
  | 'STORYTELLING_RELATABLE'// História autêntica em 1ª pessoa
  | 'URGENCY_PROMO'         // Escassez, promoção relâmpago e frete grátis
  | 'TESTIMONIAL_REVIEW'    // Review honesto estilo unboxing e primeiras impressões
  | 'HUMOR_SKIT';           // Diálogo ou situação engraçada e quebra de expectativa

export type TargetTone = 'ENERGETIC' | 'CASUAL' | 'AUTHORITATIVE' | 'EMPATHETIC' | 'HUMOROUS';

export interface ScriptSection {
  type: ScriptSectionType;
  startTimeSeconds: number;
  endTimeSeconds: number;
  durationSeconds: number;
  voiceoverText: string;     // Fala em português natural para locução/TTS
  visualCue: string;         // Instruções de cena e enquadramento visual 9:16
  onScreenText: string;      // Texto na tela / Legenda dinâmica (máx 5-7 palavras)
  estimatedWordCount: number;
}

export interface GeneratedScript {
  id: string;
  productId: string;
  productName: string;
  title: string;
  style: ScriptStyle;
  tone: TargetTone;
  targetAudience: string;
  targetLanguage: string;
  totalDurationSeconds: number;
  sections: ScriptSection[];
  fullVoiceoverText: string;
  fullOnScreenSummary: string[];
  callToActionType: 'YELLOW_BAG_TIKTOK_SHOP' | 'PROFILE_LINK' | 'LIMITED_STOCK';
  estimatedReadingWpm: number;
  costUsd: number;
  createdAt: string;
}

export interface ScriptGenerationOptions {
  productId: string;
  productName: string;
  productCategory: string;
  productFeatures?: string[];
  productPainPoints?: string[];
  targetAudience?: string;
  style?: ScriptStyle;
  tone?: TargetTone;
  targetDurationSeconds?: number;
  highlightDiscount?: boolean;
}

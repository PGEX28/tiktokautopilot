import crypto from 'crypto';
import { ScriptGenerationAgent, ScriptStyle } from '@autopilot/ai';
import { VideoGenerationAgent } from '../video-generation.agent.js';
import { 
  ABCVariationsBundle, 
  VariationsEngineRequest, 
  VideoVariationItem, 
  VariationLabel 
} from './variations.types.js';
import { logger } from '@autopilot/shared';

export interface VariationsEngineConfig {
  scriptAgent?: ScriptGenerationAgent;
  videoAgent?: VideoGenerationAgent;
}

export class VariationsEngine {
  private scriptAgent: ScriptGenerationAgent;
  private videoAgent: VideoGenerationAgent;

  constructor(config: VariationsEngineConfig = {}) {
    this.scriptAgent = config.scriptAgent || new ScriptGenerationAgent();
    this.videoAgent = config.videoAgent || new VideoGenerationAgent();
  }

  public async generateABCBundle(request: VariationsEngineRequest): Promise<ABCVariationsBundle> {
    const bundleId = `bundle_${crypto.randomBytes(8).toString('hex')}`;
    logger.info(`[VariationsEngine] Generating A/B/C Video Bundle for '${request.productName}' (${bundleId})`);

    // Definição das 3 estratégias psicológicas para o teste A/B/C
    const strategies: Array<{
      label: VariationLabel;
      name: string;
      style: ScriptStyle;
      hookAngle: string;
      tags: string[];
    }> = [
      {
        label: 'VARIATION_A',
        name: 'Variação A - Dor e Solução',
        style: 'PROBLEM_SOLUTION',
        hookAngle: 'Foco na frustração da tarefa manual comum e no alívio imediato.',
        tags: ['#dica', '#achadinhos', '#tiktokshop', '#viral', '#praticidade'],
      },
      {
        label: 'VARIATION_B',
        name: 'Variação B - Demonstração Viral',
        style: 'VIRAL_DEMO',
        hookAngle: 'Foco estético hipnótico do produto funcionando em close-up.',
        tags: ['#satisfying', '#tiktokmademebuyit', '#achados', '#inovacao', '#compras'],
      },
      {
        label: 'VARIATION_C',
        name: 'Variação C - Oferta e Escassez',
        style: 'URGENCY_PROMO',
        hookAngle: 'Foco em oportunidade relâmpago e estoque limitado no TikTok Shop.',
        tags: ['#promocao', '#desconto', '#sacolaamarela', '#oferta', '#imperdivel'],
      },
    ];

    const generatedItems: Record<string, VideoVariationItem> = {};
    let totalCost = 0;
    let totalDuration = 0;

    for (const strat of strategies) {
      logger.info(`[VariationsEngine] Processing ${strat.name} [${strat.style}]`);

      // 1. Gera roteiro específico para a estratégia
      const script = await this.scriptAgent.generateScript({
        productId: request.productId,
        productName: request.productName,
        productCategory: request.productCategory,
        productFeatures: request.productFeatures,
        productPainPoints: request.productPainPoints,
        targetAudience: request.targetAudience,
        style: strat.style,
        tone: strat.style === 'URGENCY_PROMO' ? 'AUTHORITATIVE' : 'ENERGETIC',
      });

      // 2. Gera clipe de vídeo e locução para o roteiro
      const videoManifest = await this.videoAgent.generateVideoFromScript(script);

      totalCost += script.costUsd + videoManifest.totalCostUsd;
      totalDuration += videoManifest.totalDurationSeconds;

      generatedItems[strat.label] = {
        label: strat.label,
        name: strat.name,
        style: strat.style,
        hookAngle: strat.hookAngle,
        script,
        videoManifest,
        targetTikTokTags: strat.tags,
      };
    }

    logger.info(`[VariationsEngine] A/B/C Bundle completed for '${request.productName}' (Total cost: $${totalCost.toFixed(4)})`);

    return {
      bundleId,
      productId: request.productId,
      productName: request.productName,
      category: request.productCategory,
      variations: {
        variationA: generatedItems['VARIATION_A']!,
        variationB: generatedItems['VARIATION_B']!,
        variationC: generatedItems['VARIATION_C']!,
      },

      totalCostUsd: Number(totalCost.toFixed(4)),
      totalDurationSeconds: totalDuration,
      generatedAt: new Date().toISOString(),
    };
  }
}

import {
  ScriptModel,
  ScriptStyle,
  BudgetExceededError,
  EmergencyStopError,
  logger,
} from '@autopilot/shared';
import { store } from './store.service.js';
import { productService } from './product.service.js';

export class ContentService {
  async generateContentProject(
    productId: string,
    targetVariationsCount = 3,
    _styles?: ScriptStyle[]
  ): Promise<{ projectId: string; scripts: ScriptModel[]; status: string }> {
    // Check emergency stop
    if (store.budgetSettings.emergencyStop) {
      throw new EmergencyStopError();
    }

    // Check budget
    if (store.budgetSettings.currentDailySpendUsd >= store.budgetSettings.maxDailyAiCostUsd) {
      throw new BudgetExceededError('Limite diário de custo de IA atingido. Job pausado.');
    }

    const product = await productService.getProductById(productId);
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const variationNames = ['A', 'B', 'C', 'D', 'E'].slice(0, targetVariationsCount);
    const generatedScripts: ScriptModel[] = [];

    for (const varName of variationNames) {
      const style: ScriptStyle =
        varName === 'A' ? 'problem_solution' : varName === 'B' ? 'demonstration' : 'offer';

      const script: ScriptModel = {
        id: `script_${Date.now()}_${varName}`,
        productId,
        variationName: varName,
        style,
        hookText:
          varName === 'A'
            ? `Você ainda sofre com ${product.problemSolved}? Dá uma olhada nisso!`
            : varName === 'B'
            ? `Testei esse ${product.title} que viralizou no TikTok Shop!`
            : `Como garantir o seu ${product.title} com o maior desconto do dia!`,
        sections: [
          { stage: 'HOOK', timeRange: '0-3s', spokenAudioText: `Olha esse achadinho que resolve ${product.problemSolved}!`, onScreenText: 'ACHADINHO VIRAL 🔥', visualSceneDescription: 'Close-up do produto em uso', cameraAngleOrTransition: 'Zoom dinâmico', durationSeconds: 3 },
          { stage: 'PROBLEM', timeRange: '3-8s', spokenAudioText: 'A maioria dos produtos normais é cara e difícil de usar.', onScreenText: 'Chega de sofrer!', visualSceneDescription: 'Expressão de incômodo com alternativa comum', cameraAngleOrTransition: 'Corte rápido', durationSeconds: 5 },
          { stage: 'DEMONSTRATION', timeRange: '8-18s', spokenAudioText: `Esse aqui funciona super rápido por apenas $${product.price.toFixed(2)}.`, onScreenText: `Preço: $${product.price.toFixed(2)} 💥`, visualSceneDescription: 'Demonstração prática dos benefícios', cameraAngleOrTransition: 'Macro foco', durationSeconds: 10 },
          { stage: 'BENEFITS', timeRange: '18-25s', spokenAudioText: 'Portátil, prático, durável e com entrega rápida.', onScreenText: 'Garantia + Entrega Rápida 📦', visualSceneDescription: 'Mostrando o produto na embalagem', cameraAngleOrTransition: 'Pan suave', durationSeconds: 7 },
          { stage: 'CTA', timeRange: '25-30s', spokenAudioText: 'Clica na sacolinha aqui embaixo antes que termine o lote promocional!', onScreenText: 'CLIQUE NA SACOLINHA 👇', visualSceneDescription: 'Seta apontando para sacolinha amarela', cameraAngleOrTransition: 'Pulsing callout', durationSeconds: 5 },
        ],
        totalEstimatedDurationSeconds: 30,
        caption: `Garanta seu ${product.title} na TikTok Shop com frete reduzido! ✨ #tiktokshop #achadinhos`,
        hashtags: ['tiktokshop', 'achadinhos', 'viral'],
        ctaUrlOrStickerText: 'Clique na sacolinha abaixo para garantir o seu',
        generationPrompt: `Generate high-conversion vertical video script for ${product.title}`,
        provider: 'mock-ai',
        model: 'gpt-4o-mini',
        costUsd: 0.004,
        createdAt: new Date().toISOString(),
      };

      generatedScripts.push(script);
    }

    store.budgetSettings.currentDailySpendUsd += 0.012;
    logger.info(`Generated content project [${projectId}] for product [${productId}] with ${generatedScripts.length} variations`);

    return {
      projectId,
      scripts: generatedScripts,
      status: 'READY_FOR_VIDEO_GENERATION',
    };
  }
}

export const contentService = new ContentService();

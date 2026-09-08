import crypto from 'crypto';
import { ScriptProvider } from './base-script.provider.js';
import { GeneratedScript, ScriptGenerationOptions, ScriptSection } from '../script.types.js';

export class MockScriptProvider implements ScriptProvider {
  public readonly providerName = 'mock-llm';

  public async generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript> {
    const id = `scr_${crypto.randomBytes(8).toString('hex')}`;
    const name = options.productName;
    const style = options.style || 'PROBLEM_SOLUTION';
    const tone = options.tone || 'ENERGETIC';

    // Simula tempo de inferência do LLM (60ms)
    await new Promise((resolve) => setTimeout(resolve, 60));

    const sections: ScriptSection[] = [
      {
        type: 'HOOK',
        startTimeSeconds: 0,
        endTimeSeconds: 3,
        durationSeconds: 3,
        voiceoverText: `Pare de cometer esse erro todos os dias com ${name}!`,
        visualCue: `Enquadramento 9:16 dinâmico com zoom rápido no produto em cima da bancada.`,
        onScreenText: `PARE AGORA! 🛑`,
        estimatedWordCount: 11,
      },
      {
        type: 'PROBLEM',
        startTimeSeconds: 3,
        endTimeSeconds: 8,
        durationSeconds: 5,
        voiceoverText: `Você com certeza já passou raiva tentando resolver isso na mão e perdendo tempo à toa.`,
        visualCue: `Cena rápida mostrando a dificuldade e frustração da tarefa manual comum.`,
        onScreenText: `Isso é muito chato... 😩`,
        estimatedWordCount: 15,
      },
      {
        type: 'DEMONSTRATION',
        startTimeSeconds: 8,
        endTimeSeconds: 18,
        durationSeconds: 10,
        voiceoverText: `Olha como isso muda tudo: basta ligar o ${name}, passar uma única vez e o resultado fica perfeito em segundos.`,
        visualCue: `Take de close-up mostrando o funcionamento prático e o resultado imediato impecável.`,
        onScreenText: `Funciona em 3 segundos! ✨`,
        estimatedWordCount: 20,
      },
      {
        type: 'BENEFITS',
        startTimeSeconds: 18,
        endTimeSeconds: 25,
        durationSeconds: 7,
        voiceoverText: `Ele é super compacto, recarrega via USB e dura semanas com uma única carga na bateria.`,
        visualCue: `Apresentação dos detalhes do produto, portabilidade e porta de carregamento.`,
        onScreenText: `Compacto + Bateria Longa 🔋`,
        estimatedWordCount: 16,
      },
      {
        type: 'CTA',
        startTimeSeconds: 25,
        endTimeSeconds: 30,
        durationSeconds: 5,
        voiceoverText: `Clica agora na sacolinha amarela aqui embaixo no TikTok Shop antes que o estoque acabe!`,
        visualCue: `Seta animada apontando para a sacola de compras amarela no canto inferior esquerdo.`,
        onScreenText: `Clique na Sacola Amarela! 🛍️👇`,
        estimatedWordCount: 15,
      },
    ];

    const fullVoiceoverText = sections.map((s) => s.voiceoverText).join(' ');
    const fullOnScreenSummary = sections.map((s) => s.onScreenText);
    const totalWords = sections.reduce((acc, s) => acc + s.estimatedWordCount, 0);
    const totalDurationSeconds = 30;
    const estimatedReadingWpm = Math.round((totalWords / totalDurationSeconds) * 60);

    return {
      id,
      productId: options.productId,
      productName: options.productName,
      title: `Roteiro 30s Viral - ${options.productName} (${style})`,
      style,
      tone,
      targetAudience: options.targetAudience || 'Geral TikTok',
      targetLanguage: 'pt-BR',
      totalDurationSeconds,
      sections,
      fullVoiceoverText,
      fullOnScreenSummary,
      callToActionType: 'YELLOW_BAG_TIKTOK_SHOP',
      estimatedReadingWpm,
      costUsd: this.estimateCost(options),
      createdAt: new Date().toISOString(),
    };
  }

  public estimateCost(_options: ScriptGenerationOptions): number {
    // Estimativa de custo de tokens LLM (ex: Claude 3.5 / GPT-4o-mini): ~$0.001 por roteiro
    return 0.001;
  }
}

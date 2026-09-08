import { GeneratedScript, ScriptGenerationOptions, ScriptSection } from '../script.types.js';
import { ScriptProvider } from './base-script.provider.js';
import { logger } from '@autopilot/shared';

export class OpenAIScriptProvider implements ScriptProvider {
  public readonly providerName = 'openai-gpt';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  public async generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript> {
    const { productId, productName, productCategory, style = 'PROBLEM_SOLUTION', tone = 'ENERGETIC' } = options;
    logger.info(`[OpenAIScriptProvider] Generating script with OpenAI for ${productName} (${style})`);

    const systemPrompt = `Você é o maior especialista do mundo em criação de roteiros curtos de alta conversão (Direct Response) para o TikTok Shop e reels 9:16.
Seu objetivo é criar um roteiro magnético de 30 segundos estruturado rigorosamente em 4 seções:
1. HOOK (0-3s): Gancho brutal e imediato de quebra de padrão que prende a atenção.
2. PROBLEM (3-12s): Agitação da dor ou demonstração rápida do incômodo que o cliente passa.
3. DEMONSTRATION / SOLUTION (12-23s): Demonstração visual do produto como a única solução óbvia.
4. CTA (23-30s): Chamada direta e urgente para clicar na Sacola Amarela do TikTok Shop.

Responda APENAS em formato JSON válido com as seguintes chaves:
{
  "hook": "texto do gancho inicial (0 a 3s)",
  "problem": "texto da dor (3 a 12s)",
  "solution": "texto da solução e benefícios (12 a 23s)",
  "cta": "texto do CTA para a sacola amarela (23 a 30s)",
  "fullVoiceoverText": "narração completa fluida em português",
  "onScreenSummary": ["Gancho na tela", "Dor resolvida", "Oferta exclusiva na Sacola"]
}`;

    const userPrompt = `Produto: ${productName}
Categoria: ${productCategory}
Estilo do Roteiro: ${style}
Tom da Voz: ${tone}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errText}`);
      }

      const json = (await response.json()) as { choices: Array<{ message: { content: string } }> };
      const content = JSON.parse(json.choices[0]?.message?.content || '{}');

      const fullVoiceoverText =
        content.fullVoiceoverText ||
        `${content.hook || ''} ${content.problem || ''} ${content.solution || ''} ${content.cta || ''}`;

      const sections: ScriptSection[] = [
        {
          type: 'HOOK',
          startTimeSeconds: 0,
          endTimeSeconds: 3,
          durationSeconds: 3,
          voiceoverText: content.hook || 'Você ainda perde tempo com isso?',
          visualCue: 'Corte rápido em 9:16 mostrando o problema visualmente',
          onScreenText: 'PARE AGORA!',
          estimatedWordCount: 8,
        },
        {
          type: 'PROBLEM',
          startTimeSeconds: 3,
          endTimeSeconds: 12,
          durationSeconds: 9,
          voiceoverText: content.problem || 'Isso acontece todos os dias e ninguém te avisou.',
          visualCue: 'Enquadramento focado na frustração e na sujeira/dificuldade',
          onScreenText: 'O Maior Erro!',
          estimatedWordCount: 22,
        },
        {
          type: 'DEMONSTRATION',
          startTimeSeconds: 12,
          endTimeSeconds: 23,
          durationSeconds: 11,
          voiceoverText: content.solution || 'Mas com essa novidade, tudo se resolve em 3 segundos.',
          visualCue: 'Demonstração em close-up do produto funcionando perfeitamente',
          onScreenText: 'Olha Isso!',
          estimatedWordCount: 28,
        },
        {
          type: 'CTA',
          startTimeSeconds: 23,
          endTimeSeconds: 30,
          durationSeconds: 7,
          voiceoverText: content.cta || 'Clique na sacola amarela aqui embaixo antes que esgote o lote.',
          visualCue: 'Seta animada apontando para o canto inferior esquerdo da tela',
          onScreenText: 'Sacola Amarela ↓',
          estimatedWordCount: 16,
        },
      ];

      return {
        id: `script_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        productId,
        productName,
        title: `Roteiro Viral: ${productName}`,
        style,
        tone,
        targetAudience: options.targetAudience || 'Consumidores TikTok Shop Brasil',
        targetLanguage: 'pt-BR',
        totalDurationSeconds: 30,
        sections,
        fullVoiceoverText,
        fullOnScreenSummary: content.onScreenSummary || ['Gancho', 'Solução', 'Sacola Amarela'],
        callToActionType: 'YELLOW_BAG_TIKTOK_SHOP',
        estimatedReadingWpm: 150,
        costUsd: this.estimateCost(options),
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to generate script with OpenAI, falling back', { error });
      throw error;
    }
  }

  public estimateCost(_options: ScriptGenerationOptions): number {
    return 0.005;
  }
}

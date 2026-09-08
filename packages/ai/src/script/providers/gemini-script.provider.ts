import { GeneratedScript, ScriptGenerationOptions, ScriptSection } from '../script.types.js';
import { ScriptProvider } from './base-script.provider.js';
import { logger } from '@autopilot/shared';

export class GeminiScriptProvider implements ScriptProvider {
  public readonly providerName = 'google-gemini';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  public async generateScript(options: ScriptGenerationOptions): Promise<GeneratedScript> {
    const { productId, productName, productCategory, style = 'PROBLEM_SOLUTION', tone = 'ENERGETIC' } = options;
    logger.info(`[GeminiScriptProvider] Generating high-converting script with Gemini for ${productName} (${style})`);

    const promptText = `Você é o maior especialista do mundo em criação de roteiros curtos de altíssima conversão (Direct Response) para o TikTok Shop Brasil e vídeos 9:16.
Crie um roteiro magnético de 30 segundos estruturado rigorosamente em 4 seções:
1. HOOK (0-3s): Gancho brutal e imediato de quebra de padrão que prende a atenção nos primeiros 3 segundos.
2. PROBLEM (3-12s): Agitação da dor ou demonstração rápida do incômodo que o cliente passa.
3. DEMONSTRATION / SOLUTION (12-23s): Demonstração visual do produto como a única solução óbvia.
4. CTA (23-30s): Chamada direta e urgente para clicar na Sacola Amarela do TikTok Shop.

Produto: ${productName}
Categoria: ${productCategory}
Estilo do Roteiro: ${style}
Tom da Voz: ${tone}

Responda ESTRITAMENTE em formato JSON com a seguinte estrutura (sem blocos de markdown adicionais):
{
  "hook": "texto do gancho inicial (0 a 3s)",
  "problem": "texto da dor (3 a 12s)",
  "solution": "texto da solução e benefícios (12 a 23s)",
  "cta": "texto do CTA para a sacola amarela (23 a 30s)",
  "fullVoiceoverText": "narração completa fluida em português",
  "onScreenSummary": ["Gancho na tela", "Dor resolvida", "Oferta exclusiva na Sacola"]
}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const json = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const content = JSON.parse(rawText);

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
        costUsd: 0.0, // Gratuito no plano Gemini Flash
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to generate script with Gemini', { error });
      throw error;
    }
  }

  public estimateCost(_options: ScriptGenerationOptions): number {
    return 0.0;
  }
}

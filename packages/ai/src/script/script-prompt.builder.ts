import { ScriptGenerationOptions, ScriptStyle, TargetTone } from './script.types.js';

export class ScriptPromptBuilder {
  public static buildSystemPrompt(): string {
    return `Você é um Copywriter Especialista em TikTok Shop e Algoritmos de Vídeos Curtos (9:16).
Sua missão é criar roteiros com altíssima taxa de retenção nos primeiros 3 segundos e conversão máxima para a sacola amarela do TikTok Shop.

REGRAS RÍGIDAS DE ESTRUTURA:
1. Duração Total: Exatamente entre 28 e 32 segundos (~30s).
2. O roteiro DEVE conter 5 seções obrigatórias:
   - HOOK (0 a 3s): Quebra de padrão visual e auditivo forte. Sem enrolação.
   - PROBLEM (3 a 8s): Identificação de uma dor real do público-alvo.
   - DEMONSTRATION (8 a 18s): O produto em ação demonstrando a solução de forma rápida e impactante.
   - BENEFITS (18 a 25s): 2 ou 3 benefícios práticos (ex: portátil, sem fios, bateria longa, economiza tempo).
   - CTA (25 a 30s): Chamada direta apontando para o ícone da Sacola Amarela no canto inferior esquerdo do TikTok Shop.
3. Tom e Linguagem: Português do Brasil natural, ágil, conversacional, sem jargões corporativos.
4. Métrica de Leitura: Em média 140 a 160 palavras por minuto (~70 a 80 palavras no total).`;
  }

  public static buildUserPrompt(options: ScriptGenerationOptions): string {
    const styleDescription = this.getStyleGuidance(options.style || 'PROBLEM_SOLUTION');
    const toneDescription = this.getToneGuidance(options.tone || 'ENERGETIC');

    return `Crie um roteiro completo de ~30s para o seguinte produto do TikTok Shop:

PRODUTO:
- Nome: ${options.productName}
- Categoria: ${options.productCategory}
- Funcionalidades: ${options.productFeatures?.join(', ') || 'Alta praticidade e custo-benefício'}
- Dores que resolve: ${options.productPainPoints?.join(', ') || 'Perda de tempo e esforço manual'}
- Público-Alvo: ${options.targetAudience || 'Compradores ativos no TikTok buscando facilidade'}
- Estilo Desejado: ${options.style || 'PROBLEM_SOLUTION'} (${styleDescription})
- Tom Desejado: ${options.tone || 'ENERGETIC'} (${toneDescription})
- Destaque Promocional: ${options.highlightDiscount ? 'Sim, mencionar oferta especial e frete grátis' : 'Foco em valor do produto'}

Retorne o roteiro estruturado com as 5 seções com fala, instrução de cena visual 9:16 e texto para a tela.`;
  }

  private static getStyleGuidance(style: ScriptStyle): string {
    switch (style) {
      case 'PROBLEM_SOLUTION':
        return 'Enfatize a frustração do problema inicial e o alívio imediato proporcionado pelo produto.';
      case 'VIRAL_DEMO':
        return 'Foque na estética visual hipnótica e na facilidade inacreditável do produto em ação.';
      case 'STORYTELLING_RELATABLE':
        return 'Conte uma breve experiência pessoal em primeira pessoa com a qual qualquer pessoa se identifica.';
      case 'URGENCY_PROMO':
        return 'Enfatize a escassez de estoque e o preço promocional exclusivo da sacola amarela.';
      case 'TESTIMONIAL_REVIEW':
        return 'Tom de recomendação sincera de quem testou e não consegue mais viver sem.';
      case 'HUMOR_SKIT':
        return 'Inicie com uma situação cômica ou absurda resolvida com o produto.';
      default:
        return 'Foco em dinamismo e clareza.';
    }
  }

  private static getToneGuidance(tone: TargetTone): string {
    switch (tone) {
      case 'ENERGETIC':
        return 'Entusiasmado, ritmo acelerado e contagiante.';
      case 'CASUAL':
        return 'Conversa informal e leve entre amigos.';
      case 'AUTHORITATIVE':
        return 'Confiante, especialista e direto ao ponto.';
      case 'EMPATHETIC':
        return 'Acolhedor, compreensivo e focado na dor.';
      case 'HUMOROUS':
        return 'Divertido, leve e com quebra de expectativa.';
      default:
        return 'Natural e envolvente.';
    }
  }
}

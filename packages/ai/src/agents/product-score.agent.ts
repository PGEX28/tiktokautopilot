import {
  ProductCandidate,
  ProductScoreResult,
  ScoreWeights,
  ScoreTier,
  DEFAULT_SCORE_WEIGHTS,
  logger,
} from '@autopilot/shared';

export class ProductScoreAgent {
  private static instance: ProductScoreAgent;

  private constructor() {}

  public static getInstance(): ProductScoreAgent {
    if (!ProductScoreAgent.instance) {
      ProductScoreAgent.instance = new ProductScoreAgent();
    }
    return ProductScoreAgent.instance;
  }

  /**
   * Avalia um produto e gera o score multicritério de 0 a 100 pontos
   */
  public evaluateProduct(
    product: ProductCandidate,
    customWeights?: Partial<ScoreWeights>
  ): ProductScoreResult {
    logger.info(`ProductScoreAgent evaluating product [${product.id}]: "${product.title}"`);

    const weights: ScoreWeights = {
      ...DEFAULT_SCORE_WEIGHTS,
      ...(customWeights || {}),
    };

    // 1. Demanda (0 - 100)
    const velocity = product.metrics.salesVelocity || 50;
    const rawDemand = Math.min(100, Math.max(30, velocity * 0.85 + (product.metrics.monthlySales ? Math.min(25, product.metrics.monthlySales / 150) : 10)));

    // 2. Potencial Viral (0 - 100)
    let rawViral = 60;
    if (product.visualHookPotential === 'VIRAL') rawViral = 96;
    else if (product.visualHookPotential === 'HIGH') rawViral = 85;
    else if (product.visualHookPotential === 'MEDIUM') rawViral = 70;
    else rawViral = 40;

    // 3. Comissão (0 - 100) -> 20% = 90 pts, 15% = 75 pts, 25% = 100 pts
    const rawCommission = Math.min(100, Math.max(20, product.commission.rate * 450));

    // 4. Preço (0 - 100) -> $15 a $35 = 90-95 pts, $35 a $60 = 75-85 pts
    let rawPrice = 60;
    if (product.price >= 15 && product.price <= 35) rawPrice = 95;
    else if (product.price > 35 && product.price <= 60) rawPrice = 80;
    else if (product.price < 15) rawPrice = 85;
    else rawPrice = 50;

    // 5. Avaliações (0 - 100)
    const ratingScore = (product.metrics.rating / 5) * 80;
    const reviewCountBonus = product.metrics.reviewCount > 1000 ? 20 : product.metrics.reviewCount > 200 ? 10 : 5;
    const rawReviews = Math.min(100, ratingScore + reviewCountBonus);

    // 6. Concorrência (0 - 100)
    const rawCompetition = product.category === 'Electronics & Gadgets' ? 70 : 78;

    // 7. Demonstração (0 - 100)
    const rawDemonstrability = product.problemSolved ? 92 : 65;

    // 8. Compra por Impulso (0 - 100)
    const rawImpulseBuy = product.price <= 35 && (product.discountPercentage || 0) >= 30 ? 95 : 75;

    // Construção detalhada do breakdown
    const breakdown = {
      demand: {
        criterion: 'demand' as const,
        name: 'Demanda de Mercado',
        weight: weights.demand,
        rawScore: Number(rawDemand.toFixed(1)),
        weightedScore: Number((weights.demand * rawDemand).toFixed(2)),
        justification: `Velocidade estimada de ${velocity} vendas/dia com ${product.metrics.monthlySales || 0} vendas mensais.`,
      },
      viralPotential: {
        criterion: 'viralPotential' as const,
        name: 'Potencial Viral',
        weight: weights.viralPotential,
        rawScore: Number(rawViral.toFixed(1)),
        weightedScore: Number((weights.viralPotential * rawViral).toFixed(2)),
        justification: `Potencial de gancho visual classificado como [${product.visualHookPotential}].`,
      },
      commission: {
        criterion: 'commission' as const,
        name: 'Comissão de Afiliado',
        weight: weights.commission,
        rawScore: Number(rawCommission.toFixed(1)),
        weightedScore: Number((weights.commission * rawCommission).toFixed(2)),
        justification: `Taxa de ${(product.commission.rate * 100).toFixed(0)}% gerando ~$${product.commission.amountEstimated.toFixed(2)} por unidade.`,
      },
      price: {
        criterion: 'price' as const,
        name: 'Preço de Venda',
        weight: weights.price,
        rawScore: Number(rawPrice.toFixed(1)),
        weightedScore: Number((weights.price * rawPrice).toFixed(2)),
        justification: `Preço de $${product.price.toFixed(2)} atrativo para conversão imediata no feed.`,
      },
      reviews: {
        criterion: 'reviews' as const,
        name: 'Avaliações e Prova Social',
        weight: weights.reviews,
        rawScore: Number(rawReviews.toFixed(1)),
        weightedScore: Number((weights.reviews * rawReviews).toFixed(2)),
        justification: `Nota média de ${product.metrics.rating} estrelas baseada em ${product.metrics.reviewCount} avaliações reais.`,
      },
      competition: {
        criterion: 'competition' as const,
        name: 'Nível de Concorrência',
        weight: weights.competition,
        rawScore: Number(rawCompetition.toFixed(1)),
        weightedScore: Number((weights.competition * rawCompetition).toFixed(2)),
        justification: `Nicho [${product.category}] com espaço viável para diferenciação com criativos em vídeo.`,
      },
      demonstrability: {
        criterion: 'demonstrability' as const,
        name: 'Facilidade de Demonstração',
        weight: weights.demonstrability,
        rawScore: Number(rawDemonstrability.toFixed(1)),
        weightedScore: Number((weights.demonstrability * rawDemonstrability).toFixed(2)),
        justification: 'Utilidade e transformação visíveis nos primeiros 3 segundos de vídeo.',
      },
      impulseBuy: {
        criterion: 'impulseBuy' as const,
        name: 'Compra por Impulso',
        weight: weights.impulseBuy,
        rawScore: Number(rawImpulseBuy.toFixed(1)),
        weightedScore: Number((weights.impulseBuy * rawImpulseBuy).toFixed(2)),
        justification: `Ticket acessível combinado com desconto de ${(product.discountPercentage || 0).toFixed(0)}%.`,
      },
    };

    // Soma ponderada
    const totalScore = Number(
      Object.values(breakdown).reduce((sum, item) => sum + item.weightedScore, 0).toFixed(2)
    );

    // Classificação em Tiers
    let tier: ScoreTier = 'DESCARTAR';
    if (totalScore >= 90) tier = 'EXCELENTE';
    else if (totalScore >= 80) tier = 'FORTE';
    else if (totalScore >= 70) tier = 'TESTAR';
    else if (totalScore >= 60) tier = 'FRACO';

    const recommendedAction =
      totalScore >= 75 ? 'PROCEED_AUTOPILOT' : totalScore >= 65 ? 'MANUAL_REVIEW' : 'DISCARD';

    // Prós, contras e riscos
    const pros = [
      `Comissão atrativa de ${(product.commission.rate * 100).toFixed(0)}%`,
      `Gancho visual [${product.visualHookPotential}] com fácil demonstração`,
      `Avaliação sólida de ${product.metrics.rating} estrelas`,
    ];
    const cons = product.price > 40 ? ['Ticket médio pode requerer ganchos de maior valor percebido'] : [];
    const risks = ['Possível concorrência de criativos saturados na plataforma'];

    // Explicação em linguagem natural
    const explanation = `O produto "${product.title}" obteve Score final de ${totalScore}/100 (${tier}). Destaques positivos: forte apelo visual (${breakdown.viralPotential.rawScore} pts) e comissão de ${(product.commission.rate * 100).toFixed(0)}% (${breakdown.commission.rawScore} pts).`;

    const disclaimer =
      'O score é uma estimativa estatística de potencial criativo e comercial e não constitui garantia de vendas.';

    const result: ProductScoreResult = {
      id: `score_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      productId: product.id,
      totalScore,
      tier,
      weights,
      breakdown,
      pros,
      cons,
      risks,
      recommendedAction,
      explanation,
      disclaimer,
      scoredAt: new Date().toISOString(),
    };

    logger.info(`ProductScoreAgent computed: ${totalScore}/100 (${tier}) for [${product.id}]`);
    return result;
  }
}

export const productScorer = ProductScoreAgent.getInstance();

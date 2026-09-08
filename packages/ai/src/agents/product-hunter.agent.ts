import {
  ProductCandidate,
  ProductHunterQuery,
  ProductHunterResult,
  logger,
} from '@autopilot/shared';
import { mockProductHunterProvider } from '@autopilot/tiktok';

export interface ProductHunterStructuredOutput {
  productId: string;
  name: string;
  price: number;
  currency: string;
  commissionRate: number;
  commissionEstimatedAmount: number;
  rating: number;
  reviewCount: number;
  visualHookPotential: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL';
  problemSolved: string;
  targetAudience: string;
  reasonsToSell: string[];
  risks: string[];
  affiliateEligible: boolean;
}

export class ProductHunterAgent {
  private static instance: ProductHunterAgent;

  private constructor() {}

  public static getInstance(): ProductHunterAgent {
    if (!ProductHunterAgent.instance) {
      ProductHunterAgent.instance = new ProductHunterAgent();
    }
    return ProductHunterAgent.instance;
  }

  /**
   * Encontra e analisa produtos com potencial comercial no TikTok Shop
   */
  async findCandidates(query?: ProductHunterQuery): Promise<ProductHunterResult> {
    logger.info('ProductHunterAgent scanning market opportunities...', { query });

    // Recupera candidatos da fonte configurada (TikTok Shop ou Mock Provider)
    const rawCandidates = await mockProductHunterProvider.getCandidates({
      category: query?.category,
      minCommissionRate: query?.minCommissionRate,
      minPrice: query?.minPrice,
      maxPrice: query?.maxPrice,
      minRating: query?.minRating,
      limit: query?.limit,
    });

    // Enriquecimento e validação heurística de conversão
    const enrichedCandidates: ProductCandidate[] = rawCandidates.map((product: ProductCandidate) => {
      const isHighMargin = product.commission.rate >= 0.18;
      const isImpulsePrice = product.price <= 35;
      const isViralVisual = product.visualHookPotential === 'VIRAL';

      logger.debug(`Evaluating candidate: ${product.title}`, {
        price: product.price,
        commission: product.commission.rate,
        visualHook: product.visualHookPotential,
        isHighMargin,
        isImpulsePrice,
        isViralVisual,
      });

      return {
        ...product,
        status: 'DISCOVERED',
        updatedAt: new Date().toISOString(),
      };
    });

    logger.info(`ProductHunterAgent found ${enrichedCandidates.length} viable product candidates.`);

    return {
      candidates: enrichedCandidates,
      totalFound: enrichedCandidates.length,
      source: query?.source || 'TIKTOK_SHOP_AFFILIATE',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Converte o produto no formato estruturado especificado no Prompt Mestre
   */
  public formatStructuredCandidate(product: ProductCandidate): ProductHunterStructuredOutput {
    const reasons: string[] = [];
    const risks: string[] = [];

    if (product.commission.rate >= 0.18) {
      reasons.push(`Excelente comissão de ${(product.commission.rate * 100).toFixed(0)}% com margem líquida expressiva`);
    }
    if (product.price <= 35) {
      reasons.push(`Preço de venda de $${product.price.toFixed(2)} favorece decisão rápida por impulso`);
    }
    if (product.visualHookPotential === 'VIRAL') {
      reasons.push('Demonstração visual com forte apelo magnético nos primeiros 3 segundos');
    }
    if (product.metrics.rating >= 4.5) {
      reasons.push(`Alta satisfação do consumidor (${product.metrics.rating} estrelas em ${product.metrics.reviewCount} avaliações)`);
    }

    if (product.price > 50) {
      risks.push('Ticket mais elevado pode exigir mais tempo de consideração');
    }
    if (product.metrics.reviewCount < 500) {
      risks.push('Volume de prova social moderado');
    }

    return {
      productId: product.id,
      name: product.title,
      price: product.price,
      currency: product.currency,
      commissionRate: product.commission.rate,
      commissionEstimatedAmount: product.commission.amountEstimated,
      rating: product.metrics.rating,
      reviewCount: product.metrics.reviewCount,
      visualHookPotential: product.visualHookPotential,
      problemSolved: product.problemSolved,
      targetAudience: product.targetAudience,
      reasonsToSell: reasons,
      risks: risks.length > 0 ? risks : ['Concorrência de anúncios pagos'],
      affiliateEligible: product.hasAffiliateAvailable,
    };
  }
}

export const productHunter = ProductHunterAgent.getInstance();

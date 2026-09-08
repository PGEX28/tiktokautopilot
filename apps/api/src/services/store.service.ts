import {
  ProductCandidate,
  ProductScoreResult,
  VideoVariation,
  LiveLoopConfig,
  VideoMetrics,
  OptimizationInsight,
  AutopilotJobData,
  BudgetSettings,
  DEFAULT_SCORE_WEIGHTS,
  DEFAULT_BUDGET_LIMITS,
} from '@autopilot/shared';

export class StoreService {
  public products: Map<string, ProductCandidate> = new Map();
  public scores: Map<string, ProductScoreResult> = new Map();
  public variations: Map<string, VideoVariation[]> = new Map();
  public liveLoops: Map<string, LiveLoopConfig> = new Map();
  public metrics: Map<string, VideoMetrics> = new Map();
  public insights: Map<string, OptimizationInsight> = new Map();
  public jobs: Map<string, AutopilotJobData> = new Map();
  public budgetSettings: BudgetSettings;

  constructor() {
    this.budgetSettings = {
      maxVideosPerDay: DEFAULT_BUDGET_LIMITS.MAX_VIDEOS_PER_DAY,
      maxVariationsPerProduct: DEFAULT_BUDGET_LIMITS.MAX_VARIATIONS_PER_PRODUCT,
      maxDailyAiCostUsd: DEFAULT_BUDGET_LIMITS.MAX_DAILY_AI_COST_USD,
      maxMonthlyAiCostUsd: DEFAULT_BUDGET_LIMITS.MAX_MONTHLY_AI_COST_USD,
      currentDailySpendUsd: 0.45,
      currentMonthlySpendUsd: 12.80,
      minProductScoreAutopilot: DEFAULT_BUDGET_LIMITS.MIN_PRODUCT_SCORE_AUTOPILOT,
      autopilotEnabled: true,
      emergencyStop: false,
      allowedCategories: ['Home & Kitchen', 'Electronics & Gadgets', 'Beauty & Personal Care'],
      blockedCategories: ['Weapons', 'Adult', 'Pharmaceuticals'],
      updatedAt: new Date().toISOString(),
    };

    this.initializeSeedData();
  }

  private initializeSeedData(): void {
    const prodId1 = 'd0000000-0000-0000-0000-000000000001';
    const prod1: ProductCandidate = {
      id: prodId1,
      title: 'Mini Cordless Portable Car & Desk Vacuum 9000Pa',
      description: 'Powerful rechargeable handheld vacuum for car crevices, keyboards, and quick dust removal.',
      category: 'Home & Kitchen',
      subcategory: 'Cleaning Tools',
      price: 24.90,
      currency: 'USD',
      originalPrice: 49.90,
      discountPercentage: 50.10,
      mainImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      additionalImages: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'],
      productUrl: 'https://shop.tiktok.com/view/product/tt_prod_vacuum_01',
      source: {
        platform: 'TIKTOK_SHOP_AFFILIATE',
        externalId: 'tt_prod_vacuum_01',
        sourceUrl: 'https://shop.tiktok.com/view/product/tt_prod_vacuum_01',
      },
      metrics: {
        totalSales: 12400,
        monthlySales: 3200,
        salesVelocity: 105,
        reviewCount: 3280,
        rating: 4.7,
      },
      commission: {
        rate: 0.20,
        amountEstimated: 4.98,
        commissionType: 'PERCENTAGE',
      },
      status: 'APPROVED',
      hasAffiliateAvailable: true,
      visualHookPotential: 'VIRAL',
      problemSolved: 'Cleans dust and debris from impossible crevices without heavy cords.',
      targetAudience: 'Car owners, desk workers, gamers, pet owners',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.set(prodId1, prod1);

    const score1: ProductScoreResult = {
      id: 'f0000000-0000-0000-0000-000000000001',
      productId: prodId1,
      totalScore: 88.50,
      tier: 'FORTE',
      weights: { ...DEFAULT_SCORE_WEIGHTS },
      breakdown: {
        demand: { criterion: 'demand', name: 'Demanda de Mercado', weight: 0.25, rawScore: 92, weightedScore: 23.00, justification: 'Alta procura comprovada em vídeos virais de limpeza automotiva.' },
        viralPotential: { criterion: 'viralPotential', name: 'Potencial Viral', weight: 0.20, rawScore: 95, weightedScore: 19.00, justification: 'Efeito antes/depois instantâneo muito satisfatório visualmente.' },
        commission: { criterion: 'commission', name: 'Comissão de Afiliado', weight: 0.15, rawScore: 85, weightedScore: 12.75, justification: 'Comissão de 20% garantindo margem de $4.98 por unidade vendida.' },
        price: { criterion: 'price', name: 'Preço de Venda', weight: 0.10, rawScore: 90, weightedScore: 9.00, justification: 'Preço abaixo de $25 favorece decisão rápida.' },
        reviews: { criterion: 'reviews', name: 'Avaliações e Prova Social', weight: 0.10, rawScore: 82, weightedScore: 8.20, justification: 'Média de 4.7 estrelas com mais de 3.200 avaliações.' },
        competition: { criterion: 'competition', name: 'Nível de Concorrência', weight: 0.10, rawScore: 70, weightedScore: 7.00, justification: 'Concorrência moderada, superável com novos ganchos criativos.' },
        demonstrability: { criterion: 'demonstrability', name: 'Facilidade de Demonstração', weight: 0.05, rawScore: 96, weightedScore: 4.80, justification: 'Demonstração nos primeiros 3 segundos é imediata e magnética.' },
        impulseBuy: { criterion: 'impulseBuy', name: 'Compra por Impulso', weight: 0.05, rawScore: 95, weightedScore: 4.75, justification: 'Produto de baixo custo que resolve incômodo visível.' },
      },
      pros: ['Visual instantâneo de antes e depois', 'Comissão líquida de 20%', 'Preço de compra por impulso'],
      cons: ['Concorrência moderada na categoria de limpeza'],
      risks: ['Variações de qualidade entre fornecedores de baterias'],
      recommendedAction: 'PROCEED_AUTOPILOT',
      explanation: 'O Mini Aspirador obteve pontuação 88.5/100 devido ao apelo visual imediato de limpeza, comissão de 20% e preço acessível de $24.90.',
      disclaimer: 'O score é uma estimativa estatística de potencial criativo e comercial e não constitui garantia de vendas.',
      scoredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
    this.scores.set(prodId1, score1);

    const variations1: VideoVariation[] = [
      {
        id: '30000000-0000-0000-0000-000000000001',
        projectId: '10000000-0000-0000-0000-000000000001',
        productId: prodId1,
        variationName: 'A',
        angleStrategy: 'PROBLEM_SOLUTION',
        scriptId: '20000000-0000-0000-0000-000000000001',
        resolution: '1080x1920',
        aspectRatio: '9:16',
        durationSeconds: 30,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
        provider: 'mock-video-engine',
        costUsd: 0.05,
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '30000000-0000-0000-0000-000000000002',
        projectId: '10000000-0000-0000-0000-000000000001',
        productId: prodId1,
        variationName: 'B',
        angleStrategy: 'DEMONSTRATION',
        scriptId: '20000000-0000-0000-0000-000000000002',
        resolution: '1080x1920',
        aspectRatio: '9:16',
        durationSeconds: 30,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
        provider: 'mock-video-engine',
        costUsd: 0.05,
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '30000000-0000-0000-0000-000000000003',
        projectId: '10000000-0000-0000-0000-000000000001',
        productId: prodId1,
        variationName: 'C',
        angleStrategy: 'OFFER_CURIOSITY',
        scriptId: '20000000-0000-0000-0000-000000000003',
        resolution: '1080x1920',
        aspectRatio: '9:16',
        durationSeconds: 30,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
        provider: 'mock-video-engine',
        costUsd: 0.05,
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    this.variations.set(prodId1, variations1);

    const liveLoop1: LiveLoopConfig = {
      id: '40000000-0000-0000-0000-000000000001',
      productId: prodId1,
      title: 'Continuous Live Loop A->B->C (Vacuum)',
      variationIdsOrder: ['A', 'B', 'C', 'A', 'B', 'C'],
      transitionType: 'FADE',
      transitionDurationSeconds: 0.5,
      productCardOverlay: true,
      ctaTextOverlay: 'OFERTA RELÂMPAGO NA SACOLINHA',
      finalVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
      durationSeconds: 180,
      status: 'READY',
      instructionsForLiveHost: 'Transmita este arquivo em loop vertical (1080x1920) via OBS Studio ou TikTok Live Studio vinculando o produto na vitrine.',
      createdAt: new Date().toISOString(),
    };
    this.liveLoops.set(prodId1, liveLoop1);

    const metrics1: VideoMetrics = {
      id: '50000000-0000-0000-0000-000000000003',
      videoId: 'vid_003',
      variationName: 'C',
      productId: prodId1,
      views: 8200,
      impressions: 9900,
      watchTimeSeconds: 221400,
      averageWatchDuration: 27.0,
      completionRate: 0.6400,
      clicks: 610,
      ctr: 0.0616,
      productViews: 540,
      addToCart: 142,
      orders: 51,
      cvr: 0.0836,
      gmv: 1269.90,
      commission: 253.98,
      epc: 0.4163,
      rpm: 30.97,
      periodStart: new Date(Date.now() - 86400000 * 7).toISOString(),
      periodEnd: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
    };
    this.metrics.set(prodId1, metrics1);

    const insight1: OptimizationInsight = {
      id: '60000000-0000-0000-0000-000000000001',
      productId: prodId1,
      bestPerformingVariation: 'C',
      bestHookPattern: 'Preço cortado + Anúncio de economia direta',
      bestCtaPattern: 'Cupom de 50% na sacolinha',
      variationComparisons: [
        { variationName: 'A', ctr: 0.0251, cvr: 0.0769, completionRate: 0.4200, commission: 29.88 },
        { variationName: 'B', ctr: 0.0433, cvr: 0.0769, completionRate: 0.5800, commission: 119.52 },
        { variationName: 'C', ctr: 0.0616, cvr: 0.0836, completionRate: 0.6400, commission: 253.98 },
      ],
      confidenceLevel: 'PRELIMINARY_EVIDENCE',
      summaryFindings: 'Variação C superou as demais com CTR de 6.16% e RPM de $30.97.',
      recommendedActions: [
        'Priorizar ganchos com destaque de preço cortado e cupons.',
        'Aumentar produção do formato Variação C para 70% nos novos ciclos.',
      ],
      patternsToReduce: ['Ganchos genéricos sem apelo visual nos primeiros 2 segundos'],
      analyzedAt: new Date().toISOString(),
    };
    this.insights.set(prodId1, insight1);

    const job1: AutopilotJobData = {
      id: 'job_discovery_seed_001',
      type: 'product-discovery',
      status: 'COMPLETED',
      priority: 5,
      attempts: 1,
      maxAttempts: 3,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      startedAt: new Date(Date.now() - 3590000).toISOString(),
      completedAt: new Date(Date.now() - 3500000).toISOString(),
      idempotencyKey: 'discovery_daily_cycle_' + new Date().toISOString().slice(0, 10),
      payload: { category: 'Home & Kitchen' },
      logs: [{ attemptNumber: 1, startedAt: new Date(Date.now() - 3590000).toISOString(), durationMs: 90000 }],
    };
    this.jobs.set(job1.id, job1);
  }
}

export const store = new StoreService();

import { AnalyticsAgent, OptimizationAgent } from '../packages/ai/dist/index.js';

async function run() {
  console.log('🧠 Iniciando Verificação Automatizada do Optimization Agent (ETAPA 15)...\n');

  // 1. Simular Dados de Campanhas Anteriores via AnalyticsAgent
  console.log('1. Preparando dados analíticos de campanhas passadas...');
  const analyticsAgent = new AnalyticsAgent();
  
  const reportWinner = analyticsAgent.evaluateCreative({
    creativeId: 'vid_001_winner',
    variationLabel: 'Variação A (Dor e Solução)',
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    rawMetrics: {
      impressions: 60000,
      views3s: 34000, // 56.6% retenção
      viewsFull: 15000,
      likes: 4200,
      comments: 530,
      shares: 1100,
      saves: 1400,
      productCardClicks: 2600, // 4.3% CTR
      ordersCount: 115, // 4.4% CVR
      grossMerchandiseValueUsd: 3450.00,
      commissionEarnedUsd: 517.50,
      productionCostUsd: 0.92,
    },
  });

  const reportFatigued = analyticsAgent.evaluateCreative({
    creativeId: 'vid_002_fatigued',
    variationLabel: 'Variação C (Oferta Direta)',
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    rawMetrics: {
      impressions: 40000,
      views3s: 7000, // 17.5% retenção (Gancho Fraco)
      viewsFull: 2000,
      likes: 300,
      comments: 20,
      shares: 40,
      saves: 50,
      productCardClicks: 280,
      ordersCount: 5,
      grossMerchandiseValueUsd: 150.00,
      commissionEarnedUsd: 22.50,
      productionCostUsd: 0.92,
    },
  });

  console.log(`✅ Relatórios gerados para aprendizado: [${reportWinner.reportId}] e [${reportFatigued.reportId}]\n`);

  // 2. Executar o OptimizationAgent para Aprender dos Dados
  console.log('2. Testando OptimizationAgent (Ciclo de Aprendizado e Extração de Diretrizes)...');
  const optAgent = new OptimizationAgent();
  const optSummary = optAgent.learnFromCampaignResults([reportWinner, reportFatigued]);

  if (optSummary.totalCreativesAnalyzed !== 2) {
    throw new Error('Total de criativos analisados diverge do esperado');
  }
  if (optSummary.directivesGenerated.length === 0) {
    throw new Error('Nenhuma diretriz de otimização foi gerada');
  }

  console.log(`✅ Ciclo de Otimização Concluído: [${optSummary.reportId}]`);
  console.log(`   - Total de Criativos Ingeridos: ${optSummary.totalCreativesAnalyzed}`);
  console.log(`   - Padrões de Ganchos Vencedores Detectados: ${optSummary.topPerformingHooks.length}`);
  optSummary.topPerformingHooks.forEach((h, idx) => {
    console.log(`     [Hook ${idx + 1}] "${h.hookText}" (Retenção 3s: ${h.retention3sPercent}%, CTR: ${h.ctrPercent}%)`);
  });
  console.log();

  // 3. Validar Diretrizes Geradas para a Próxima Geração de Vídeos
  console.log('3. Validando Diretrizes de Otimização por Categoria:');
  const directives = optAgent.getDirectivesForCategory('Cozinha');
  console.log(`   📂 Categoria: ${directives.category} (Confiança: ${(directives.confidenceScore * 100).toFixed(0)}%)`);
  console.log(`   🎯 Estilos Recomendados: ${directives.preferredStyles.join(', ')}`);
  console.log(`   ✨ Frases de Gancho Sugeridas:`);
  directives.recommendedHookPhrasing.forEach((p) => console.log(`      - "${p}"`));
  console.log(`   🚫 Frases Proibidas (Lista Negra de Baixa Retenção):`);
  directives.phrasesToAvoid.forEach((p) => console.log(`      - "${p}"`));
  console.log();

  console.log('🎉 Todos os testes do Optimization Agent (ETAPA 15) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 15:', err);
  process.exit(1);
});

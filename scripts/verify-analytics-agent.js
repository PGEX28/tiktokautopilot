import { AnalyticsAgent, MetricsCalculator } from '../packages/ai/dist/index.js';

async function run() {
  console.log('📊 Iniciando Verificação Automatizada do Analytics Agent (ETAPA 14)...\n');

  // 1. Testando Métricas Matemáticas com o MetricsCalculator
  console.log('1. Testando MetricsCalculator (CTR, CVR, EPC, RPM, ROAS)...');
  const rawData = {
    impressions: 50000,
    views3s: 28000,
    viewsFull: 12000,
    likes: 3200,
    comments: 410,
    shares: 890,
    saves: 1100,
    productCardClicks: 2100,
    ordersCount: 94,
    grossMerchandiseValueUsd: 2820.00,
    commissionEarnedUsd: 423.00,
    productionCostUsd: 0.92,
  };

  const calculated = MetricsCalculator.calculate(rawData);

  if (calculated.ctrPercent !== 4.2 || calculated.cvrPercent !== 4.48) {
    throw new Error(`Cálculo de CTR (${calculated.ctrPercent}%) ou CVR (${calculated.cvrPercent}%) divergente!`);
  }
  if (calculated.performanceTier !== 'TOP_PERFORMER') {
    throw new Error(`Classificação de performance incorreta: ${calculated.performanceTier}`);
  }

  console.log('✅ Métricas Calculadas:');
  console.log(`   - CTR (Taxa de Cliques): ${calculated.ctrPercent}%`);
  console.log(`   - CVR (Taxa de Conversão): ${calculated.cvrPercent}%`);
  console.log(`   - Retenção 3s: ${calculated.retention3sPercent}%`);
  console.log(`   - Conclusão do Vídeo: ${calculated.completionRatePercent}%`);
  console.log(`   - EPC (Ganho por Clique): $${calculated.epcUsd}`);
  console.log(`   - RPM (Receita por Mil): $${calculated.rpmUsd}`);
  console.log(`   - ROAS: ${calculated.roas}x | Lucro Líquido: $${calculated.netProfitUsd} USD`);
  console.log(`   - Tier: ${calculated.performanceTier}\n`);

  // 2. Testando Diagnóstico do AnalyticsAgent
  console.log('2. Testando AnalyticsAgent (Diagnóstico de Criativo Individual)...');
  const agent = new AnalyticsAgent();
  const reportA = agent.evaluateCreative({
    creativeId: 'vid_var_a_001',
    variationLabel: 'Variação A (Dor/Solução)',
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    rawMetrics: rawData,
  });

  if (reportA.recommendedAction !== 'SCALE_BUDGET') {
    throw new Error(`Ação recomendada deveria ser SCALE_BUDGET, recebido ${reportA.recommendedAction}`);
  }
  console.log(`✅ Relatório Gerado: [${reportA.reportId}]`);
  console.log(`   - Ação Recomendada: ${reportA.recommendedAction}`);
  console.log('   - Diagnósticos:');
  reportA.diagnosis.forEach((d) => console.log(`     ${d}`));
  console.log();

  // 3. Testando Comparação de Performance A/B/C
  console.log('3. Testando Comparação de Variações A/B/C...');
  const reportB = agent.evaluateCreative({
    creativeId: 'vid_var_b_002',
    variationLabel: 'Variação B (Demonstração Viral)',
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    rawMetrics: {
      ...rawData,
      productCardClicks: 900,
      ordersCount: 25,
      commissionEarnedUsd: 112.50,
      views3s: 14000,
    },
  });

  const reportC = agent.evaluateCreative({
    creativeId: 'vid_var_c_003',
    variationLabel: 'Variação C (Oferta/Escassez)',
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    rawMetrics: {
      ...rawData,
      productCardClicks: 400,
      ordersCount: 8,
      commissionEarnedUsd: 36.00,
      views3s: 8000,
    },
  });

  const comparison = agent.compareVariations('prod_9921_kitchen', 'Mini Seladora Térmica Portátil', [reportA, reportB, reportC]);

  if (comparison.winningVariation !== 'Variação A (Dor/Solução)') {
    throw new Error(`Variação vencedora incorreta: ${comparison.winningVariation}`);
  }

  console.log(`✅ Comparação Finalizada!`);
  console.log(`   🏆 Variação Vencedora: ${comparison.winningVariation}`);
  console.log(`   📄 Resumo Executivo: ${comparison.executiveSummary}\n`);

  console.log('🎉 Todos os testes do Analytics Agent (ETAPA 14) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 14:', err);
  process.exit(1);
});

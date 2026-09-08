import { VariationsEngine } from '../packages/video/dist/index.js';

async function run() {
  console.log('⚡ Iniciando Verificação Automatizada do 3 Variations Engine (ETAPA 12)...\n');

  const engine = new VariationsEngine();

  console.log('1. Solicitando Geração do Pacote de 3 Variações A/B/C...');
  const bundle = await engine.generateABCBundle({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    productCategory: 'Cozinha',
    productFeatures: ['Bateria USB-C recarregável', 'Vedação hermética em 3 segundos'],
    productPainPoints: ['Sacos de salgadinho e biscoito murchando'],
    targetAudience: 'Compradores do TikTok interessados em organização e cozinha',
  });

  // Validações
  if (!bundle.bundleId || !bundle.variations) {
    throw new Error('Bundle de variações gerado incompleto!');
  }

  const { variationA, variationB, variationC } = bundle.variations;

  if (!variationA || !variationB || !variationC) {
    throw new Error('Faltam uma ou mais variações no pacote A/B/C');
  }

  if (variationA.style !== 'PROBLEM_SOLUTION' || variationB.style !== 'VIRAL_DEMO' || variationC.style !== 'URGENCY_PROMO') {
    throw new Error('Estilos das variações A/B/C incorretos!');
  }

  console.log(`✅ Pacote A/B/C Gerado com Sucesso: [${bundle.bundleId}]`);
  console.log(`   - Produto: ${bundle.productName} (${bundle.category})`);
  console.log(`   - Duração Total Acumulada: ${bundle.totalDurationSeconds}s`);
  console.log(`   - Custo Total de Produção dos 3 Vídeos: $${bundle.totalCostUsd} USD\n`);

  console.log('2. Detalhes Estratégicos das 3 Variações Geradas:');
  
  [variationA, variationB, variationC].forEach((v) => {
    console.log(`\n📌 ${v.name} [${v.label}]:`);
    console.log(`   🎯 Ângulo do Gancho: ${v.hookAngle}`);
    console.log(`   📝 Roteiro ID: ${v.script.id} (Estilo: ${v.style})`);
    console.log(`   🎤 Locução TTS: ${v.videoManifest.voiceover.url}`);
    console.log(`   🎞️ Vídeo Clipes: ${v.videoManifest.clips.length} tomadas (${v.videoManifest.resolution})`);
    console.log(`   🏷️ Tags TikTok: ${v.targetTikTokTags.join(' ')}`);
    console.log(`   💰 Custo da Variação: $${(v.script.costUsd + v.videoManifest.totalCostUsd).toFixed(4)} USD`);
  });

  console.log('\n🎉 Todos os testes do 3 Variations Engine (ETAPA 12) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 12:', err);
  process.exit(1);
});

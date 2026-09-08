import { ScriptGenerationAgent, ScriptPromptBuilder } from '../packages/ai/dist/index.js';

async function run() {
  console.log('📝 Iniciando Verificação Automatizada do Script Generation Agent (ETAPA 10)...\n');

  // 1. Testando Construtor de Prompts Psicológicos
  console.log('1. Testando ScriptPromptBuilder (Sistema de 5 Fases Psicológicas)...');
  const systemPrompt = ScriptPromptBuilder.buildSystemPrompt();
  const userPrompt = ScriptPromptBuilder.buildUserPrompt({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    productCategory: 'Cozinha',
    productFeatures: ['Bateria USB-C recarregável', 'Vedação hermética em 3 segundos', 'Super leve'],
    productPainPoints: ['Comida murchando no armário', 'Pregadores de roupa feios que não vedam'],
    targetAudience: 'Donas de casa e pessoas que moram sozinhas',
    style: 'PROBLEM_SOLUTION',
    tone: 'ENERGETIC',
    highlightDiscount: true,
  });

  if (!systemPrompt.includes('HOOK (0 a 3s)') || !systemPrompt.includes('Sacola Amarela')) {
    throw new Error('System prompt não contém as 5 seções ou a regra da Sacola Amarela');
  }
  if (!userPrompt.includes('Mini Seladora Térmica Portátil') || !userPrompt.includes('Vedação hermética')) {
    throw new Error('User prompt não contém os atributos do produto');
  }
  console.log('✅ System Prompt validado (5 fases + Sacola Amarela)');
  console.log('✅ User Prompt construído com sucesso para o produto alvo\n');

  // 2. Testando Agente Gerando Roteiro Individual de 30s
  console.log('2. Testando ScriptGenerationAgent (Geração Individual de Roteiro)...');
  const agent = new ScriptGenerationAgent();
  const script = await agent.generateScript({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    productCategory: 'Cozinha',
    style: 'PROBLEM_SOLUTION',
    tone: 'ENERGETIC',
  });

  if (script.sections.length !== 5) {
    throw new Error(`Esperado exatamente 5 seções no roteiro, recebido ${script.sections.length}`);
  }
  if (script.totalDurationSeconds < 28 || script.totalDurationSeconds > 32) {
    throw new Error(`Duração fora da janela de ~30s: ${script.totalDurationSeconds}s`);
  }
  if (script.callToActionType !== 'YELLOW_BAG_TIKTOK_SHOP') {
    throw new Error('CTA não direciona para o TikTok Shop');
  }

  console.log(`✅ Roteiro gerado: "${script.title}"`);
  console.log(`✅ Duração Total: ${script.totalDurationSeconds}s | WPM Estimado: ${script.estimatedReadingWpm} ppm | Custo: $${script.costUsd}`);
  console.log('   --- Estrutura Temporal das 5 Seções ---');
  script.sections.forEach((sec) => {
    console.log(`   [${sec.startTimeSeconds}s-${sec.endTimeSeconds}s] ${sec.type.padEnd(14)}: "${sec.voiceoverText}"`);
    console.log(`      ↳ Cena: ${sec.visualCue}`);
    console.log(`      ↳ Tela: ${sec.onScreenText}`);
  });
  console.log();

  // 3. Testando Geração de Variações de Estilo (A/B Testing)
  console.log('3. Testando Geração de Múltiplas Variações de Estilo...');
  const variationsResult = await agent.generateVariations(
    {
      productId: 'prod_9921_kitchen',
      productName: 'Mini Seladora Térmica Portátil',
      productCategory: 'Cozinha',
    },
    ['PROBLEM_SOLUTION', 'VIRAL_DEMO', 'URGENCY_PROMO']
  );

  if (variationsResult.scripts.length !== 3) {
    throw new Error(`Esperado 3 variações de roteiro, recebido ${variationsResult.scripts.length}`);
  }
  console.log(`✅ ${variationsResult.scripts.length} variações geradas com sucesso (Tempo: ${variationsResult.totalTimeMs}ms, Custo Total: $${variationsResult.totalCostUsd}):`);
  variationsResult.scripts.forEach((v, idx) => {
    console.log(`   [Variação ${idx + 1}] Estilo: ${v.style.padEnd(18)} -> ID: ${v.id}`);
  });
  console.log();

  console.log('🎉 Todos os testes do Script Generation Agent (ETAPA 10) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 10:', err);
  process.exit(1);
});

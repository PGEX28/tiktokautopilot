import { ImageGenerationAgent, MockImageProvider, ImagePromptBuilder } from '../packages/ai/dist/index.js';

async function run() {
  console.log('🎨 Iniciando Verificação Automatizada do Image Generation Agent (ETAPA 9)...\n');

  // 1. Testando Construtor de Prompts 9:16
  console.log('1. Testando ImagePromptBuilder (Formato 9:16 Vertical e Estilos)...');
  const promptOutput = ImagePromptBuilder.buildPrompt({
    productName: 'Mini Seladora Térmica Portátil',
    category: 'Cozinha e Utilidades',
    description: 'Bateria recarregável USB-C e fechamento a vácuo instantâneo',
    shotType: 'HERO_STUDIO',
    stylePreset: 'TIKTOK_VIRAL_AESTHETIC',
    aspectRatio: '9:16',
  });

  if (!promptOutput.prompt.includes('9:16') || !promptOutput.prompt.includes('commercial product photography')) {
    throw new Error('Falha na geração do prompt 9:16');
  }
  if (!promptOutput.negativePrompt.includes('blurry') || !promptOutput.negativePrompt.includes('watermark')) {
    throw new Error('Falha nos prompts negativos de qualidade');
  }
  console.log('✅ Prompt Positivo:', promptOutput.prompt.slice(0, 95) + '...');
  console.log('✅ Prompt Negativo:', promptOutput.negativePrompt.slice(0, 60) + '...\n');

  // 2. Testando Agente com MockImageProvider
  console.log('2. Testando ImageGenerationAgent (Geração de Imagem Individual)...');
  const agent = new ImageGenerationAgent({ provider: new MockImageProvider() });
  const singleImage = await agent.generateSingleImage({
    prompt: promptOutput.prompt,
    negativePrompt: promptOutput.negativePrompt,
    aspectRatio: '9:16',
    shotType: 'HERO_STUDIO',
    stylePreset: 'TIKTOK_VIRAL_AESTHETIC',
  });

  if (singleImage.aspectRatio !== '9:16' || singleImage.width !== 1080 || singleImage.height !== 1920) {
    throw new Error(`Resolução inválida para 9:16: ${singleImage.width}x${singleImage.height}`);
  }
  if (!singleImage.url.startsWith('https://cdn.tiktokautopilot.io')) {
    throw new Error('URL da imagem não gerada corretamente pelo mock');
  }
  console.log(`✅ Imagem individual gerada: [${singleImage.id}] ${singleImage.width}x${singleImage.height} | Custo: $${singleImage.costUsd} | Tempo: ${singleImage.inferenceTimeMs}ms\n`);

  // 3. Testando Kit de Imagens Completo do Produto (Múltiplos Ângulos 9:16)
  console.log('3. Testando Geração de Kit Completo de Imagens Publicitárias (Batch)...');
  const kitResult = await agent.generateProductImageKit({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    productCategory: 'Cozinha',
    productDescription: 'Selagem hermética em 3 segundos para alimentos crocantes',
    shotTypes: ['HERO_STUDIO', 'CLOSEUP_DETAIL', 'LIFESTYLE_IN_USE'],
    stylePreset: 'TIKTOK_VIRAL_AESTHETIC',
    aspectRatio: '9:16',
  });

  if (kitResult.images.length !== 3) {
    throw new Error(`Esperado 3 imagens no kit, recebido ${kitResult.images.length}`);
  }
  if (kitResult.totalCostUsd <= 0) {
    throw new Error('Custo total não computado');
  }

  console.log(`✅ Kit gerado com sucesso para o produto: ${kitResult.productId}`);
  kitResult.images.forEach((img, idx) => {
    console.log(`   [${idx + 1}] Ângulo: ${img.shotType} -> URL: ${img.url} ($${img.costUsd})`);
  });
  console.log(`✅ Custo Total do Kit: $${kitResult.totalCostUsd} | Duração: ${kitResult.totalTimeMs}ms\n`);

  console.log('🎉 Todos os testes do Image Generation Agent (ETAPA 9) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 9:', err);
  process.exit(1);
});

import { ScriptGenerationAgent } from '../packages/ai/dist/index.js';
import { VideoGenerationAgent, MockVideoProvider, MockTTSProvider } from '../packages/video/dist/index.js';

async function run() {
  console.log('🎬 Iniciando Verificação Automatizada do Video Generation Agent (ETAPA 11)...\n');

  // 1. Gerar Roteiro de Referência com o ScriptAgent
  console.log('1. Gerando Roteiro de Teste (ScriptAgent)...');
  const scriptAgent = new ScriptGenerationAgent();
  const testScript = await scriptAgent.generateScript({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil',
    productCategory: 'Cozinha',
    style: 'PROBLEM_SOLUTION',
    tone: 'ENERGETIC',
  });
  console.log(`✅ Roteiro gerado com ${testScript.sections.length} seções (~${testScript.totalDurationSeconds}s)\n`);

  // 2. Executar VideoGenerationAgent para sintetizar Áudio TTS e Clipes 9:16
  console.log('2. Testando VideoGenerationAgent (Síntese de Vídeos 9:16 + Locução Neural)...');
  const videoAgent = new VideoGenerationAgent({
    videoProvider: new MockVideoProvider(),
    ttsProvider: new MockTTSProvider(),
  });

  const manifest = await videoAgent.generateVideoFromScript(testScript);

  if (manifest.clips.length !== 5) {
    throw new Error(`Esperado 5 clipes de vídeo, recebido ${manifest.clips.length}`);
  }
  if (manifest.resolution !== '1080x1920') {
    throw new Error(`Resolução incorreta: ${manifest.resolution}`);
  }
  if (!manifest.voiceover || !manifest.voiceover.url.endsWith('.mp3')) {
    throw new Error('Falha na síntese da locução TTS');
  }

  console.log(`✅ Manifesto de Vídeo Gerado com Sucesso: [${manifest.manifestId}]`);
  console.log(`   - Resolução: ${manifest.resolution} (9:16 Vertical TikTok) @ ${manifest.fps} fps`);
  console.log(`   - Duração Total: ${manifest.totalDurationSeconds}s`);
  console.log(`   - Custo Total de Produção: $${manifest.totalCostUsd} USD`);
  console.log(`   - Tempo Total de Render/Síntese: ${manifest.totalProcessingTimeMs}ms\n`);

  console.log('3. Validando Detalhes das Trilhas Geradas:');
  console.log(`   🎤 Trilha de Voz (TTS): [${manifest.voiceover.id}] ${manifest.voiceover.language} -> ${manifest.voiceover.url} ($${manifest.voiceover.costUsd})`);
  manifest.clips.forEach((clip, index) => {
    console.log(`   🎞️ Clipe ${index + 1} [${clip.sectionType.padEnd(14)}]: ${clip.durationSeconds}s (${clip.width}x${clip.height}) -> ${clip.url} ($${clip.costUsd})`);
  });
  console.log();

  console.log('🎉 Todos os testes do Video Generation Agent (ETAPA 11) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 11:', err);
  process.exit(1);
});

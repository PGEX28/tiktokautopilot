import { config } from 'dotenv';
config();

import { OpenAIScriptProvider } from '../packages/ai/dist/script/providers/openai-script.provider.js';
import { ElevenLabsTTSProvider } from '../packages/video/dist/providers/elevenlabs-tts.provider.js';

async function testGeneration() {
  console.log('--- TESTE DE GERAÇÃO REAL COM IA ---');
  console.log('1. Testando OpenAI GPT-4o-mini (Geração de Roteiro Direct Response)...');
  
  const scriptProvider = new OpenAIScriptProvider();
  const script = await scriptProvider.generateScript({
    productId: 'test_prod_001',
    productName: 'Mini Seladora Térmica Portátil USB',
    productCategory: 'Cozinha & Casa',
    style: 'PROBLEM_SOLUTION',
    tone: 'ENERGETIC',
  });

  console.log('✅ Roteiro gerado pela OpenAI com Sucesso!');
  console.log('   - Gancho (0-3s):', script.sections[0]?.voiceoverText);
  console.log('   - Dor (3-12s):', script.sections[1]?.voiceoverText);
  console.log('   - Solução (12-23s):', script.sections[2]?.voiceoverText);
  console.log('   - CTA Sacola:', script.sections[3]?.voiceoverText);

  console.log('\n2. Testando ElevenLabs (Síntese de Voz Neural)...');
  const ttsProvider = new ElevenLabsTTSProvider();
  const audio = await ttsProvider.synthesizeSpeech({
    text: script.sections[0]?.voiceoverText || 'Pare de perder seus alimentos com embalagens abertas!',
  });

  console.log('✅ Áudio sintetizado com Sucesso pelo ElevenLabs!');
  console.log('   - Arquivo salvo em:', audio.url);
  console.log('   - Duração estimada:', audio.durationSeconds, 's');
  console.log('   - Custo aproximado: $' + audio.costUsd);
  console.log('\n🚀 TODAS AS APIS ESTÃO 100% OPERACIONAIS E INTEGRADAS!');
}

testGeneration().catch(console.error);

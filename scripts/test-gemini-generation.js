import { config } from 'dotenv';
config();

import { GeminiScriptProvider } from '../packages/ai/dist/script/providers/gemini-script.provider.js';
import { ElevenLabsTTSProvider } from '../packages/video/dist/providers/elevenlabs-tts.provider.js';

async function testGeminiAndEleven() {
  console.log('--- TESTE REAL COM GOOGLE GEMINI 1.5 & ELEVENLABS ---');
  console.log('1. Testando Gemini 1.5 Flash (Roteirização Direct Response)...');

  const geminiProvider = new GeminiScriptProvider();
  const script = await geminiProvider.generateScript({
    productId: 'prod_9921_kitchen',
    productName: 'Mini Seladora Térmica Portátil USB',
    productCategory: 'Cozinha & Casa',
    style: 'PROBLEM_SOLUTION',
    tone: 'ENERGETIC',
  });

  console.log('✅ Roteiro gerado pelo Google Gemini com Sucesso!');
  console.log('   - Gancho (0-3s):', script.sections[0]?.voiceoverText);
  console.log('   - Dor (3-12s):', script.sections[1]?.voiceoverText);
  console.log('   - Solução (12-23s):', script.sections[2]?.voiceoverText);
  console.log('   - CTA Sacola:', script.sections[3]?.voiceoverText);

  console.log('\n2. Testando ElevenLabs (Síntese de Áudio Neural)...');
  const ttsProvider = new ElevenLabsTTSProvider();
  const audio = await ttsProvider.synthesizeSpeech({
    text: script.sections[0]?.voiceoverText || 'Pare de comer biscoito murcho agora mesmo!',
  });

  console.log('✅ Áudio sintetizado pelo ElevenLabs com Sucesso!');
  console.log('   - Arquivo salvo em:', audio.url);
  console.log('   - Duração estimada:', audio.durationSeconds, 's');
  console.log('   - Custo aproximado: $' + audio.costUsd);
  console.log('\n🚀 TODAS AS APIS ESTÃO 100% OPERACIONAIS E CONECTADAS!');
}

testGeminiAndEleven().catch(console.error);

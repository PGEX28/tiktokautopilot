import { config } from 'dotenv';
config();

import { ElevenLabsTTSProvider } from '../packages/video/dist/providers/elevenlabs-tts.provider.js';

async function testElevenLabsOnly() {
  console.log('--- TESTE DIRETO COM ELEVENLABS (VOZ NEURAL REAL) ---');
  
  const ttsProvider = new ElevenLabsTTSProvider();
  const audio = await ttsProvider.synthesizeSpeech({
    text: 'Pare de comer biscoito murcho agora mesmo! Essa mini seladora térmica portátil veda qualquer pacote em apenas 3 segundos com frete grátis na sacola amarela do TikTok Shop.',
  });

  console.log('✅ Áudio sintetizado com SUCESSO pelo ElevenLabs!');
  console.log('   - Arquivo de áudio gerado:', audio.url);
  console.log('   - Duração:', audio.durationSeconds, 'segundos');
  console.log('   - Caracteres narrados:', audio.wordCount, 'palavras');
  console.log('   - Provedor:', audio.provider);
}

testElevenLabsOnly().catch(console.error);

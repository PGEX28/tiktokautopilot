import crypto from 'crypto';
import { TTSProvider } from './base-tts.provider.js';
import { AudioVoiceoverResult, TTSGenerationOptions } from '../video.types.js';

export class MockTTSProvider implements TTSProvider {
  public readonly providerName = 'mock-tts';

  public async synthesizeSpeech(options: TTSGenerationOptions): Promise<AudioVoiceoverResult> {
    const startTime = Date.now();
    const id = `audio_${crypto.randomBytes(8).toString('hex')}`;
    const wordCount = options.text.trim().split(/\s+/).length;
    
    // Média de 2.5 palavras por segundo em fala publicitária rápida
    const calculatedDuration = Math.max(1, Math.round(wordCount / 2.5));

    await new Promise((resolve) => setTimeout(resolve, 40));

    const mockAudioUrl = `https://cdn.tiktokautopilot.io/audio/${id}_voiceover_${options.language || 'pt-BR'}.mp3`;

    return {
      id,
      url: mockAudioUrl,
      durationSeconds: calculatedDuration,
      language: options.language || 'pt-BR',
      voiceId: options.voiceId || 'pt_br_energetic_male_01',
      wordCount,
      costUsd: this.estimateCost(options.text.length),
      synthesisTimeMs: Date.now() - startTime,
      provider: 'mock-tts',
      createdAt: new Date().toISOString(),
    };
  }

  public estimateCost(characterCount: number): number {
    // Estimativa mock de TTS (ex: ElevenLabs / OpenAI TTS): ~$0.000015 por caractere
    return Number((characterCount * 0.000015).toFixed(4));
  }
}

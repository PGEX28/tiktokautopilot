import { AudioVoiceoverResult, TTSGenerationOptions } from '../video.types.js';
import { TTSProvider } from './base-tts.provider.js';
import { logger } from '@autopilot/shared';
import * as fs from 'fs';
import * as path from 'path';

export class ElevenLabsTTSProvider implements TTSProvider {
  public readonly providerName = 'elevenlabs';
  private apiKey: string;
  private defaultVoiceId: string;

  constructor(apiKey?: string, voiceId?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
    this.defaultVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM';
  }

  public async synthesizeSpeech(options: TTSGenerationOptions): Promise<AudioVoiceoverResult> {
    const { text, voiceId = this.defaultVoiceId } = options;
    logger.info(`[ElevenLabsTTSProvider] Synthesizing speech with ElevenLabs (${text.length} chars)`);

    const startTime = Date.now();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API error (${response.status}): ${errText}`);
      }

      const buffer = await response.arrayBuffer();
      const outputDir = path.resolve(process.cwd(), 'media', 'audio');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const audioFileName = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
      const audioPath = path.join(outputDir, audioFileName);
      fs.writeFileSync(audioPath, Buffer.from(buffer));

      const durationMs = Date.now() - startTime;

      return {
        id: `tts_${Date.now()}`,
        url: audioPath,
        durationSeconds: 30,
        language: 'pt-BR',
        voiceId,
        wordCount: text.split(' ').length,
        costUsd: this.estimateCost(text.length),
        synthesisTimeMs: durationMs,
        provider: 'elevenlabs',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to synthesize speech with ElevenLabs', { error });
      throw error;
    }
  }

  public estimateCost(characterCount: number): number {
    return +(characterCount * 0.00003).toFixed(4);
  }
}

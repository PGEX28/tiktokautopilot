import { AudioVoiceoverResult, TTSGenerationOptions } from '../video.types.js';

export interface TTSProvider {
  readonly providerName: 'mock-tts' | 'elevenlabs' | 'openai-tts';
  synthesizeSpeech(options: TTSGenerationOptions): Promise<AudioVoiceoverResult>;
  estimateCost(characterCount: number): number;
}

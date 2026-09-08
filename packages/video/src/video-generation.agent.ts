import crypto from 'crypto';
import { VideoProvider } from './providers/base-video.provider.js';
import { MockVideoProvider } from './providers/mock-video.provider.js';
import { TTSProvider } from './providers/base-tts.provider.js';
import { MockTTSProvider } from './providers/mock-tts.provider.js';
import { 
  FullVideoCompositionManifest, 
  VideoClipResult 
} from './video.types.js';
import { GeneratedScript } from '@autopilot/ai';
import { logger } from '@autopilot/shared';

export interface VideoAgentConfig {
  videoProvider?: VideoProvider;
  ttsProvider?: TTSProvider;
}

export class VideoGenerationAgent {
  private videoProvider: VideoProvider;
  private ttsProvider: TTSProvider;

  constructor(config: VideoAgentConfig = {}) {
    this.videoProvider = config.videoProvider || new MockVideoProvider();
    this.ttsProvider = config.ttsProvider || new MockTTSProvider();
  }

  public setVideoProvider(provider: VideoProvider): void {
    this.videoProvider = provider;
  }

  public setTTSProvider(provider: TTSProvider): void {
    this.ttsProvider = provider;
  }

  public async generateVideoFromScript(script: GeneratedScript): Promise<FullVideoCompositionManifest> {
    const startTime = Date.now();
    logger.info(`[VideoAgent] Starting video & audio synthesis for script '${script.id}' (${script.sections.length} sections)`);

    // 1. Geração da Locução Completa (TTS)
    logger.info(`[VideoAgent] Synthesizing voiceover track (${script.sections.length} sections, ~${script.totalDurationSeconds}s)`);
    const voiceover = await this.ttsProvider.synthesizeSpeech({
      text: script.fullVoiceoverText,
      language: script.targetLanguage,
      voiceId: 'pt_br_energetic_male_01',
    });

    // 2. Geração dos Clipes de Vídeo 9:16 para cada uma das seções do roteiro
    const clips: VideoClipResult[] = [];
    let accumulatedVideoCost = 0;

    for (const section of script.sections) {
      logger.info(`[VideoAgent] Generating clip for section [${section.type}] (${section.durationSeconds}s)`);
      const clip = await this.videoProvider.generateClip({
        sectionType: section.type,
        durationSeconds: section.durationSeconds,
        visualPrompt: section.visualCue,
        resolution: '1080x1920',
        fps: 30,
      });

      clips.push(clip);
      accumulatedVideoCost += clip.costUsd;
    }

    const totalProcessingTimeMs = Date.now() - startTime;
    const totalCostUsd = Number((accumulatedVideoCost + voiceover.costUsd).toFixed(4));
    const totalDurationSeconds = clips.reduce((acc, c) => acc + c.durationSeconds, 0);

    const manifestId = `man_${crypto.randomBytes(8).toString('hex')}`;

    logger.info(`[VideoAgent] Video generation completed: ${clips.length} clips, total cost $${totalCostUsd} (${totalProcessingTimeMs}ms)`);

    return {
      manifestId,
      productId: script.productId,
      scriptId: script.id,
      totalDurationSeconds,
      clips,
      voiceover,
      resolution: '1080x1920',
      fps: 30,
      totalCostUsd,
      totalProcessingTimeMs,
      createdAt: new Date().toISOString(),
    };
  }
}

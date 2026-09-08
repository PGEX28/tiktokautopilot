import crypto from 'crypto';
import { FFmpegCommandBuilder } from './ffmpeg-command.builder.js';
import { LiveStreamOptions, LiveStreamSession } from './ffmpeg.types.js';
import { logger } from '@autopilot/shared';

export class LiveLoopGenerator {
  /**
   * Inicia ou gera a sessão de Live Stream contínua em loop (24/7) para TikTok Live.
   */
  public createLiveSession(options: LiveStreamOptions): LiveStreamSession {
    const sessionId = `live_${crypto.randomBytes(8).toString('hex')}`;
    const rtmpCommandLine = FFmpegCommandBuilder.buildLiveStreamCommand(options);

    logger.info(`[LiveLoopGenerator] Starting TikTok Shop Live 24/7 stream session [${sessionId}]`);
    logger.debug(`[LiveLoopGenerator] RTMP Stream Command: ${rtmpCommandLine}`);

    return {
      sessionId,
      streamUrl: `${options.rtmpServerUrl.replace(/\/$/, '')}/${options.streamKey}`,
      status: 'STREAMING',
      rtmpCommandLine,
      startedAt: new Date().toISOString(),
    };
  }
}

export interface OverlayConfig {
  type: 'TEXT' | 'BADGE' | 'YELLOW_BAG_ANIMATION';
  content?: string;
  positionX?: number | string; // ex: '(w-text_w)/2'
  positionY?: number | string; // ex: 'h-150'
  fontSize?: number;
  fontColor?: string;
  boxColor?: string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
}

export interface RenderCompositionOptions {
  manifestId: string;
  videoClipUrls: string[];
  audioVoiceoverUrl: string;
  backgroundMusicUrl?: string;
  backgroundMusicVolume?: number; // ex: 0.15 (-18dB)
  overlays?: OverlayConfig[];
  outputPath?: string;
  outputResolution?: '1080x1920';
  fps?: number;
}

export interface RenderedVideoResult {
  renderId: string;
  outputPath: string;
  outputUrl: string;
  durationSeconds: number;
  fileSizeBytes: number;
  resolution: string;
  fps: number;
  ffmpegCommandLine: string;
  renderTimeMs: number;
  createdAt: string;
}

export interface LiveStreamOptions {
  videoSourcePath: string;
  rtmpServerUrl: string;
  streamKey: string;
  loopForever: boolean;
  bitrateKbps?: number;
}

export interface LiveStreamSession {
  sessionId: string;
  streamUrl: string;
  status: 'STARTING' | 'STREAMING' | 'STOPPED' | 'ERROR';
  rtmpCommandLine: string;
  startedAt: string;
}

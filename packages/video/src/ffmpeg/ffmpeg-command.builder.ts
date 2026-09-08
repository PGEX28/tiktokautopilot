import { RenderCompositionOptions, LiveStreamOptions } from './ffmpeg.types.js';

export class FFmpegCommandBuilder {
  /**
   * Constrói o comando de renderização complexo do FFmpeg para juntar clipes, áudio de voz, trilha de fundo e overlays.
   */
  public static buildRenderCommand(options: RenderCompositionOptions): string {
    const inputs: string[] = [];
    
    // Insumos de clipes de vídeo
    options.videoClipUrls.forEach((url) => {
      inputs.push(`-i "${url}"`);
    });

    // Insumo da locução (TTS)
    inputs.push(`-i "${options.audioVoiceoverUrl}"`);

    // Insumo de música de fundo (se houver)
    if (options.backgroundMusicUrl) {
      inputs.push(`-i "${options.backgroundMusicUrl}"`);
    }

    const videoInputsCount = options.videoClipUrls.length;
    const ttsIndex = videoInputsCount;
    const bgmIndex = options.backgroundMusicUrl ? videoInputsCount + 1 : -1;

    // Filtros de vídeo (concatenação e padronização 1080x1920)
    let filterComplex = '';
    for (let i = 0; i < videoInputsCount; i++) {
      filterComplex += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v${i}];`;
    }

    for (let i = 0; i < videoInputsCount; i++) {
      filterComplex += `[v${i}]`;
    }
    filterComplex += `concat=n=${videoInputsCount}:v=1:a=0[vconcat];`;

    // Filtros de Overlays (ex: Legendas e Sacola Amarela)
    let currentVTag = 'vconcat';
    if (options.overlays && options.overlays.length > 0) {
      options.overlays.forEach((overlay, idx) => {
        const nextVTag = `vovl${idx}`;
        if (overlay.type === 'BADGE' || overlay.type === 'YELLOW_BAG_ANIMATION') {
          filterComplex += `[${currentVTag}]drawbox=x=40:y=1700:w=360:h=120:color=yellow@0.9:t=fill[${nextVTag}];`;
        } else if (overlay.type === 'TEXT') {
          const escapedText = (overlay.content || 'TikTok Shop').replace(/'/g, "\\'");
          filterComplex += `[${currentVTag}]drawtext=text='${escapedText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h-240:shadowcolor=black:shadowx=2:shadowy=2[${nextVTag}];`;
        }
        currentVTag = nextVTag;
      });
    }

    // Filtros de Áudio (Mixagem da voz com música atenuada - ducking)
    if (bgmIndex !== -1) {
      const vol = options.backgroundMusicVolume || 0.15;
      filterComplex += `[${bgmIndex}:a]volume=${vol}[abgm];[${ttsIndex}:a][abgm]amix=inputs=2:duration=first[aout]`;
    } else {
      filterComplex += `[${ttsIndex}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[aout]`;
    }

    const outputPath = options.outputPath || 'output_rendered_video.mp4';

    return `ffmpeg -y ${inputs.join(' ')} -filter_complex "${filterComplex}" -map "[${currentVTag}]" -map "[aout]" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k -r 30 "${outputPath}"`;
  }

  /**
   * Constrói o comando de transmissão ao vivo contínua (Loop 24/7 RTMP) para TikTok Live.
   */
  public static buildLiveStreamCommand(options: LiveStreamOptions): string {
    const loopFlag = options.loopForever ? '-stream_loop -1' : '';
    const bitrate = options.bitrateKbps || 4500;
    const destination = `${options.rtmpServerUrl.replace(/\/$/, '')}/${options.streamKey}`;

    return `ffmpeg -re ${loopFlag} -i "${options.videoSourcePath}" -c:v libx264 -preset veryfast -b:v ${bitrate}k -maxrate ${bitrate}k -bufsize ${bitrate * 2}k -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -ar 44100 -f flv "${destination}"`;
  }
}

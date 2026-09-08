import { 
  FFmpegCommandBuilder, 
  FFmpegRenderer, 
  LiveLoopGenerator 
} from '../packages/video/dist/index.js';

async function run() {
  console.log('🎞️ Iniciando Verificação Automatizada do FFmpeg Engine + Live Loop (ETAPA 13)...\n');

  // 1. Testando Construtor de Comandos de Renderização Complexos (FFmpegCommandBuilder)
  console.log('1. Testando FFmpegCommandBuilder (Concatenação 9:16 + Ducking de Áudio + Overlays)...');
  const renderCmd = FFmpegCommandBuilder.buildRenderCommand({
    manifestId: 'man_test_9921',
    videoClipUrls: [
      'https://cdn.tiktokautopilot.io/videos/clip_01_hook.mp4',
      'https://cdn.tiktokautopilot.io/videos/clip_02_problem.mp4',
      'https://cdn.tiktokautopilot.io/videos/clip_03_demo.mp4',
      'https://cdn.tiktokautopilot.io/videos/clip_04_benefits.mp4',
      'https://cdn.tiktokautopilot.io/videos/clip_05_cta.mp4',
    ],
    audioVoiceoverUrl: 'https://cdn.tiktokautopilot.io/audio/voiceover_pt_br.mp3',
    backgroundMusicUrl: 'https://cdn.tiktokautopilot.io/audio/bg_lofi_upbeat.mp3',
    backgroundMusicVolume: 0.12,
    overlays: [
      { type: 'BADGE' },
      { type: 'TEXT', content: 'Clique na Sacola Amarela! 🛍️' },
    ],
    outputPath: '/tmp/renders/master_rendered_916.mp4',
  });

  if (!renderCmd.includes('scale=1080:1920') || !renderCmd.includes('concat=n=5:v=1:a=0') || !renderCmd.includes('amix=inputs=2')) {
    throw new Error('Comando FFmpeg gerado não contém filtros essenciais de escala ou concatenação');
  }
  console.log('✅ Comando FFmpeg Complexo Construído:');
  console.log(`   ${renderCmd.slice(0, 140)}...\n`);

  // 2. Testando Motor de Renderização de Vídeo Composto (FFmpegRenderer)
  console.log('2. Testando FFmpegRenderer (Processamento do Vídeo Final)...');
  const renderer = new FFmpegRenderer();
  const renderResult = await renderer.renderVideo({
    manifestId: 'man_test_9921',
    videoClipUrls: [
      'https://cdn.tiktokautopilot.io/videos/clip_01_hook.mp4',
      'https://cdn.tiktokautopilot.io/videos/clip_02_problem.mp4',
    ],
    audioVoiceoverUrl: 'https://cdn.tiktokautopilot.io/audio/voiceover_pt_br.mp3',
    outputPath: '/tmp/renders/final_video_916.mp4',
  });

  if (renderResult.resolution !== '1080x1920' || renderResult.fps !== 30 || renderResult.fileSizeBytes <= 0) {
    throw new Error('Resultado de renderização com especificações inválidas');
  }
  console.log(`✅ Vídeo Renderizado com Sucesso: [${renderResult.renderId}]`);
  console.log(`   - Output URL: ${renderResult.outputUrl}`);
  console.log(`   - Resolução: ${renderResult.resolution} @ ${renderResult.fps} fps`);
  console.log(`   - Tamanho Estimado: ${(renderResult.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`   - Tempo de Renderização: ${renderResult.renderTimeMs}ms\n`);

  // 3. Testando Gerador de Live Loop RTMP (LiveLoopGenerator)
  console.log('3. Testando LiveLoopGenerator (Transmissão Contínua 24/7 TikTok Live)...');
  const liveGen = new LiveLoopGenerator();
  const liveSession = liveGen.createLiveSession({
    videoSourcePath: renderResult.outputPath,
    rtmpServerUrl: 'rtmp://live-push.tiktok.com/live',
    streamKey: 'stream_key_auth_live_9921',
    loopForever: true,
    bitrateKbps: 4500,
  });

  if (!liveSession.rtmpCommandLine.includes('-stream_loop -1') || !liveSession.rtmpCommandLine.includes('rtmp://live-push.tiktok.com/live')) {
    throw new Error('Comando RTMP de streaming não possui flag de repetição infinita ou destino válido');
  }

  console.log(`✅ Sessão de Live Loop Criada: [${liveSession.sessionId}]`);
  console.log(`   - Destino RTMP: ${liveSession.streamUrl}`);
  console.log(`   - Status: ${liveSession.status}`);
  console.log(`   - Comando RTMP: ${liveSession.rtmpCommandLine.slice(0, 110)}...\n`);

  console.log('🎉 Todos os testes do FFmpeg Engine + Live Loop (ETAPA 13) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 13:', err);
  process.exit(1);
});

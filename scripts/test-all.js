import { spawn } from 'child_process';
import path from 'path';

const testScripts = [
  { name: 'ETAPA 1: Setup & Fundação do Monorepo', file: 'scripts/verify-setup.js' },
  { name: 'ETAPA 8: OAuth e Segurança (AES-256-GCM / CSRF)', file: 'scripts/verify-security.js' },
  { name: 'ETAPA 5: Product Hunter Agent', file: 'scripts/verify-product-hunter.js' },
  { name: 'ETAPA 6: Product Score Agent', file: 'scripts/verify-product-score.js' },
  { name: 'ETAPA 9: Image Generation Agent (9:16 Vertical)', file: 'scripts/verify-image-agent.js' },
  { name: 'ETAPA 10: Script Generation Agent (5 Fases ~30s)', file: 'scripts/verify-script-agent.js' },
  { name: 'ETAPA 11: Video Generation Agent (TTS pt-BR)', file: 'scripts/verify-video-agent.js' },
  { name: 'ETAPA 12: 3 Variations Engine (A/B/C Testing)', file: 'scripts/verify-variations-engine.js' },
  { name: 'ETAPA 13: FFmpeg Engine + Live Loop 24/7 RTMP', file: 'scripts/verify-ffmpeg-engine.js' },
  { name: 'ETAPA 14: Analytics Agent (CTR, CVR, EPC, RPM)', file: 'scripts/verify-analytics-agent.js' },
  { name: 'ETAPA 15: Optimization Agent (IA Learning Engine)', file: 'scripts/verify-optimization-agent.js' },
  { name: 'ETAPA 16: Web Dashboard UI (React + Tailwind)', file: 'scripts/verify-web-ui.js' },
  { name: 'ETAPA 17: n8n Workflows Automation JSONs', file: 'scripts/verify-n8n-workflows.js' },
  { name: 'ETAPA 18: Autopilot Engine (Pipeline Loop & Guards)', file: 'scripts/verify-autopilot-engine.js' },
  { name: 'ETAPA 19: Docker & Containerização (Compose + FFmpeg)', file: 'scripts/verify-docker-config.js' },
];

function runScript(scriptPath) {
  return new Promise((resolve) => {
    const start = Date.now();
    const proc = spawn('node', [scriptPath], { stdio: 'inherit', shell: true });

    proc.on('close', (code) => {
      const duration = Date.now() - start;
      resolve({ success: code === 0, duration, code });
    });
  });
}

async function runAll() {
  console.log('🧪 =========================================================');
  console.log('🧪 EXECUTOR CENTRAL DE TESTES - TIKTOK SHOP AI AUTOPILOT');
  console.log('🧪 Bateria Completa de Verificação Automatizada (ETAPA 20)');
  console.log('🧪 =========================================================\n');

  const results = [];
  const globalStart = Date.now();

  for (let i = 0; i < testScripts.length; i++) {
    const item = testScripts[i];
    console.log(`\n▶️  [${i + 1}/${testScripts.length}] Executando: ${item.name}...`);
    const result = await runScript(item.file);
    results.push({ ...item, ...result });

    if (!result.success) {
      console.error(`\n❌ Falha no teste: ${item.name} (código de saída: ${result.code})`);
      process.exit(1);
    }
  }

  const totalTime = Date.now() - globalStart;

  console.log('\n\n📊 =========================================================');
  console.log('📊 MATRIZ CONSOLIDADA DE RESULTADOS DOS TESTES');
  console.log('📊 =========================================================');
  results.forEach((r, idx) => {
    console.log(`✅ [${String(idx + 1).padStart(2, '0')}/${testScripts.length}] ${r.name.padEnd(52)}: APROVADO (${r.duration}ms)`);
  });

  console.log('=========================================================');
  console.log(`🎉 100% DE SUCESSO: Todos os ${results.length} testes passaram! (Tempo Total: ${(totalTime / 1000).toFixed(2)}s)`);
  console.log('=========================================================\n');

  setTimeout(() => process.exit(0), 100);
}

runAll().catch((err) => {
  console.error('❌ Erro fatal no executor de testes:', err);
  process.exit(1);
});

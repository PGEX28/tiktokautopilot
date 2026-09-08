import fs from 'fs';
import path from 'path';

async function run() {
  console.log('🔄 Iniciando Verificação Automatizada dos Workflows n8n (ETAPA 17)...\n');

  const workflowsDir = path.resolve('n8n/workflows');
  if (!fs.existsSync(workflowsDir)) {
    throw new Error('Diretório n8n/workflows não encontrado!');
  }

  const expectedWorkflows = [
    '01_product_mining_and_scoring.json',
    '02_abc_video_generation_pipeline.json',
    '03_tiktok_live_loop_streamer.json',
    '04_analytics_and_telegram_alerts.json',
  ];

  console.log('1. Validando Sintaxe JSON e Estrutura de Nós do n8n:');
  for (const filename of expectedWorkflows) {
    const filePath = path.join(workflowsDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo de workflow ausente: ${filename}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);

    if (!parsed.name || !Array.isArray(parsed.nodes) || !parsed.connections) {
      throw new Error(`Estrutura de workflow n8n inválida em: ${filename}`);
    }

    console.log(`   ✅ [${filename}]`);
    console.log(`      - Nome: "${parsed.name}"`);
    console.log(`      - Nós configurados: ${parsed.nodes.length}`);
    console.log(`      - Conexões ativas: ${Object.keys(parsed.connections).length}`);
  }

  console.log('\n🎉 Todos os 4 workflows do n8n (ETAPA 17) foram validados com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 17:', err);
  process.exit(1);
});

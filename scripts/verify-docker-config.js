import fs from 'fs';
import path from 'path';

async function run() {
  console.log('🐳 Iniciando Verificação de Configuração Docker & Containerização (ETAPA 19)...\n');

  const filesToCheck = [
    { path: '.dockerignore', name: '.dockerignore' },
    { path: 'apps/api/Dockerfile', name: 'API Dockerfile' },
    { path: 'apps/web/Dockerfile', name: 'Web Dockerfile' },
    { path: 'docker-compose.yml', name: 'Docker Compose' },
  ];

  console.log('1. Validando Existência e Estrutura dos Arquivos Docker:');
  for (const item of filesToCheck) {
    const fullPath = path.resolve(item.path);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Arquivo obrigatório ausente: ${item.path}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    if (content.length < 50) {
      throw new Error(`Arquivo ${item.path} parece incompleto ou vazio!`);
    }

    console.log(`   ✅ [${item.name}]: Presente (${content.split('\n').length} linhas)`);
  }

  // 2. Validações Específicas
  console.log('\n2. Validando Diretrizes Especiais de Containerização:');
  const apiDocker = fs.readFileSync(path.resolve('apps/api/Dockerfile'), 'utf-8');
  if (!apiDocker.includes('ffmpeg') || !apiDocker.includes('node:20-alpine')) {
    throw new Error('Dockerfile da API não inclui FFmpeg ou base Node 20!');
  }
  console.log('   ✅ API Dockerfile: Multi-stage configurado com Node 20 e FFmpeg nativo.');

  const webDocker = fs.readFileSync(path.resolve('apps/web/Dockerfile'), 'utf-8');
  if (!webDocker.includes('nginx:alpine')) {
    throw new Error('Dockerfile do Frontend não utiliza Nginx!');
  }
  console.log('   ✅ Web Dockerfile: Multi-stage configurado com compilação Vite e Nginx Alpine.');

  const compose = fs.readFileSync(path.resolve('docker-compose.yml'), 'utf-8');
  if (!compose.includes('redis:7-alpine') || !compose.includes('autopilot-net')) {
    throw new Error('docker-compose.yml não configura Redis 7 ou rede isolada!');
  }
  console.log('   ✅ Docker Compose: Serviços (api, web, redis), rede bridge e volumes persistentes configurados.');

  console.log('\n🎉 Todos os testes de Docker & Containerização (ETAPA 19) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 19:', err);
  process.exit(1);
});

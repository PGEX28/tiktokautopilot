import http from 'http';
import { createServer } from '../apps/api/src/server.ts';

console.log('🧪 Iniciando Verificação Automatizada da API REST (ETAPA 3)...');

const app = createServer();
const server = http.createServer(app);

server.listen(0, async () => {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 4001;
  const baseUrl = `http://localhost:${port}/api/v1`;

  console.log(`📡 Servidor de teste em execução na porta ${port}`);

  try {
    // 1. Health check
    console.log('Testing GET /api/v1/health...');
    const resHealth = await fetch(`${baseUrl}/health`);
    const healthData = await resHealth.json();
    if (!healthData.status || healthData.status !== 'HEALTHY') throw new Error('Health check falhou');
    console.log('✅ GET /api/v1/health: 200 OK');

    // 2. List products
    console.log('Testing GET /api/v1/products...');
    const resProducts = await fetch(`${baseUrl}/products`);
    const productsData = await resProducts.json();
    if (!productsData.success || !Array.isArray(productsData.data) || productsData.data.length === 0) {
      throw new Error('Listagem de produtos falhou');
    }
    const productId = productsData.data[0].id;
    console.log(`✅ GET /api/v1/products: 200 OK (${productsData.data.length} produtos encontrados)`);

    // 3. Get score breakdown
    console.log(`Testing GET /api/v1/scores/${productId}...`);
    const resScore = await fetch(`${baseUrl}/scores/${productId}`);
    const scoreData = await resScore.json();
    if (!scoreData.success || !scoreData.data.totalScore || !scoreData.data.breakdown.demand) {
      throw new Error('Consulta de score falhou');
    }
    console.log(`✅ GET /api/v1/scores/:id: 200 OK (Score: ${scoreData.data.totalScore}, Tier: ${scoreData.data.tier})`);

    // 4. Generate content
    console.log('Testing POST /api/v1/content/generate...');
    const resContent = await fetch(`${baseUrl}/content/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, targetVariationsCount: 3 }),
    });
    const contentData = await resContent.json();
    if (!contentData.success || !contentData.data.scripts || contentData.data.scripts.length !== 3) {
      throw new Error('Geração de conteúdo falhou');
    }
    console.log(`✅ POST /api/v1/content/generate: 200 OK (${contentData.data.scripts.length} roteiros gerados)`);

    // 5. Get video variations
    console.log(`Testing GET /api/v1/videos/product/${productId}...`);
    const resVideos = await fetch(`${baseUrl}/videos/product/${productId}`);
    const videosData = await resVideos.json();
    if (!videosData.success || !Array.isArray(videosData.data) || videosData.data.length < 3) {
      throw new Error('Consulta de variações de vídeo falhou');
    }
    console.log(`✅ GET /api/v1/videos/product/:id: 200 OK (${videosData.data.length} variações encontradas)`);

    // 6. Create & Get Live Loop
    console.log(`Testing POST /api/v1/live-loops...`);
    const resLoop = await fetch(`${baseUrl}/live-loops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        title: 'Loop Automático de Demonstração',
        variationIdsOrder: ['A', 'B', 'C', 'A', 'B', 'C'],
        transitionType: 'FADE',
      }),
    });
    const loopData = await resLoop.json();
    if (!loopData.success || !loopData.data.id) throw new Error('Criação de live loop falhou');
    console.log(`✅ POST /api/v1/live-loops: 200 OK (Loop ID: ${loopData.data.id})`);

    // 7. Analytics summary
    console.log('Testing GET /api/v1/analytics/summary...');
    const resAnalytics = await fetch(`${baseUrl}/analytics/summary`);
    const analyticsData = await resAnalytics.json();
    if (!analyticsData.success || analyticsData.data.totalViews === undefined) throw new Error('Analytics summary falhou');
    console.log(`✅ GET /api/v1/analytics/summary: 200 OK (Views: ${analyticsData.data.totalViews}, GMV: $${analyticsData.data.totalGmvUsd})`);

    // 8. Settings & Emergency Stop
    console.log('Testing GET /api/v1/settings/budget...');
    const resSettings = await fetch(`${baseUrl}/settings/budget`);
    const settingsData = await resSettings.json();
    if (!settingsData.success || !settingsData.data.maxVideosPerDay) throw new Error('Consulta de configurações falhou');
    console.log(`✅ GET /api/v1/settings/budget: 200 OK (Limite diário: $${settingsData.data.maxDailyAiCostUsd})`);

    console.log('Testing POST /api/v1/settings/emergency-stop...');
    const resEmergency = await fetch(`${baseUrl}/settings/emergency-stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true }),
    });
    const emergencyData = await resEmergency.json();
    if (!emergencyData.success || emergencyData.data.emergencyStop !== true) throw new Error('Emergency stop toggle falhou');
    console.log('✅ POST /api/v1/settings/emergency-stop: 200 OK (Emergency stop ativo)');

    // Reset emergency stop
    await fetch(`${baseUrl}/settings/emergency-stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });

    console.log('\n🎉 Todos os testes de integração da API REST da ETAPA 3 passaram com sucesso!');
    server.close();
  } catch (err) {
    console.error('\n❌ Erro durante o teste da API:', err);
    server.close();
  }
});

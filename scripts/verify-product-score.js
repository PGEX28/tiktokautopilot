import http from 'http';
import { productHunter, productScorer } from '@autopilot/ai';
import { createServer } from '../apps/api/dist/server.js';

console.log('🧪 Iniciando Verificação Automatizada do Product Score Agent (ETAPA 6)...');

async function runVerification() {
  try {
    // 1. Obter produtos candidatos para teste
    console.log('1. Buscando produtos para avaliação de score...');
    const hunterResult = await productHunter.findCandidates();
    const product = hunterResult.candidates[0];
    console.log(`✅ Produto selecionado: "${product.title}"`);

    // 2. Avaliação de Score com Pesos Padrão
    console.log('\n2. Avaliando score com os 8 critérios padrão...');
    const scoreResult = productScorer.evaluateProduct(product);

    if (
      typeof scoreResult.totalScore !== 'number' ||
      scoreResult.totalScore < 0 ||
      scoreResult.totalScore > 100 ||
      !scoreResult.tier ||
      !scoreResult.breakdown.demand ||
      !scoreResult.breakdown.viralPotential ||
      !scoreResult.breakdown.commission ||
      !scoreResult.breakdown.price ||
      !scoreResult.breakdown.reviews ||
      !scoreResult.breakdown.competition ||
      !scoreResult.breakdown.demonstrability ||
      !scoreResult.breakdown.impulseBuy
    ) {
      throw new Error('Cálculo de score ou breakdown dos 8 critérios inválido!');
    }

    console.log(`✅ Score Total: ${scoreResult.totalScore}/100 | Tier: [${scoreResult.tier}] | Ação: ${scoreResult.recommendedAction}`);
    console.log('   Decomposição dos 8 Critérios:');
    for (const [key, item] of Object.entries(scoreResult.breakdown)) {
      console.log(`   - ${item.name} (${(item.weight * 100).toFixed(0)}%): Nota ${item.rawScore} -> Ponderada: ${item.weightedScore} pts`);
    }

    // 3. Verificação da Explicação e Disclaimer
    console.log('\n3. Verificando justificativa em linguagem natural e disclaimer...');
    if (!scoreResult.explanation || !scoreResult.disclaimer || !scoreResult.disclaimer.includes('não constitui garantia de vendas')) {
      throw new Error('Explicação textual ou disclaimer obrigatório ausentes!');
    }
    console.log(`✅ Explicação gerada: "${scoreResult.explanation}"`);
    console.log(`✅ Disclaimer verificado: "${scoreResult.disclaimer}"`);

    // 4. Teste de Recalibração com Pesos Customizados
    console.log('\n4. Testando recálculo com pesos customizados (Demanda 35%, Viral 25%, Comissão 20%, etc.)...');
    const customWeights = {
      demand: 0.35,
      viralPotential: 0.25,
      commission: 0.20,
      price: 0.05,
      reviews: 0.05,
      competition: 0.05,
      demonstrability: 0.025,
      impulseBuy: 0.025,
    };
    const customScore = productScorer.evaluateProduct(product, customWeights);
    console.log(`✅ Novo Score com pesos customizados: ${customScore.totalScore}/100 (${customScore.tier})`);

    // 5. Teste de Integração com API REST (/api/v1/scores)
    console.log('\n5. Testando integração com API REST (/api/v1/scores)...');
    const app = createServer();
    const server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(0, async () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 4003;
        const baseUrl = `http://localhost:${port}/api/v1/scores`;

        // GET /api/v1/scores/:productId
        const resGet = await fetch(`${baseUrl}/${product.id}`);
        const getData = await resGet.json();
        if (!getData.success || !getData.data.totalScore) throw new Error('GET /api/v1/scores/:id falhou');
        console.log(`✅ GET /api/v1/scores/:id: 200 OK (Score: ${getData.data.totalScore}, Tier: ${getData.data.tier})`);

        // POST /api/v1/scores/:productId/recalculate
        const resPost = await fetch(`${baseUrl}/${product.id}/recalculate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customWeights }),
        });
        const postData = await resPost.json();
        if (!postData.success || !postData.data.totalScore) throw new Error('POST /api/v1/scores/:id/recalculate falhou');
        console.log(`✅ POST /api/v1/scores/:id/recalculate: 200 OK (Score Recalculado: ${postData.data.totalScore})`);

        server.close();
        console.log('\n🎉 Todos os testes do Product Score Agent (ETAPA 6) passaram com 100% de sucesso!');
        setTimeout(() => process.exit(0), 100);
        resolve(true);
      });
    });
  } catch (err) {
    console.error('\n❌ Erro durante verificação do Product Score Agent:', err);
    setTimeout(() => process.exit(1), 100);
  }
}

runVerification();

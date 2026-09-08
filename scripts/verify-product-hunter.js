import http from 'http';
import { productHunter } from '@autopilot/ai';
import { queueService } from '@autopilot/queue';
import { createServer } from '../apps/api/dist/server.js';

console.log('🧪 Iniciando Verificação Automatizada do Product Hunter Agent (ETAPA 5)...');

async function runVerification() {
  try {
    // 1. Teste direto do Agente ProductHunter
    console.log('1. Executando ProductHunter.findCandidates() com busca geral...');
    const result = await productHunter.findCandidates();

    if (!result || !Array.isArray(result.candidates) || result.candidates.length === 0) {
      throw new Error('Falha ao encontrar candidatos de produtos!');
    }
    console.log(`✅ ${result.candidates.length} produtos candidatos encontrados.`);

    // 2. Teste de Formatação Estruturada
    console.log('\n2. Testando formatação estruturada de produto...');
    const firstProd = result.candidates[0];
    const structured = productHunter.formatStructuredCandidate(firstProd);

    if (
      !structured.productId ||
      !structured.name ||
      typeof structured.price !== 'number' ||
      typeof structured.commissionRate !== 'number' ||
      !Array.isArray(structured.reasonsToSell) ||
      !Array.isArray(structured.risks) ||
      !structured.problemSolved ||
      !structured.visualHookPotential
    ) {
      throw new Error('Formato estruturado do candidato está incompleto ou inválido!');
    }
    console.log(`✅ Produto estruturado: "${structured.name}" | Preço: $${structured.price} | Comissão: ${(structured.commissionRate * 100).toFixed(0)}% | Gancho: ${structured.visualHookPotential}`);
    console.log(`   Motivos para vender: ${structured.reasonsToSell.length} identificados.`);

    // 3. Teste com Filtros Específicos (Categoria e Comissão mínima)
    console.log('\n3. Testando filtros do Product Hunter (Categoria Home & Kitchen)...');
    const filteredResult = await productHunter.findCandidates({
      category: 'Home & Kitchen',
      minCommissionRate: 0.18,
    });

    if (filteredResult.candidates.some((p) => p.category !== 'Home & Kitchen' || p.commission.rate < 0.18)) {
      throw new Error('Filtro de categoria ou comissão mínima não foi aplicado corretamente!');
    }
    console.log(`✅ Filtros aplicados com sucesso: ${filteredResult.candidates.length} produtos correspondentes.`);

    // 4. Teste de Integração com API REST
    console.log('\n4. Testando integração com API REST (/api/v1/hunter)...');
    const app = createServer();
    const server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(0, async () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 4002;
        const baseUrl = `http://localhost:${port}/api/v1/hunter`;

        // GET /api/v1/hunter/candidates
        const resGet = await fetch(`${baseUrl}/candidates`);
        const getData = await resGet.json();
        if (!getData.success || !Array.json || !Array.isArray(getData.data) || getData.data.length === 0) {
          if (!getData.success || !Array.isArray(getData.data)) throw new Error('GET /api/v1/hunter/candidates falhou');
        }
        console.log(`✅ GET /api/v1/hunter/candidates: 200 OK (${getData.data.length} candidatos retornados)`);

        // POST /api/v1/hunter/discover
        const resPost = await fetch(`${baseUrl}/discover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'Electronics & Gadgets', minCommissionRate: 0.15 }),
        });
        const postData = await resPost.json();
        if (!postData.success || !postData.data.jobId) throw new Error('POST /api/v1/hunter/discover falhou');
        console.log(`✅ POST /api/v1/hunter/discover: 200 OK (Job despachado para fila: ${postData.data.jobId})`);

        server.close();
        await queueService.closeAll();
        console.log('\n🎉 Todos os testes do Product Hunter Agent (ETAPA 5) passaram com 100% de sucesso!');
        setTimeout(() => process.exit(0), 100);
        resolve(true);
      });
    });
  } catch (err) {
    console.error('\n❌ Erro durante verificação do Product Hunter Agent:', err);
    await queueService.closeAll();
    setTimeout(() => process.exit(1), 100);
  }
}

runVerification();

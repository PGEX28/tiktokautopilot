import { AutopilotPipelineEngine, BudgetGuard } from '../packages/shared/dist/index.js';

async function run() {
  console.log('🤖 Iniciando Verificação Automatizada do Autopilot Engine (ETAPA 18)...\n');

  // 1. Testando Ciclo Normal de Ponta a Ponta
  console.log('1. Executando Ciclo Autônomo Completo (Fase 1 a Fase 5)...');
  const guard = new BudgetGuard({ dailyBudgetUsd: 10.00 });
  const engine = new AutopilotPipelineEngine(guard);

  const cycleResult = await engine.runAutonomousCycle();

  if (cycleResult.status !== 'SUCCESS' || !cycleResult.productMined || !cycleResult.bundleGenerated) {
    throw new Error('Falha na execução do ciclo autônomo completo');
  }

  console.log(`✅ Ciclo Autônomo [${cycleResult.cycleId}] Finalizado com Sucesso:`);
  console.log(`   - Status: ${cycleResult.status}`);
  console.log(`   - Produto Processado: ${cycleResult.productMined.title} (Score: ${cycleResult.productMined.score}/100)`);
  console.log(`   - Variações A/B/C Geradas: ${cycleResult.bundleGenerated.variationsCount} vídeos`);
  console.log(`   - Sessão de Live Loop RTMP: ${cycleResult.liveSessionStarted?.sessionId}`);
  console.log(`   - Custo Incorrido no Ciclo: $${cycleResult.totalCostIncurredUsd} USD\n`);

  // 2. Testando Trava de Emergência (Emergency Stop)
  console.log('2. Testando Trava de Emergência (Emergency Stop)...');
  guard.triggerEmergencyStop();
  const emergencyCycle = await engine.runAutonomousCycle();

  if (emergencyCycle.status !== 'STOPPED_BY_GUARD' || !emergencyCycle.logMessages.some((m) => m.includes('EMERGENCY_STOP_ACTIVE'))) {
    throw new Error('A trava de emergência falhou em suspender o ciclo autônomo!');
  }
  console.log('✅ Trava de Emergência interceptou e impediu o ciclo com sucesso!\n');

  // 3. Testando Liberação e Limite Diário de Orçamento (Budget Guard)
  console.log('3. Testando Limite Estrito de Orçamento Diário (Hard Stop)...');
  guard.releaseEmergencyStop();
  
  // Consumir o orçamento até estourar o limite de $10 USD
  guard.recordSpend(9.50);
  const budgetBlockedCycle = await engine.runAutonomousCycle();

  if (budgetBlockedCycle.status !== 'STOPPED_BY_GUARD' || !budgetBlockedCycle.logMessages.some((m) => m.includes('DAILY_BUDGET_EXCEEDED'))) {
    throw new Error('O guardião de orçamento falhou em bloquear gastos acima do teto!');
  }
  console.log('✅ Guardião de Orçamento bloqueou o ciclo por atingimento do teto diário com sucesso!\n');

  console.log('🎉 Todos os testes do Autopilot Engine (ETAPA 18) passaram com 100% de sucesso!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 18:', err);
  process.exit(1);
});

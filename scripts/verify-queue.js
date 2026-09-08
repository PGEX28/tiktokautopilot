import {
  queueService,
  workerService,
  RetryPolicy,
  idempotencyManager,
} from '@autopilot/queue';
import { ValidationError, AppError } from '@autopilot/shared';

console.log('🧪 Iniciando Verificação Automatizada do Sistema de Filas (ETAPA 4)...');

async function runQueueVerification() {
  try {
    // 1. Testar todas as 11 filas
    const queueNames = [
      'product-discovery',
      'product-analysis',
      'affiliate',
      'image-generation',
      'script-generation',
      'video-generation',
      'video-variation',
      'live-loop',
      'analytics',
      'optimization',
      'webhooks',
    ];

    console.log('1. Despachando jobs em todas as 11 filas...');
    for (const qName of queueNames) {
      const job = await queueService.dispatchJob(qName, { testPayload: `data_${qName}`, timestamp: Date.now() });
      if (!job || !job.id || job.status !== 'QUEUED') {
        throw new Error(`Falha ao enfileirar job na fila ${qName}`);
      }
      console.log(`✅ Fila [${qName}] -> Job despachado com sucesso (ID: ${job.id})`);
    }

    // 2. Testar Idempotência e Bloqueio de Duplicatas
    console.log('\n2. Testando bloqueio por Idempotência...');
    const testKey = 'idempotency_test_unique_key_123';
    await queueService.dispatchJob('product-discovery', { test: 1 }, { idempotencyKey: testKey });
    console.log('✅ 1º job com chave única aceito.');

    let duplicateBlocked = false;
    try {
      await queueService.dispatchJob('product-discovery', { test: 2 }, { idempotencyKey: testKey });
    } catch (err) {
      if (err.message.includes('duplicado')) {
        duplicateBlocked = true;
        console.log(`✅ 2º job com mesma chave bloqueado com sucesso (${err.message})`);
      }
    }
    if (!duplicateBlocked) throw new Error('Falha no teste de idempotência: job duplicado não foi bloqueado!');

    // 3. Testar Cálculo de Backoff Exponencial
    console.log('\n3. Testando cálculo de Backoff Exponencial...');
    const delay1 = RetryPolicy.calculateBackoff(1);
    const delay2 = RetryPolicy.calculateBackoff(2);
    const delay3 = RetryPolicy.calculateBackoff(3);
    console.log(`Tentativa 1: ~${delay1}ms | Tentativa 2: ~${delay2}ms | Tentativa 3: ~${delay3}ms`);
    if (delay2 <= delay1 || delay3 <= delay2) {
      throw new Error('Falha na progressão do backoff exponencial!');
    }
    console.log('✅ Backoff exponencial com jitter validado.');

    // 4. Testar Diferenciação de Erro Transitório vs Permanente (Dead-Letter)
    console.log('\n4. Testando diferenciação de erros transitórios vs permanentes...');
    const permError = new ValidationError('Payload inválido');
    const permDecision = RetryPolicy.handleJobFailure('job_01', 'script-generation', 1, permError);
    if (permDecision.shouldRetry !== false || !permDecision.isDeadLetter) {
      throw new Error('Erro de validação não foi marcado como Dead-Letter imediato!');
    }
    console.log('✅ Erro permanente (ValidationError) enviado diretamente para Dead-Letter sem retry inútil.');

    const transientError = new AppError('Timeout na rede', 502, true);
    const transDecision = RetryPolicy.handleJobFailure('job_02', 'video-generation', 1, transientError);
    if (transDecision.shouldRetry !== true || transDecision.nextDelayMs <= 0) {
      throw new Error('Erro transitório não foi agendado para retentativa!');
    }
    console.log(`✅ Erro transitório agendado para retry com delay de ${transDecision.nextDelayMs}ms.`);

    // 5. Testar Registro de Handlers de Workers
    console.log('\n5. Testando registro de handlers nos Workers...');
    workerService.registerHandler('product-analysis', async (payload) => {
      return { scored: true, payload };
    });
    console.log('✅ Worker handler registrado com sucesso.');

    console.log('\n🎉 Todos os testes do Sistema de Filas (ETAPA 4) passaram com 100% de sucesso!');
    await queueService.closeAll();
    await workerService.closeAll();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erro durante a verificação do sistema de filas:', err);
    await queueService.closeAll();
    await workerService.closeAll();
    process.exit(1);
  }
}

runQueueVerification();

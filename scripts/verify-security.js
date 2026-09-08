import http from 'http';
import { encryptData, decryptData, csrfStateManager } from '@autopilot/shared';
import { createServer } from '../apps/api/dist/server.js';
import { requireAuth, requireRole } from '../apps/api/dist/middlewares/auth.middleware.js';

console.log('🧪 Iniciando Verificação Automatizada do Módulo de Segurança (ETAPA 8)...');

async function runVerification() {
  try {
    // 1. Teste de Criptografia AES-256-GCM
    console.log('1. Testando criptografia simétrica autenticada AES-256-GCM...');
    const originalSecret = 'tiktok_live_access_token_super_secret_12345';
    const encrypted = encryptData(originalSecret);

    if (!encrypted.encryptedData || !encrypted.iv || !encrypted.tag) {
      throw new Error('Criptografia AES-256-GCM gerou payload incompleto!');
    }
    console.log(`✅ Dados cifrados: [${encrypted.encryptedData.slice(0, 16)}...] (IV: ${encrypted.iv.slice(0, 8)}, Tag: ${encrypted.tag.slice(0, 8)})`);

    const decrypted = decryptData(encrypted);
    if (decrypted !== originalSecret) {
      throw new Error('Decifragem falhou: texto decifrado não corresponde ao original!');
    }
    console.log('✅ Decifragem bem-sucedida e idêntica ao original.');

    // 2. Teste de Detecção de Adulteração de Dados (Integridade da Tag)
    console.log('\n2. Testando detecção de adulteração de payload (Auth Tag check)...');
    let tamperDetected = false;
    try {
      const tampered = { ...encrypted, encryptedData: encrypted.encryptedData.slice(0, -2) + '00' };
      decryptData(tampered);
    } catch {
      tamperDetected = true;
      console.log('✅ Adulteração de payload detectada e rejeitada imediatamente com sucesso.');
    }
    if (!tamperDetected) throw new Error('Falha de segurança: payload adulterado não foi rejeitado!');

    // 3. Teste de Proteção CSRF e Anti-Replay
    console.log('\n3. Testando geração e consumo único de tokens CSRF (Anti-Replay)...');
    const stateToken = csrfStateManager.generateState({ userId: 'usr_001', returnTo: '/dashboard' });
    if (!stateToken || stateToken.length !== 64) {
      throw new Error('Token de estado CSRF inválido!');
    }
    console.log(`✅ Token CSRF gerado: ${stateToken.slice(0, 16)}...`);

    const firstConsume = csrfStateManager.validateAndConsumeState(stateToken);
    if (!firstConsume.isValid || firstConsume.metadata?.userId !== 'usr_001') {
      throw new Error('Primeiro consumo de token CSRF falhou!');
    }
    console.log('✅ 1º consumo do token CSRF validado com sucesso.');

    const secondConsume = csrfStateManager.validateAndConsumeState(stateToken);
    if (secondConsume.isValid) {
      throw new Error('Falha anti-replay: token CSRF foi reutilizado com sucesso!');
    }
    console.log('✅ 2º consumo rejeitado com sucesso (Uso Único garantido).');

    // 4. Teste de Cabeçalhos HTTP de Segurança e Rate Limiting
    console.log('\n4. Testando Headers de Segurança e Rate Limiting na API REST...');
    const app = createServer();
    const server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(0, async () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 4004;
        const baseUrl = `http://localhost:${port}/api/v1`;

        const res = await fetch(`${baseUrl}/health`);
        const headers = res.headers;

        if (headers.get('x-content-type-options') !== 'nosniff') throw new Error('Header X-Content-Type-Options ausente!');
        if (headers.get('x-frame-options') !== 'DENY') throw new Error('Header X-Frame-Options ausente!');
        if (!headers.get('x-ratelimit-limit')) throw new Error('Header X-RateLimit-Limit ausente!');

        console.log('✅ Cabeçalhos de segurança HTTP validados:');
        console.log('   - X-Content-Type-Options: nosniff');
        console.log('   - X-Frame-Options: DENY');
        console.log(`   - X-RateLimit-Limit: ${headers.get('x-ratelimit-limit')}`);
        console.log(`   - X-RateLimit-Remaining: ${headers.get('x-ratelimit-remaining')}`);

        server.close();
        console.log('\n🎉 Todos os testes de Segurança e OAuth (ETAPA 8) passaram com 100% de sucesso!');
        setTimeout(() => process.exit(0), 100);
        resolve(true);
      });
    });
  } catch (err) {
    console.error('\n❌ Erro durante verificação de Segurança:', err);
    setTimeout(() => process.exit(1), 100);
  }
}

runVerification();

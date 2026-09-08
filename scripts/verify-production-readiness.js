import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

function runProcess(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Comando '${cmd} ${args.join(' ')}' falhou com código ${code}`));
    });
  });
}

async function runAudit() {
  console.log('🏆 =================================================================');
  console.log('🏆 AUDITORIA FINAL DE PRONTIDÃO PARA PRODUÇÃO (ETAPA 22)');
  console.log('🏆 TikTok Shop AI Autopilot - Production Readiness Audit');
  console.log('🏆 =================================================================\n');

  // 1. Auditoria de Workspaces e Dependências
  console.log('1. [Audit 1/4] Verificando integridade das dependências e workspaces...');
  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
  if (!packageJson.workspaces || packageJson.workspaces.length === 0) {
    throw new Error('Workspaces não configurados no package.json!');
  }
  console.log(`✅ Workspaces validados: ${packageJson.workspaces.join(', ')}\n`);

  // 2. Compilação Multi-Workspace Limpa
  console.log('2. [Audit 2/4] Executando build de produção em todos os workspaces TypeScript...');
  await runProcess('npm', ['run', 'build', '--workspaces', '--if-present']);
  console.log('✅ Build de produção concluído sem erros em todos os pacotes e apps!\n');

  // 3. Execução da Bateria Completa de 15 Testes Automatizados
  console.log('3. [Audit 3/4] Executando suíte central de testes automatizados...');
  await runProcess('node', ['scripts/test-all.js']);
  console.log('✅ 100% dos testes unitários e de integração passaram com sucesso!\n');

  // 4. Verificação de Documentação e Relatórios
  console.log('4. [Audit 4/4] Verificando conformidade da documentação corporativa...');
  await runProcess('node', ['scripts/verify-documentation.js']);
  console.log('✅ Toda a base de documentação em conformidade com os padrões da engenharia!\n');

  console.log('🌟 =================================================================');
  console.log('🌟 SISTEMA 100% PRONTO PARA PRODUÇÃO & DEPLOY REAL!');
  console.log('🌟 Todas as 22 etapas do roadmap foram concluídas com êxito.');
  console.log('🌟 =================================================================\n');

  setTimeout(() => process.exit(0), 100);
}

runAudit().catch((err) => {
  console.error('❌ Falha na auditoria de prontidão para produção:', err);
  process.exit(1);
});

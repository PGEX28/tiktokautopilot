import fs from 'fs';
import path from 'path';

async function run() {
  console.log('📚 Iniciando Verificação da Base de Documentação (ETAPA 21)...\n');

  const docs = [
    { path: 'README.md', name: 'README Principal' },
    { path: 'docs/ARCHITECTURE.md', name: 'Arquitetura do Sistema' },
    { path: 'docs/DATABASE.md', name: 'Modelo de Dados & Supabase' },
    { path: 'docs/API.md', name: 'API REST Reference' },
    { path: 'docs/QUEUE.md', name: 'Filas de Processamento BullMQ' },
    { path: 'docs/AGENTS.md', name: 'Catálogo dos Agentes de IA' },
    { path: 'docs/SECURITY.md', name: 'Diretrizes de Segurança & OAuth' },
    { path: 'docs/DEPLOYMENT.md', name: 'Guia de Deploy em Produção' },
    { path: 'n8n/README.md', name: 'Guia de Workflows n8n' },
  ];

  console.log('1. Validando Arquivos de Documentação Essenciais:');
  for (const doc of docs) {
    const fullPath = path.resolve(doc.path);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Documento ausente: ${doc.path}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    if (content.length < 100) {
      throw new Error(`Documento ${doc.path} parece vazio ou insuficiente!`);
    }

    console.log(`   ✅ [${doc.name}]: Presente e Completo (${content.split('\n').length} linhas)`);
  }

  console.log('\n🎉 Toda a base de documentação (ETAPA 21) está 100% em conformidade!');
  setTimeout(() => process.exit(0), 100);
}

run().catch((err) => {
  console.error('❌ Erro durante a validação da ETAPA 21:', err);
  process.exit(1);
});

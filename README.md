# TikTok Shop AI Autopilot 🚀

> **Sistema Autônomo de Mineração de Produtos, Geração de Vídeos Verticais 9:16 (A/B/C) e Transmissão Live Loop 24/7 para TikTok Shop.**

---

## 🏗️ Arquitetura do Monorepo

O projeto está estruturado em **Monorepo com npm workspaces** e arquitetura em camadas desacopladas:

```
├── apps/
│   ├── api/             # Backend Fastify + BullMQ + FFmpeg + OpenAPI REST
│   └── web/             # Frontend Dashboard React + TypeScript + TailwindCSS
├── packages/
│   ├── shared/          # Types, Logger, Segurança AES-256-GCM, CSRF e Autopilot Engine
│   ├── database/        # Migrations Supabase (25 tabelas SQL), RLS e Seeds
│   ├── queue/           # Filas BullMQ resilientes com fallback In-Memory
│   ├── tiktok/          # Adaptador oficial TikTok Shop + Mock TikTok Provider
│   ├── ai/              # Agentes: Hunter, Score, Imagem 9:16, Roteiro, Analytics, Otimização
│   └── video/           # Clipes 9:16, Locução Neural TTS, Variações A/B/C e FFmpeg Engine
├── n8n/                 # 4 Workflows de automação em JSON prontos para importação
├── docs/                # Documentação técnica completa
└── scripts/             # Bateria de 15 testes automatizados de ponta a ponta
```

---

## ⚡ Quickstart

### 1. Pré-requisitos
- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose (opcional para ambiente conteinerizado)

### 2. Instalação & Build
```bash
# Instalar dependências de todos os workspaces
npm install

# Compilar todos os pacotes TypeScript
npm run build --workspaces --if-present
```

### 3. Execução dos Testes Automatizados
```bash
# Executar a bateria completa de 15 suítes de testes
node scripts/test-all.js
```

### 4. Executando Localmente com Docker
```bash
docker compose up -d
```
- API Backend: `http://localhost:3000`
- Web Dashboard: `http://localhost`

---

## 🤖 Catálogo dos 8 Agentes de IA

1. **Product Hunter Agent**: Minera produtos em alta no TikTok Shop por volume de busca e crescimento.
2. **Product Score Agent**: Avalia 8 critérios multi-ponderados calculando AI Score (0-100) e Tiers (`EXCELENTE`, `FORTE`, `TESTAR`, `FRACO`).
3. **Image Generation Agent**: Renderiza kits de imagem 9:16 vertical (1080x1920) com iluminação difusa de estúdio.
4. **Script Generation Agent**: Escreve roteiros persuasivos em 5 fases psicológicas (~30s) em português do Brasil com foco na Sacola Amarela.
5. **Video Generation Agent**: Sintetiza clipes visuais 9:16 e locução neural TTS sincronizada.
6. **3 Variations Engine**: Produz paralelamente 3 criativos de vídeo distintos (Variação A: Dor/Solução, Variação B: Demonstração Viral, Variação C: Oferta/Escassez).
7. **Analytics Agent**: Computa métricas de e-commerce (`CTR`, `CVR`, `EPC`, `RPM`, `ROAS` e Lucro Líquido).
8. **Optimization Agent**: Retroalimenta a IA com aprendizado contínuo para refinar prompts futuros.

---

## 🛡️ Segurança & Trava de Emergência

- **Criptografia Simétrica Autenticada**: `AES-256-GCM` com IV de 12 bytes e Auth Tag de 16 bytes.
- **CSRF Anti-Replay**: Consumo único de tokens em fluxos OAuth.
- **Trava de Emergência (Emergency Stop)**: Interrupção imediata de todo o pipeline através de botão no dashboard ou chamada de API.
- **Guardião de Orçamento (BudgetGuard)**: Travas estritas de teto diário e mensal.

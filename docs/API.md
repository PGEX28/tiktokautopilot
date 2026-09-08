# Especificação da API REST — TikTok Shop AI Autopilot

## 1. Visão Geral

A API do **TikTok Shop AI Autopilot** segue o padrão RESTful, retornando respostas estruturadas em JSON sob o prefixo `/api/v1`.

Todas as respostas de sucesso seguem a estrutura:
```json
{
  "success": true,
  "data": { ... }
}
```

Respostas de erro seguem:
```json
{
  "success": false,
  "error": {
    "name": "ValidationError | NotFoundError | BudgetExceededError | EmergencyStopError",
    "message": "Descrição amigável do erro",
    "details": { ... }
  }
}
```

---

## 2. Catálogo de Endpoints

### 🩺 Sistema & Saúde
* `GET /api/v1/health`
  * Retorna o status operacional, modo de execução (`DEMO` ou `PRODUCTION`), uptime e flags de emergência.

---

### 📦 Produtos (`/api/v1/products`)
* `GET /api/v1/products`
  * **Filtros**: `category`, `minPrice`, `maxPrice`, `status`, `limit`, `offset`.
  * **Resposta**: Lista de produtos candidatos e total encontrado.
* `GET /api/v1/products/:id`
  * **Resposta**: Dados completos do produto, preço, métricas e comissão.
* `POST /api/v1/products/:id/action`
  * **Payload**: `{ "action": "APPROVE" | "REJECT", "reason": "opcional" }`
  * **Resposta**: Produto atualizado.

---

### 🎯 Pontuação & Score (`/api/v1/scores`)
* `GET /api/v1/scores/:productId`
  * **Resposta**: Decomposição do score 0-100 nos 8 critérios ponderados (Demanda, Viral, Comissão, Preço, Avaliações, Concorrência, Demonstração, Compra por Impulso).
* `POST /api/v1/scores/:productId/recalculate`
  * **Payload**: `{ "customWeights": { "demand": 0.30, "viralPotential": 0.20, ... } }` (soma = 1.0).
  * **Resposta**: Novo score recalculado.

---

### ✍️ Geração de Conteúdo (`/api/v1/content`)
* `POST /api/v1/content/generate`
  * **Payload**: `{ "productId": "uuid", "targetVariationsCount": 3 }`
  * **Resposta**: Roteiros gerados nas 5 etapas (HOOK, PROBLEMA, DEMONSTRAÇÃO, BENEFÍCIOS, CTA) e custos computados.

---

### 🎬 Vídeos & Variações (`/api/v1/videos`)
* `GET /api/v1/videos/product/:productId`
  * **Resposta**: Lista das variações A, B, C geradas para o produto.

---

### 🔄 LIVE Loops (`/api/v1/live-loops`)
* `GET /api/v1/live-loops/product/:productId`
  * **Resposta**: Configuração do loop pronto para transmissão no TikTok Live Studio / OBS.
* `POST /api/v1/live-loops`
  * **Payload**: `{ "productId": "uuid", "title": "Loop Carro", "variationIdsOrder": ["A", "B", "C", "A", "B", "C"], "transitionType": "FADE" }`
  * **Resposta**: Loop criado.

---

### 📊 Métricas & Insights (`/api/v1/analytics`)
* `GET /api/v1/analytics/summary`
  * **Resposta**: Resumo do dashboard (total de vídeos, views, clicks, CTR, pedidos, CVR, GMV, comissões).
* `GET /api/v1/analytics/product/:productId`
  * **Resposta**: Métricas detalhadas (EPC, RPM, taxa de conclusão) daquele produto.
* `GET /api/v1/analytics/insights/product/:productId`
  * **Resposta**: Recomendações e conclusões da IA de Otimização.

---

### ⚙️ Filas & Jobs (`/api/v1/jobs`)
* `GET /api/v1/jobs`
  * **Resposta**: Lista de jobs BullMQ ativos, concluídos ou em retentativa.
* `POST /api/v1/jobs/:id/retry`
  * **Resposta**: Job reencaminhado para a fila.
* `POST /api/v1/jobs/:id/cancel`
  * **Resposta**: Job cancelado.

---

### 🛡️ Configurações & Orçamento (`/api/v1/settings`)
* `GET /api/v1/settings/budget`
  * **Resposta**: Limites diários/mensais de custo, vídeos/dia e status do Autopilot.
* `PUT /api/v1/settings/budget`
  * **Payload**: `{ "maxVideosPerDay": 3, "maxDailyAiCostUsd": 15.00, ... }`
* `POST /api/v1/settings/emergency-stop`
  * **Payload**: `{ "active": true | false }`
  * **Resposta**: Acionamento imediato da trava geral de segurança.

---

### 🔑 Autenticação TikTok Shop (`/api/v1/auth`)
* `GET /api/v1/auth/tiktok/url`
  * **Resposta**: URL oficial ou de demonstração para login com TikTok Shop.
* `POST /api/v1/auth/tiktok/callback`
  * **Payload**: `{ "code": "..." }`
  * **Resposta**: Conta conectada com sucesso.

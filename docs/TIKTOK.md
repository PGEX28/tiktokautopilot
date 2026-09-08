# TikTok Shop Adapter & Integração Oficial — TikTok Shop AI Autopilot

## 1. Visão Geral

O pacote `@autopilot/tiktok` é a camada de isolamento do sistema com as APIs do **TikTok Shop**.

Seguindo a regra fundamental do projeto: **NUNCA inventar endpoints ou simular falsamente operações não suportadas**.

Quando uma operação não for coberta pelo escopo concedido pela API oficial:
* O sistema lança `NotSupportedByProviderError`.
* Marca a funcionalidade como *"Aguardando permissão/API"*.
* O sistema continua operando perfeitamente em modo de simulação através do `MockTikTokProvider`.

---

## 2. Serviços Modulares

| Serviço | Responsabilidade | Endpoints Principais / Ações |
|---|---|---|
| `TikTokAuthService` | OAuth 2.0, troca de código e renovação de tokens | `/oauth/authorize`, `/oauth/token` |
| `TikTokProductService` | Catálogo de produtos do vendedor | `/product/get_list`, `/product/detail` |
| `TikTokAffiliateService` | Produtos do Open Affiliate Plan e links comissionados | `/affiliate/open_plan/products` |
| `TikTokContentService` | Publicação de vídeos (ou fallback gracioso) | `/video/upload` (quando autorizado) |
| `TikTokLiveService` | Indexação de produtos na vitrine de Live | `/live/showcase/bind` |
| `TikTokAnalyticsService` | Métricas consolidadas, pedidos e comissões | `/order/get_list`, `/finance/settlements` |
| `TikTokWebhookService` | Validação criptográfica de assinatura HMAC-SHA256 | Validação de header `x-signature` |

---

## 3. Escopos e Permissões do TikTok Shop

* `product.read`: Leitura de catálogo de produtos.
* `affiliate.read`: Consulta de planos de afiliação e comissões.
* `order.read`: Leitura de pedidos atribuídos e vendas.
* `analytics.read`: Coleta de métricas e conversões.

---

## 4. Modo de Simulação (DEMO MODE)

Quando `APP_ENV=DEMO` ou sem chaves oficiais cadastradas:
* Todas as chamadas são atendidas por `MockTikTokProvider`.
* Não há cobrança de APIs nem risco de penalidades de conta.
* O fluxo completo de afiliação, vídeo e Live Loop pode ser testado livremente.

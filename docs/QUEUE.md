# Arquitetura do Sistema de Filas (Redis + BullMQ) — TikTok Shop AI Autopilot

## 1. Visão Geral

O processamento do **TikTok Shop AI Autopilot** é orientado a eventos e tarefas assíncronas através de **BullMQ e Redis**, garantindo escalabilidade desde 3 vídeos/dia até centenas de vídeos/dia sem gargalos na API REST.

---

## 2. Catálogo das 11 Filas do Sistema

| Fila | Responsabilidade | Concorrência Padrão | Timeout Padrão |
|---|---|---|---|
| `product-discovery` | Busca periódica e prospecção de produtos com potencial | 1 | 120s |
| `product-analysis` | Cálculo de score nos 8 critérios ponderados | 5 | 30s |
| `affiliate` | Verificação de disponibilidade e link de afiliado TikTok Shop | 3 | 60s |
| `image-generation` | Renderização de imagem publicitária 9:16 vertical | 2 | 90s |
| `script-generation` | Geração dos roteiros de 5 etapas (HOOK -> CTA) | 3 | 45s |
| `video-generation` | Criação de cenas em vídeo com IA e geração de voz TTS | 2 | 300s |
| `video-variation` | Renderização final das Variações A, B e C | 2 | 180s |
| `live-loop` | Concatenação de loops contínuos com transição via FFmpeg | 1 | 300s |
| `analytics` | Ingestão e agregação de métricas de engajamento e vendas | 5 | 30s |
| `optimization` | Aprendizado contínuo e feedback loop para próximos ciclos | 1 | 60s |
| `webhooks` | Processamento assíncrono de eventos externos recebidos | 10 | 15s |

---

## 3. Política de Retentativas e Backoff Exponencial

* **Erros Transitórios (Network, Timeout, Rate Limit)**:
  * 1ª falha -> aguarda ~2s (+ jitter aleatório).
  * 2ª falha -> aguarda ~4s (+ jitter aleatório).
  * 3ª falha -> aguarda ~8s (+ jitter aleatório).
* **Erros Permanentes (Validação, Parada de Emergência, Limite de Orçamento, Autenticação Inválida)**:
  * Encaminhamento imediato para **Dead-Letter**, sem reprocessamento desnecessário de custos.
* **Dead-Letter Handling**: Jobs que esgotam o número máximo de tentativas (`maxAttempts = 3`) são marcados com status `FAILED`, persistidos com stack trace completo para auditoria e ficam disponíveis para retentativa manual via endpoint `POST /api/v1/jobs/:id/retry`.

---

## 4. Idempotência e Prevenção de Duplicatas

Cada job despachado possui uma chave de idempotência (`idempotencyKey`), por exemplo:
```text
discovery_daily_cycle_2026-09-08
content_prod_vacuum_01_var_A
```
Se um job com a mesma chave estiver em execução ou concluído dentro da janela TTL, o enfileiramento repetido é bloqueado imediatamente, evitando custos duplicados de APIs externas.

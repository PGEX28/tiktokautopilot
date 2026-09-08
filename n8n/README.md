# Automação de Workflows no n8n

Este diretório contém os 4 fluxos principais de automação do **TikTok Shop AI Autopilot**, estruturados em arquivos JSON prontos para importação no n8n:

---

## 📂 Workflows Disponíveis

1. **`01_product_mining_and_scoring.json`**:
   - Disparo a cada 4 horas.
   - Consulta de produtos minerados na API (`/api/v1/hunter/mine`).
   - Filtro de corte de pontuação de IA (`score >= 80`).
   - Enfileiramento automático na fila BullMQ (`video-generation`).

2. **`02_abc_video_generation_pipeline.json`**:
   - Disparo via Webhook após aprovação do produto.
   - Geração de 3 criativos de vídeo 9:16 (`VARIATION_A`, `VARIATION_B`, `VARIATION_C`) com locução neural e masterização FFmpeg.
   - Publicação na API do TikTok Shop com hashtags e sacola amarela.

3. **`03_tiktok_live_loop_streamer.json`**:
   - Monitoramento de hora em hora do status do stream RTMP 24/7.
   - Reinício automático ininterrupto caso a live seja encerrada por oscilação de rede.

4. **`04_analytics_and_telegram_alerts.json`**:
   - Fechamento diário às 23:00.
   - Ingestão de métricas de conversão e faturamento (`GMV`, comissões e CTR).
   - Execução do `OptimizationAgent` para aprendizado contínuo.
   - Alerta detalhado no Telegram / Discord com a variação vencedora.

---

## 🚀 Como Importar no n8n

1. Acesse o painel do seu n8n.
2. Clique em **Workflows > Import from File**.
3. Selecione um dos arquivos `.json` desta pasta.
4. Configure as variáveis de ambiente no nó ou no `.env`:
   - `API_BASE_URL`: URL base da API (ex: `http://localhost:3000`).
   - `TELEGRAM_CHAT_ID`: ID do canal de alertas no Telegram.

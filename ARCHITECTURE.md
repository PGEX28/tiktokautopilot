# System Architecture — TikTok Shop AI Autopilot

## 1. Architectural Philosophy

The system adheres strictly to **Clean Architecture** principles organized in layers:

```text
[ Presentation Layer (Web Dashboard & External Webhooks) ]
                         │
                         ▼
   [ Application Layer (Controllers, Orchestrators, Routes) ]
                         │
                         ▼
     [ Domain & Agent Layer (Hunter, Score, Content, Video) ]
                         │
                         ▼
 [ Infrastructure Layer (PostgreSQL/Supabase, Redis/BullMQ, FFmpeg, Providers) ]
```

---

## 2. Core Agent Pipelines

```text
                    ┌─────────────────────────┐
                    │    TIKTOK SHOP API      │
                    │   (or Mock Provider)    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Product Hunter Agent  │  <-- Finds candidate products
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Product Score Agent  │  <-- Evaluates 8 weighted metrics (0-100)
                     └───────────┬───────────┘
                                 │ (Threshold >= 75)
                                 ▼
                     ┌───────────────────────┐
                     │   Image Gen Agent     │  <-- Renders 9:16 high-impact visuals
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Script Gen Agent    │  <-- Generates 5-stage ~30s scripts
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Video Gen Agent     │  <-- Produces video clips + TTS audio
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   Variation Agent     │  <-- Synthesizes Var A, Var B, Var C
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │    Live Loop Agent    │  <-- Concatenates seamless stream loop
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │    Analytics Agent    │  <-- Ingests performance metrics
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │  Optimization Agent   │  <-- Feedback loop & strategy tuner
                     └───────────────────────┘
```

---

## 3. Job Queue System (Redis + BullMQ)

All asynchronous and resource-intensive actions are dispatched to dedicated BullMQ queues:
* `product-discovery`
* `product-analysis`
* `affiliate`
* `image-generation`
* `script-generation`
* `video-generation`
* `video-variation`
* `live-loop`
* `analytics`
* `optimization`
* `webhooks`

Every job features:
* Exponential backoff retry policies.
* Idempotency keys (`productId + timestamp`).
* Budget checks prior to executing paid external model APIs.
* Full audit logging to PostgreSQL/Supabase.

---

## 4. Multi-Provider Strategy & Fallback

External providers (LLM, Image, Video, TikTok) are abstracted behind strict TypeScript interfaces:
* `TikTokShopProvider` -> `MockTikTokProvider` / `OfficialTikTokShopProvider`
* `ImageGenProvider` -> `MockImageProvider` / `FluxProvider` / `DalleProvider`
* `VideoGenProvider` -> `MockVideoProvider` / `RunwayProvider` / `KlingProvider`
* `TTSProvider` -> `MockTTSProvider` / `ElevenLabsProvider`

If credentials are absent or `APP_ENV=DEMO`, the system automatically runs with zero external cost while exercising 100% of internal logic.

---

## 5. Security & Isolation

* **No Frontend Secrets**: API keys and OAuth tokens reside solely on the backend.
* **Token Encryption**: Stored TikTok OAuth tokens are encrypted at rest using AES-256-GCM.
* **Emergency Stop**: Global switch in database and Redis that immediately suspends autopilot workers and queue processing.

# Database Architecture & Data Dictionary — TikTok Shop AI Autopilot

## 1. Overview

The database is built on **PostgreSQL / Supabase**, structured for high throughput, full auditability, automated timestamp updates, strict relational integrity with foreign keys, and Row Level Security (RLS) isolation.

---

## 2. Table Inventory (25 Tables)

| # | Table Name | Purpose | Primary Key | Key Foreign Keys |
|---|---|---|---|---|
| 1 | `users` | User management & RBAC | UUID | - |
| 2 | `tiktok_accounts` | Encrypted OAuth tokens & TikTok credentials | UUID | `user_id -> users(id)` |
| 3 | `products` | Product catalog, pricing, status, and hook potential | UUID | - |
| 4 | `product_sources` | Provenance tracking (TikTok Affiliate, Trend feed, Mock) | UUID | `product_id -> products(id)` |
| 5 | `product_scores` | 0-100 score results with 8 weighted breakdown criteria | UUID | `product_id -> products(id)` |
| 6 | `affiliate_campaigns` | TikTok Shop target affiliate promotions | UUID | - |
| 7 | `affiliate_products` | Commission rates, approval status, tracking links | UUID | `product_id -> products(id)`, `campaign_id` |
| 8 | `content_projects` | Multi-variation production units per product | UUID | `product_id -> products(id)` |
| 9 | `scripts` | 5-stage psychology scripts (Hook, Problem, Demo, Benefits, CTA) | UUID | `product_id -> products(id)`, `project_id` |
| 10 | `images` | Generated 9:16 advertising product renders | UUID | `product_id -> products(id)` |
| 11 | `videos` | Raw and intermediate video render assets | UUID | `product_id -> products(id)` |
| 12 | `video_variations` | Variations A / B / C with distinct angle strategies | UUID | `product_id -> products(id)`, `script_id` |
| 13 | `live_loops` | FFmpeg synthesized continuous stream loops | UUID | `product_id -> products(id)` |
| 14 | `live_sessions` | TikTok Live broadcast tracking and metrics | UUID | `live_loop_id`, `tiktok_account_id` |
| 15 | `metrics` | CTR, CVR, EPC, RPM, Watch Time, GMV, Orders | UUID | `product_id`, `video_variation_id` |
| 16 | `orders` | Sales attributed to video variations and TikTok accounts | UUID | `product_id`, `video_variation_id`, `tiktok_account_id` |
| 17 | `commissions` | Affiliate payout tracking and ledger | UUID | `order_id -> orders(id)` |
| 18 | `ai_decisions` | Autonomous decision audit logs with rationale & evidence | UUID | `product_id -> products(id)` |
| 19 | `jobs` | BullMQ asynchronous job status and cost tracking | UUID | - |
| 20 | `job_attempts` | Execution attempt logs, errors, and backoff history | UUID | `job_id -> jobs(id)` |
| 21 | `system_logs` | Structured audit logs with masked secrets | UUID | `job_id -> jobs(id)` |
| 22 | `webhooks` | Incoming webhook events from TikTok/n8n/external | UUID | - |
| 23 | `settings` | System-wide config, budget controls, and scoring weights | UUID | - |

---

## 3. Entity Relationship Flow

```text
  [users] ──< [tiktok_accounts] ──< [live_sessions] >── [live_loops]
                    │                                         │
                    ▼                                         ▼
  [products] ──┬──< [product_sources]                  [video_variations] (A / B / C)
               ├──< [product_scores] (8 weighted criteria)    │
               ├──< [affiliate_products]                      ▼
               ├──< [content_projects] ──< [scripts] ──> [videos]
               ├──< [images]
               ├──< [metrics] (CTR, CVR, EPC, RPM)
               ├──< [orders] ──< [commissions]
               └──< [ai_decisions] (Optimization recommendations)
```

---

## 4. Migrations & Seeding

* **Initial Migration**: `infrastructure/supabase/migrations/001_initial_schema.sql`
* **RLS Policies**: `infrastructure/supabase/migrations/002_rls_policies.sql`
* **Development Seeds**: `infrastructure/supabase/seed.sql`

-- ============================================================================
-- TIKTOK SHOP AI AUTOPILOT - CORE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- ============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'USER', -- ADMIN | USER | OPERATOR
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. TIKTOK_ACCOUNTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tiktok_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_name VARCHAR(255),
  open_id VARCHAR(255) NOT NULL UNIQUE,
  shop_id VARCHAR(100),
  shop_cipher TEXT,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  token_iv VARCHAR(64) NOT NULL,
  token_tag VARCHAR(64) NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  refresh_token_expires_at TIMESTAMPTZ,
  scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(50) NOT NULL DEFAULT 'CONNECTED', -- CONNECTED | EXPIRED | DISCONNECTED | REVOKED
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_tiktok_accounts_updated_at BEFORE UPDATE ON tiktok_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_tiktok_accounts_user ON tiktok_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_accounts_open_id ON tiktok_accounts(open_id);

-- ----------------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  original_price NUMERIC(12, 2),
  discount_percentage NUMERIC(5, 2) DEFAULT 0,
  main_image_url TEXT NOT NULL,
  additional_images JSONB DEFAULT '[]'::jsonb,
  product_url TEXT,
  problem_solved TEXT,
  target_audience TEXT,
  visual_hook_potential VARCHAR(50) DEFAULT 'MEDIUM', -- LOW | MEDIUM | HIGH | VIRAL
  has_affiliate_available BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'DISCOVERED', -- DISCOVERED | SCORED | APPROVED | REJECTED | IN_PRODUCTION | ARCHIVED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_external_id ON products(external_id);

-- ----------------------------------------------------------------------------
-- 4. PRODUCT_SOURCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL, -- TIKTOK_SHOP_AFFILIATE | TREND_FEED | MANUAL_IMPORT | MOCK_PROVIDER
  source_url TEXT,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  discovered_by_job_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_product_sources_updated_at BEFORE UPDATE ON product_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_product_sources_product ON product_sources(product_id);

-- ----------------------------------------------------------------------------
-- 5. PRODUCT_SCORES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  total_score NUMERIC(5, 2) NOT NULL, -- 0.00 to 100.00
  tier VARCHAR(50) NOT NULL, -- EXCELENTE | FORTE | TESTAR | FRACO | DESCARTAR
  weights JSONB NOT NULL,
  breakdown JSONB NOT NULL,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  risks JSONB DEFAULT '[]'::jsonb,
  explanation TEXT NOT NULL,
  recommended_action VARCHAR(50) NOT NULL, -- PROCEED_AUTOPILOT | MANUAL_REVIEW | DISCARD
  disclaimer TEXT NOT NULL,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_product_scores_updated_at BEFORE UPDATE ON product_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_product_scores_product ON product_scores(product_id);
CREATE INDEX IF NOT EXISTS idx_product_scores_total_score ON product_scores(total_score DESC);

-- ----------------------------------------------------------------------------
-- 6. AFFILIATE_CAMPAIGNS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_campaign_id VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  commission_rate NUMERIC(5, 4) NOT NULL, -- e.g. 0.2000 for 20%
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | UPCOMING | EXPIRED | CANCELLED
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  target_categories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_affiliate_campaigns_updated_at BEFORE UPDATE ON affiliate_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_affiliate_campaigns_status ON affiliate_campaigns(status);

-- ----------------------------------------------------------------------------
-- 7. AFFILIATE_PRODUCTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES affiliate_campaigns(id) ON DELETE SET NULL,
  commission_rate NUMERIC(5, 4) NOT NULL,
  estimated_commission_amount NUMERIC(10, 2) NOT NULL,
  commission_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE', -- PERCENTAGE | FIXED
  affiliate_link TEXT,
  approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED', -- PENDING | APPROVED | REJECTED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_affiliate_products_updated_at BEFORE UPDATE ON affiliate_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_affiliate_products_product ON affiliate_products(product_id);

-- ----------------------------------------------------------------------------
-- 8. CONTENT_PROJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PLANNING', -- PLANNING | IN_PROGRESS | COMPLETED | FAILED
  target_variations_count INT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_content_projects_updated_at BEFORE UPDATE ON content_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_content_projects_product ON content_projects(product_id);

-- ----------------------------------------------------------------------------
-- 9. SCRIPTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES content_projects(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variation_name VARCHAR(10) NOT NULL, -- A | B | C
  style VARCHAR(50) NOT NULL, -- curiosity | problem_solution | before_after | review | offer | demonstration
  hook_text TEXT NOT NULL,
  sections JSONB NOT NULL, -- Array of 5 stages (HOOK, PROBLEM, DEMONSTRATION, BENEFITS, CTA)
  total_duration_seconds INT NOT NULL DEFAULT 30,
  caption TEXT NOT NULL,
  hashtags JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  cost_usd NUMERIC(8, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_scripts_product ON scripts(product_id);

-- ----------------------------------------------------------------------------
-- 10. IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variation_name VARCHAR(10),
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '9:16',
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  cost_usd NUMERIC(8, 4) NOT NULL DEFAULT 0,
  width INT NOT NULL DEFAULT 1080,
  height INT NOT NULL DEFAULT 1920,
  status VARCHAR(50) NOT NULL DEFAULT 'READY',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_images_product ON images(product_id);

-- ----------------------------------------------------------------------------
-- 11. VIDEOS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  format VARCHAR(20) NOT NULL DEFAULT 'mp4',
  resolution VARCHAR(20) NOT NULL DEFAULT '1080x1920',
  duration_seconds INT NOT NULL DEFAULT 30,
  video_url TEXT NOT NULL,
  storage_path TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'READY',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_videos_product ON videos(product_id);

-- ----------------------------------------------------------------------------
-- 12. VIDEO_VARIATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS video_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES content_projects(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  variation_name VARCHAR(10) NOT NULL, -- A | B | C
  angle_strategy VARCHAR(100) NOT NULL, -- PROBLEM_SOLUTION | DEMONSTRATION | OFFER_CURIOSITY
  resolution VARCHAR(20) NOT NULL DEFAULT '1080x1920',
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '9:16',
  duration_seconds INT NOT NULL DEFAULT 30,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  audio_voiceover_url TEXT,
  background_music_url TEXT,
  subtitles_url TEXT,
  provider VARCHAR(50) NOT NULL,
  cost_usd NUMERIC(8, 4) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED', -- PENDING | RENDERING | COMPLETED | FAILED
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_video_variations_updated_at BEFORE UPDATE ON video_variations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_video_variations_product ON video_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_video_variations_project ON video_variations(project_id);

-- ----------------------------------------------------------------------------
-- 13. LIVE_LOOPS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  variation_ids_order JSONB NOT NULL, -- e.g. ["A", "B", "C", "A", "B", "C"]
  transition_type VARCHAR(50) NOT NULL DEFAULT 'FADE',
  transition_duration_seconds NUMERIC(4, 2) NOT NULL DEFAULT 0.5,
  product_card_overlay BOOLEAN NOT NULL DEFAULT TRUE,
  cta_text_overlay TEXT,
  final_video_url TEXT,
  duration_seconds INT,
  status VARCHAR(50) NOT NULL DEFAULT 'READY', -- READY | GENERATING | FAILED
  instructions_for_live_host TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_live_loops_updated_at BEFORE UPDATE ON live_loops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_live_loops_product ON live_loops(product_id);

-- ----------------------------------------------------------------------------
-- 14. LIVE_SESSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_loop_id UUID REFERENCES live_loops(id) ON DELETE SET NULL,
  tiktok_account_id UUID REFERENCES tiktok_accounts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED | RUNNING | COMPLETED | CANCELLED
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  peak_viewers INT DEFAULT 0,
  total_views INT DEFAULT 0,
  gmv_generated NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON live_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);

-- ----------------------------------------------------------------------------
-- 15. METRICS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  video_variation_id UUID REFERENCES video_variations(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  views INT NOT NULL DEFAULT 0,
  impressions INT NOT NULL DEFAULT 0,
  watch_time_seconds INT NOT NULL DEFAULT 0,
  average_watch_duration NUMERIC(8, 2) NOT NULL DEFAULT 0,
  completion_rate NUMERIC(5, 4) NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  ctr NUMERIC(5, 4) NOT NULL DEFAULT 0,
  product_views INT NOT NULL DEFAULT 0,
  add_to_cart INT NOT NULL DEFAULT 0,
  orders INT NOT NULL DEFAULT 0,
  cvr NUMERIC(5, 4) NOT NULL DEFAULT 0,
  gmv NUMERIC(12, 2) NOT NULL DEFAULT 0,
  commission NUMERIC(12, 2) NOT NULL DEFAULT 0,
  epc NUMERIC(10, 4) NOT NULL DEFAULT 0,
  rpm NUMERIC(10, 4) NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_metrics_product ON metrics(product_id);
CREATE INDEX IF NOT EXISTS idx_metrics_variation ON metrics(video_variation_id);

-- ----------------------------------------------------------------------------
-- 16. ORDERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_order_id VARCHAR(255) NOT NULL UNIQUE,
  tiktok_account_id UUID REFERENCES tiktok_accounts(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  video_variation_id UUID REFERENCES video_variations(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_amount NUMERIC(12, 2) NOT NULL,
  commission_earned NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  order_status VARCHAR(50) NOT NULL, -- PENDING | COMPLETED | CANCELLED | REFUNDED
  ordered_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_external_id ON orders(external_order_id);

-- ----------------------------------------------------------------------------
-- 17. COMMISSIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tiktok_account_id UUID REFERENCES tiktok_accounts(id) ON DELETE SET NULL,
  gross_amount NUMERIC(12, 2) NOT NULL,
  rate NUMERIC(5, 4) NOT NULL,
  net_amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  payout_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING | SETTLED | PAID | CANCELLED
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_commissions_order ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_payout_status ON commissions(payout_status);

-- ----------------------------------------------------------------------------
-- 18. AI_DECISIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(100) NOT NULL, -- ProductHunter | ProductScorer | OptimizationAgent
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  decision_type VARCHAR(100) NOT NULL,
  confidence_level VARCHAR(50) NOT NULL DEFAULT 'PRELIMINARY_EVIDENCE', -- PRELIMINARY_EVIDENCE | MODERATE_CONFIDENCE | HIGH_CONFIDENCE
  rationale TEXT NOT NULL,
  inputs_payload JSONB NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_ai_decisions_updated_at BEFORE UPDATE ON ai_decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_ai_decisions_agent ON ai_decisions(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_product ON ai_decisions(product_id);

-- ----------------------------------------------------------------------------
-- 19. JOBS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED | RUNNING | COMPLETED | FAILED | RETRYING | CANCELLED
  priority INT NOT NULL DEFAULT 5,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  payload JSONB NOT NULL,
  estimated_cost_usd NUMERIC(8, 4) DEFAULT 0,
  actual_cost_usd NUMERIC(8, 4) DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_jobs_queue_status ON jobs(queue_name, status);
CREATE INDEX IF NOT EXISTS idx_jobs_idempotency_key ON jobs(idempotency_key);

-- ----------------------------------------------------------------------------
-- 20. JOB_ATTEMPTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  duration_ms INT,
  error_message TEXT,
  error_stack TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_job_attempts_job ON job_attempts(job_id);

-- ----------------------------------------------------------------------------
-- 21. SYSTEM_LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level VARCHAR(20) NOT NULL, -- DEBUG | INFO | WARN | ERROR | FATAL
  service VARCHAR(100) NOT NULL,
  agent VARCHAR(100),
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 22. WEBHOOKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL, -- TIKTOK | STRIPE | N8N | EXTERNAL
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON webhooks(processed);

-- ----------------------------------------------------------------------------
-- 23. SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

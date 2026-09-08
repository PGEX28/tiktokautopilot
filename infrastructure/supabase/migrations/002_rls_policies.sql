-- ============================================================================
-- TIKTOK SHOP AI AUTOPILOT - ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 002_rls_policies.sql
-- ============================================================================

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Service Role Policy (Full access for backend services & workers)
-- ----------------------------------------------------------------------------
CREATE POLICY "Service role full access on users" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on tiktok_accounts" ON tiktok_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on product_scores" ON product_scores FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on affiliate_campaigns" ON affiliate_campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on affiliate_products" ON affiliate_products FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on content_projects" ON content_projects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on scripts" ON scripts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on images" ON images FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on videos" ON videos FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on video_variations" ON video_variations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on live_loops" ON live_loops FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on live_sessions" ON live_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on metrics" ON metrics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on orders" ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on commissions" ON commissions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on ai_decisions" ON ai_decisions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on jobs" ON jobs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on system_logs" ON system_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on settings" ON settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Authenticated Users Policies (Dashboard Read/Write access)
-- ----------------------------------------------------------------------------
CREATE POLICY "Authenticated users can read products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read product_scores" ON product_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read content_projects" ON content_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read scripts" ON scripts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read images" ON images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read videos" ON videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read video_variations" ON video_variations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read live_loops" ON live_loops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read metrics" ON metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read commissions" ON commissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read ai_decisions" ON ai_decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read jobs" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read system_logs" ON system_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read settings" ON settings FOR SELECT TO authenticated USING (true);

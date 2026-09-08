-- ============================================================================
-- TIKTOK SHOP AI AUTOPILOT - DEVELOPMENT SEED DATA
-- File: seed.sql
-- ============================================================================

-- 1. Insert Default Settings
INSERT INTO settings (id, key, value, description)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'BUDGET_CONFIG', '{
    "maxVideosPerDay": 3,
    "maxVariationsPerProduct": 3,
    "maxDailyAiCostUsd": 15.00,
    "maxMonthlyAiCostUsd": 300.00,
    "currentDailySpendUsd": 0.45,
    "currentMonthlySpendUsd": 12.80,
    "minProductScoreAutopilot": 75,
    "autopilotEnabled": true,
    "emergencyStop": false,
    "allowedCategories": ["Home & Kitchen", "Electronics & Gadgets", "Beauty & Personal Care"],
    "blockedCategories": ["Weapons", "Adult", "Pharmaceuticals"]
  }'::jsonb, 'Global budget and autopilot safety controls'),
  ('a0000000-0000-0000-0000-000000000002', 'SCORING_WEIGHTS', '{
    "demand": 0.25,
    "viralPotential": 0.20,
    "commission": 0.15,
    "price": 0.10,
    "reviews": 0.10,
    "competition": 0.10,
    "demonstrability": 0.05,
    "impulseBuy": 0.05
  }'::jsonb, 'Weights for Product Score 0-100 algorithm')
ON CONFLICT (key) DO NOTHING;

-- 2. Insert Default User
INSERT INTO users (id, email, name, role, is_active)
VALUES 
  ('b0000000-0000-0000-0000-000000000001', 'admin@tiktokautopilot.io', 'Admin Operator', 'ADMIN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Connected Demo TikTok Account
INSERT INTO tiktok_accounts (
  id, user_id, seller_name, open_id, shop_id, shop_cipher,
  encrypted_access_token, token_iv, token_tag, token_expires_at, scopes, status
)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Autopilot Demo Store',
  'demo_open_id_12345',
  'SHOP_US_9921',
  'demo_cipher_key',
  'enc_mock_token_abcdef1234567890',
  'iv_123456789012',
  'tag_123456789012',
  NOW() + INTERVAL '30 days',
  '["product.read", "affiliate.read", "analytics.read", "video.publish"]'::jsonb,
  'CONNECTED'
)
ON CONFLICT (open_id) DO NOTHING;

-- 4. Insert Seed Product 1: Mini Handheld Vacuum
INSERT INTO products (
  id, external_id, title, description, category, subcategory,
  price, currency, original_price, discount_percentage,
  main_image_url, problem_solved, target_audience,
  visual_hook_potential, has_affiliate_available, status
)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'tt_prod_vacuum_01',
  'Mini Cordless Portable Car & Desk Vacuum 9000Pa',
  'Powerful rechargeable handheld vacuum for car crevices, keyboards, and quick dust removal.',
  'Home & Kitchen',
  'Cleaning Tools',
  24.90,
  'USD',
  49.90,
  50.10,
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
  'Cleans dust and debris from impossible crevices without heavy cords.',
  'Car owners, desk workers, gamers, pet owners',
  'VIRAL',
  TRUE,
  'APPROVED'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Product Source
INSERT INTO product_sources (id, product_id, source_type, source_url)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'TIKTOK_SHOP_AFFILIATE',
  'https://shop.tiktok.com/view/product/tt_prod_vacuum_01'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Product Score for Vacuum
INSERT INTO product_scores (
  id, product_id, total_score, tier, weights, breakdown,
  pros, cons, risks, explanation, recommended_action, disclaimer
)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  88.50,
  'FORTE',
  '{
    "demand": 0.25,
    "viralPotential": 0.20,
    "commission": 0.15,
    "price": 0.10,
    "reviews": 0.10,
    "competition": 0.10,
    "demonstrability": 0.05,
    "impulseBuy": 0.05
  }'::jsonb,
  '{
    "demand": { "criterion": "demand", "name": "Demanda de Mercado", "weight": 0.25, "rawScore": 92, "weightedScore": 23.00, "justification": "Alta procura comprovada em vídeos virais de limpeza automotiva." },
    "viralPotential": { "criterion": "viralPotential", "name": "Potencial Viral", "weight": 0.20, "rawScore": 95, "weightedScore": 19.00, "justification": "Efeito antes/depois instantâneo muito satisfatório visualmente." },
    "commission": { "criterion": "commission", "name": "Comissão de Afiliado", "weight": 0.15, "rawScore": 85, "weightedScore": 12.75, "justification": "Comissão de 20% garantindo margem de $4.98 por unidade vendida." },
    "price": { "criterion": "price", "name": "Preço de Venda", "weight": 0.10, "rawScore": 90, "weightedScore": 9.00, "justification": "Preço abaixo de $25 favorece decisão rápida." },
    "reviews": { "criterion": "reviews", "name": "Avaliações e Prova Social", "weight": 0.10, "rawScore": 82, "weightedScore": 8.20, "justification": "Média de 4.7 estrelas com mais de 3.200 avaliações." },
    "competition": { "criterion": "competition", "name": "Nível de Concorrência", "weight": 0.10, "rawScore": 70, "weightedScore": 7.00, "justification": "Concorrência moderada, superável com novos ganchos criativos." },
    "demonstrability": { "criterion": "demonstrability", "name": "Facilidade de Demonstração", "weight": 0.05, "rawScore": 96, "weightedScore": 4.80, "justification": "Demonstração nos primeiros 3 segundos é imediata e magnética." },
    "impulseBuy": { "criterion": "impulseBuy", "name": "Compra por Impulso", "weight": 0.05, "rawScore": 95, "weightedScore": 4.75, "justification": "Produto de baixo custo que resolve incômodo visível." }
  }'::jsonb,
  '["Visual instantâneo de antes e depois", "Comissão líquida de 20%", "Preço de compra por impulso"]'::jsonb,
  '["Concorrência moderada na categoria de limpeza"]'::jsonb,
  '["Variações de qualidade entre fornecedores de baterias"]'::jsonb,
  'O Mini Aspirador obteve pontuação 88.5/100 devido ao apelo visual imediato de limpeza, comissão de 20% e preço acessível de $24.90.',
  'PROCEED_AUTOPILOT',
  'O score é uma estimativa estatística de potencial criativo e comercial e não constitui garantia de vendas.'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Content Project
INSERT INTO content_projects (
  id, product_id, title, status, target_variations_count
)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'Mini Vacuum 3-Variation Campaign',
  'COMPLETED',
  3
)
ON CONFLICT (id) DO NOTHING;

-- 8. Scripts for Variations A, B, C
INSERT INTO scripts (
  id, project_id, product_id, variation_name, style, hook_text,
  sections, total_duration_seconds, caption, hashtags, cta_text,
  provider, model, cost_usd
)
VALUES 
(
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'A',
  'problem_solution',
  'Pare de passar vergonha com o interior do seu carro sujo de poeira!',
  '[
    {"stage": "HOOK", "timeRange": "0-3s", "spokenAudioText": "Pare de passar vergonha com o interior do seu carro sujo de poeira!", "onScreenText": "Carro sujo NUNCA MAIS 🚗❌", "visualSceneDescription": "Close-up em migalhas no porta-copos do carro", "cameraAngleOrTransition": "Zoom rápido", "durationSeconds": 3},
    {"stage": "PROBLEM", "timeRange": "3-8s", "spokenAudioText": "Aspiradores normais são pesados e não entram nesses cantinhos chatos.", "onScreenText": "Aspirador grande NÃO cabe!", "visualSceneDescription": "Pessoa lutando com aspirador gigante com fio", "cameraAngleOrTransition": "Corte dinâmico", "durationSeconds": 5},
    {"stage": "DEMONSTRATION", "timeRange": "8-18s", "spokenAudioText": "Esse mini aspirador sem fio tem 9000Pa de sucção e limpa tudo em 2 segundos.", "onScreenText": "Poder de sucção 9000Pa 🔥", "visualSceneDescription": "Mini aspirador sugando todas as sujeiras instantaneamente", "cameraAngleOrTransition": "Macro close-up", "durationSeconds": 10},
    {"stage": "BENEFITS", "timeRange": "18-25s", "spokenAudioText": "Cabe no porta-luvas, é recarregável USB e a bateria dura semanas.", "onScreenText": "Portátil + Bateria USB ⚡", "visualSceneDescription": "Guardando no porta-luvas com facilidade", "cameraAngleOrTransition": "Pan suave", "durationSeconds": 7},
    {"stage": "CTA", "timeRange": "25-30s", "spokenAudioText": "Clica no link da sacolinha aqui embaixo com 50% de desconto!", "onScreenText": "50% OFF NA SACOLINHA 👇", "visualSceneDescription": "Seta apontando para o botão da TikTok Shop", "cameraAngleOrTransition": "Pulsing overlay", "durationSeconds": 5}
  ]'::jsonb,
  30,
  'Adeus sujeira no carro com esse achadinho da TikTok Shop! 🚗✨ #tiktokshop #achadinhos #carro #limpeza',
  '["tiktokshop", "achadinhos", "carro", "limpeza", "shoptok"]'::jsonb,
  'Clique na sacolinha abaixo para garantir com 50% de desconto',
  'mock-ai',
  'gpt-4o-mini',
  0.0040
),
(
  '20000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'B',
  'demonstration',
  'Testei o mini aspirador mais viral do TikTok para ver se realmente suga moeda!',
  '[
    {"stage": "HOOK", "timeRange": "0-3s", "spokenAudioText": "Testei o mini aspirador mais viral do TikTok para ver se funciona!", "onScreenText": "TESTANDO O MAIS VIRAL 😱", "visualSceneDescription": "Moedas e parafusos na mesa", "cameraAngleOrTransition": "Aproximação rápida", "durationSeconds": 3},
    {"stage": "PROBLEM", "timeRange": "3-8s", "spokenAudioText": "Todo mundo fala que é forte, mas será que aguenta sujeira pesada?", "onScreenText": "Será que aguenta?", "visualSceneDescription": "Testador cético olhando para o produto", "cameraAngleOrTransition": "Corte de reação", "durationSeconds": 5},
    {"stage": "DEMONSTRATION", "timeRange": "8-18s", "spokenAudioText": "Olha isso! Puxou tudo do teclado e do painel sem deixar nada pra trás.", "onScreenText": "SUGOU TUDO! 🌪️", "visualSceneDescription": "Limpeza satisfatória entre teclas de teclado gamer", "cameraAngleOrTransition": "Slow motion 60fps", "durationSeconds": 10},
    {"stage": "BENEFITS", "timeRange": "18-25s", "spokenAudioText": "Vem com 3 bicos diferentes e filtro lavável que nunca precisa trocar.", "onScreenText": "Filtro Lavável + 3 Bicos 🧼", "visualSceneDescription": "Mostrando acessórios inclusos", "cameraAngleOrTransition": "Flat lay organizado", "durationSeconds": 7},
    {"stage": "CTA", "timeRange": "25-30s", "spokenAudioText": "Aproveita o frete grátis na sacola antes que esgote o lote!", "onScreenText": "FRETE GRÁTIS HOJE 🛒", "visualSceneDescription": "Tela final com sacolinha amarela piscando", "cameraAngleOrTransition": "Overlay animado", "durationSeconds": 5}
  ]'::jsonb,
  30,
  'O teste definitivo do mini aspirador viral! 🌪️ #tiktokfinds #satisfying #tech #gadgets',
  '["tiktokfinds", "satisfying", "tech", "gadgets"]'::jsonb,
  'Frete grátis disponível por tempo limitado na sacolinha',
  'mock-ai',
  'gpt-4o-mini',
  0.0040
),
(
  '20000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'C',
  'offer',
  'Como eu comprei esse aspirador de $50 por apenas $24 hoje no TikTok Shop!',
  '[
    {"stage": "HOOK", "timeRange": "0-3s", "spokenAudioText": "Como eu peguei esse aspirador de $50 por metade do preço hoje!", "onScreenText": "PAGUEI METADE DO PREÇO 🏷️", "visualSceneDescription": "Etiqueta de preço riscada com corte", "cameraAngleOrTransition": "Corte de impacto", "durationSeconds": 3},
    {"stage": "PROBLEM", "timeRange": "3-8s", "spokenAudioText": "Eu sempre quis um aspirador sem fio, mas nas lojas tradicionais é um absurdo.", "onScreenText": "Lojas cobram muito caro 💸", "visualSceneDescription": "Tela comparando preços altos de shopping", "cameraAngleOrTransition": "Split screen", "durationSeconds": 5},
    {"stage": "DEMONSTRATION", "timeRange": "8-18s", "spokenAudioText": "Esse aqui entrega a mesma potência de 9000Pa direto da fábrica.", "onScreenText": "Preço de Fábrica direto no TikTok", "visualSceneDescription": "Uso prático no sofá e no carro", "cameraAngleOrTransition": "Montagem rápida", "durationSeconds": 10},
    {"stage": "BENEFITS", "timeRange": "18-25s", "spokenAudioText": "Bateria turbo, garantia total e chega em 3 dias na sua casa.", "onScreenText": "Entrega Rápida + Garantia 📦", "visualSceneDescription": "Caixa lacrada sendo aberta", "cameraAngleOrTransition": "Unboxing fluido", "durationSeconds": 7},
    {"stage": "CTA", "timeRange": "25-30s", "spokenAudioText": "Garante o seu cupom agora clicando no botão da sacolinha!", "onScreenText": "PEGUE SEU CUPOM AQUI 🎟️", "visualSceneDescription": "Dedo clicando na sacola de compras", "cameraAngleOrTransition": "Callout visual", "durationSeconds": 5}
  ]'::jsonb,
  30,
  'Cupom secreto de 50% liberado hoje! 🎟️ Corre antes que acabe o estoque. #cupom #oferta #tiktokshop',
  '["cupom", "oferta", "tiktokshop", "desconto"]'::jsonb,
  'Clique e resgate seu cupom de 50% de desconto',
  'mock-ai',
  'gpt-4o-mini',
  0.0040
)
ON CONFLICT (id) DO NOTHING;

-- 9. Video Variations A, B, C
INSERT INTO video_variations (
  id, project_id, product_id, script_id, variation_name, angle_strategy,
  resolution, aspect_ratio, duration_seconds, video_url, thumbnail_url,
  provider, cost_usd, status
)
VALUES 
(
  '30000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'A',
  'PROBLEM_SOLUTION',
  '1080x1920',
  '9:16',
  30,
  'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
  'mock-video-engine',
  0.0500,
  'COMPLETED'
),
(
  '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  'B',
  'DEMONSTRATION',
  '1080x1920',
  '9:16',
  30,
  'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
  'mock-video-engine',
  0.0500,
  'COMPLETED'
),
(
  '30000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  'C',
  'OFFER_CURIOSITY',
  '1080x1920',
  '9:16',
  30,
  'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
  'mock-video-engine',
  0.0500,
  'COMPLETED'
)
ON CONFLICT (id) DO NOTHING;

-- 10. Live Loop
INSERT INTO live_loops (
  id, product_id, title, variation_ids_order, transition_type,
  transition_duration_seconds, product_card_overlay, cta_text_overlay,
  final_video_url, duration_seconds, status, instructions_for_live_host
)
VALUES (
  '40000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'Continuous Live Loop A->B->C (Vacuum)',
  '["A", "B", "C", "A", "B", "C"]'::jsonb,
  'FADE',
  0.5,
  TRUE,
  'OFERTA RELÂMPAGO NA SACOLINHA',
  'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-woman-opening-a-package-41617-large.mp4',
  180,
  'READY',
  'Transmita este arquivo em loop vertical (1080x1920) via OBS Studio ou TikTok Live Studio vinculando o produto na vitrine.'
)
ON CONFLICT (id) DO NOTHING;

-- 11. Initial Performance Metrics for Variations
INSERT INTO metrics (
  id, video_variation_id, product_id, views, impressions, watch_time_seconds,
  average_watch_duration, completion_rate, clicks, ctr, product_views,
  add_to_cart, orders, cvr, gmv, commission, epc, rpm,
  period_start, period_end
)
VALUES 
(
  '50000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  2400, 3100, 48000, 20.0, 0.4200, 78, 0.0251, 65, 14, 6, 0.0769, 149.40, 29.88, 0.3830, 12.45,
  NOW() - INTERVAL '7 days', NOW()
),
(
  '50000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000001',
  5800, 7200, 145000, 25.0, 0.5800, 312, 0.0433, 280, 68, 24, 0.0769, 597.60, 119.52, 0.3830, 20.60,
  NOW() - INTERVAL '7 days', NOW()
),
(
  '50000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  8200, 9900, 221400, 27.0, 0.6400, 610, 0.0616, 540, 142, 51, 0.0836, 1269.90, 253.98, 0.4163, 30.97,
  NOW() - INTERVAL '7 days', NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 12. AI Optimization Decision Log
INSERT INTO ai_decisions (
  id, agent_name, product_id, decision_type, confidence_level,
  rationale, inputs_payload, recommendations
)
VALUES (
  '60000000-0000-0000-0000-000000000001',
  'OptimizationAgent',
  'd0000000-0000-0000-0000-000000000001',
  'VARIATION_PERFORMANCE_ANALYSIS',
  'PRELIMINARY_EVIDENCE',
  'Variação C (Oferta/Cupom com gancho de preço cortado) apresentou CTR de 6.16% e RPM de $30.97, superando a Variação A (CTR 2.51%) em mais de 145%.',
  '{
    "variationsTested": ["A", "B", "C"],
    "totalImpressions": 20200,
    "totalCommission": 403.38
  }'::jsonb,
  '[
    "Priorizar ganchos com destaque de preço cortado e cupons de tempo limitado.",
    "Aumentar o volume de produção do formato de Variação C para 70% dos novos ciclos.",
    "Testar novo gancho de curiosidade com elementos da Variação B (demonstração satisfatória de teclado)."
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

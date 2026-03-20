-- ── Phase 14: Onboard Agent Đặng Minh Đức (dmd01) ────────────────────────────
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- Profile: Môi giới CK 6 năm, mạnh trading ngắn hạn, phong cách gần gũi coaching
-- Kênh: TikTok + Facebook + YouTube | Target: Emerging investor, Office worker 25-35

-- ────────────────────────────────────────────────────────────
-- STEP 1: Insert agent vào sales_agents
-- ────────────────────────────────────────────────────────────
INSERT INTO sales_agents (
  code,
  full_name,
  brand_name,
  brand_tagline,
  brand_color_primary,
  brand_color_accent,
  title,
  contact_phone,
  active
)
VALUES (
  'dmd01',
  'Đặng Minh Đức',
  'Minh Đức Trading',
  'Đơn giản hoá đầu tư — Bắt đầu từ hôm nay',
  '#0a1a0d',            -- dark green OLED
  '#4ade80',            -- green accent (phân biệt với gold của agents khác)
  'Stock Advisor & Trading Coach',
  '0398992555',
  true
)
ON CONFLICT (code) DO UPDATE SET
  full_name        = EXCLUDED.full_name,
  brand_name       = EXCLUDED.brand_name,
  brand_tagline    = EXCLUDED.brand_tagline,
  brand_color_primary = EXCLUDED.brand_color_primary,
  brand_color_accent  = EXCLUDED.brand_color_accent,
  title            = EXCLUDED.title,
  contact_phone    = EXCLUDED.contact_phone,
  active           = true;


-- ────────────────────────────────────────────────────────────
-- STEP 2: Seed 2 draft campaigns
-- Chỉ dùng columns trong schema (phase5 + phase9):
--   agent_id, slug, topic, content_type, campaign_name,
--   utm_source, status, published
-- (content_slug KHÔNG tồn tại trong agent_landing_pages)
-- ────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_agent_id UUID;
BEGIN
  SELECT id INTO v_agent_id FROM sales_agents WHERE code = 'dmd01';

  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Agent dmd01 không tồn tại — chạy STEP 1 trước';
  END IF;

  -- Campaign 1: Bắt đầu đầu tư
  INSERT INTO agent_landing_pages (
    agent_id, slug, topic,
    content_type, campaign_name,
    utm_source, status, published
  )
  VALUES (
    v_agent_id,
    'bat-dau-dau-tu',
    'Bắt đầu đầu tư từ đâu — Hướng dẫn đơn giản',
    'knowledgebase',
    'ĐMĐ — Emerging Investor Campaign (TikTok)',
    'tiktok',
    'draft',
    false
  )
  ON CONFLICT (agent_id, slug) DO NOTHING;

  -- Campaign 2: Trading ngắn hạn
  INSERT INTO agent_landing_pages (
    agent_id, slug, topic,
    content_type, campaign_name,
    utm_source, status, published
  )
  VALUES (
    v_agent_id,
    'trading-ngan-han',
    'Trading ngắn hạn an toàn — Chiến lược thực chiến',
    'macro_insight',
    'ĐMĐ — Trading Ngắn Hạn Campaign (Facebook)',
    'facebook',
    'draft',
    false
  )
  ON CONFLICT (agent_id, slug) DO NOTHING;

END $$;

-- ────────────────────────────────────────────────────────────
-- STEP 3: Verify
-- ────────────────────────────────────────────────────────────
SELECT
  sa.code,
  sa.full_name,
  sa.brand_name,
  sa.brand_tagline,
  sa.contact_phone,
  sa.active,
  COUNT(alp.id) AS campaigns_seeded
FROM sales_agents sa
LEFT JOIN agent_landing_pages alp ON alp.agent_id = sa.id
WHERE sa.code = 'dmd01'
GROUP BY sa.id, sa.code, sa.full_name, sa.brand_name, sa.brand_tagline, sa.contact_phone, sa.active;

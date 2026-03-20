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
  contact_email,
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
  'minhduccle2@gmail.com',
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
  contact_email    = EXCLUDED.contact_email,
  active           = true;

-- ────────────────────────────────────────────────────────────
-- STEP 2: Seed 2 draft campaigns (dùng subquery để lấy agent_id)
-- Note: slug + content_slug sẽ được cập nhật sau khi bàn với ĐMĐ
-- ────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_agent_id UUID;
BEGIN
  SELECT id INTO v_agent_id FROM sales_agents WHERE code = 'dmd01';

  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Agent dmd01 không tồn tại — chạy STEP 1 trước';
  END IF;

  -- Campaign 1: Bắt đầu đầu tư (pain: sợ rủi ro, không biết bắt đầu)
  INSERT INTO agent_landing_pages (
    agent_id, slug, topic, content_type, content_slug,
    campaign_name, target_audience_hint, utm_source, status, published
  )
  VALUES (
    v_agent_id,
    'bat-dau-dau-tu',
    'Bắt đầu đầu tư từ đâu — Hướng dẫn đơn giản',
    'knowledgebase',
    'bat-dau-dau-tu-tu-dau',
    'ĐMĐ — Emerging Investor Campaign (TikTok)',
    'Người 25-35 sợ rủi ro, không biết bắt đầu đầu tư, không có nhiều thời gian',
    'tiktok',
    'draft',
    false
  )
  ON CONFLICT (agent_id, slug) DO NOTHING;

  -- Campaign 2: Trading ngắn hạn (thế mạnh của ĐMĐ)
  INSERT INTO agent_landing_pages (
    agent_id, slug, topic, content_type, content_slug,
    campaign_name, target_audience_hint, utm_source, status, published
  )
  VALUES (
    v_agent_id,
    'trading-ngan-han',
    'Trading ngắn hạn an toàn — Chiến lược thực chiến',
    'macro_insight',
    'phan-tich-ky-thuat-co-ban',
    'ĐMĐ — Trading Ngắn Hạn Campaign (Facebook)',
    'Nhân viên văn phòng có tiền tiết kiệm, muốn tăng trưởng, quan tâm tới technical',
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

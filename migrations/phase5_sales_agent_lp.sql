-- =====================================================
-- MIGRATION: Sales Agent Landing Page System
-- Phase 1 Foundation
-- =====================================================

-- 1. Bảng agents
CREATE TABLE IF NOT EXISTS sales_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,          -- 'mq01', 'nt02'
  full_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,           -- 'MQ Capital Insights'
  brand_tagline TEXT,
  brand_color_primary TEXT DEFAULT '#1E3A5F',
  brand_color_accent TEXT DEFAULT '#3B82F6',
  avatar_url TEXT,
  title TEXT,                         -- 'Senior Financial Advisor'
  contact_phone TEXT,
  contact_zalo TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng landing pages
CREATE TABLE IF NOT EXISTS agent_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES sales_agents(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,                 -- 'ty-gia', 'fdi-ban-dan'
  macro_insight_id TEXT,              -- ref to hardcoded story id
  topic TEXT NOT NULL,               -- 'Tỷ Giá USD/VND'
  custom_hook TEXT,                  -- Agent's custom headline
  custom_cta TEXT DEFAULT 'Đăng ký tư vấn miễn phí',
  published BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, slug)
);

-- 3. Bảng leads
CREATE TABLE IF NOT EXISTS agent_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES sales_agents(id),
  landing_page_id UUID REFERENCES agent_landing_pages(id),
  auth_user_id UUID REFERENCES auth.users(id),  -- set sau khi đăng ký
  email TEXT,
  full_name TEXT,
  phone TEXT,
  ref_code TEXT NOT NULL,            -- agent code
  utm_source TEXT,                   -- zalo, facebook, etc.
  registered_at TIMESTAMPTZ DEFAULT now(),
  converted_at TIMESTAMPTZ,          -- lúc đăng ký tài khoản xong
  status TEXT DEFAULT 'new'          -- new, contacted, converted
);

-- 4. RLS
ALTER TABLE sales_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_leads ENABLE ROW LEVEL SECURITY;

-- Public read for LP rendering (no auth needed)
CREATE POLICY "public read agents" ON sales_agents FOR SELECT USING (active = true);
CREATE POLICY "public read lp" ON agent_landing_pages FOR SELECT USING (published = true);

-- Service role full access (for API routes)
CREATE POLICY "service full agents" ON sales_agents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service full lp" ON agent_landing_pages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service full leads" ON agent_leads FOR ALL USING (auth.role() = 'service_role');

-- Public insert leads (when customer submits form)
CREATE POLICY "public insert leads" ON agent_leads FOR INSERT WITH CHECK (true);

-- 5. Seed data: Minh Quang Agent
INSERT INTO sales_agents (code, full_name, brand_name, brand_tagline, brand_color_primary, brand_color_accent, title, contact_phone)
VALUES (
  'mq01',
  'Minh Quang',
  'MQ Capital Insights',
  'Đọc Vĩ Mô — Chọn Cổ Phiếu Đúng',
  '#1E3A5F',
  '#3B82F6',
  'Senior Financial Advisor',
  '0901234567'
);

-- 6. Track view function
CREATE OR REPLACE FUNCTION increment_lp_views(page_id UUID)
RETURNS void AS $$
  UPDATE agent_landing_pages SET views = views + 1 WHERE id = page_id;
$$ LANGUAGE sql SECURITY DEFINER;

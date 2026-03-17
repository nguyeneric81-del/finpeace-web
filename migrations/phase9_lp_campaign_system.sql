-- Phase 9: LP Campaign System — AI-Powered Generation & Approval Flow
-- Run via Supabase SQL Editor: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql

-- 1. Extend agent_landing_pages
ALTER TABLE agent_landing_pages
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
    CHECK (status IN ('generating','draft','pending_review','active','paused')),
  ADD COLUMN IF NOT EXISTS campaign_name TEXT,
  ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'macro_insight'
    CHECK (content_type IN ('macro_insight','knowledgebase')),
  ADD COLUMN IF NOT EXISTS generated_hook TEXT,
  ADD COLUMN IF NOT EXISTS generated_body JSONB,
  ADD COLUMN IF NOT EXISTS generated_cta TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS preview_token TEXT,
  ADD COLUMN IF NOT EXISTS budget_allocated INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_spent INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by TEXT;

-- 2. Add persona to sales_agents
ALTER TABLE sales_agents
  ADD COLUMN IF NOT EXISTS persona JSONB;

-- 3. Create lp_views table (for tracking page views with UTM)
CREATE TABLE IF NOT EXISTS lp_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lp_id UUID REFERENCES agent_landing_pages(id) ON DELETE CASCADE,
  agent_code TEXT NOT NULL,
  topic_slug TEXT NOT NULL,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create campaign stats view
CREATE OR REPLACE VIEW lp_campaign_stats AS
SELECT
  alp.id,
  alp.slug,
  alp.campaign_name,
  alp.content_type,
  alp.status,
  alp.budget_allocated,
  alp.budget_spent,
  alp.utm_source,
  alp.utm_campaign,
  alp.approved_at,
  sa.code AS agent_code,
  sa.full_name AS agent_name,
  sa.brand_color_accent,
  COUNT(DISTINCT lv.id) FILTER (WHERE lv.created_at > NOW() - INTERVAL '7 days') AS views_7d,
  COUNT(DISTINCT al.id) FILTER (WHERE al.registered_at > NOW() - INTERVAL '7 days') AS leads_7d,
  COUNT(DISTINCT al.id) AS leads_total,
  CASE
    WHEN alp.budget_spent > 0 AND COUNT(DISTINCT al.id) > 0
    THEN alp.budget_spent / COUNT(DISTINCT al.id)
    ELSE 0
  END AS cpa
FROM agent_landing_pages alp
JOIN sales_agents sa ON sa.id = alp.agent_id
LEFT JOIN lp_views lv ON lv.lp_id = alp.id
LEFT JOIN agent_leads al ON al.landing_page_id = alp.id
GROUP BY alp.id, sa.code, sa.full_name, sa.brand_color_accent;

-- Phase 10: KB Articles Table
-- Run via Supabase SQL Editor: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql

CREATE TABLE IF NOT EXISTS kb_articles (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT    NOT NULL,          -- 'fomo-va-bau-dan'
  pillar      TEXT    NOT NULL,          -- 'tam-ly-thi-truong'
  title       TEXT    NOT NULL,
  summary     TEXT,                      -- intro block (first 500 chars)
  content     JSONB,                     -- ContentBlock[] serialized as JSON
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(pillar, slug)
);

ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

-- Public can read (for landing pages, knowledgebase rendering)
CREATE POLICY "public read kb" ON kb_articles
  FOR SELECT USING (true);

-- Only service role can write (seed script / admin)
CREATE POLICY "service full kb" ON kb_articles
  FOR ALL USING (auth.role() = 'service_role');

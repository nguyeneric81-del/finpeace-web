-- Phase 13: Clarity Content Tracking & KB Account Requests
-- Run on Supabase SQL Editor

-- 1. Content Views (simple page open tracking)
CREATE TABLE IF NOT EXISTS content_views (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type text NOT NULL CHECK (content_type IN ('knowledgebase', 'macro_insight')),
  slug         text NOT NULL,
  pillar       text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_views_slug ON content_views(slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_views_type ON content_views(content_type, created_at DESC);

-- 2. Content Reactions (Like / Love)
CREATE TABLE IF NOT EXISTS content_reactions (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type text NOT NULL CHECK (content_type IN ('knowledgebase', 'macro_insight')),
  slug         text NOT NULL,
  pillar       text,
  reaction     text NOT NULL CHECK (reaction IN ('like', 'love')),
  user_email   text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_reactions_slug ON content_reactions(slug);
CREATE INDEX IF NOT EXISTS idx_content_reactions_type ON content_reactions(content_type, created_at DESC);

-- 3. KB Account Requests
CREATE TABLE IF NOT EXISTS kb_account_requests (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email   text NOT NULL,
  user_name    text,
  user_phone   text,
  content_type text NOT NULL CHECK (content_type IN ('knowledgebase', 'macro_insight')),
  content_slug text NOT NULL,
  content_title text,
  status       text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  requested_at timestamptz DEFAULT now(),
  expires_at   timestamptz DEFAULT (now() + INTERVAL '3 days'),
  completed_at timestamptz,
  agent_note   text
);

CREATE INDEX IF NOT EXISTS idx_kb_requests_status ON kb_account_requests(status, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_kb_requests_email ON kb_account_requests(user_email);

-- Enable RLS (public insert, admin read)
ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_account_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anonymous tracking)
CREATE POLICY "public_insert_views" ON content_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_insert_reactions" ON content_reactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_insert_kb_requests" ON kb_account_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow service_role full access (for API routes using admin client)
CREATE POLICY "service_role_all_views" ON content_views FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_reactions" ON content_reactions FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all_kb_requests" ON kb_account_requests FOR ALL TO service_role USING (true);

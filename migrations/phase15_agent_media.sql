-- ── Phase 15: Agent Media Columns ────────────────────────────────────────────
-- Thêm media + social columns vào sales_agents
-- Upload avatar: chạy scripts/upload_agent_media.js từ Mac Mini
-- Video: dùng YouTube embed (agent cung cấp video ID)
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql

ALTER TABLE sales_agents
  ADD COLUMN IF NOT EXISTS youtube_video_id  TEXT,        -- VD: 'dQw4w9WgXcQ'
  ADD COLUMN IF NOT EXISTS bio               TEXT,        -- Mô tả ngắn 1-2 câu
  ADD COLUMN IF NOT EXISTS gallery_urls      TEXT[],      -- Ảnh bổ sung (tối đa 5)
  ADD COLUMN IF NOT EXISTS social_facebook   TEXT,        -- URL trang Facebook
  ADD COLUMN IF NOT EXISTS social_tiktok     TEXT,        -- URL profile TikTok
  ADD COLUMN IF NOT EXISTS social_youtube    TEXT;        -- URL channel YouTube

-- Verify
SELECT
  code,
  full_name,
  avatar_url,
  youtube_video_id,
  bio,
  social_facebook,
  social_tiktok,
  social_youtube,
  active
FROM sales_agents
ORDER BY created_at;

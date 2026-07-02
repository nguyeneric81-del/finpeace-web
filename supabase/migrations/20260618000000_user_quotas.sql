-- 1. Tạo bảng quản lý quota
CREATE TABLE IF NOT EXISTS public.user_quotas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  discord_id TEXT UNIQUE,
  telegram_id TEXT UNIQUE,
  quota_limit INTEGER DEFAULT 30,
  quota_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kích hoạt Row Level Security (RLS) để bảo mật
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;

-- 3. Tạo policy cho hệ thống/bot truy cập
CREATE POLICY "Enable read/write access for all operations" 
ON public.user_quotas 
USING (true)
WITH CHECK (true);

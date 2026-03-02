-- ==============================================================================
-- MIGRATION: CLIENT ALIASES (Nickname hệ thống cho khách hàng)
-- Cho phép mỗi KH có nhiều alias để dễ tra cứu qua Telegram bot
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.client_aliases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    alias TEXT NOT NULL,           -- Nickname (VD: Yen01, YenHai, vinh_le...)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alias)                  -- Mỗi alias là duy nhất toàn hệ thống
);

-- Index để lookup nhanh
CREATE INDEX IF NOT EXISTS idx_client_aliases_user_id ON public.client_aliases(user_id);
CREATE INDEX IF NOT EXISTS idx_client_aliases_alias ON public.client_aliases(LOWER(alias));

-- RLS
ALTER TABLE public.client_aliases ENABLE ROW LEVEL SECURITY;

-- Service role (agent) được phép đọc/ghi tất cả (bypass RLS qua service key)
-- User chỉ xem alias của chính mình
CREATE POLICY "Users can view own aliases"
ON public.client_aliases FOR SELECT
USING (auth.uid() = user_id);

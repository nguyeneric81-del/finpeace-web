-- =====================================================
-- MIGRATION: Ensure client_assets table exists with correct schema + RLS
-- Run in Supabase SQL Editor
-- =====================================================

-- 1. Tạo client_assets nếu chưa có
CREATE TABLE IF NOT EXISTS public.client_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    asset_name TEXT NOT NULL,
    asset_group TEXT NOT NULL, -- Thanh Khoản | Bảo Vệ | Đầu Tư | Nợ | Tiêu Dùng
    amount NUMERIC(20, 2) DEFAULT 0,
    risk_level INTEGER DEFAULT 1,
    expected_return NUMERIC(5,2),
    is_liquid BOOLEAN DEFAULT false,
    monthly_payment BIGINT DEFAULT 0,
    interest_rate DECIMAL(5,2),
    remaining_months INTEGER,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Thêm các column còn thiếu (nếu table đã tồn tại)
ALTER TABLE public.client_assets
    ADD COLUMN IF NOT EXISTS is_liquid BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS monthly_payment BIGINT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS remaining_months INTEGER,
    ADD COLUMN IF NOT EXISTS risk_level INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS expected_return NUMERIC(5,2);

-- 3. Enable RLS
ALTER TABLE public.client_assets ENABLE ROW LEVEL SECURITY;

-- 4. Drop policy cũ nếu có (để tạo lại đúng)
DROP POLICY IF EXISTS "Users manage own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can view own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can insert own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can update own assets" ON public.client_assets;
DROP POLICY IF EXISTS "Users can delete own assets" ON public.client_assets;

-- 5. Tạo policy mới — cho phép user full control dữ liệu của mình
CREATE POLICY "Users manage own assets"
    ON public.client_assets FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Index
CREATE INDEX IF NOT EXISTS idx_client_assets_user_id ON public.client_assets(user_id);

-- 7. Verify RLS đang hoạt động
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'client_assets';

-- 8. Kiểm tra policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'client_assets';

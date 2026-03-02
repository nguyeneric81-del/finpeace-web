-- ==============================================================================
-- MIGRATION: CLIENT CASHFLOW (Dòng tiền hàng năm của khách hàng)
-- Mỗi user có 1 bản ghi duy nhất (upsert theo user_id)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.client_cashflow (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    annual_income   NUMERIC(20, 2) DEFAULT 0,   -- Thu nhập hàng năm (VNĐ)
    annual_expense  NUMERIC(20, 2) DEFAULT 0,   -- Chi phí hàng năm (VNĐ)
    annual_saving   NUMERIC(20, 2) DEFAULT 0,   -- Tiết kiệm mục tiêu/năm (VNĐ)
    note            TEXT,
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS: mỗi user chỉ thao tác được bản ghi của chính mình
ALTER TABLE public.client_cashflow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cashflow"
ON public.client_cashflow FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index để lookup nhanh theo user_id
CREATE INDEX IF NOT EXISTS idx_client_cashflow_user_id ON public.client_cashflow(user_id);

-- ============================================================
-- FinPeace Wealth Planning — Phase 1 Migration
-- CFP Foundation: Profiles + Cashflow + Assets + Insurance
-- Run on Supabase SQL Editor
-- ============================================================

-- 1. PROFILES — thêm thông tin cá nhân chuẩn CFP
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS dependents INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS employment_type TEXT, -- salaried | self-employed | business | retired
  ADD COLUMN IF NOT EXISTS risk_score INTEGER,   -- 0-100, từ Risk Quiz
  ADD COLUMN IF NOT EXISTS risk_profile TEXT;    -- conservative | moderate | aggressive

-- 2. CLIENT_CASHFLOW — phân tách chi tiêu theo CFP standards
ALTER TABLE client_cashflow
  ADD COLUMN IF NOT EXISTS fixed_expense BIGINT DEFAULT 0,         -- thuê nhà, EMI vay, bảo hiểm
  ADD COLUMN IF NOT EXISTS variable_expense BIGINT DEFAULT 0,      -- ăn uống, đi lại, tiện ích
  ADD COLUMN IF NOT EXISTS discretionary_expense BIGINT DEFAULT 0, -- giải trí, du lịch, shopping
  ADD COLUMN IF NOT EXISTS passive_income BIGINT DEFAULT 0,        -- cổ tức, cho thuê, lãi tiết kiệm
  ADD COLUMN IF NOT EXISTS monthly_debt_payment BIGINT DEFAULT 0;  -- tổng trả nợ/tháng → tính DSR

-- 3. CLIENT_ASSETS — thêm thông tin khoản nợ chi tiết
ALTER TABLE client_assets
  ADD COLUMN IF NOT EXISTS monthly_payment BIGINT DEFAULT 0,    -- trả góp hàng tháng
  ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2),          -- lãi suất %/năm
  ADD COLUMN IF NOT EXISTS remaining_months INTEGER;            -- số tháng còn lại

-- 4. CLIENT_INSURANCE — bảo hiểm & rủi ro (CFP Section 6: Risk Management)
CREATE TABLE IF NOT EXISTS client_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insurance_type TEXT NOT NULL, -- life_term | life_whole | health | accident | bhxh | other
  insurer TEXT,                 -- Prudential, Manulife, Bảo Hiểm Xã Hội...
  coverage_amount BIGINT,       -- mệnh giá bảo hiểm
  annual_premium BIGINT,        -- phí/năm
  years_paid INTEGER DEFAULT 0, -- số năm đã đóng (dành cho BHXH)
  policy_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS cho client_insurance
ALTER TABLE client_insurance ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users manage own insurance"
  ON client_insurance FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. INDEX cho performance
CREATE INDEX IF NOT EXISTS idx_client_insurance_user_id ON client_insurance(user_id);

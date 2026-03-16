-- Migration: Financial Planning Redesign
-- Thêm cột KYC vào advisor_users
ALTER TABLE advisor_users ADD COLUMN IF NOT EXISTS kyc_completed boolean DEFAULT false;
ALTER TABLE advisor_users ADD COLUMN IF NOT EXISTS kyc_completed_at timestamptz;

-- Bảng kế hoạch tài chính (1 per user)
CREATE TABLE IF NOT EXISTS financial_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES advisor_users(id) ON DELETE CASCADE UNIQUE,
  goal_name text,
  target_amount numeric,
  timeline_years int,
  initial_capital numeric,
  expected_return numeric,
  required_monthly_saving numeric,
  committed_asset_ids text[] DEFAULT '{}',
  scenario_type text DEFAULT 'balanced',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bảng snapshot lịch sử định kỳ
CREATE TABLE IF NOT EXISTS financial_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES advisor_users(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  period_label text,
  cashflow jsonb NOT NULL DEFAULT '{}',
  assets jsonb NOT NULL DEFAULT '[]',
  net_worth numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_financial_snapshots_user_date ON financial_snapshots(user_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_plans_user ON financial_plans(user_id);

-- RLS policies (nếu có RLS enabled)
-- ALTER TABLE financial_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;

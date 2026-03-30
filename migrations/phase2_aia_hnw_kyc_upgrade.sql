-- ============================================================
-- FinPeace Wealth Planning — Phase 2 Migration
-- AIA HNW KYC Upgrade: Psychology, Advanced Health, Legacy, Debt
-- ============================================================

-- 1. PROFILES — Thêm các tham số định tính, mục tiêu, nỗi sợ
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS health_status TEXT,    -- 'good' | 'stable' | 'chronic' | 'family_history'
  ADD COLUMN IF NOT EXISTS health_concern TEXT,   -- 'low' | 'moderate' | 'high'
  ADD COLUMN IF NOT EXISTS financial_priority TEXT, -- 'protection' | 'growth' | 'balanced' | 'legacy' | 'income'
  ADD COLUMN IF NOT EXISTS biggest_fear TEXT,     -- 'health' | 'income_loss' | 'market' | 'succession' | 'education' | 'tax' | 'liquidity'
  ADD COLUMN IF NOT EXISTS legacy_goal TEXT,      -- 'wealth' | 'education' | 'mixed'
  ADD COLUMN IF NOT EXISTS succession_plan TEXT;  -- 'trust' | 'will' | 'active' | 'none'

-- 2. CLIENT_ASSETS — Phân rã Nợ kinh doanh và Nguồn gốc tài sản
ALTER TABLE client_assets
  ADD COLUMN IF NOT EXISTS is_business_debt BOOLEAN DEFAULT false,  -- Phân tách rủi ro nợ cá nhân vs nợ thế chấp DN
  ADD COLUMN IF NOT EXISTS asset_location TEXT DEFAULT 'domestic';  -- 'domestic' | 'offshore'

-- 3. CLIENT_INSURANCE — Phân rã quyền lợi Sinh mạng, Bệnh lý, và Y tế
ALTER TABLE client_insurance
  ADD COLUMN IF NOT EXISTS is_ci_rider BOOLEAN DEFAULT false, -- Đánh dấu nếu đây là phụ phí Bệnh hiểm nghèo (Critical Illness) chứ không phải sinh mạng
  ADD COLUMN IF NOT EXISTS is_medical BOOLEAN DEFAULT false;  -- Đánh dấu nếu đây là Thẻ sức khỏe (Medical Rider)

-- Migration: Add analysis and status fields to trading_plans
-- Date: 2026-03-04

-- 1. Thêm các cột mới phục vụ phân tích chuyên sâu
ALTER TABLE trading_plans 
ADD COLUMN IF NOT EXISTS wave_index TEXT,
ADD COLUMN IF NOT EXISTS area_symmetry_note TEXT,
ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT FALSE;

-- 2. Thêm cột status để quản lý luồng Draft -> Active -> Archived
-- Lưu ý: Nếu database hỗ trợ ENUM thì tốt, không thì dùng TEXT
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_status') THEN
        CREATE TYPE plan_status AS ENUM ('draft', 'active', 'archived');
    END IF;
END $$;

ALTER TABLE trading_plans 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 3. Tạo index cho ticker để tối ưu việc ghi đè (overwrite) khi tìm kiếm mã cũ
CREATE INDEX IF NOT EXISTS idx_trading_plans_ticker ON trading_plans(ticker);
CREATE INDEX IF NOT EXISTS idx_trading_plans_status ON trading_plans(status);

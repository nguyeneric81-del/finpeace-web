-- =====================================================
-- Phase 22: Fix StockPick Schema (Advisor Users & Payment)
-- =====================================================

-- 1. Thêm các cột thiếu vào advisor_users để hỗ trợ StockPick 2.0
ALTER TABLE advisor_users 
ADD COLUMN IF NOT EXISTS stockpick_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stockspick_credits INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS kyc_completed BOOLEAN DEFAULT false;

-- 2. Sửa bảng user_unlocked_deals (trước kia trỏ vào profiles, nay stockpick dùng advisor_users)
-- Xoá constraint cũ nếu có
ALTER TABLE user_unlocked_deals 
DROP CONSTRAINT IF EXISTS user_unlocked_deals_user_id_fkey;

-- Cho phép user_id tham chiếu tới advisor_users
ALTER TABLE user_unlocked_deals
ADD CONSTRAINT user_unlocked_deals_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES advisor_users(id) ON DELETE CASCADE;

-- 3. Tạo bảng payment_orders cho tính năng nâng cấp Bronze qua SePay
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES advisor_users(id) ON DELETE CASCADE,
  transfer_code TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  tier_to_upgrade TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  sepay_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bật RLS cho payment_orders
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

-- Các policy nếu cần cho user tự xem lịch sử
CREATE POLICY "Users can view their own payment orders" 
ON payment_orders 
FOR SELECT 
USING (auth.uid() = user_id);

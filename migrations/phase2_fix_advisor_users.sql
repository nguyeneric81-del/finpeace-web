-- =====================================================
-- MIGRATION: Fix advisor_users để link với auth.users
-- và thêm kyc_completed column
-- Run in Supabase SQL Editor
-- =====================================================

-- 1. Thêm auth_user_id vào advisor_users (link với auth.users)
ALTER TABLE advisor_users
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS kyc_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS kyc_completed_at TIMESTAMPTZ;

-- 2. Thêm unique index cho auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_advisor_users_auth_user_id ON advisor_users(auth_user_id);

-- 3. RLS cho advisor_users (nếu chưa có)
ALTER TABLE advisor_users ENABLE ROW LEVEL SECURITY;

-- Policy: user chỉ xem/sửa record của mình (dùng auth_user_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'advisor_users' AND policyname = 'Users manage own advisor profile'
  ) THEN
    CREATE POLICY "Users manage own advisor profile"
      ON advisor_users FOR ALL
      USING (auth.uid() = auth_user_id)
      WITH CHECK (auth.uid() = auth_user_id);
  END IF;
END $$;

-- 4. Đảm bảo client_assets có RLS đúng
-- (Check nếu đã có policy chưa, nếu chưa thì tạo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'client_assets' AND policyname = 'Users manage own assets'
  ) THEN
    ALTER TABLE client_assets ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users manage own assets"
      ON client_assets FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Khi user đăng ký mới qua auth, tự tạo advisor_users row
-- (Dùng trigger hoặc xử lý trong application code)
-- Function: auto-create advisor_users khi user đăng ký
CREATE OR REPLACE FUNCTION handle_new_user_advisor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO advisor_users (auth_user_id, email, full_name, password_hash)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'MANAGED_BY_SUPABASE_AUTH'
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: chạy khi user mới được tạo
DROP TRIGGER IF EXISTS on_auth_user_created_advisor ON auth.users;
CREATE TRIGGER on_auth_user_created_advisor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_advisor();

-- 6. Backfill: với user hiện có, tạo advisor_users rows dựa trên auth.users
-- (Chạy manual 1 lần)
INSERT INTO advisor_users (auth_user_id, email, full_name, password_hash, kyc_completed)
SELECT 
  au.id as auth_user_id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  'MANAGED_BY_SUPABASE_AUTH' as password_hash,
  false as kyc_completed
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM advisor_users adu WHERE adu.auth_user_id = au.id
)
ON CONFLICT DO NOTHING;

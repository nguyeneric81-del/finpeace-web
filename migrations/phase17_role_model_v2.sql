-- =====================================================
-- FinPeace — Phase 17: Role Model V2
-- 3-Zone Access Control (Finance | Trading | Info)
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- =====================================================
-- STEP 0: Kiểm tra & migrate dữ liệu role CŨ
-- Phải chạy TRƯỚC khi add constraint mới
-- =====================================================

-- 0a. Xem tất cả distinct roles hiện tại (để debug)
SELECT role, COUNT(*) FROM profiles GROUP BY role;

-- 0b. Migrate role cũ → role mới hợp lệ
-- 'customer' → 'customer_finance' (Zone 1 mặc định)
UPDATE profiles
SET role = 'customer_finance'
WHERE role = 'customer';

-- Các role không hợp lệ khác → NULL (sẽ không bị block bởi constraint)
UPDATE profiles
SET role = NULL
WHERE role IS NOT NULL
  AND role NOT IN ('admin', 'agent', 'customer_finance', 'customer_trading', 'customer_trading_kb');

-- =====================================================
-- STEP 1: Mở rộng profiles.role CHECK constraint
-- =====================================================

-- Xóa constraint cũ trước (nếu có)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Thêm lại constraint với đầy đủ roles (NULL được phép)
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'admin',              -- Toàn quyền: 3 zone + admin panel
    'agent',              -- Zone 3 đọc + xem leads cá nhân
    'customer_finance',   -- Zone 1: Tài chính cá nhân
    'customer_trading',   -- Zone 2: Trading Plan + Zone 3 giới hạn
    'customer_trading_kb' -- Zone 2 + Zone 3 full (đã kết nối KB account)
  ));

-- =====================================================
-- STEP 2: Thêm zone_access vào profiles
-- Dùng array để kiểm soát nội dung premium linh hoạt
-- Ví dụ: '{finance}', '{trading}', '{trading,kb_verified}'
-- =====================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS zone_access TEXT[] DEFAULT '{}';

-- =====================================================
-- STEP 3: Link sales_agents với auth.users
-- Để Agent đăng nhập và portal có thể identify người dùng
-- =====================================================

ALTER TABLE sales_agents
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sales_agents_auth_user_id ON sales_agents(auth_user_id);

-- =====================================================
-- STEP 4: Update trigger sync_profile_role_to_auth
-- Sync thêm zone_access vào app_metadata
-- =====================================================

CREATE OR REPLACE FUNCTION sync_profile_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object(
        'role', NEW.role,
        'zone_access', COALESCE(NEW.zone_access, ARRAY[]::TEXT[])
      )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (function đã replace ở trên)
DROP TRIGGER IF EXISTS on_profile_role_change ON profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role, zone_access ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_role_to_auth();

-- =====================================================
-- STEP 5: Set role = 'admin' cho 3 tài khoản Admin
-- Backfill app_metadata trực tiếp (không qua trigger)
-- =====================================================

UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object(
      'role', 'admin',
      'zone_access', ARRAY['finance', 'trading', 'info']::TEXT[]
    )
WHERE email IN (
  'nguyeneric81@gmail.com',
  'yenle@finpeace.vn',
  'tienvinh0108@gmail.com'
);

-- Sync vào profiles table nếu đã có row
UPDATE profiles p
SET role = 'admin',
    zone_access = ARRAY['finance', 'trading', 'info']
FROM auth.users u
WHERE p.id = u.id
  AND u.email IN ('nguyeneric81@gmail.com', 'yenle@finpeace.vn', 'tienvinh0108@gmail.com');

-- =====================================================
-- STEP 6: Backfill zone_access cho app_metadata toàn bộ
-- Đảm bảo users hiện tại có zone_access đúng theo role
-- =====================================================

UPDATE auth.users u
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object(
      'zone_access',
      CASE p.role
        WHEN 'admin'              THEN ARRAY['finance', 'trading', 'info']
        WHEN 'agent'              THEN ARRAY['info']
        WHEN 'customer_finance'   THEN ARRAY['finance']
        WHEN 'customer_trading'   THEN ARRAY['trading', 'info']
        WHEN 'customer_trading_kb' THEN ARRAY['trading', 'info', 'kb_verified']
        ELSE ARRAY[]::TEXT[]
      END
    )
FROM profiles p
WHERE u.id = p.id
  AND p.role IS NOT NULL;

-- =====================================================
-- VERIFY
-- =====================================================

-- Kiểm tra 3 admin accounts
SELECT
  u.email,
  u.raw_app_meta_data->>'role' AS role,
  u.raw_app_meta_data->'zone_access' AS zone_access
FROM auth.users u
WHERE u.email IN ('nguyeneric81@gmail.com', 'yenle@finpeace.vn', 'tienvinh0108@gmail.com');

-- Kiểm tra constraint mới
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass AND conname = 'profiles_role_check';

-- Kiểm tra column mới
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name IN ('role', 'zone_access');

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sales_agents' AND column_name = 'auth_user_id';

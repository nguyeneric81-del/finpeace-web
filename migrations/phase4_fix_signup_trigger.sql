-- =====================================================
-- MIGRATION: Fix signup trigger + email confirmation flow
-- Run in Supabase SQL Editor
-- =====================================================

-- 1. Drop old trigger trước
DROP TRIGGER IF EXISTS on_auth_user_created_advisor ON auth.users;

-- 2. Tạo lại function ROBUST hơn — không bao giờ fail
CREATE OR REPLACE FUNCTION handle_new_user_advisor()
RETURNS TRIGGER AS $$
BEGIN
  -- Thử link auth_user_id vào row đã có (user đăng ký advisor form trước)
  UPDATE advisor_users 
  SET auth_user_id = NEW.id,
      full_name = COALESCE(full_name, NEW.raw_user_meta_data->>'full_name', '')
  WHERE email = NEW.email AND (auth_user_id IS NULL OR auth_user_id != NEW.id);
  
  -- Nếu không có row nào khớp email → tạo mới
  IF NOT FOUND THEN
    INSERT INTO advisor_users (auth_user_id, email, full_name, password_hash)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'MANAGED_BY_SUPABASE_AUTH'
    )
    ON CONFLICT (auth_user_id) DO NOTHING
    ON CONFLICT (email) DO UPDATE SET 
      auth_user_id = EXCLUDED.auth_user_id;
  END IF;
  
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  -- QUAN TRỌNG: Không bao giờ để trigger fail chặn Supabase auth signup
  RAISE WARNING 'handle_new_user_advisor error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate trigger
CREATE TRIGGER on_auth_user_created_advisor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_advisor();

-- 4. Verify
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'handle_new_user_advisor';

-- =====================================================
-- FinPeace — Phase 19h: Fix handle_new_user + EXCEPTION handler
-- Đảm bảo Add User qua Dashboard không bị block
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Xem function hiện tại
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- STEP 2: Wrap handle_new_user trong EXCEPTION handler
-- Kể cả profiles INSERT fail, user vẫn được tạo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- KHÔNG block user creation dù profiles insert fail
  RAISE WARNING 'handle_new_user error (non-blocking): %', SQLERRM;
  RETURN NEW;
END;
$$;

-- STEP 3: Verify trigger vẫn còn được attach
SELECT tgname, tgenabled, tgfoid::regproc AS function_name
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass;

-- =====================================================
-- FinPeace — Phase 19g: Fix profiles.role DEFAULT + handle_new_user
-- Root cause: tgenabled='O' = ENABLED, không phải disabled!
-- profiles.role có DEFAULT 'customer' vi phạm CHECK constraint mới
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Xem column definition của profiles.role
SELECT column_name, column_default, is_nullable, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'role';

-- STEP 2: Xem định nghĩa của handle_new_user
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- STEP 3: Fix — đổi DEFAULT của profiles.role thành NULL
-- (NULL vượt qua CHECK constraint vì NULL IN (...) = NULL ≠ FALSE)
ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT NULL;

-- Nếu có DEFAULT 'customer', dòng trên sẽ xóa nó.
-- Nếu không có DEFAULT, không sao cả.

-- STEP 4: Verify constraint còn tồn tại đúng không
SELECT conname, consrc
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND contype = 'c';

-- STEP 5: Test trigger bằng cách check xem handle_new_user có gây lỗi không
-- (Chạy xong rồi thử Add user trên Dashboard)

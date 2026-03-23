-- =====================================================
-- FinPeace — Phase 19f: Xóa accounts GoTrue-incompatible + Fix handle_new_user
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Xem handle_new_user hiện tại đang làm gì
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- STEP 2: Xóa 4 accounts bị lỗi (cần tạo lại qua Dashboard)
-- ⚠️ Backup UIDs trước khi xóa
SELECT id, email FROM auth.users
WHERE email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com'
);

-- Xóa identities trước (foreign key)
DELETE FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'quangnm@finpeace.vn',
    'ducha@finpeace.vn',
    'Lelethuy150801@gmail.com',
    'nguyeneric81@gmail.com'
  )
);

-- Xóa profiles (foreign key có thể cascade, nhưng xóa thủ công cho chắc)
DELETE FROM profiles
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN (
    'quangnm@finpeace.vn',
    'ducha@finpeace.vn',
    'Lelethuy150801@gmail.com',
    'nguyeneric81@gmail.com'
  )
);

-- Xóa auth.users
DELETE FROM auth.users
WHERE email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com'
);

-- STEP 3: Verify còn lại đúng 2 admin đang hoạt động
SELECT email, raw_app_meta_data->>'role' AS role
FROM auth.users
WHERE email IN (
  'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com','nguyeneric81@gmail.com',
  'yenle@finpeace.vn','tienvinh0108@gmail.com'
);

-- =====================================================
-- SAU KHI CHẠY FILE NÀY:
-- Vào Supabase Dashboard → Authentication → Users → "Add user"
-- Tạo lại 4 accounts:
--   quangnm@finpeace.vn       / 123456
--   ducha@finpeace.vn         / 123456  
--   Lelethuy150801@gmail.com  / 123456
--   nguyeneric81@gmail.com    / 123456
-- Sau đó chạy phase18_agent_portal_seed.sql để re-link sales_agents
-- =====================================================

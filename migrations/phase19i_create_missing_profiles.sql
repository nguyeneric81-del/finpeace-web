-- =====================================================
-- FinPeace — Phase 19i: Tạo profiles + set roles cho 4 accounts mới
-- Các accounts được tạo qua Dashboard nhưng không có profiles
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Xem UIDs của 4 accounts mới
SELECT id, email FROM auth.users
WHERE email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'thuylt@finpeace.vn',
  'nguyeneric81@gmail.com'
);

-- STEP 2: Tạo profiles cho 4 accounts chưa có profile
INSERT INTO public.profiles (id, email, full_name, role, zone_access)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  CASE
    WHEN u.email = 'nguyeneric81@gmail.com' THEN 'admin'
    ELSE 'agent'
  END,
  CASE
    WHEN u.email = 'nguyeneric81@gmail.com' THEN ARRAY['finance','trading','info']
    ELSE ARRAY['info']
  END
FROM auth.users u
WHERE u.email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'thuylt@finpeace.vn',
  'nguyeneric81@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  zone_access = EXCLUDED.zone_access;

-- STEP 3: Sync role vào auth.users.raw_app_meta_data
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'agent', 'zone_access', ARRAY['info'])
WHERE email IN ('quangnm@finpeace.vn', 'ducha@finpeace.vn', 'thuylt@finpeace.vn');

UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin', 'zone_access', ARRAY['finance','trading','info'])
WHERE email = 'nguyeneric81@gmail.com';

-- STEP 4: Link sales_agents với auth_user_id mới
UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'quangnm@finpeace.vn' LIMIT 1)
WHERE code = 'mq01';

UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'ducha@finpeace.vn' LIMIT 1)
WHERE code = 'aduc02';

UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'thuylt@finpeace.vn' LIMIT 1)
WHERE code = 'thuy03';

-- STEP 5: Verify tất cả
SELECT
  sa.code, sa.full_name,
  u.email,
  p.role AS profile_role,
  u.raw_app_meta_data->>'role' AS auth_role,
  u.email_confirmed_at IS NOT NULL AS confirmed
FROM sales_agents sa
LEFT JOIN auth.users u ON u.id = sa.auth_user_id
LEFT JOIN profiles p ON p.id = sa.auth_user_id
WHERE sa.code IN ('mq01', 'aduc02', 'thuy03')
ORDER BY sa.code;

-- =====================================================
-- FinPeace — Phase 18: Agent Portal Seed
-- Link sales_agents → auth.users + set role = 'agent'
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- =====================================================
-- BƯỚC THỦ CÔNG TRƯỚC KHI CHẠY FILE NÀY:
-- Vào Supabase Dashboard → Authentication → Users
-- Tạo tài khoản cho từng Agent (email + mật khẩu)
-- Sau đó chạy file này để link và gán role.
-- =====================================================

-- STEP 1: Xem danh sách agents hiện tại
SELECT code, full_name, auth_user_id FROM sales_agents ORDER BY created_at;

-- STEP 2: Link auth_user_id cho từng agent
-- Cập nhật email tương ứng với từng agent code
-- ⚠️ Sửa email bên dưới theo đúng tài khoản đã tạo trên Supabase Auth

UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'quangnm@finpeace.vn' LIMIT 1)
WHERE code = 'mq01' AND auth_user_id IS NULL;

UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'ducha@finpeace.vn' LIMIT 1)
WHERE code = 'aduc02' AND auth_user_id IS NULL;

UPDATE sales_agents
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'thuylt@finpeace.vn' LIMIT 1)
WHERE code = 'thuy03' AND auth_user_id IS NULL;

-- huyen04, mduc05, dmd01: chưa có email — bổ sung sau
-- UPDATE sales_agents SET auth_user_id = (...) WHERE code = 'huyen04' AND auth_user_id IS NULL;
-- UPDATE sales_agents SET auth_user_id = (...) WHERE code = 'mduc05' AND auth_user_id IS NULL;
-- UPDATE sales_agents SET auth_user_id = (...) WHERE code = 'dmd01' AND auth_user_id IS NULL;


-- STEP 3: Set role = 'agent' trong profiles cho tất cả agent đã được link
-- Cũng sync lên app_metadata qua trigger
UPDATE profiles p
SET role = 'agent',
    zone_access = ARRAY['info']
FROM sales_agents sa
WHERE p.id = sa.auth_user_id
  AND sa.auth_user_id IS NOT NULL
  AND (p.role IS NULL OR p.role NOT IN ('admin'));  -- Không downgrade admin

-- STEP 4: Verify kết quả
SELECT
  sa.code,
  sa.full_name,
  u.email,
  p.role,
  p.zone_access,
  u.raw_app_meta_data->>'role' AS auth_role
FROM sales_agents sa
LEFT JOIN auth.users u ON u.id = sa.auth_user_id
LEFT JOIN profiles p ON p.id = sa.auth_user_id
ORDER BY sa.created_at;

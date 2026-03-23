-- =====================================================
-- FinPeace — Phase 19b: Drop Constraint → Tạo Users → Re-add Constraint
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- =====================================================
-- STEP 1: Drop constraint trước — để handle_new_user() insert tự do
-- =====================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- =====================================================
-- STEP 2: Fix trigger handle_new_user_advisor (1 ON CONFLICT)
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user_advisor()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE advisor_users
  SET auth_user_id = NEW.id,
      full_name = COALESCE(full_name, NEW.raw_user_meta_data->>'full_name', '')
  WHERE email = NEW.email
    AND (auth_user_id IS NULL OR auth_user_id != NEW.id);

  IF NOT FOUND THEN
    INSERT INTO advisor_users (auth_user_id, email, full_name, password_hash)
    VALUES (
      NEW.id, NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      'MANAGED_BY_SUPABASE_AUTH'
    )
    ON CONFLICT (email) DO UPDATE SET
      auth_user_id = EXCLUDED.auth_user_id,
      full_name = COALESCE(EXCLUDED.full_name, advisor_users.full_name);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user_advisor error (ignored): %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 3: Tạo Agent accounts (constraint đã drop → safe)
-- =====================================================

DO $$ DECLARE v UUID;
BEGIN
  SELECT id INTO v FROM auth.users WHERE email = 'quangnm@finpeace.vn';
  IF v IS NULL THEN
    INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_user_meta_data,raw_app_meta_data,created_at,updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated','quangnm@finpeace.vn',crypt('123456',gen_salt('bf')),now(),'{"full_name":"Minh Quang"}'::jsonb,'{"provider":"email","providers":["email"]}'::jsonb,now(),now());
    RAISE NOTICE '✅ Created quangnm@finpeace.vn';
  ELSE RAISE NOTICE '⚠️ quangnm@finpeace.vn exists'; END IF;
END $$;

DO $$ DECLARE v UUID;
BEGIN
  SELECT id INTO v FROM auth.users WHERE email = 'ducha@finpeace.vn';
  IF v IS NULL THEN
    INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_user_meta_data,raw_app_meta_data,created_at,updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated','ducha@finpeace.vn',crypt('123456',gen_salt('bf')),now(),'{"full_name":"Anh Đức"}'::jsonb,'{"provider":"email","providers":["email"]}'::jsonb,now(),now());
    RAISE NOTICE '✅ Created ducha@finpeace.vn';
  ELSE RAISE NOTICE '⚠️ ducha@finpeace.vn exists'; END IF;
END $$;

DO $$ DECLARE v UUID;
BEGIN
  SELECT id INTO v FROM auth.users WHERE email = 'Lelethuy150801@gmail.com';
  IF v IS NULL THEN
    INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_user_meta_data,raw_app_meta_data,created_at,updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated','Lelethuy150801@gmail.com',crypt('123456',gen_salt('bf')),now(),'{"full_name":"Lê Thủy"}'::jsonb,'{"provider":"email","providers":["email"]}'::jsonb,now(),now());
    RAISE NOTICE '✅ Created Lelethuy150801@gmail.com';
  ELSE RAISE NOTICE '⚠️ Lelethuy150801@gmail.com exists'; END IF;
END $$;

-- =====================================================
-- STEP 4: Tạo Admin accounts (nếu chưa có)
-- =====================================================
DO $$
DECLARE em TEXT; v UUID;
  admins TEXT[] := ARRAY['nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com'];
BEGIN
  FOREACH em IN ARRAY admins LOOP
    SELECT id INTO v FROM auth.users WHERE email = em;
    IF v IS NULL THEN
      INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_user_meta_data,raw_app_meta_data,created_at,updated_at)
      VALUES ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated',em,crypt('123456',gen_salt('bf')),now(),'{}'::jsonb,'{"provider":"email","providers":["email"]}'::jsonb,now(),now());
      RAISE NOTICE '✅ Created admin: %', em;
    ELSE RAISE NOTICE '⚠️ Admin exists: %', em; END IF;
  END LOOP;
END $$;

-- =====================================================
-- STEP 5: Set role đúng cho profiles + sync auth meta
-- =====================================================

-- Normalize tất cả profiles NULL/invalid -> customer_finance
UPDATE profiles
SET role = 'customer_finance'
WHERE role IS NULL OR role NOT IN ('admin','agent','customer_finance','customer_trading','customer_trading_kb');

-- Set agent role
UPDATE profiles
SET role = 'agent', zone_access = ARRAY['info']
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com')
);

-- Set admin role
UPDATE profiles
SET role = 'admin', zone_access = ARRAY['finance','trading','info']
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com')
);

-- Sync app_metadata agents
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data,'{}'::jsonb)
  || '{"role":"agent","zone_access":["info"]}'::jsonb
WHERE email IN ('quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com');

-- Sync app_metadata admins
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data,'{}'::jsonb)
  || '{"role":"admin","zone_access":["finance","trading","info"]}'::jsonb
WHERE email IN ('nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com');

-- =====================================================
-- STEP 6: Re-add constraint SAU khi data đã sạch
-- =====================================================
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'admin',
    'agent',
    'customer_finance',
    'customer_trading',
    'customer_trading_kb'
  ));

-- =====================================================
-- VERIFY
-- =====================================================
SELECT
  u.email,
  p.role AS profile_role,
  u.raw_app_meta_data->>'role' AS auth_role,
  u.email_confirmed_at IS NOT NULL AS confirmed
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email IN (
  'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com'
)
ORDER BY u.email;

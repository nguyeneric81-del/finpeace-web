-- =====================================================
-- FinPeace — Phase 19c: Fix auth.identities cho Agent/Admin accounts
-- Root cause: INSERT trực tiếp vào auth.users không tạo auth.identities
-- → Supabase Auth không verify được email+password
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Thêm auth.identities cho 3 Agent
DO $$
DECLARE
  agent_emails TEXT[] := ARRAY[
    'quangnm@finpeace.vn',
    'ducha@finpeace.vn',
    'Lelethuy150801@gmail.com'
  ];
  em TEXT;
  v_uid UUID;
BEGIN
  FOREACH em IN ARRAY agent_emails LOOP
    SELECT id INTO v_uid FROM auth.users WHERE email = em;
    IF v_uid IS NULL THEN
      RAISE NOTICE 'User not found: %', em;
      CONTINUE;
    END IF;

    -- Thêm identity nếu chưa có
    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, created_at, updated_at, last_sign_in_at
    )
    VALUES (
      gen_random_uuid(),
      v_uid,
      em,           -- provider_id cho email chính là email
      'email',
      jsonb_build_object('sub', v_uid::text, 'email', em),
      now(), now(), now()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;

    RAISE NOTICE '✅ Identity added for: %', em;
  END LOOP;
END $$;

-- STEP 2: Thêm auth.identities cho 3 Admin
DO $$
DECLARE
  admin_emails TEXT[] := ARRAY[
    'nguyeneric81@gmail.com',
    'yenle@finpeace.vn',
    'tienvinh0108@gmail.com'
  ];
  em TEXT;
  v_uid UUID;
BEGIN
  FOREACH em IN ARRAY admin_emails LOOP
    SELECT id INTO v_uid FROM auth.users WHERE email = em;
    IF v_uid IS NULL THEN
      RAISE NOTICE 'User not found: %', em;
      CONTINUE;
    END IF;

    INSERT INTO auth.identities (
      id, user_id, provider_id, provider,
      identity_data, created_at, updated_at, last_sign_in_at
    )
    VALUES (
      gen_random_uuid(),
      v_uid,
      em,
      'email',
      jsonb_build_object('sub', v_uid::text, 'email', em),
      now(), now(), now()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;

    RAISE NOTICE '✅ Identity added for: %', em;
  END LOOP;
END $$;

-- STEP 3: Đảm bảo password hash đúng (cost 10 — Supabase default)
UPDATE auth.users
SET encrypted_password = crypt('123456', gen_salt('bf', 10))
WHERE email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com',
  'yenle@finpeace.vn',
  'tienvinh0108@gmail.com'
);

-- STEP 4: Verify
SELECT
  u.email,
  u.email_confirmed_at IS NOT NULL AS confirmed,
  u.raw_app_meta_data->>'role' AS role,
  i.provider,
  i.provider_id
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id AND i.provider = 'email'
WHERE u.email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn',
  'Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com',
  'yenle@finpeace.vn',
  'tienvinh0108@gmail.com'
)
ORDER BY u.email;

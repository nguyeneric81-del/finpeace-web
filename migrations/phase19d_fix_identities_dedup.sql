-- =====================================================
-- FinPeace — Phase 19d: Fix duplicate auth.identities + verify
-- Root cause: Duplicate identity rows gây GoTrue JOIN error
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Xem tất cả identities cho 6 accounts
SELECT
  u.email,
  i.id AS identity_id,
  i.provider,
  i.provider_id,
  i.created_at
FROM auth.users u
JOIN auth.identities i ON i.user_id = u.id
WHERE u.email IN (
  'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com'
)
ORDER BY u.email, i.created_at;

-- STEP 2: Xóa duplicate identities — giữ lại 1 identity mới nhất cho mỗi user+provider
DELETE FROM auth.identities
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, provider
        ORDER BY created_at DESC   -- giữ mới nhất
      ) AS rn
    FROM auth.identities
    WHERE user_id IN (
      SELECT id FROM auth.users WHERE email IN (
        'nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com',
        'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com'
      )
    )
  ) ranked
  WHERE rn > 1   -- xóa rows cũ hơn (duplicate)
);

-- STEP 3: Đảm bảo identity_data có đúng email key
UPDATE auth.identities
SET identity_data = jsonb_build_object('sub', user_id::text, 'email', provider_id)
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com',
    'nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com'
  )
)
AND provider = 'email';

-- STEP 4: Verify — phải chỉ còn 1 row mỗi user
SELECT
  u.email,
  COUNT(i.id) AS identity_count,
  i.provider,
  i.provider_id
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email IN (
  'quangnm@finpeace.vn','ducha@finpeace.vn','Lelethuy150801@gmail.com',
  'nguyeneric81@gmail.com','yenle@finpeace.vn','tienvinh0108@gmail.com'
)
GROUP BY u.email, i.provider, i.provider_id
ORDER BY u.email;

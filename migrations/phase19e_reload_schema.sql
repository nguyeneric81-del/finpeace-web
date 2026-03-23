-- =====================================================
-- FinPeace — Phase 19e: Reload schema cache + Normalize auth state
-- Fix: "Database error querying schema" sau khi nhiều DDL migrations
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql
-- =====================================================

-- STEP 1: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- STEP 2: Kiểm tra triggers trên auth.users
SELECT tgname, tgtype, tgenabled, proname
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE tgrelid = 'auth.users'::regclass
ORDER BY tgname;

-- STEP 3: Kiểm tra triggers trên profiles
SELECT tgname, tgtype, tgenabled, proname
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE tgrelid = 'public.profiles'::regclass
ORDER BY tgname;

-- STEP 4: Test simple auth.users query
SELECT id, email, email_confirmed_at IS NOT NULL AS confirmed
FROM auth.users
WHERE email IN (
  'quangnm@finpeace.vn',
  'ducha@finpeace.vn'
)
LIMIT 2;

-- STEP 5: Check có trigger nào UPDATE auth.users không (có thể gây loop)
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgrelid = 'auth.users'::regclass
AND tgtype & 4 > 0;  -- UPDATE triggers

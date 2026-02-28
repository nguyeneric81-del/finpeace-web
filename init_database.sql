-- Cấp quyền sử dụng tiện ích uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tạo Bảng Profiles (Lưu thông tin cá nhân khách hàng)
-- Bảng này liên kết 1-1 với bảng auth.users mặc định của Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  dob DATE,
  role TEXT DEFAULT 'client', -- 'admin' hoặc 'client'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tạo Bảng Financial Records (Lưu lịch sử tài chính và số liệu biểu đồ)
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  net_worth NUMERIC DEFAULT 0,
  cashflow NUMERIC DEFAULT 0,
  monthly_savings NUMERIC DEFAULT 0,
  expected_inflation NUMERIC DEFAULT 3.0, -- Lạm phát kỳ vọng (%)
  expected_interest NUMERIC DEFAULT 6.0,  -- Lãi suất kỳ vọng (%)
  retirement_goal NUMERIC DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ==============================================================================
-- 3. KÍCH HOẠT BẢO MẬT CẤP ĐỘ DÒNG (ROW LEVEL SECURITY - RLS)
-- Đảm bảo triệt để: Khách nào chỉ xem/sửa được dữ liệu của khách đó.
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Policy cho Profiles:
-- 1. Cho phép User tự xem hồ sơ của mình
CREATE POLICY "User can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 2. Cho phép User tự cập nhật hồ sơ của mình
CREATE POLICY "User can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy cho Financial Records:
-- 1. Cho phép User tự xem số liệu tài chính của mình
CREATE POLICY "User can view own financial records" 
ON public.financial_records FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Cho phép insert dữ liệu (Agent thao tác thay hoặc user tự tạo)
CREATE POLICY "User can insert own financial records" 
ON public.financial_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Cho phép update số liệu của chính mình
CREATE POLICY "User can update own financial records" 
ON public.financial_records FOR UPDATE 
USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. FUNCTION TRIGGER TỰ ĐỘNG (Auto-create profile)
-- Tự động chèn 1 dòng vào public.profiles khi có 1 user mới đăng nhập lần đầu
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

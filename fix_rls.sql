-- Cấp quyền Bypass RLS cho role Service (Backend Node.js)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Xóa policy cũ nếu có trùng tên
DROP POLICY IF EXISTS "Service Role Full Access Profiles" ON public.profiles;

-- Thêm quyền lấy dữ liệu (SELECT/UPDATE) cho mọi Profile đối với Service Role API
CREATE POLICY "Service Role Full Access Profiles" 
ON public.profiles
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Tương tự cho cột financial_records
DROP POLICY IF EXISTS "Service Role Full Access Records" ON public.financial_records;
CREATE POLICY "Service Role Full Access Records" 
ON public.financial_records
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

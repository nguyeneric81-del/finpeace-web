-- Thêm cột email vào bảng profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Trigger Function tự động đồng bộ email từ bảng auth.users sang profiles khi đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger lắng nghe sự kiện sign up
DROP TRIGGER IF EXISTS on_auth_user_created_email ON auth.users;
CREATE TRIGGER on_auth_user_created_email
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_email();

-- Cập nhật hồi tố email cho những user cũ đã tạo
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

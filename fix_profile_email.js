const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  console.log("Tìm tài khoản của YenLe trong Users Auth...");
  const { data: users, error: errAuth } = await supabase.auth.admin.listUsers();

  if (errAuth) {
    console.error("Lỗi lấy danh sách User Auth:", errAuth);
    return;
  }

  const yenle = users?.users.find(u => u.email === 'yenle@finpeace.vn');

  if (yenle) {
    console.log("Đã tìm thấy ID Auth:", yenle.id);
    console.log("Đang ép Update Email vào bảng Profiles...");
    const { data, error } = await supabase.from('profiles').upsert({
      id: yenle.id,
      email: 'yenle@finpeace.vn',
      full_name: 'Lê Hải Yến'
    });
    if (error) {
      console.log("Lỗi chèn Profile:", error.message);
    } else {
      console.log("Thành công! Khách hàng YenLe đã có Profile và Email");
    }
  } else {
    console.log("Chưa có User nào tên yenle@finpeace.vn trong DB Auth");
  }
}
fix();

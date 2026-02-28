const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log("Đang tạo tài khoản cho Yen Le...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'yenle@finpeace.vn',
    password: 'password123',
    email_confirm: true,
    user_metadata: { full_name: 'Lê Hải Yến' }
  });
  
  if (error) {
    console.error("Lỗi:", error.message);
  } else {
    console.log("Tạo tài khoản Auth thành công ID:", data.user.id);
    
    // Đảm bảo Profile ghi nhận tên
    await supabase.from('profiles').update({ 
      full_name: 'Lê Hải Yến',
      email: 'yenle@finpeace.vn'
    }).eq('id', data.user.id);
    
    console.log("Hoàn tất tạo Profile.");
  }
}
seed();

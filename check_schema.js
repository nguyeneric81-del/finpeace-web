const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  // Cố gắng chọn 1 record để xem cấu trúc cột trả về
  const { data, error } = await supabase.from('financial_records').select('*').limit(1);
  console.log("Dữ liệu bảng:", data);
  console.log("Lỗi:", error);
})();

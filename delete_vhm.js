const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
    const { error } = await supabase.from('trading_plans').delete().eq('ticker', 'VHM');
    if (error) console.error('Lỗi delete VHM:', error);
    else console.log('Đã xóa VHM khỏi DB thành công!');
})();

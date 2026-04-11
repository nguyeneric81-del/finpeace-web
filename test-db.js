const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const transferCode = 'FPBRZ' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const { data, error } = await sb.from('payment_orders').insert({
    user_id: '1a10e156-59fa-4cf3-9337-da028e37eddf',
    transfer_code: transferCode,
    amount: 295000,
    tier_to_upgrade: 'BRONZE',
    status: 'pending'
  }).select().single();
  console.log("DB Insert Result:", data, error);
}
run();

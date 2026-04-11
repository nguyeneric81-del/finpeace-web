const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await sb.from('advisor_users').select('stockpick_plan').limit(1);
  console.log("advisor_users check:", data, error);
  const { data: d2, error: e2 } = await sb.from('payment_orders').select('*').limit(1);
  console.log("payment_orders check:", d2, e2);
}
run();

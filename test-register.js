const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await sb.from('advisor_users').insert({
    email: 'test_free2bronze@example.com',
    password_hash: 'somehash',
    full_name: 'Test Customer',
    role: 'customer',
    stockpick_plan: 'free',
    stockspick_credits: 3
  }).select();
  console.log("Register insert result:", data, error);
}
run();

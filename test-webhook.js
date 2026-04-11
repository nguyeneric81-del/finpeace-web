const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const data = {
    transferType: 'in',
    content: 'CHUYEN TIEN CHO FINPEACE FPBRZK677 NHA',
    transferAmount: 295000,
    referenceCode: '123456789'
  }
  
  const content = data.content.toUpperCase();
  const { data: pendingOrders, error: fetchErr } = await sb.from('payment_orders').select('*').eq('status', 'pending');
  console.log("Pending Orders length:", pendingOrders?.length, fetchErr);
  
  const matchedOrder = pendingOrders.find(o => content.includes(o.transfer_code));
  console.log("Matched order:", matchedOrder);
  
  if (matchedOrder) {
    const targetTier = matchedOrder.tier_to_upgrade.toLowerCase();
    
    // Simulate what the webhook does
    const { data: userProfile, error: err1 } = await sb.from('advisor_users').select('stockspick_credits').eq('id', matchedOrder.user_id).single();
    console.log("Profile fetch:", userProfile, err1);
    
    const currentCredits = userProfile?.stockspick_credits || 0;
    const newCredits = targetTier === 'bronze' ? currentCredits + 10 : currentCredits;
    
    const { error: err2 } = await sb.from('advisor_users').update({
      stockpick_plan: targetTier,
      stockspick_credits: newCredits
    }).eq('id', matchedOrder.user_id);
    console.log("Update tier error:", err2);
    
    const { error: err3 } = await sb.from('payment_orders').update({
      status: 'paid', sepay_reference: data.referenceCode, updated_at: new Date().toISOString()
    }).eq('id', matchedOrder.id);
    console.log("Update order error:", err3);
  }
}
run();

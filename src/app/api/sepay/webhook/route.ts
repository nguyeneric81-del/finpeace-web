import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    // Payload from SePay:
    // { gateway, transactionDate, accountNumber, transferType: "in", transferAmount, content, referenceCode }

    if (data.transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Not an IN transfer' })
    }

    const rawContent = data.content || ''
    const content = rawContent.toUpperCase()

    // 1. Fetch pending orders from DB
    const { data: pendingOrders, error: fetchErr } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('status', 'pending')

    if (fetchErr || !pendingOrders) {
      console.error('Error fetching orders:', fetchErr)
      return NextResponse.json({ success: false, message: 'DB Error' })
    }

    // 2. Find matching order -> Check if transferCode (e.g., FPBRZA2B1) is inside the bank transfer content
    const matchedOrder = pendingOrders.find(o => content.includes(o.transfer_code))

    if (!matchedOrder) {
      return NextResponse.json({ success: true, message: 'No matching order found. May be a normal deposit.' })
    }

    // 3. Verify exact Amount
    // Accept if they paid equal or more
    if (Number(data.transferAmount) < Number(matchedOrder.amount)) {
      console.error(`Insufficient amount. Expected ${matchedOrder.amount}, Got ${data.transferAmount}`);
      return NextResponse.json({ success: true, message: 'Insufficient amount' })
    }

    // 4. Update the Order to 'paid'
    await supabase.from('payment_orders').update({
      status: 'paid',
      sepay_reference: data.referenceCode,
      updated_at: new Date().toISOString()
    }).eq('id', matchedOrder.id)

    // 5. Instantly upgrade the User's tier in advisor_users table
    // Convert 'BRONZE' to 'bronze' mapping
    const targetTier = matchedOrder.tier_to_upgrade.toLowerCase()
    
    // Fetch current profile to get credits
    const { data: userProfile } = await supabase
      .from('advisor_users')
      .select('stockspick_credits')
      .eq('id', matchedOrder.user_id)
      .single()
      
    const currentCredits = userProfile?.stockspick_credits || 0
    const newCredits = targetTier === 'bronze' ? currentCredits + 10 : currentCredits

    await supabase.from('advisor_users').update({
      stockpick_plan: targetTier,
      stockspick_credits: newCredits
    }).eq('id', matchedOrder.user_id)

    return NextResponse.json({ success: true, message: 'Order Paid, User Upgraded & Received 10 Credits', orderId: matchedOrder.id })

  } catch (err: any) {
    console.error('SePay Webhook Error:', err)
    return NextResponse.json({ success: false, err: err.message }, { status: 500 })
  }
}

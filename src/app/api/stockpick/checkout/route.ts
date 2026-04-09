import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, tierToUpgrade, amount } = await req.json()

    if (!userId || !tierToUpgrade || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate a unique 7-character transfer code (e.g. FPBRZA2B1)
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const prefix = tierToUpgrade === 'BRONZE' ? 'BRZ' : 'SIL'
    const transferCode = `FP${prefix}${suffix}`

    const { data: order, error } = await supabase
      .from('payment_orders')
      .insert({
        user_id: userId,
        transfer_code: transferCode,
        amount: amount,
        tier_to_upgrade: tierToUpgrade,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Insert payment_orders error:', error)
      return NextResponse.json({ error: 'DB Error' }, { status: 500 })
    }

    // FinPeace TPBank Account (từ cấu hình SePay của anh)
    const sepayBank = 'TPBank' 
    const sepayAcc = '89996669999'
    const qrUrl = `https://qr.sepay.vn/img?acc=${sepayAcc}&bank=${sepayBank}&amount=${amount}&des=${transferCode}`

    return NextResponse.json({ 
      orderId: order.id,
      transferCode,
      qrUrl 
    })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, email, amount } = await req.json()
    
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Số credits (amount) không hợp lệ' }, { status: 400 })
    }

    let uid = userId
    if (!uid && email) {
      const normalizedEmail = email.toLowerCase().trim()
      // Tìm uid từ advisor_users vì stockpick dùng bảng này
      const { data: user } = await supabase
        .from('advisor_users')
        .select('id')
        .eq('email', normalizedEmail)
        .single()
      
      if (user) uid = user.id
    }

    if (!uid) {
      return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
    }

    // Lấy số dư hiện tại trong profiles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('stockspick_credits')
      .eq('id', uid)
      .single()

    if (profileErr && profileErr.code !== 'PGRST116') {
      throw profileErr
    }

    const current = profile?.stockspick_credits || 0
    const newCredit = current + amount

    // Cập nhật số dư credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stockspick_credits: newCredit })
      .eq('id', uid)

    if (updateError) throw updateError

    return NextResponse.json({ 
      success: true, 
      message: `Đã cộng ${amount} credits. Số dư mới: ${newCredit}`,
      credits: newCredit 
    })
  } catch (err: any) {
    console.error('StockPick add credit error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

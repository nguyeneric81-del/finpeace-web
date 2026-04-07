import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { userId, dealId } = await req.json()

    if (!userId || !dealId) {
      return NextResponse.json({ error: 'Thiếu dữ liệu (userId hoặc dealId)' }, { status: 400 })
    }

    // Lấy số dư hiện tại
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('stockspick_credits')
      .eq('id', userId)
      .single()

    if (profileErr) throw profileErr

    const credits = profile?.stockspick_credits || 0

    if (credits <= 0) {
      return NextResponse.json({ error: 'Bạn đã hết Credit mở khoá. Vui lòng nâng cấp gói Bronze để nhận thêm Credits.' }, { status: 403 })
    }

    // Ghi vào bảng (Unique Constraint bảo vệ việc mở khoá 2 lần)
    const { error: insertError } = await supabase
      .from('user_unlocked_deals')
      .insert({ user_id: userId, deal_id: dealId })

    if (insertError) {
      if (insertError.code === '23505' || insertError.code === '23503') {
        return NextResponse.json({ error: 'Deal đã được mở khoá trước đó hoặc dữ liệu không hợp lệ.' }, { status: 400 })
      }
      throw insertError
    }

    // Trừ 1 credit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stockspick_credits: credits - 1 })
      .eq('id', userId)

    if (updateError) {
      // Rollback delete if needed, but for now we throw
      throw updateError
    }

    // Lấy lại dữ liệu Full của deals
    const { data: deal } = await supabase.from('trading_plans').select('*').eq('id', dealId).single()
    const { data: signal } = await supabase.from('price_signals')
      .select('ticker, current_price, signal_type, signal_label, signal_detail, generated_at')
      .eq('ticker', deal.ticker)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      success: true,
      creditsRemaining: credits - 1,
      deal: {
        ...deal,
        signal: signal || null,
        is_locked: false
      }
    })
  } catch (err: any) {
    console.error('Unlock deal error:', err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi mở khoá deal' }, { status: 500 })
  }
}

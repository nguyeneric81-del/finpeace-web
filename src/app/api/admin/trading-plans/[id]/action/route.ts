import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/** Add N business days (skip Sat/Sun) to a date */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dow = result.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return result
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { action, price, note } = body

  if (!id || !action) {
    return NextResponse.json({ error: 'Thiếu id hoặc action' }, { status: 400 })
  }

  // Fetch current plan
  const { data: plan, error: fetchErr } = await supabase
    .from('trading_plans')
    .select('id, ticker, exec_status')
    .eq('id', id)
    .single()

  if (fetchErr || !plan) {
    return NextResponse.json({ error: 'Không tìm thấy trading plan' }, { status: 404 })
  }

  let updatePayload: Record<string, any> = {}
  const now = new Date()

  if (action === 'buy') {
    if (plan.exec_status !== 'waiting_buy') {
      return NextResponse.json({ error: 'Plan không ở trạng thái chờ mua' }, { status: 409 })
    }
    if (!price) return NextResponse.json({ error: 'Thiếu giá mua' }, { status: 400 })

    const holdingSince = addBusinessDays(now, 2)
    updatePayload = {
      exec_status: 'bought',
      bought_price: price,
      bought_at: now.toISOString(),
      holding_since: holdingSince.toISOString(),
      exec_note: note || null,
    }
  } else if (action === 'sell_half') {
    if (!['bought', 'holding'].includes(plan.exec_status)) {
      return NextResponse.json({ error: 'Plan chưa ở trạng thái có thể bán' }, { status: 409 })
    }
    if (!price) return NextResponse.json({ error: 'Thiếu giá bán' }, { status: 400 })

    updatePayload = {
      exec_status: 'partial_sold',
      sold_half_price: price,
      sold_half_at: now.toISOString(),
      exec_note: note || null,
    }
  } else if (action === 'sell_all') {
    if (!['bought', 'holding', 'partial_sold'].includes(plan.exec_status)) {
      return NextResponse.json({ error: 'Không thể bán all ở trạng thái này' }, { status: 409 })
    }
    if (!price) return NextResponse.json({ error: 'Thiếu giá bán' }, { status: 400 })

    updatePayload = {
      exec_status: 'closed',
      sold_all_price: price,
      sold_all_at: now.toISOString(),
      exec_note: note || null,
    }
  } else if (action === 'cancel') {
    updatePayload = {
      exec_status: 'waiting_buy',
      bought_price: null,
      bought_at: null,
      holding_since: null,
      sold_half_price: null,
      sold_half_at: null,
      sold_all_price: null,
      sold_all_at: null,
      exec_note: note || 'Đã hủy bộ lệnh điều kiện tự động',
    }
  } else {
    return NextResponse.json({ error: `Action không hợp lệ: ${action}` }, { status: 400 })
  }

  const { error: updateErr } = await supabase
    .from('trading_plans')
    .update(updatePayload)
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: 'Lỗi cập nhật database' }, { status: 500 })
  }

  return NextResponse.json({ success: true, action, plan_id: id, ...updatePayload })
}

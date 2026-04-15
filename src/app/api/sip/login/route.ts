import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function hashPassword(pwd: string) {
  return crypto.createHash('sha256').update(pwd).digest('hex')
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const { data: customer, error } = await supabase
    .from('sip_customers')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .eq('password_hash', hashPassword(password))
    .single()

  if (error || !customer) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
  }

  // Check if still active
  if (new Date(customer.end_date) < new Date()) {
    return NextResponse.json({ error: 'Hợp đồng tích sản của bạn đã kết thúc. Vui lòng liên hệ FinPeace để gia hạn.' }, { status: 403 })
  }

  return NextResponse.json({
    success: true,
    customer: {
      id: customer.id,
      email: customer.email,
      full_name: customer.full_name,
      start_date: customer.start_date,
      end_date: customer.end_date,
      monthly_target: customer.monthly_target,
      target1_name: customer.target1_name,
      target1_value: customer.target1_value,
      target1_months: customer.target1_months,
      broker_company: customer.broker_company,
      broker_account: customer.broker_account,
      dealer_name: customer.dealer_name,
    }
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 12))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
    }

    // Check advisor_users table (same auth system as advisor)
    const { data: user, error } = await supabase
      .from('advisor_users')
      .select('id, email, full_name, role, password_hash, kyc_completed, stockpick_plan, stockspick_credits, force_password_change')
      .eq('email', normalizedEmail)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Email không tồn tại trong hệ thống' }, { status: 401 })
    }

    // Verify password with same SHA-256 method as advisor login
    const hashedInput = await hashPassword(password)
    if (hashedInput !== user.password_hash) {
      return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
    }

    // Determine tier based on stockpick_plan column
    const plan = user.stockpick_plan || 'free'
    let tier: 'FREE' | 'BRONZE' | 'SILVER' = 'FREE'
    if (plan === 'silver') tier = 'SILVER'
    else if (plan === 'bronze') tier = 'BRONZE'

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || normalizedEmail.split('@')[0],
        role: user.role,
        tier,
        credits: user.stockspick_credits || 0,
        kyc_completed: user.kyc_completed,
        requires_password_change: user.force_password_change || false,
      }
    })
  } catch (err) {
    console.error('StockPick login error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

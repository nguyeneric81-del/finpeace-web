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
    const { email, password, fullName } = await req.json()
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ Email và Mật khẩu' }, { status: 400 })
    }

    const hashedInput = await hashPassword(password)

    // Check if user already exists
    const { data: existing } = await supabase
      .from('stockpick2_users')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Email này đã được đăng ký tài khoản StockPicks 2.0' }, { status: 400 })
    }

    // Insert new user
    const { data: newUser, error: regError } = await supabase
      .from('stockpick2_users')
      .insert({
        email: normalizedEmail,
        password_hash: hashedInput,
        full_name: fullName || normalizedEmail.split('@')[0],
        tier: 'SILVER',
        credits: 500
      })
      .select()
      .single()

    if (regError || !newUser) {
      console.error('Registration error:', regError)
      return NextResponse.json({ error: 'Không thể đăng ký tài khoản. Vui lòng thử lại.' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name || normalizedEmail.split('@')[0],
        tier: newUser.tier || 'SILVER',
        credits: newUser.credits || 500,
        role: 'STOCKPICK2_USER'
      }
    })
  } catch (err) {
    console.error('StockPick2 register error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

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

    const hashedInput = await hashPassword(password)

    // Check dedicated stockpick2_users table first
    const { data: user, error } = await supabase
      .from('stockpick2_users')
      .select('id, email, full_name, tier, credits, password_hash')
      .eq('email', normalizedEmail)
      .single()

    if (error || !user) {
      // Auto-register new user into stockpick2_users if logging in for first time in StockPicks 2.0
      const { data: newUser, error: regError } = await supabase
        .from('stockpick2_users')
        .insert({
          email: normalizedEmail,
          password_hash: hashedInput,
          full_name: normalizedEmail.split('@')[0],
          tier: 'SILVER',
          credits: 500
        })
        .select()
        .single()

      if (regError || !newUser) {
        return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
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
    }

    // Verify password if user exists
    if (user.password_hash !== 'temp_placeholder' && user.password_hash !== hashedInput) {
      return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
    }

    // Update password_hash if it was placeholder
    if (user.password_hash === 'temp_placeholder') {
      await supabase.from('stockpick2_users').update({ password_hash: hashedInput }).eq('id', user.id)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || normalizedEmail.split('@')[0],
        tier: user.tier || 'SILVER',
        credits: user.credits || 500,
        role: 'STOCKPICK2_USER'
      }
    })
  } catch (err) {
    console.error('StockPick2 login error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

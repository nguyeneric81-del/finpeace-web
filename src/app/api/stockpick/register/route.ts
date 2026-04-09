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
    const { email, password, full_name } = await req.json()
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải từ 6 ký tự trở lên' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('advisor_users')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã được đăng ký. Vui lòng đăng nhập.' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Determine fallback name
    const defaultName = full_name || normalizedEmail.split('@')[0]

    // Create user in advisor_users (StockPicks customer role)
    const { data: newUser, error: insertError } = await supabase
      .from('advisor_users')
      .insert({
        email: normalizedEmail,
        password_hash: hashedPassword,
        full_name: defaultName,
        role: 'customer', // Phải dùng 'customer' theo DB Schema 
        stockpick_plan: 'free',
        stockspick_credits: 3 // Default free credits
      })
      .select('id, email, full_name, role, stockpick_plan, stockspick_credits, kyc_completed')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Lỗi khi tạo tài khoản' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
        tier: 'FREE',
        credits: newUser.stockspick_credits || 3,
        kyc_completed: newUser.kyc_completed || false,
      }
    })
  } catch (err) {
    console.error('StockPick register error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

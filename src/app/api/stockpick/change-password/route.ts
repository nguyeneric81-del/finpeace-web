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
    const { userId, newPassword } = await req.json()

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }, { status: 400 })
    }

    // Verify user exists and requires a change (optional security check)
    const { data: user, error: fetchError } = await supabase
      .from('advisor_users')
      .select('id, force_password_change')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại.' }, { status: 404 })
    }

    const hashedPassword = await hashPassword(newPassword)

    const { error: updateError } = await supabase
      .from('advisor_users')
      .update({ 
        password_hash: hashedPassword, 
        force_password_change: false 
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Update password error:', updateError)
      return NextResponse.json({ error: 'Lỗi máy chủ khi cập nhật mật khẩu.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công.' })
  } catch (err) {
    console.error('Change password route error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

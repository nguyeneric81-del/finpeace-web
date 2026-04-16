import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 12))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let pass = ''
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pass
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Vui lòng nhập email.' }, { status: 400 })
    }

    // Check if email exists
    const { data: existingUser } = await supabase
      .from('advisor_users')
      .select('id, full_name')
      .eq('email', normalizedEmail)
      .single()

    if (!existingUser) {
      return NextResponse.json({ error: 'Email không tồn tại trong hệ thống.' }, { status: 404 })
    }

    // Generate new password
    const newPassword = generateRandomPassword()
    const hashedPassword = await hashPassword(newPassword)

    // Update the DB
    const { error: updateError } = await supabase
      .from('advisor_users')
      .update({ password_hash: hashedPassword, force_password_change: true })
      .eq('id', existingUser.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Lỗi khi cập nhật mật khẩu.' }, { status: 500 })
    }

    // Send email using Resend
    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'FinPeace Advisor <advisor@finpeace.cloud>',
      to: [normalizedEmail],
      subject: 'Mật khẩu mới cho StockPicks 2.0 (FinPeace)',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #111;">
          <h2>Hỗ trợ lấy lại mật khẩu</h2>
          <p>Chào <b>${existingUser.full_name || 'bạn'}</b>,</p>
          <p>Mật khẩu đăng nhập StockPicks 2.0 của bạn đã được khởi tạo lại theo yêu cầu.</p>
          <br/>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 20px; letter-spacing: 2px;">
            <strong style="color: #10B981;">${newPassword}</strong>
          </div>
          <br/>
          <p>Vui lòng đăng nhập bằng mật khẩu trên. Bạn nên đổi lại mật khẩu khác nếu muốn an toàn hơn.</p>
          <p>Trân trọng,<br/><b>FinPeace Support Team</b></p>
        </div>
      `
    })

    if (emailError) {
      console.error('Email send error:', emailError)
      return NextResponse.json({ error: 'Mật khẩu đã đổi nhưng không thể gửi email. Vui lòng liên hệ hỗ trợ.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Đã gửi mật khẩu mới qua Email!' })
  } catch (err) {
    console.error('StockPick forgot password error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}

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
  const { customerId, newPassword } = await req.json()
  if (!customerId || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabase
    .from('sip_customers')
    .update({ password_hash: hashPassword(newPassword), updated_at: new Date().toISOString() })
    .eq('id', customerId)

  if (error) {
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

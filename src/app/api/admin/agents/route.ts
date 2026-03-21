import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// GET /api/admin/agents — list all active sales agents
export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('sales_agents')
    .select('id, code, full_name, brand_name, brand_color_accent, active, agent_type')
    .eq('active', true)
    .order('code', { ascending: true })

  if (error) {
    return NextResponse.json({ agents: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agents: data ?? [] })
}

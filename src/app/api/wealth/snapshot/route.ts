import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/wealth/snapshot?user_id=xxx&limit=24
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('user_id')
    const limit = Number(req.nextUrl.searchParams.get('limit') || '24')

    if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

    const { data, error } = await supabase
        .from('financial_snapshots')
        .select('*')
        .eq('user_id', userId)
        .order('snapshot_date', { ascending: true })
        .limit(limit)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ snapshots: data || [] })
}

// POST /api/wealth/snapshot — lưu snapshot mới
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { user_id, period_label, cashflow, assets, net_worth, notes } = body

        if (!user_id || !cashflow || !assets) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('financial_snapshots')
            .insert({
                user_id,
                snapshot_date: today,
                period_label: period_label || `T${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                cashflow,
                assets,
                net_worth: net_worth || 0,
                notes: notes || null
            })
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true, snapshot: data })
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

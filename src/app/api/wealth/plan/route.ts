import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/wealth/plan?user_id=xxx
export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('user_id')
    if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

    const { data, error } = await supabase
        .from('financial_plans')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ plan: data })
}

// POST /api/wealth/plan — upsert plan
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { user_id, goal_name, target_amount, timeline_years, initial_capital, expected_return, required_monthly_saving, committed_asset_ids, scenario_type } = body

        if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

        const { data, error } = await supabase
            .from('financial_plans')
            .upsert({
                user_id,
                goal_name,
                target_amount,
                timeline_years,
                initial_capital,
                expected_return,
                required_monthly_saving,
                committed_asset_ids: committed_asset_ids || [],
                scenario_type: scenario_type || 'balanced',
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true, plan: data })
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

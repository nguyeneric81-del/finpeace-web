import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: lấy danh sách
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'plans' | 'pending'

    if (type === 'pending') {
        const { data, error } = await supabase
            .from('pending_tickers')
            .select('*')
            .order('requested_count', { ascending: false })
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    // default: trading plans
    const { data, error } = await supabase
        .from('trading_plans')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// POST: tạo/sửa plan hoặc update pending status
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { action, ...payload } = body

        if (action === 'upsert_plan') {
            // Chỉ giữ lại các trường có giá trị, bỏ trường rỗng/undefined
            const cleanPayload: Record<string, any> = {}
            const ALLOWED_FIELDS = [
                'ticker', 'company_name', 'strategy_name', 'timeframe',
                'entry_zone', 'stop_loss', 'take_profit', 'risk_reward',
                'max_position_pct', 'indicators', 'entry_criteria', 'exit_criteria',
                'analyst_note', 'status', 'chart_image_url'
            ]
            for (const key of ALLOWED_FIELDS) {
                if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
                    cleanPayload[key] = payload[key]
                }
            }

            if (payload.id) {
                const { data, error } = await supabase
                    .from('trading_plans')
                    .update({ ...cleanPayload, updated_at: new Date().toISOString() })
                    .eq('id', payload.id)
                    .select().single()
                if (error) {
                    console.error('[Admin] update_plan error:', error)
                    return NextResponse.json({ error: error.message }, { status: 500 })
                }
                return NextResponse.json(data)
            } else {
                const { data, error } = await supabase
                    .from('trading_plans')
                    .insert({ ...cleanPayload, status: cleanPayload.status || 'active' })
                    .select().single()
                if (error) {
                    console.error('[Admin] insert_plan error:', error)
                    return NextResponse.json({ error: error.message }, { status: 500 })
                }
                return NextResponse.json(data)
            }
        }

        if (action === 'delete_plan') {
            const { error } = await supabase.from('trading_plans').delete().eq('id', payload.id)
            if (error) return NextResponse.json({ error: error.message }, { status: 500 })
            return NextResponse.json({ success: true })
        }

        if (action === 'update_pending_status') {
            const { data, error } = await supabase
                .from('pending_tickers')
                .update({ status: payload.status, updated_at: new Date().toISOString() })
                .eq('id', payload.id)
                .select().single()
            if (error) return NextResponse.json({ error: error.message }, { status: 500 })
            return NextResponse.json(data)
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (err) {
        console.error('[Admin] POST error:', err)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT: upload chart image cho trading plan
export async function PUT(req: NextRequest) {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const planId = formData.get('plan_id') as string

    if (!file || !planId) return NextResponse.json({ error: 'Thiếu file hoặc plan_id' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const fileName = `charts/${planId}/${Date.now()}.${ext}`

    // Ensure bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    if (!buckets?.some(b => b.name === 'advisor-charts')) {
        await supabase.storage.createBucket('advisor-charts', { public: true })
    }

    const { data: uploaded, error: uploadError } = await supabase.storage
        .from('advisor-charts')
        .upload(fileName, file, { contentType: file.type, upsert: true })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const chartUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/advisor-charts/${uploaded.path}`

    // Cập nhật trading_plans với chart_image_url
    const { error: updateError } = await supabase
        .from('trading_plans')
        .update({ chart_image_url: chartUrl, updated_at: new Date().toISOString() })
        .eq('id', planId)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    return NextResponse.json({ success: true, chart_image_url: chartUrl })
}

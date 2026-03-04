import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// GET: lấy danh sách
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'plans' | 'pending'

    if (type === 'pending') {
        const { data: pendingData, error: pendingError } = await supabase
            .from('pending_tickers')
            .select('*')
            .order('requested_count', { ascending: false })
        if (pendingError) return NextResponse.json({ error: pendingError.message }, { status: 500 })

        // Lọc bỏ những mã đã có trading plan active
        const { data: activePlans } = await supabase
            .from('trading_plans')
            .select('ticker')
            .eq('status', 'active')

        const activeTickers = new Set((activePlans || []).map((p: any) => p.ticker))
        const filteredPending = (pendingData || []).filter(p => !activeTickers.has(p.ticker))

        return NextResponse.json(filteredPending)
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
            const cleanPayload: Record<string, any> = {}
            const ALLOWED_FIELDS = [
                'ticker', 'company_name', 'strategy_name', 'timeframe',
                'entry_zone', 'stop_loss', 'take_profit', 'risk_reward',
                'max_position_pct', 'indicators', 'entry_criteria', 'exit_criteria',
                'analyst_note', 'status', 'chart_image_url',
                'wave_index', 'area_symmetry_note', 'is_confirmed', 'price_series'
            ]
            for (const key of ALLOWED_FIELDS) {
                if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
                    cleanPayload[key] = payload[key]
                }
            }

            // Xác định status dựa trên is_confirmed
            const planStatus = cleanPayload.is_confirmed ? 'active' : 'draft'
            const finalPayload: any = { ...cleanPayload, status: planStatus }

            // Logic ghi đè (Ticker-based overwrite):
            // Chỉ archive bản cũ nếu bản mới này được publish (active)
            if (finalPayload.ticker && (!payload.id) && planStatus === 'active') {
                await supabase
                    .from('trading_plans')
                    .update({ status: 'archived' })
                    .eq('ticker', finalPayload.ticker)
                    .eq('status', 'active')
            }

            if (payload.id) {
                const { data, error } = await supabase
                    .from('trading_plans')
                    .update(finalPayload)
                    .eq('id', payload.id)
                    .select().single()
                if (error) return NextResponse.json({ error: error.message }, { status: 500 })
                return NextResponse.json(data)
            } else {
                const { data, error } = await supabase
                    .from('trading_plans')
                    .insert(finalPayload)
                    .select().single()
                if (error) return NextResponse.json({ error: error.message }, { status: 500 })
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

    let draft_plan = {}
    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const base64Image = buffer.toString('base64')

        const completion = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-preview",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Bạn là trợ lý phân tích đồ thị chứng khoán chuyên nghiệp. Hãy đọc đồ thị này và trả về 1 JSON hợp lệ với cấu trúc sau:
{
  "strategy_name": "Tên chiến lược ngắn gọn (VD: Vượt cản, Tích lũy đáy)",
  "entry_zone": "Mức giá điểm vào (khoảng giá)",
  "stop_loss": "Mức giá cắt lỗ",
  "take_profit": "Mức giá chốt lời",
  "wave_index": "Tình trạng sóng (VD: Trending 3, Sideway 4)",
  "area_symmetry_note": "Ghi chú tương xứng diện tích/thời gian",
  "analyst_note": "Vài dòng phân tích lý do chọn điểm vào này.",
  "price_series": [mảng CHÍNH XÁC 20 số]
}
QUAN TRỌNG VỀ 'price_series': Hãy dùng mắt ước lượng hình dạng đường giá (đóng cửa/thân nến) từ trái qua phải trên toàn bộ đồ thị, chia đều thành 20 điểm thời gian. Mỗi điểm là 1 con số tương đối phản ánh ĐỘ CAO của giá so với trục tung bên phải. Ví dụ: [60, 62, 59, 65, ...]. Đảm bảo có đúng 20 phần tử số. TRẢ VỀ DUY NHẤT CHUỖI JSON.`
                        },
                        {
                            type: 'image_url',
                            image_url: { url: `data:${file.type};base64,${base64Image}` }
                        }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 1500,
        })

        let aiText = completion.choices[0]?.message?.content || ''
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim()
        draft_plan = JSON.parse(aiText)
    } catch (err) {
        console.error('[Admin Groq Vision Error]:', err)
        // Fallback
        draft_plan = {
            strategy_name: 'Dự thảo tự động',
            analyst_note: 'AI cập nhật lỗi, vui lòng điền thủ công.'
        }
    }

    return NextResponse.json({ success: true, chart_image_url: chartUrl, draft_plan })
}

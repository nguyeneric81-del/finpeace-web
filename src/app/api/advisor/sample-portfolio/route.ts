import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'

const SECTOR_MAP: Record<string, string> = {
    'TCB': 'Ngân hàng', 'VCB': 'Ngân hàng', 'VIB': 'Ngân hàng', 'MBB': 'Ngân hàng',
    'SSI': 'Chứng khoán', 'VND': 'Chứng khoán', 'VDS': 'Chứng khoán', 'VIX': 'Chứng khoán',
    'HPG': 'Thép - Vật liệu', 'NKG': 'Thép - Vật liệu', 'HSG': 'Thép - Vật liệu',
    'VHM': 'Bất động sản', 'NVL': 'Bất động sản', 'KDH': 'Bất động sản',
    'MSN': 'Bán lẻ - Tiêu dùng', 'MWG': 'Bán lẻ - Tiêu dùng',
    'CTD': 'Xây dựng', 'HBC': 'Xây dựng',
    'CTR': 'Công nghệ - Viễn thông', 'FPT': 'Công nghệ - Viễn thông',
    'HAH': 'Cảng biển - Logistics', 'VSC': 'Cảng biển - Logistics',
    'VJC': 'Hàng không', 'HVN': 'Hàng không',
    'POW': 'Năng lượng', 'GAS': 'Năng lượng',
    'PAC': 'Hoá chất - Pin', 'DCL': 'Dược phẩm'
}

const RATIONALE_MAP: Record<string, string> = {
    'aggressive': 'Danh mục đề xuất tập trung vào các cổ phiếu có hệ số Beta cao, thuộc nhóm Chứng Khoán, Bất Động Sản hoặc nhóm có câu chuyện dòng tiền mạnh. Phù hợp với tính cách quyết đoán, luôn tối ưu hoá hiệu suất vốn để nắm bắt các cơ hội nóng nhất của thị trường.',
    'growth': 'Tuyển tập các doanh nghiệp có vị thế đột phá, vốn hoá tầm trung lên lớn, cấu trúc biểu đồ xác nhận vào chu kỳ tăng trưởng. Phù hợp với tính cách nhiệt tình, cởi mở với các cơ hội sinh lời dựa vào động lực phát triển mới của doanh nghiệp.',
    'balanced': 'Danh mục được thiết kế theo tỷ lệ cân bằng giữa nhóm phòng thủ và tấn công. Phù hợp với sự kiên nhẫn, điềm tĩnh và kỷ luật của bạn, tối ưu lợi nhuận mà vẫn duy trì biên độ an toàn cực cao.',
    'conservative': 'Ưu tiên tuyệt đối các cổ phiếu đầu ngành (Bluechip/VN30), nền tảng cơ bản cực tốt, rủi ro biến động thấp nhất thị trường. Bám sát cá tính tư duy hệ thống và nguyên tắc thận trọng, bảo vệ vốn là ưu tiên số một.'
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('investor_type') || 'balanced'

    const { data: plans } = await supabase.from('trading_plans').select('*').eq('status', 'active')
    if (!plans || plans.length === 0) return NextResponse.json({ result: [] })

    const { data: signals } = await supabase
        .from('price_signals')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        
    const latestSignals = signals || []

    const enhancedPlans = plans.map(p => {
        const signal = latestSignals.find(s => s.ticker === p.ticker)
        return {
            ...p,
            sector: SECTOR_MAP[p.ticker] || 'Khác',
            latest_signal: signal ? {
                type: signal.signal_type,
                label: signal.signal_label,
                current_price: signal.current_price,
                detail: signal.signal_detail
            } : null
        }
    })

    let candidates = enhancedPlans.filter(p => p.latest_signal?.type === 'consider_buy')
    
    if (candidates.length < 3) {
        const waitPullbacks = enhancedPlans.filter(p => p.latest_signal?.type === 'wait_pullback')
        candidates = [...candidates, ...waitPullbacks]
    }
    
    if (candidates.length < 3) {
        const others = enhancedPlans.filter(p => p.latest_signal?.type !== 'consider_buy' && p.latest_signal?.type !== 'wait_pullback')
        candidates = [...candidates, ...others]
    }

    const selected = []
    const usedSectors = new Set<string>()

    for (const plan of candidates) {
        if (!usedSectors.has(plan.sector)) {
            selected.push(plan)
            usedSectors.add(plan.sector)
        }
        if (selected.length === 3) break
    }

    if (selected.length < 3) {
        for (const plan of candidates) {
            if (!selected.find(s => s.ticker === plan.ticker)) {
                selected.push(plan)
            }
            if (selected.length === 3) break
        }
    }

    return NextResponse.json({
        result: selected,
        rationale: RATIONALE_MAP[type] || RATIONALE_MAP['balanced'],
        investor_type: type
    })
}

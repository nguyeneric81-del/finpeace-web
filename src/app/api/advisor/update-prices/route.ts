import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PRICE_UPDATE_SECRET = process.env.PRICE_UPDATE_SECRET || 'finpeace-price-secret-2026'

// ── Helpers: parse TEXT → số ──
function parsePrice(text: string | null): number | null {
    if (!text) return null
    const cleaned = text.replace(/[^0-9.,\-]/g, '')
    const match = cleaned.replace(/,/g, '').match(/[\d.]+/)
    if (!match) return null
    let val = parseFloat(match[0])
    // If > 500, it's stored as full VND (e.g. 12200) → convert to thousands VND (12.2)
    if (val > 500) val = val / 1000
    return val
}


function parseRange(text: string | null): [number | null, number | null] {
    if (!text) return [null, null]
    // VD: "55,000 - 57,000" → [55000, 57000]
    const nums = text.replace(/,/g, '').match(/[\d.]+/g)
    if (!nums || nums.length === 0) return [null, null]
    if (nums.length === 1) {
        const v = parseFloat(nums[0])
        return [v, v]
    }
    return [parseFloat(nums[0]), parseFloat(nums[nums.length - 1])]
}

// ── Signal logic ──
type SignalType = 'reduce' | 'consider_buy' | 'wait_pullback' | 'sell' | 'take_profit' | 'unknown'

interface Signal {
    ticker: string
    current_price: number
    signal_type: SignalType
    signal_label: string
    signal_detail: string
    plan_entry_low: number | null
    plan_entry_high: number | null
    plan_sl: number | null
    plan_tp: number | null
}

function generateSignal(
    ticker: string,
    price: number,
    plan: { entry_zone: string | null; stop_loss: string | null; take_profit: string | null }
): Signal {
    const [entryLow, entryHigh] = parseRange(plan.entry_zone)
    const sl = parsePrice(plan.stop_loss)
    const tp = parsePrice(plan.take_profit)

    const base: Signal = {
        ticker,
        current_price: price,
        signal_type: 'unknown',
        signal_label: '—',
        signal_detail: '',
        plan_entry_low: entryLow,
        plan_entry_high: entryHigh,
        plan_sl: sl,
        plan_tp: tp,
    }

    const fmt = (n: number) => n.toLocaleString('vi-VN')

    // Cần ít nhất SL hoặc Entry để tạo tín hiệu
    if (!sl && !entryLow) {
        base.signal_type = 'unknown'
        base.signal_label = 'Thiếu dữ liệu tham chiếu'
        return base
    }

    if (sl && price < sl) {
        return {
            ...base,
            signal_type: 'reduce',
            signal_label: '⚠️ Cân nhắc giảm tỷ trọng',
            signal_detail: `Giá hiện tại ${fmt(price)} thấp hơn ngưỡng Stop Loss ${fmt(sl)}. FinPeace khuyến nghị xem xét giảm tỷ trọng hoặc cắt lỗ để bảo toàn vốn.`,
        }
    }

    if (tp && price >= tp * 1.0) {
        const isWayAbove = price > tp * 1.03
        if (isWayAbove) {
            return {
                ...base,
                signal_type: 'take_profit',
                signal_label: '🎉 Chốt lời — Vượt khung dự báo',
                signal_detail: `Giá ${fmt(price)} đã vượt mục tiêu Take Profit ${fmt(tp)}. Lợi nhuận ngắn hạn vượt khung dự báo — FinPeace khuyến nghị chốt lời ngay.`,
            }
        } else {
            return {
                ...base,
                signal_type: 'sell',
                signal_label: '💰 Khuyến nghị bán',
                signal_detail: `Giá ${fmt(price)} xấp xỉ mục tiêu Take Profit ${fmt(tp)}. Đây là thời điểm hợp lý để hiện thực hóa lợi nhuận theo kế hoạch.`,
            }
        }
    }

    if (entryHigh && price > entryHigh * 1.01) {
        return {
            ...base,
            signal_type: 'wait_pullback',
            signal_label: '⏳ Chờ điều chỉnh về vùng mua',
            signal_detail: `Giá ${fmt(price)} đang cao hơn vùng Entry (${fmt(entryLow ?? 0)}-${fmt(entryHigh)}). FinPeace khuyến nghị chờ điều chỉnh về vùng mua trước khi vào lệnh.`,
        }
    }

    if (entryLow && price <= entryLow) {
        return {
            ...base,
            signal_type: 'consider_buy',
            signal_label: '✅ Có thể cân nhắc mua',
            signal_detail: `Giá ${fmt(price)} đang nằm tại/dưới vùng Entry (${fmt(entryLow)}-${fmt(entryHigh ?? entryLow)}). Đây là vùng giá hấp dẫn theo Trading Plan — có thể cân nhắc tích lũy.`,
        }
    }

    // Giá nằm trong vùng entry
    if (entryLow && entryHigh && price >= entryLow && price <= entryHigh) {
        return {
            ...base,
            signal_type: 'consider_buy',
            signal_label: '✅ Đang trong vùng mua',
            signal_detail: `Giá ${fmt(price)} đang nằm trong vùng Entry (${fmt(entryLow)}-${fmt(entryHigh)}). Điều kiện phù hợp để tích lũy theo kế hoạch.`,
        }
    }

    return base
}

// ── POST handler ──
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { secret, prices } = body

        if (secret !== PRICE_UPDATE_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!prices || !Array.isArray(prices) || prices.length === 0) {
            return NextResponse.json({ error: 'Thiếu dữ liệu prices' }, { status: 400 })
        }

        const normalizedPrices = prices.map((p: any) => {
            let num = typeof p.price === 'string' ? parseFloat(p.price.replace(/,/g, '')) : Number(p.price)
            if (isNaN(num)) num = 0
            if (num > 500) num = num / 1000
            return {
                ...p,
                price: parseFloat(num.toFixed(2))
            }
        })

        const today = new Date().toISOString().split('T')[0]
        const tickers = normalizedPrices.map((p: any) => p.ticker)

        // Lấy trading plans của các tickers này
        const { data: plans } = await supabase
            .from('trading_plans')
            .select('ticker, entry_zone, stop_loss, take_profit')
            .in('ticker', tickers)
            .eq('status', 'active')

        const planMap = new Map((plans || []).map(p => [p.ticker, p]))

        // Upsert giá vào stock_prices
        const priceRows = normalizedPrices.map((p: any) => ({
            ticker: p.ticker,
            price: p.price,
            date: today,
            source: 'tcbs',
            updated_at: new Date().toISOString(),
        }))
        await supabase.from('stock_prices').upsert(priceRows, { onConflict: 'ticker,date' })

        // Generate & upsert signals
        const signalRows: any[] = []
        for (const { ticker, price } of normalizedPrices) {
            const plan = planMap.get(ticker)
            if (!plan) continue

            // VPS returns price in thousands VND (12.6 = 12,600đ) — parsePrice normalizes the plan's entry/sl/tp to same unit
            const sig = generateSignal(ticker, price, plan)
            if (sig.signal_type === 'unknown') continue

            signalRows.push({
                ticker: sig.ticker,
                current_price: sig.current_price,
                signal_type: sig.signal_type,
                signal_label: sig.signal_label,
                signal_detail: sig.signal_detail,
                plan_entry_low: sig.plan_entry_low,
                plan_entry_high: sig.plan_entry_high,
                plan_sl: sig.plan_sl,
                plan_tp: sig.plan_tp,
                date: today,
                generated_at: new Date().toISOString(),
            })
        }

        if (signalRows.length > 0) {
            await supabase.from('price_signals').upsert(signalRows, { onConflict: 'ticker,date' })
        }

        return NextResponse.json({
            success: true,
            message: `Đã cập nhật ${priceRows.length} giá, tạo ${signalRows.length} tín hiệu`,
            prices_count: priceRows.length,
            signals_count: signalRows.length,
            date: today,
        })

    } catch (err) {
        console.error('update-prices error:', err)
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
    }
}

// ── GET: Xem signals hôm nay (dùng cho dashboard) ──
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const { data: signals } = await supabase
        .from('price_signals')
        .select('*')
        .eq('date', date)
        .order('signal_type')

    const { data: prices } = await supabase
        .from('stock_prices')
        .select('ticker, price, updated_at')
        .eq('date', date)

    return NextResponse.json({ signals: signals || [], prices: prices || [], date })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { calculateMinimumVariancePortfolio } from '@/lib/portfolioOptimizer'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BUCKET_NAME = 'advisor-portfolios'
const AI_TIMEOUT_MS = 55_000 // 55s — dưới giới hạn Vercel 60s

async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some(b => b.name === BUCKET_NAME)
    if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, { public: true })
    }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout sau ${ms / 1000}s (${label})`)), ms)
        )
    ])
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const imageFile = formData.get('image') as File
        const userId = formData.get('user_id') as string

        if (!imageFile) {
            return NextResponse.json({ error: 'Không có ảnh được upload' }, { status: 400 })
        }

        const imageBytes = await imageFile.arrayBuffer()
        const imageBase64 = Buffer.from(imageBytes).toString('base64')
        const mimeType = imageFile.type as string

        // ── Bước 1+2: Song song hoá Storage upload & Gemini Vision ──
        const uploadTask = (async () => {
            try {
                await ensureBucket()
                const fileName = `portfolios/${userId || 'anonymous'}/${Date.now()}_${imageFile.name}`
                const { data: storageData } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(fileName, imageFile, { contentType: mimeType, upsert: false })
                return storageData?.path
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storageData.path}`
                    : null
            } catch (e) {
                console.warn('Storage upload failed (non-critical):', e)
                return null
            }
        })()

        const geminiTask = (async () => {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
            const prompt = `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam.\n\nNhiệm vụ:\n1. Liệt kê tất cả các mã chứng khoán (tickers).\n2. Trích xuất "Giá vốn" (Avg Cost) và "Giá hiện tại" (Current Price) cho từng mã nếu có.\n3. Phân tích cơ cấu danh mục.\n\nYêu cầu trả về định dạng JSON duy nhất:\n{\n  "items": [\n    {"ticker": "VNM", "avg_cost": 72.5, "current_price": 71.2},\n    {"ticker": "HPG", "avg_cost": 28.1, "current_price": 30.5}\n  ],\n  "assessment": {\n    "summary": "Mô tả phong cách danh mục...",\n    "sectors": ["Ngân hàng (VCB)", "Công nghệ (FPT)", "..."],\n    "risk_level": "Trung bình / Cao / Thấp",\n    "advice": "Lời khuyên chiến lược..."\n  }\n}\n\n- Chỉ trả về JSON, không thêm text giải thích.`

            const result = await model.generateContent([
                prompt,
                { inlineData: { data: imageBase64, mimeType } }
            ])
            const rawText = result.response.text().trim()
            const jsonMatch = rawText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0])
            }
            return { items: [], assessment: null }
        })()

        // Race cả 2 tác vụ nặng với timeout 55s
        let imageUrl: string | null = null
        let extractedData: any = { items: [], assessment: null }

        try {
            const [uploadResult, geminiResult] = await withTimeout(
                Promise.all([uploadTask, geminiTask]),
                AI_TIMEOUT_MS,
                'Gemini + Storage'
            )
            imageUrl = uploadResult
            extractedData = geminiResult
        } catch (err: any) {
            console.error('[analyze-portfolio] Timeout hoặc lỗi AI:', err.message)
            // Nếu timeout → trả lỗi có nghĩa ngay thay vì treo
            if (err.message?.includes('Timeout')) {
                return NextResponse.json({
                    error: 'Phân tích mất quá lâu. Vui lòng thử lại với ảnh nhỏ hơn hoặc rõ hơn.'
                }, { status: 504 })
            }
        }

        const extractedTickers: string[] = (extractedData.items || []).map((i: any) => i.ticker.toUpperCase())
        let allocationAssessment: any = extractedData.assessment || {
            summary: 'Chưa có đánh giá', sectors: [], risk_level: 'N/A', advice: ''
        }

        // ── Bước 3: Match với Trading Plans ──
        const { data: plans } = await supabase
            .from('trading_plans')
            .select('*')
            .in('ticker', extractedTickers.length > 0 ? extractedTickers : ['__none__'])
            .eq('status', 'active')

        const matchedPlans = plans || []
        const matchedTickers = matchedPlans.map((p: any) => p.ticker)
        const pendingTickers = extractedTickers.filter((t: string) => !matchedTickers.includes(t))

        // Logic Nâng cao: Risk Alerts & Balance
        const risk_alerts: string[] = []
        const profit_opportunities: string[] = []
        let trendingCount = 0
        let sidewayCount = 0

        matchedPlans.forEach(plan => {
            const item = (extractedData.items || []).find((i: any) => i.ticker.toUpperCase() === plan.ticker)
            const cost = item?.avg_cost || item?.current_price
            const sl = parseFloat(plan.stop_loss?.replace(/[^0-9.]/g, ''))
            const tp = parseFloat(plan.take_profit?.replace(/[^0-9.]/g, ''))
            if (cost && sl && cost <= sl * 1.03 && cost >= sl * 0.97) {
                risk_alerts.push(`Mã ${plan.ticker} đang gần vùng Stop Loss (${plan.stop_loss}). Cần lưu ý quản trị rủi ro.`)
            }
            if (cost && tp && cost >= tp * 0.95) {
                profit_opportunities.push(`Mã ${plan.ticker} đang tiến sát mục tiêu Take Profit (${plan.take_profit}). Cân nhắc hiện thực hóa lợi nhuận.`)
            }
            const strategy = (plan.strategy_name || '').toLowerCase()
            if (strategy.includes('sideway')) sidewayCount++
            else if (strategy.includes('trending')) trendingCount++
        })

        let balance_note = ''
        const totalIdentified = trendingCount + sidewayCount
        if (totalIdentified > 0) {
            const trendingPct = (trendingCount / totalIdentified) * 100
            if (trendingPct > 80) balance_note = 'Danh mục đang nghiêng hẳn về phía Tấn công (Trending). Cần bổ sung các mã Sideway/Phòng vệ để cân bằng.'
            else if (trendingPct < 20) balance_note = 'Danh mục đang quá nặng về các mã Sideway. Có thể bỏ lỡ cơ hội khi thị trường vào sóng tăng mạnh.'
            else balance_note = 'Danh mục có sự kết hợp khá cân bằng giữa các vị thế Trending và Sideway.'
        }

        let optimalAllocation = null
        if (matchedPlans.length >= 2) {
            const optResult = await calculateMinimumVariancePortfolio(matchedPlans)
            if (!optResult.error) optimalAllocation = optResult
        }

        allocationAssessment = {
            ...allocationAssessment,
            risk_alerts,
            profit_opportunities,
            optimal_allocation: optimalAllocation,
            balance_assessment: { trending_count: trendingCount, sideway_count: sidewayCount, note: balance_note }
        }

        // ── Bước 4: Batch upsert pending_tickers (1 query thay vì N) ──
        if (pendingTickers.length > 0) {
            // Lấy tất cả existing trong 1 query
            const { data: existingRows } = await supabase
                .from('pending_tickers')
                .select('id, ticker, requested_count, requester_ids')
                .in('ticker', pendingTickers)

            const existingMap = new Map((existingRows || []).map(r => [r.ticker, r]))

            const upsertRows = pendingTickers.map(ticker => {
                const existing = existingMap.get(ticker)
                if (existing) {
                    return {
                        id: existing.id,
                        ticker,
                        requested_count: existing.requested_count + 1,
                        requester_ids: userId
                            ? [...(existing.requester_ids || []), userId]
                            : existing.requester_ids,
                        status: 'pending'
                    }
                }
                return {
                    ticker,
                    requested_count: 1,
                    requester_ids: userId ? [userId] : [],
                    status: 'pending'
                }
            })

            await supabase.from('pending_tickers').upsert(upsertRows, { onConflict: 'ticker' })
        }

        // ── Bước 5: Lưu portfolio record ──
        if (userId) {
            const { error: portfolioErr } = await supabase.from('customer_portfolios').insert({
                user_id: userId,
                image_url: imageUrl,
                extracted_tickers: extractedTickers,
                allocation_assessment: allocationAssessment
            })
            if (portfolioErr) console.error('[Portfolio] Save failed:', portfolioErr)
        }

        return NextResponse.json({
            success: true,
            extracted_tickers: extractedTickers,
            matched_plans: plans || [],
            pending_tickers: pendingTickers,
            allocation_assessment: allocationAssessment
        })

    } catch (err) {
        console.error('Analyze portfolio error:', err)
        return NextResponse.json({ error: 'Lỗi phân tích ảnh, vui lòng thử lại.' }, { status: 500 })
    }
}

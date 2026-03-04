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

async function ensureBucket() {
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some(b => b.name === BUCKET_NAME)
    if (!exists) {
        await supabase.storage.createBucket(BUCKET_NAME, { public: true })
    }
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

        // ── Bước 1: Upload ảnh lên Supabase Storage (non-critical) ──
        let imageUrl: string | null = null
        try {
            await ensureBucket()
            const fileName = `portfolios/${userId || 'anonymous'}/${Date.now()}_${imageFile.name}`
            const { data: storageData } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, imageFile, { contentType: mimeType, upsert: false })
            imageUrl = storageData?.path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storageData.path}`
                : null
        } catch (uploadErr) {
            console.warn('Storage upload failed (non-critical):', uploadErr)
        }

        // ── Bước 2: Gemini Vision đọc ảnh ──
        let extractedData: any = { tickers: [], assessment: null, items: [] }
        let allocationAssessment: any = null
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            const prompt = `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam.\n\nNhiệm vụ:\n1. Liệt kê tất cả các mã chứng khoán (tickers).\n2. Trích xuất "Giá vốn" (Avg Cost) và "Giá hiện tại" (Current Price) cho từng mã nếu có.\n3. Phân tích cơ cấu danh mục.\n\nYêu cầu trả về định dạng JSON duy nhất:\n{\n  "items": [\n    {"ticker": "VNM", "avg_cost": 72.5, "current_price": 71.2},\n    {"ticker": "HPG", "avg_cost": 28.1, "current_price": 30.5}\n  ],\n  "assessment": {\n    "summary": "Mô tả phong cách danh mục...",\n    "sectors": ["Ngân hàng (VCB)", "Công nghệ (FPT)", "..."],\n    "risk_level": "Trung bình / Cao / Thấp",\n    "advice": "Lời khuyên chiến lược..."\n  }\n}\n\n- Chỉ trả về JSON, không thêm text giải thích.`

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType
                    }
                }
            ]);

            const rawText = result.response.text().trim();
            try {
                const jsonMatch = rawText.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    extractedData = JSON.parse(jsonMatch[0])
                }
            } catch {
                console.warn('[Gemini] JSON parse failed')
            }
        } catch (aiErr) {
            console.error('[Gemini] AI failed:', aiErr)
        }

        const extractedTickers = (extractedData.items || []).map((i: any) => i.ticker.toUpperCase())
        allocationAssessment = extractedData.assessment || { summary: 'Chưa có đánh giá', sectors: [], risk_level: 'N/A', advice: '' }

        // ── Bước 3: Match với Trading Plans & Logic Nâng cao ──
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

            // Check Risk/Profit based on stop_loss/take_profit strings (simple parsing)
            const sl = parseFloat(plan.stop_loss?.replace(/[^0-9.]/g, ''))
            const tp = parseFloat(plan.take_profit?.replace(/[^0-9.]/g, ''))

            if (cost && sl && cost <= sl * 1.03 && cost >= sl * 0.97) {
                risk_alerts.push(`Mã ${plan.ticker} đang gần vùng Stop Loss (${plan.stop_loss}). Cần lưu ý quản trị rủi ro.`)
            }
            if (cost && tp && cost >= tp * 0.95) {
                profit_opportunities.push(`Mã ${plan.ticker} đang tiến sát mục tiêu Take Profit (${plan.take_profit}). Cân nhắc hiện thực hóa lợi nhuận.`)
            }

            // Strategy Balance
            const strategy = (plan.strategy_name || '').toLowerCase()
            if (strategy.includes('sideway')) sidewayCount++
            else if (strategy.includes('trending')) trendingCount++
        })

        // Phân bổ Sideway vs Trending
        let balance_note = ''
        const totalIdentified = trendingCount + sidewayCount
        if (totalIdentified > 0) {
            const trendingPct = (trendingCount / totalIdentified) * 100
            if (trendingPct > 80) balance_note = 'Danh mục đang nghiêng hẳn về phía Tấn công (Trending). Cần bổ sung các mã Sideway/Phòng vệ để cân bằng.'
            else if (trendingPct < 20) balance_note = 'Danh mục đang quá nặng về các mã Sideway. Có thể bỏ lỡ cơ hội khi thị trường vào sóng tăng mạnh.'
            else balance_note = 'Danh mục có sự kết hợp khá cân bằng giữa các vị thế Trending và Sideway.'
        }

        let optimalAllocation = null;
        if (matchedPlans.length >= 2) {
            const optResult = await calculateMinimumVariancePortfolio(matchedPlans);
            if (!optResult.error) {
                optimalAllocation = optResult;
            }
        }

        allocationAssessment = {
            ...allocationAssessment,
            risk_alerts,
            profit_opportunities,
            optimal_allocation: optimalAllocation,
            balance_assessment: {
                trending_count: trendingCount,
                sideway_count: sidewayCount,
                note: balance_note
            }
        }

        // ── Bước 4: Upsert pending tickers ──
        for (const ticker of pendingTickers) {
            const { data: existing } = await supabase
                .from('pending_tickers')
                .select('id, requested_count, requester_ids')
                .eq('ticker', ticker)
                .single()

            if (existing) {
                await supabase.from('pending_tickers').update({
                    requested_count: existing.requested_count + 1,
                    requester_ids: userId ? [...(existing.requester_ids || []), userId] : existing.requester_ids
                }).eq('ticker', ticker)
            } else {
                await supabase.from('pending_tickers').insert({
                    ticker,
                    requested_count: 1,
                    requester_ids: userId ? [userId] : [],
                    status: 'pending'
                })
            }
        }

        // ── Bước 5: Lưu portfolio record ──
        // LUÔN LUÔN chạy bước này dù AI có lỗi hay không
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

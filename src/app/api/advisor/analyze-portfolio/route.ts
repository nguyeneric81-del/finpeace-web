import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

        // Chuyển File thành bytes
        const imageBytes = await imageFile.arrayBuffer()
        const imageBase64 = Buffer.from(imageBytes).toString('base64')
        const mimeType = imageFile.type as 'image/jpeg' | 'image/png' | 'image/webp'

        // ── Bước 1: Upload ảnh lên Supabase Storage (non-critical) ──
        // Không để lỗi upload block kết quả AI
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
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        const prompt = `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam (HOSE/HNX/UPCOM).
        
Nhiệm vụ: Liệt kê tất cả các mã chứng khoán (ticker/stock symbol) xuất hiện trong ảnh.
- Mã chứng khoán VN thường có 2-4 ký tự in hoa (ví dụ: VNM, VIC, ACB, HPG, FPT, MWG, TCB, VHM...)
- Chỉ trả về mã CK, KHÔNG bao gồm tên công ty hay số liệu
- Trả về dạng JSON array như sau: {"tickers": ["VNM", "VIC", "ACB"]}
- Nếu không thấy mã CK nào, trả về: {"tickers": []}
- Chỉ trả về JSON, không thêm text giải thích`

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: imageBase64, mimeType } }
        ])

        const rawText = result.response.text().trim()

        // Parse JSON từ Gemini
        let extractedTickers: string[] = []
        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                extractedTickers = (parsed.tickers || []).map((t: string) => t.toUpperCase().trim())
            }
        } catch {
            console.warn('Gemini JSON parse failed, raw:', rawText)
        }

        // ── Bước 3: Match với Trading Plans ──
        const { data: plans } = await supabase
            .from('trading_plans')
            .select('*')
            .in('ticker', extractedTickers)
            .eq('status', 'active')

        const matchedTickers = (plans || []).map((p: any) => p.ticker)
        const pendingTickers = extractedTickers.filter(t => !matchedTickers.includes(t))

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
                    requester_ids: userId ? [...(existing.requester_ids || []), userId] : existing.requester_ids,
                    updated_at: new Date().toISOString()
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
        if (userId) {
            await supabase.from('customer_portfolios').insert({
                user_id: userId,
                image_url: imageUrl,
                extracted_tickers: extractedTickers
            })
        }

        return NextResponse.json({
            success: true,
            extracted_tickers: extractedTickers,
            matched_plans: plans || [],
            pending_tickers: pendingTickers
        })

    } catch (err) {
        console.error('Analyze portfolio error:', err)
        return NextResponse.json({ error: 'Lỗi phân tích ảnh, vui lòng thử lại.' }, { status: 500 })
    }
}

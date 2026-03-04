import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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

        // ── Bước 2: Groq Llama Vision đọc ảnh ──
        // QUAN TRỌNG: Tách riêng try-catch để nếu AI lỗi,
        // vẫn tiếp tục lưu portfolio record vào DB (bước 5)
        let extractedTickers: string[] = []
        let allocationAssessment: any = null
        try {
            const completion = await groq.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam (HOSE/HNX/UPCOM).\n\nNhiệm vụ:\n1. Liệt kê tất cả các mã chứng khoán (ticker/stock symbol) xuất hiện trong ảnh.\n2. Phân tích cơ cấu danh mục dựa trên các mã này (nhóm ngành, rủi ro, đa dạng hóa).\n\nYêu cầu trả về định dạng JSON duy nhất như sau:\n{\n  "tickers": ["VNM", "VIC", "ACB"],\n  "assessment": {\n    "summary": "Mô tả ngắn gọn về phong cách danh mục (vd: Tập trung nhóm Bank, Rủi ro cao...)",\n    "sectors": ["Ngân hàng (40%)", "Bất động sản (30%)", "Khác (30%)"],\n    "risk_level": "Trung bình / Cao / Thấp",\n    "advice": "Lời khuyên ngắn gọn theo phong cách coaching của FinPeace (vd: Nên đa dạng hóa thêm nhóm ngành phòng vệ...)"\n  }\n}\n\n- Chỉ trả về JSON, không thêm text giải thích.`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.1,
                max_tokens: 1024
            })

            const rawText = completion.choices[0]?.message?.content?.trim() || ''
            console.log('[Groq] Raw response:', rawText)

            try {
                const jsonMatch = rawText.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    extractedTickers = (parsed.tickers || []).map((t: string) => t.toUpperCase().trim())
                    allocationAssessment = parsed.assessment || null
                }
            } catch {
                console.warn('[Groq] JSON parse failed, raw:', rawText)
            }

            console.log('[Groq] Extracted tickers:', extractedTickers)
        } catch (aiErr) {
            // AI lỗi (timeout, quota exceeded, model error...) → không throw,
            // tiếp tục với tickers rỗng để vẫn lưu được portfolio record
            console.error('[Groq] AI extraction failed (non-critical):', aiErr)
        }

        // ── Bước 3: Match với Trading Plans ──
        const { data: plans } = await supabase
            .from('trading_plans')
            .select('*')
            .in('ticker', extractedTickers.length > 0 ? extractedTickers : ['__none__'])
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

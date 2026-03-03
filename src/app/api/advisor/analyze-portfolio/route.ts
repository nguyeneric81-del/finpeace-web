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
        try {
            const completion = await groq.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Đây là ảnh chụp màn hình danh mục đầu tư chứng khoán tại thị trường Việt Nam (HOSE/HNX/UPCOM).\n\nNhiệm vụ: Liệt kê tất cả các mã chứng khoán (ticker/stock symbol) xuất hiện trong ảnh.\n- Mã chứng khoán VN thường có 2-4 ký tự in hoa (ví dụ: VNM, VIC, ACB, HPG, FPT, MWG, TCB, VHM...)\n- Chỉ trả về mã CK, KHÔNG bao gồm tên công ty hay số liệu\n- Trả về dạng JSON array như sau: {"tickers": ["VNM", "VIC", "ACB"]}\n- Nếu không thấy mã CK nào, trả về: {"tickers": []}\n- Chỉ trả về JSON, không thêm text giải thích`
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
                max_tokens: 256
            })

            const rawText = completion.choices[0]?.message?.content?.trim() || ''
            console.log('[Groq] Raw response:', rawText)

            try {
                const jsonMatch = rawText.match(/\{[\s\S]*\}/)
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0])
                    extractedTickers = (parsed.tickers || []).map((t: string) => t.toUpperCase().trim())
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
                extracted_tickers: extractedTickers
            })
            if (portfolioErr) console.error('[Portfolio] Save failed:', portfolioErr)
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

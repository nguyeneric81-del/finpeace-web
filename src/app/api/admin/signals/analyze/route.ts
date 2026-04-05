import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import Groq from 'groq-sdk'

const KB_ARTICLES = `
[TÂM LÝ & BẢN LĨNH]
- nguoi-ban-co-phieu: "Ngài Thị Trường" — Giá cổ phiếu ngắn hạn phi lý
- fomo-va-bau-dan: FOMO & Bầy Đàn — mua đỉnh, bán đáy
- ky-luat-giao-dich: Kỷ luật giao dịch — tách cảm xúc khỏi quyết định
- lo-ngai-thua-lo: Nỗi đau thua lỗ gấp 2.5 lần niềm vui lợi nhuận
[CƠ CHẾ THỊ TRƯỜNG]
- margin-trading: Margin Lending — đòn bẩy tài chính con dao hai lưỡi
[PHÂN TÍCH CƠ BẢN]
- dinh-gia-co-phieu: P/E, P/B, EV/EBITDA — các phương pháp định giá
- dong-tien-tu-do: FCF — tiền thật quan trọng hơn lợi nhuận kế toán
[ĐẦU TƯ GIÁ TRỊ]
- bien-do-an-toan: Margin of Safety — mua thấp hơn giá trị thực
- loi-the-canh-tranh: Moat — hào kinh bảo vệ doanh nghiệp
[PHÂN TÍCH KỸ THUẬT]
- ho-tro-khang-cu: Hỗ trợ & Kháng cự — bản đồ chiến trường
- macd-rsi: MACD & RSI — chỉ báo momentum
[QUẢN TRỊ RỦI RO]
- cat-lo: Cắt lỗ — kỹ thuật stop-loss khoa học
- position-sizing: Position Sizing — Kelly Criterion, 1-2% rule
`

const GROQ_PROMPT = (newsText: string, date: string) => `
Bạn là chuyên gia phân tích TTCK Việt Nam của FinPeace.
Hôm nay ${date}, phân tích các tin tức sau và chọn **3 tin ảnh hưởng nhất** đến VNINDEX.

Với mỗi tin, trả về JSON object theo format:
{
  "id": <tin_id_số>,
  "impact": "positive"|"negative"|"neutral",
  "impact_score": <1-10>,
  "summary_vi": "<2-3 câu tóm tắt tiếng Việt>",
  "key_points": ["điểm 1", "điểm 2", "điểm 3"],
  "watch_tickers": ["TCB", "VNM"],
  "kb_slug": "<slug-bai-hoc-lien-quan>",
  "kb_reasoning": "<1 câu giải thích tại sao bài KB đó liên quan>"
}

Trả về JSON array gồm 3 objects. Không kèm văn bản ngoài JSON.

=== BẢNG BÀI HỌC KB ===
${KB_ARTICLES}

=== TIN TỨC ===
${newsText}
`

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) throw new Error('GROQ_API_KEY chưa được cấu hình')

    const groq = new Groq({ apiKey: groqApiKey })

    // Lấy top 15 tin pending mới nhất
    const { data: pendingNews, error: fetchError } = await supabase
      .from('raw_news')
      .select('id, title, description, source, link, published_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(15)

    if (fetchError) throw fetchError
    if (!pendingNews || pendingNews.length === 0) {
      return NextResponse.json({ success: true, message: 'Không có tin pending để phân tích', analyzed: 0 })
    }

    // Build news text for Groq
    const newsText = pendingNews.map((n, i) =>
      `[${n.id}] ${n.source} | ${n.title}\n${n.description?.substring(0, 400)}`
    ).join('\n\n')

    const today = new Date().toLocaleDateString('vi-VN')

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: GROQ_PROMPT(newsText, today) }],
      temperature: 0.3,
      max_tokens: 2500,
    })

    const rawContent = completion.choices[0].message.content?.trim() || '[]'

    // Parse JSON từ Groq
    let analyses: any[] = []
    try {
      // Strip markdown code fences if present
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analyses = JSON.parse(cleaned)
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Groq trả về JSON không hợp lệ', raw: rawContent }, { status: 500 })
    }

    // Update từng tin trong DB với kết quả phân tích
    const updatePromises = analyses.map(async (a: any) => {
      const { error } = await supabase
        .from('raw_news')
        .update({
          status: 'analyzed',
          relevance: a.impact_score,
          tags: a.key_points || [],
          tickers: a.watch_tickers || [],
          category: a.impact,
        })
        .eq('id', a.id)
      if (error) console.error(`Update error for id ${a.id}:`, error.message)
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      analyzed: analyses.length,
      results: analyses,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

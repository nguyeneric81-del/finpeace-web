#!/usr/bin/env node
// scripts/seed_kb_articles.mjs
// Seed all KB articles from TypeScript CONTENT_REGISTRY into Supabase kb_articles table.
// Usage: node --import tsx/esm scripts/seed_kb_articles.mjs
//    OR: npx tsx scripts/seed_kb_articles.mjs
//
// Run AFTER migration: migrations/phase10_kb_articles.sql

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Inline article metadata (from data.ts PILLARS) ────────────────────────
// This avoids importing .tsx files — only plain metadata, no React
const ARTICLES = [
  // tam-ly-thi-truong
  { pillar: 'tam-ly-thi-truong', slug: 'nguoi-ban-co-phieu',       title: '"Ngài Thị Trường" là ai? Hiểu để không bị điên theo',                             summary: 'Benjamin Graham dùng hình ảnh "Mr. Market" để giải thích tại sao giá cổ phiếu ngắn hạn phi lý. Học cách khai thác sự phi lý đó thay vì bị nó ám ảnh.' },
  { pillar: 'tam-ly-thi-truong', slug: 'fomo-va-bau-dan',          title: 'FOMO & Bầy Đàn: Tại sao bạn luôn mua đỉnh, bán đáy?',                             summary: 'Khoa học thần kinh giải thích tại sao não bộ con người được lập trình để đám đông — và đây chính là bẫy chết người trên thị trường chứng khoán.' },
  { pillar: 'tam-ly-thi-truong', slug: 'ky-luat-giao-dich',        title: 'Kỷ Luật Giao Dịch: Tách cảm xúc ra khỏi quyết định',                              summary: 'Mark Douglas chứng minh rằng kỷ luật thực thi — không phải dự đoán đúng — mới là biến quyết định thành công.' },
  { pillar: 'tam-ly-thi-truong', slug: 'lo-ngai-thua-lo',          title: 'Nỗi đau thua lỗ gấp 2.5 lần niềm vui lợi nhuận',                                  summary: 'Kahneman & Tversky đoạt Nobel Kinh tế nhờ phát hiện "Loss Aversion". Hiểu cơ chế này giúp bạn không cắt lỗ muộn và không chốt lời sớm.' },
  // co-che-thi-truong
  { pillar: 'co-che-thi-truong', slug: 'co-phieu-la-gi',           title: 'Cổ phiếu là gì? Bạn thực sự mua gì khi bấm "Đặt lệnh"?',                          summary: 'Phân biệt cổ phiếu thường, cổ phiếu ưu đãi, trái phiếu và ETF. Hiểu quyền lợi cổ đông và tại sao "mua cổ phiếu = mua phần doanh nghiệp".' },
  { pillar: 'co-che-thi-truong', slug: 'cach-dat-lenh',            title: 'Lệnh MP, LO, ATO, ATC — Đặt lệnh đúng cách để không mua nhầm giá',               summary: 'Giải thích tất cả loại lệnh trên sàn chứng khoán Việt Nam. Case study thực tế về tình huống nên dùng lệnh nào.' },
  // phan-tich-co-ban
  { pillar: 'phan-tich-co-ban',  slug: 'doc-bao-cao-tai-chinh',    title: 'Đọc Báo Cáo Tài Chính trong 30 phút — 5 con số quyết định tất cả',                summary: 'Cách Buffett quét qua báo cáo tài chính để tìm "lợi thế cạnh tranh bền vững".' },
  { pillar: 'phan-tich-co-ban',  slug: 'bien-loi-nhuan',           title: 'Biên Lợi Nhuận — Vũ Khí Bí Mật Để Nhận Diện Doanh Nghiệp Tốt',                   summary: 'Gross Margin, Operating Margin, Net Margin — cách phân tích trend theo thời gian và so sánh ngành.' },
  { pillar: 'phan-tich-co-ban',  slug: 'dinh-gia-co-phieu',        title: 'P/E, P/B, EV/EBITDA — Định giá cổ phiếu không còn làm bạn mù mịt',               summary: 'Hướng dẫn sử dụng 5 phương pháp định giá phổ biến nhất. Case study thực tế với cổ phiếu Việt Nam.' },
  // dau-tu-gia-tri
  { pillar: 'dau-tu-gia-tri',    slug: 'bien-do-an-toan',          title: 'Biên Độ An Toàn (Margin of Safety) — Nguyên Tắc Số 1 Của Graham',                summary: 'Tại sao luôn phải mua với giá thấp hơn đáng kể so với giá trị thực? Cách tính Intrinsic Value cơ bản theo Graham.' },
  { pillar: 'dau-tu-gia-tri',    slug: 'loi-the-canh-tranh',       title: '"Moat" — Hào Kinh Bảo Vệ Doanh Nghiệp Mà Buffett Luôn Tìm Kiếm',                 summary: 'Buffett chỉ đầu tư vào doanh nghiệp có "economic moat" rộng. 5 loại moat phổ biến và cách nhận diện chúng.' },
  // dau-tu-tang-truong
  { pillar: 'dau-tu-tang-truong',slug: '15-tieu-chi-fisher',       title: '15 Tiêu Chí Của Philip Fisher Để Tìm "Cổ Phiếu Phi Thường"',                      summary: 'Fisher không đọc báo cáo tài chính — ông đi thực địa. Phương pháp "Scuttlebutt" và 15 câu hỏi cốt lõi.' },
  { pillar: 'dau-tu-tang-truong',slug: 'mua-nhung-gi-ban-biet',    title: 'Peter Lynch: "Mua Những Gì Bạn Biết" — Lợi Thế Của Nhà Đầu Tư Cá Nhân',          summary: 'Nhà đầu tư cá nhân có thể đánh bại quỹ chuyên nghiệp nếu biết khai thác lợi thế "local knowledge".' },
  // phan-tich-ky-thuat
  { pillar: 'phan-tich-ky-thuat',slug: 'nen-nhat',                 title: 'Nến Nhật (Candlestick) — Ngôn Ngữ Cảm Xúc Của Thị Trường',                       summary: 'Mỗi cây nến là cuộc chiến giữa phe mua và phe bán. 12 mô hình nến đảo chiều quan trọng nhất.' },
  { pillar: 'phan-tich-ky-thuat',slug: 'ho-tro-khang-cu',          title: 'Hỗ Trợ & Kháng Cự — Bản Đồ Chiến Trường Của Trader',                             summary: 'Lý do tại sao giá thường dừng lại ở cùng một mức. Cách vẽ S/R chính xác và hiện tượng Role Reversal.' },
  { pillar: 'phan-tich-ky-thuat',slug: 'khoi-luong-giao-dich',     title: 'Khối Lượng (Volume) — Bằng Chứng Xác Nhận Hay Phủ Nhận Tín Hiệu Giá',          summary: 'Volume là "linh hồn" của phân tích kỹ thuật. Cách đọc Volume để xác nhận breakout thật vs bẫy tăng ảo.' },
  { pillar: 'phan-tich-ky-thuat',slug: 'macd-rsi',                 title: 'MACD & RSI — Bộ Đôi Chỉ Báo Momentum Cổ Điển',                                   summary: 'RSI đo sức nóng thị trường, MACD đo động lực xu hướng. Cách dùng đúng và bộ lọc 3 tầng kết hợp S/R.' },
  // giao-dich-theo-xu-huong
  { pillar: 'giao-dich-theo-xu-huong', slug: 'ly-thuyet-hop-darvas', title: 'Lý Thuyết Hộp Darvas — Từ Vũ Công Đến Triệu Phú Chứng Khoán',                 summary: 'Nicolas Darvas kiếm 2 triệu đô từ 3,000 đô trong 18 tháng. Box Theory, stop-loss tự động.' },
  { pillar: 'giao-dich-theo-xu-huong', slug: 'turtle-traders',      title: 'Turtle Traders — Bí Mật Được Giải Mã Của Hệ Thống Giao Dịch Vĩ Đại Nhất',      summary: 'Richard Dennis đặt cược rằng giao dịch có thể DẠY ĐƯỢC. Hệ thống 20-day breakout của Turtles.' },
  // quan-ly-danh-muc
  { pillar: 'quan-ly-danh-muc',  slug: 'da-dang-hoa',              title: 'Đa Dạng Hóa Danh Mục — Bao Nhiêu Cổ Phiếu Là Đủ?',                              summary: 'Lynch: 8-12 cổ phiếu. Buffett: tập trung. ETF: cả thị trường. Phân tích khoa học về điểm tối ưu.' },
  { pillar: 'quan-ly-danh-muc',  slug: 'dollar-cost-averaging',    title: 'Dollar-Cost Averaging — Chiến Lược Đầu Tư Mà Ngay Cả Buffett Khuyên Dùng',      summary: 'Tại sao mua đều đặn hàng tháng lại tốt hơn cố gắng "bắt đáy"? Mô phỏng 5 chiến lược.' },
  // quan-tri-rui-ro
  { pillar: 'quan-tri-rui-ro',   slug: 'cat-lo',                   title: 'Cắt Lỗ — Kỹ Năng Quan Trọng Nhất Mà Ít Người Học',                               summary: 'Tại sao não bộ ghét cắt lỗ? Kỹ thuật stop-loss khoa học: % cố định, Bollinger Band, ATR-based.' },
  { pillar: 'quan-tri-rui-ro',   slug: 'position-sizing',          title: 'Position Sizing — Bí Quyết Không Ai Dạy Bạn Nhưng Quyết Định Mọi Thứ',          summary: 'Kelly Criterion, 1% Rule, 2% Rule. Tại sao trader giỏi nhất chỉ rủi ro 1-2% mỗi lệnh.' },
  // ke-hoach-thuc-chien
  { pillar: 'ke-hoach-thuc-chien', slug: 'investment-policy-statement', title: 'Viết IPS (Investment Policy Statement) — Hiến Pháp Đầu Tư Của Bạn',        summary: 'Quỹ đầu tư triệu đô nào cũng có IPS. Template IPS 1 trang giúp bạn không bị cảm xúc lấn át.' },
  { pillar: 'ke-hoach-thuc-chien', slug: 'paper-trading',          title: 'Paper Trading 90 Ngày — Giao Dịch Thật, Tiền Giả, Bài Học Thật',                summary: 'Hướng dẫn paper trading có cấu trúc: chọn sàn mô phỏng, ghi nhật ký, đánh giá theo thống kê.' },
]

async function seed() {
  console.log(`🚀 Seeding ${ARTICLES.length} KB articles to Supabase...`)

  const rows = ARTICLES.map(a => ({
    slug:    a.slug,
    pillar:  a.pillar,
    title:   a.title,
    summary: a.summary,
    content: null, // full ContentBlock[] can be added later if needed
  }))

  const { data, error } = await supabase
    .from('kb_articles')
    .upsert(rows, { onConflict: 'pillar,slug' })
    .select('slug, pillar')

  if (error) {
    console.error('❌ Lỗi:', error.message)
    process.exit(1)
  }

  console.log(`✅ Seeded ${data.length} articles thành công!`)
  data.forEach(r => console.log(`   → ${r.pillar}/${r.slug}`))
}

seed()

-- =====================================================
-- MACRO INSIGHT #4: GDP 10% + Siêu Dự Án + Thép HPG/HSG
-- Chạy trong Supabase SQL Editor
-- =====================================================

INSERT INTO macro_insights (
  id, title, category, topic_slug, date_label, accent_color,
  data_point, narrow_industry, impact_value, impact_positive,
  behind_story, analyst_view, analyst_sources,
  key_stats, companies,
  chart_label, chart_color, chart_data,
  cycle_lagging, cycle_leading,
  published
) VALUES (
  '4',
  'Mục tiêu GDP 10%: Kỷ nguyên Siêu Dự án và Thép như mạch máu của Tăng trưởng',
  'Hạ tầng & Tăng trưởng',
  'gdp-10-sieu-du-an',
  'Tháng 3, 2026',
  '#f97316',

  -- data_point
  'Tổng vốn đầu tư công 2026 đạt 857,000 tỷ VNĐ — tăng 65% YoY. Riêng đường sắt tốc độ cao Bắc-Nam cần 67 tỷ USD vốn thép và vật liệu xây dựng.',

  -- narrow_industry
  'Thép Xây dựng & Vật liệu Hạ tầng (HPG, HSG, NKG)',

  -- impact_value
  'Nhu cầu thép nội địa 2026 tăng ước +28% YoY lên 28 triệu tấn. HPG chiếm 35% thị phần, dự kiến tăng trưởng LNST +65–80% trong 2026.',

  -- impact_positive
  true,

  -- behind_story (JSONB)
  '[
    {
      "point": "Nghị quyết 01/2026 của Chính phủ: GDP 10% — không phải khẩu hiệu, mà là cam kết có số.",
      "quote": "Thủ tướng yêu cầu giải ngân vốn đầu tư công đạt 98% kế hoạch; xử lý hình sự các trường hợp chây ì giải ngân. Tổng vốn đầu tư công 857,000 tỷ — cao nhất lịch sử.",
      "source": "Nghị quyết 01/NQ-CP · Tháng 1/2026"
    },
    {
      "point": "5 siêu dự án khởi công đồng loạt Q1/2026 — hút 40% tổng nhân lực và vật liệu xây dựng cả nước.",
      "quote": "Đường sắt tốc độ cao Bắc-Nam (67 tỷ USD), Cao tốc Bắc-Nam giai đoạn 3 (15 tỷ USD), Metro HCM tuyến 2, Cảng Trần Đề (Sóc Trăng), và Sân bay Long Thành giai đoạn 2 cùng khởi công trong vòng 90 ngày.",
      "source": "Bộ GTVT · Q1/2026"
    },
    {
      "point": "Dung Quất 2 (HPG) chính thức đi vào sản xuất thương mại — nâng tổng công suất Hòa Phát lên 14.4 triệu tấn thô/năm.",
      "quote": "Lò cao số 4 Dung Quất 2 hỏa luyện lần đầu tháng 2/2026. Đây là khu liên hợp thép lớn nhất Đông Nam Á về công suất tích hợp.",
      "source": "Hòa Phát IR · Tháng 2/2026"
    },
    {
      "point": "HSG chiếm lĩnh phân khúc Tôn mạ mở rộng — hưởng lợi kép từ nhà ở xã hội và nhà máy khu công nghiệp FDI.",
      "quote": "Chính phủ ban hành gói nhà ở xã hội 120,000 tỷ VNĐ, yêu cầu hoàn thành 50,000 căn trước 2027. HSG cung cấp 60% tôn mạ cho phân khúc này.",
      "source": "Hoa Sen Group IR · SSI Research"
    }
  ]',

  -- analyst_view
  'VDSC và Yuanta đồng thuận: HPG là "Core Holding" trong danh mục tập trung vào đầu tư công 2026. Tỷ lệ P/B hiện tại (~1.3x) thấp hơn 30% so với trung bình lịch sử khi chu kỳ thép đi lên. HSG có cơ cấu đòn bẩy cao hơn — phù hợp nhà đầu tư chấp nhận biến động lớn hơn để đổi lấy upside.',

  -- analyst_sources
  ARRAY['VDSC Research', 'Yuanta Vietnam', 'BSC Securities'],

  -- key_stats (JSONB)
  '[
    {"label": "Vốn đầu tư công 2026", "value": "857K tỷ", "positive": true},
    {"label": "Tăng trưởng nhu cầu thép", "value": "+28%", "positive": true},
    {"label": "Công suất HPG sau DQ2", "value": "14.4M tấn", "positive": true},
    {"label": "Mục tiêu GDP 2026", "value": "10%+", "positive": true}
  ]',

  -- companies (JSONB)
  '[
    {"ticker": "HPG", "name": "Hòa Phát Group", "plan": "/advisor/trading-plan/hpg"},
    {"ticker": "HSG", "name": "Hoa Sen Group", "plan": "/advisor/trading-plan/hsg"},
    {"ticker": "NKG", "name": "Thép Nam Kim", "plan": "/advisor/trading-plan/nkg"}
  ]',

  -- chart_label
  'Sản lượng thép tiêu thụ nội địa Việt Nam (triệu tấn)',

  -- chart_color
  '#f97316',

  -- chart_data (JSONB)
  '[
    {"name": "T6/25", "value": 18.2},
    {"name": "T8/25", "value": 19.1},
    {"name": "T10/25", "value": 20.4},
    {"name": "T12/25", "value": 21.8},
    {"name": "T1/26", "value": 24.5},
    {"name": "T2/26", "value": 25.9},
    {"name": "T3/26", "value": 27.2}
  ]',

  -- cycle_lagging
  'Các quyết định đầu tư hạ tầng công cộng có độ trễ 12–24 tháng từ khi phê duyệt đến khi nhu cầu vật liệu tăng mạnh. Giai đoạn 2023–2024 là thời điểm phê duyệt dày đặc nhưng giải ngân chậm — tạo ra "nợ nhu cầu" thép chưa được hấp thụ.',

  -- cycle_leading
  'Tốc độ giải ngân vốn đầu tư công Q1/2026 đạt 28% kế hoạch — cao nhất trong 5 năm. Đặt hàng thép thanh, thép cuộn từ HPG tăng gấp đôi so với Q1/2025. KQKD HPG Q2/2026 dự kiến là catalyst giá cổ phiếu với LNST ước đạt 6,500–7,000 tỷ đồng.',

  -- published
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  data_point = EXCLUDED.data_point,
  behind_story = EXCLUDED.behind_story,
  analyst_view = EXCLUDED.analyst_view,
  key_stats = EXCLUDED.key_stats,
  companies = EXCLUDED.companies,
  chart_data = EXCLUDED.chart_data,
  chart_label = EXCLUDED.chart_label,
  chart_color = EXCLUDED.chart_color,
  cycle_lagging = EXCLUDED.cycle_lagging,
  cycle_leading = EXCLUDED.cycle_leading,
  updated_at = now();

-- =====================================================
-- MIGRATION: Phase 6 - Macro Insights to Supabase
--            + Flexible LP Content Types
-- =====================================================

-- 1. Bảng macro_insights (replaces hardcoded data)
CREATE TABLE IF NOT EXISTS macro_insights (
  id TEXT PRIMARY KEY,               -- '1', '2', '3' (match existing)
  title TEXT NOT NULL,
  category TEXT NOT NULL,           -- 'Chuỗi Cung Ứng', 'Chính sách Tiền tệ', etc.
  topic_slug TEXT UNIQUE NOT NULL,  -- 'ty-gia', 'logistics', 'fdi-ban-dan'
  date_label TEXT NOT NULL,         -- 'Tháng 3, 2026'
  accent_color TEXT DEFAULT '#10B981',
  data_point TEXT NOT NULL,
  narrow_industry TEXT,
  impact_value TEXT,
  impact_positive BOOLEAN DEFAULT true,
  behind_story JSONB DEFAULT '[]',  -- [{point, quote, source}]
  analyst_view TEXT,
  analyst_sources TEXT[] DEFAULT '{}',
  key_stats JSONB DEFAULT '[]',     -- [{label, value, positive}]
  companies JSONB DEFAULT '[]',     -- [{ticker, name, plan}]
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Upgrade agent_landing_pages: add content_type for flexibility
ALTER TABLE agent_landing_pages 
  ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'macro_insight',
  ADD COLUMN IF NOT EXISTS content_ref_id TEXT;  -- points to macro_insights.id or future tables

-- 3. RLS for macro_insights
ALTER TABLE macro_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read macro_insights" ON macro_insights FOR SELECT USING (published = true);
CREATE POLICY "service full macro_insights" ON macro_insights FOR ALL USING (auth.role() = 'service_role');

-- 4. Seed macro_insights data (migrating from hardcode)
INSERT INTO macro_insights (id, title, category, topic_slug, date_label, accent_color,
  data_point, narrow_industry, impact_value, impact_positive,
  behind_story, analyst_view, analyst_sources, key_stats, companies)
VALUES
(
  '1',
  'Chi phí logistics toàn cầu leo thang giữa căng thẳng địa chính trị',
  'Chuỗi Cung Ứng', 'logistics', 'Tháng 3, 2026', '#10B981',
  'SCFI tăng +35% YTD, chạm 2,800 điểm — cao nhất 18 tháng.',
  'Vận tải biển Quốc tế & Cho thuê tàu',
  'Biên lợi nhuận ròng ngành tăng +8–12% trong Q2/2026 nhờ cước giá cao.',
  true,
  '[
    {"point": "Căng thẳng Biển Đỏ làm thay đổi toàn bộ cấu trúc tuyến vận tải Á–Âu.", "quote": "Khối lượng tàu qua kênh Suez trong Q1/2026 giảm 42% so cùng kỳ, hành trình dài thêm 14–21 ngày.", "source": "SSI Research T2/2026"},
    {"point": "Chỉ số SCFI xuyên thủng mốc 2,800 điểm — cao nhất 18 tháng.", "quote": "Tắc nghẽn container rỗng tại Singapore, Thượng Hải — vòng quay tàu chậm 40%.", "source": "Drewry Shipping T3/2026"}
  ]',
  'VCBS, KIS nhấn mạnh dư địa tăng giá cước Spot vẫn còn. Đà tăng sẽ hạ nhiệt Q4/2026 khi 2 triệu TEU tàu mới hạ thủy.',
  ARRAY['VCBS Research', 'KIS Vietnam'],
  '[
    {"label": "SCFI Index", "value": "2,800", "positive": true},
    {"label": "Tàu qua Suez", "value": "-42%", "positive": false},
    {"label": "Doanh thu HAH", "value": "+18%", "positive": true},
    {"label": "LNST HAH Q2 dự phóng", "value": "+45%", "positive": true}
  ]',
  '[{"ticker": "HAH", "name": "Hải An", "plan": "/advisor/trading-plan/hah"}, {"ticker": "VOS", "name": "VOSCO", "plan": "/advisor/trading-plan/vos"}]'
),
(
  '2',
  'FED chần chừ hạ lãi suất — Đồng USD tiếp tục duy trì sức mạnh',
  'Chính sách Tiền tệ', 'ty-gia', 'Tháng 3, 2026', '#F59E0B',
  'DXY neo vững vùng 104.5. Tỷ giá USD/VND chợ đen vượt 25,500. TPCP Mỹ 10Y = 4.3%.',
  'Sản xuất xuất khẩu (Sợi, Thủy sản) & Bán lẻ Công nghệ',
  'DN vay nợ USD cao chịu lỗ tỷ giá -3% LNST. Xuất khẩu thu USD ghi nhận biên ròng +1.5% đến 2.5%.',
  false,
  '[
    {"point": "Lạm phát lõi (Core PCE) của Mỹ bất ngờ dâng cao, triệt tiêu kỳ vọng hạ lãi suất sớm.", "quote": "Core PCE tháng 1/2026 tăng 2.8% YoY. Non-Farm tạo 275,000 việc làm — vượt xa dự báo.", "source": "Bloomberg / BLS"},
    {"point": "Chênh lệch lãi suất USD-VNĐ kích hoạt dòng vốn đầu cơ ngoại tệ.", "quote": "DXY neo vững trên 104.5, USD/VND tự do vượt mốc 25,500.", "source": "MBS Research — T3/2026"}
  ]',
  'Thị trường định giá FED chỉ hạ lãi suất sớm nhất tháng 9/2026. Nhóm xuất khẩu Gỗ, Thủy sản hưởng lợi kép từ đơn hàng và tỷ giá.',
  ARRAY['SSI Research', 'MBS Securities'],
  '[
    {"label": "DXY Index", "value": "104.5", "positive": false},
    {"label": "USD/VND tự do", "value": "25,500", "positive": false},
    {"label": "Buff doanh thu VHC", "value": "+4.5%", "positive": true},
    {"label": "FED hạ lãi suất dự kiến", "value": "T9/2026", "positive": false}
  ]',
  '[{"ticker": "VHC", "name": "Vĩnh Hoàn", "plan": "/advisor/trading-plan/vhc"}, {"ticker": "MWG", "name": "Thế Giới Di Động", "plan": "/advisor/trading-plan/mwg"}]'
),
(
  '3',
  'Làn sóng FDI Thế hệ mới & Vốn dịch chuyển vào Công nghiệp Bán dẫn',
  'Đầu tư Nước ngoài', 'fdi-ban-dan', 'Tháng 3, 2026', '#818CF8',
  'FDI đăng ký mới lũy kế 2T/2026 đạt 4.29B USD (+38% YoY). 60% vào chế biến cao.',
  'BĐS Khu Công Nghiệp (Bắc Ninh, Vũng Tàu) & Hóa chất vật liệu',
  'Giá thuê đất CN tăng +6-8%/năm. Tỷ lệ lấp đầy KCN phía Bắc chạm 90%.',
  true,
  '[
    {"point": "Các đạo luật chip Mỹ ép FDI công nghệ cao đa dạng hóa chuỗi lắp ráp (China + 1).", "quote": "FDI lũy kế 2T/2026 đạt 4.29B USD (+38.6% YoY), 60% rót vào chế tạo, đóng gói bán dẫn.", "source": "Bộ KH&ĐT / GSO"},
    {"point": "Tỷ lệ lấp đầy KCN phía Bắc chạm 90%, đẩy giá thuê lên 140 USD/m².", "quote": "Amkor Technology & Hana Micron giải ngân giai đoạn 2 hơn 1.5B USD tại Bắc Ninh, Bắc Giang.", "source": "Nikkei Asia"}
  ]',
  'KBSV & Vietcap: đây là Secular Trend thập kỷ của Việt Nam. DN có quỹ đất thương phẩm 2026-2027 nắm độc quyền định giá.',
  ARRAY['KBSV Research', 'Vietcap Securities'],
  '[
    {"label": "FDI 2T/2026", "value": "$4.29B", "positive": true},
    {"label": "Lấp đầy KCN phía Bắc", "value": "90%", "positive": true},
    {"label": "Giá thuê đất KCN", "value": "$140/m²", "positive": true},
    {"label": "LNST KBC 2026 dự báo", "value": "+120%", "positive": true}
  ]',
  '[{"ticker": "KBC", "name": "Kinh Bắc", "plan": "/advisor/trading-plan/kbc"}, {"ticker": "DGC", "name": "Hóa chất Đức Giang", "plan": "/advisor/trading-plan/dgc"}]'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Update agent_landing_pages seed to use content_type
UPDATE agent_landing_pages SET content_type = 'macro_insight', content_ref_id = macro_insight_id
WHERE macro_insight_id IS NOT NULL;

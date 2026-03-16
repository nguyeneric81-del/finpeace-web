-- =====================================================
-- MIGRATION: Phase 7 - Add rich content fields to macro_insights
-- Matches full structure of /advisor/macro-insights/[id]/page.tsx
-- =====================================================

ALTER TABLE macro_insights
  ADD COLUMN IF NOT EXISTS chart_data JSONB DEFAULT '[]',     -- [{name, value}]
  ADD COLUMN IF NOT EXISTS chart_label TEXT,
  ADD COLUMN IF NOT EXISTS chart_color TEXT DEFAULT '#34d399',
  ADD COLUMN IF NOT EXISTS cycle_lagging TEXT,               -- Lagging indicator narrative
  ADD COLUMN IF NOT EXISTS cycle_leading TEXT,               -- Leading indicator narrative
  ADD COLUMN IF NOT EXISTS infographic_syntax TEXT;           -- For future AntV infographic

-- =====================================================
-- Seed full rich data for logistics (id=1)
-- =====================================================
UPDATE macro_insights SET
  chart_label = 'Chỉ số SCFI (Container Freight Index) — 8 tháng gần nhất',
  chart_color = '#34d399',
  chart_data = '[
    {"name":"T8/25","value":1200},{"name":"T9/25","value":1450},
    {"name":"T10/25","value":1800},{"name":"T11/25","value":2100},
    {"name":"T12/25","value":2350},{"name":"T1/26","value":2600},
    {"name":"T2/26","value":2750},{"name":"T3/26","value":2800}
  ]',
  cycle_lagging = 'Chi phí cước SCFI đi Châu Âu giao dịch quanh mức 3,200 USD/TEU, tăng +125% so với trung bình 5 năm (1,420 USD) do độ trễ từ đứt gãy chuỗi cung ứng 6 tháng trước.',
  cycle_leading = 'Lợi nhuận trực tiếp cho DN có đội tàu tái ký vào đợt cước cao. HAH với 3 tàu mới tuyến Nội Á ước tính đóng góp +18% Tổng doanh thu 2026.'
WHERE id = '1';

-- =====================================================
-- Seed full rich data for ty-gia (id=2)
-- =====================================================
UPDATE macro_insights SET
  chart_label = 'Chỉ số DXY (USD Index) — 7 tháng gần nhất',
  chart_color = '#f59e0b',
  chart_data = '[
    {"name":"T9/25","value":101.2},{"name":"T10/25","value":102.5},
    {"name":"T11/25","value":103.1},{"name":"T12/25","value":103.8},
    {"name":"T1/26","value":104.0},{"name":"T2/26","value":104.3},
    {"name":"T3/26","value":104.5}
  ]',
  cycle_lagging = 'Lạm phát dịch vụ và giá nhà ở Mỹ dai dẳng duy trì mặt bằng lãi suất liên ngân hàng VNĐ ở vùng thấp giả tạo so với FED Funds Rate xuyên suốt 6 tháng qua.',
  cycle_leading = 'Tỷ giá neo cao 25,500 VNĐ/USD trực tiếp buff lợi nhuận VHC. Phần chênh lệch đóng góp +4.5% tổng doanh thu xuất khẩu, cải thiện biên gộp lên 18% từ 14% đầu 2025.'
WHERE id = '2';

-- =====================================================
-- Seed full rich data for fdi-ban-dan (id=3)
-- =====================================================
UPDATE macro_insights SET
  chart_label = 'FDI Lũy kế đăng ký mới vào Việt Nam (tỷ USD)',
  chart_color = '#a78bfa',
  chart_data = '[
    {"name":"T4/25","value":2.1},{"name":"T6/25","value":2.4},
    {"name":"T8/25","value":2.8},{"name":"T10/25","value":3.1},
    {"name":"T12/25","value":3.5},{"name":"T1/26","value":3.9},
    {"name":"T2/26","value":4.29}
  ]',
  cycle_lagging = 'Cam kết MOU đầu tư FDI tỷ đô được ký kết trong chuỗi ngoại giao con thoi của chính phủ giai đoạn 2024–2025.',
  cycle_leading = 'Chuyển hóa dòng tiền thực cho KBC. Bàn giao 100ha KCN Tràng Duệ 3 cho LG Innotek đóng góp 65% Tổng doanh thu 2026. LNST KBC dự kiến +120% YoY lên 3,500 tỷ đồng.'
WHERE id = '3';

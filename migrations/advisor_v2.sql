-- =====================================================
-- advisor.finpeace.cloud v2 — Database Migration
-- Chạy trong Supabase SQL Editor
-- =====================================================

-- 1. Bảng user đăng ký qua Advisor (tách biệt với profiles)
CREATE TABLE IF NOT EXISTS advisor_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trading Plans — Đội phân tích nhập thủ công theo từng mã CK
CREATE TABLE IF NOT EXISTS trading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL UNIQUE,
  company_name TEXT,
  strategy_name TEXT NOT NULL,
  timeframe TEXT,
  entry_zone TEXT,
  stop_loss TEXT,
  take_profit TEXT,
  risk_reward TEXT,
  max_position_pct NUMERIC DEFAULT 10,
  indicators TEXT[] DEFAULT '{}',
  entry_criteria TEXT,
  exit_criteria TEXT,
  analyst_note TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Danh mục portfolio KH đã upload
CREATE TABLE IF NOT EXISTS customer_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES advisor_users(id) ON DELETE CASCADE,
  image_url TEXT,
  extracted_tickers TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Mã CK pending — chưa có Trading Plan
CREATE TABLE IF NOT EXISTS pending_tickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL UNIQUE,
  requested_count INT DEFAULT 1,
  requester_ids UUID[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE advisor_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_tickers ENABLE ROW LEVEL SECURITY;

-- trading_plans: Public READ (khách hàng xem plan)
CREATE POLICY "trading_plans_public_read" ON trading_plans
  FOR SELECT USING (status = 'active');

-- customer_portfolios: KH chỉ xem portfolio của mình
-- (Dùng service_role từ API route, bỏ qua RLS)

-- =====================================================
-- Sample Trading Plans (để test)
-- =====================================================

INSERT INTO trading_plans (ticker, company_name, strategy_name, timeframe, entry_zone, stop_loss, take_profit, risk_reward, max_position_pct, indicators, entry_criteria, exit_criteria, analyst_note)
VALUES
  ('VNM', 'Vinamilk', 'Mua tích lũy vùng đáy', 'Trung hạn (4-8 tuần)', '55,000 - 57,000', '52,500 (-7%)', '65,000 (+15%)', '1:2.1', 10, ARRAY['MA20','MA50','RSI 14','MACD'],
   'Giá chạm vùng 55,000-57,000 với RSI < 35, MACD sắp giao cắt dương. Khối lượng tăng dần.', 'RSI > 70 hoặc giá đạt 65,000. Cắt lỗ nếu giá đóng cửa < 52,500.', 'VNM đang tích lũy tốt về mặt nền tảng, P/E hấp dẫn so với ngành FMCG.'),
  ('VIC', 'Vingroup', 'Bắt đáy phục hồi', 'Ngắn hạn (2-4 tuần)', '28,000 - 30,000', '27,000 (-7%)', '36,000 (+20%)', '1:2.9', 8, ARRAY['Bollinger Bands','RSI 14','Volume'],
   'Giá test đáy vùng 28,000-30,000, Bollinger Band thu hẹp, nến Hammer/Doji xuất hiện trên khung D.', 'Giá đạt 36,000 hoặc RSI > 75. Thoát lệnh nếu đóng cửa dưới 27,000.', 'Rủi ro vẫn còn do áp lực thị trường BĐS, chỉ phân bổ tối đa 8% danh mục.'),
  ('ACB', 'Ngân hàng ACB', 'Momentum mua mạnh', 'Trung hạn (4-6 tuần)', '22,000 - 23,000', '21,000 (-6%)', '27,000 (+20%)', '1:3.3', 15, ARRAY['MA10','MA20','MACD','RSI 14'],
   'ACB trending tốt, MA10 vượt MA20, MACD dương. Mua khi giá điều chỉnh về vùng 22,000-23,000.', 'Giá đạt 27,000 hoặc khi MA10 cắt xuống MA20. SL tại 21,000.', 'Nhóm ngân hàng hưởng lợi từ chu kỳ giảm lãi suất, room ngoại còn nhiều.')
ON CONFLICT (ticker) DO NOTHING;

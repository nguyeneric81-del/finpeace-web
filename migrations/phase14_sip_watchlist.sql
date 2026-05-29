-- Bảng sip_watchlist: Danh sách cổ phiếu Tích sản
CREATE TABLE IF NOT EXISTS public.sip_watchlist (
    ticker VARCHAR(10) PRIMARY KEY REFERENCES public.companies(ticker) ON DELETE CASCADE,
    allocation_pct NUMERIC DEFAULT 0,  -- Tỷ trọng phân bổ % trong danh mục (optional)
    intrinsic_value NUMERIC NOT NULL,  -- Giá trị nội tại
    ma200_value NUMERIC,               -- Đường trung bình 200 ngày (cập nhật tự động/thường xuyên)
    current_price NUMERIC,             -- Giá thị trường hiện tại
    cta_status VARCHAR(50),            -- Trạng thái MUA TỐT / MUA / TẠM DỪNG MUA
    review_note TEXT,                  -- Ghi chú của chuyên gia
    next_review_date DATE,             -- Ngày dự kiến review tiếp theo
    is_active BOOLEAN DEFAULT true,    -- Đang theo dõi hay đã loại khỏi danh sách
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng sip_monthly_reviews: Lịch sử review hàng tháng của danh mục Tích sản
CREATE TABLE IF NOT EXISTS public.sip_monthly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker VARCHAR(10) REFERENCES public.sip_watchlist(ticker) ON DELETE CASCADE,
    review_month DATE NOT NULL,        -- Ngày mùng 1 của tháng review (VD: 2026-05-01)
    
    intrinsic_value NUMERIC NOT NULL,  -- Giá trị nội tại tại thời điểm review
    market_price NUMERIC,              -- Giá lúc review
    ma200_value NUMERIC,               -- MA200 lúc review
    cta_status VARCHAR(50) NOT NULL,   -- MUA TỐT / MUA / TẠM DỪNG MUA
    
    disclaimer_text TEXT,              -- Đoạn text disclaimer gắn liền với báo cáo
    valid_until DATE,                  -- Thời hạn báo cáo (VD: Cuối quý)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Tránh tạo 2 báo cáo review cho cùng 1 mã trong cùng 1 tháng
    CONSTRAINT unique_ticker_month UNIQUE (ticker, review_month)
);

-- RLS (Row Level Security)
ALTER TABLE public.sip_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sip_monthly_reviews ENABLE ROW LEVEL SECURITY;

-- Cấp quyền read: Chỉ dành cho user đã đăng ký dịch vụ (Ví dụ: Giả sử qua app metadata, hiện tại cho phép đọc tạm thời, sau này update policies sau)
-- Tạm thời cho phép mọi user authenticated đọc (Sẽ nâng cấp lên check membership sau)
CREATE POLICY "Cho phép đọc sip_watchlist" ON public.sip_watchlist FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Cho phép đọc sip_monthly_reviews" ON public.sip_monthly_reviews FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Cấp quyền ALL cho admin/service_role
CREATE POLICY "Service role toàn quyền sip_watchlist" ON public.sip_watchlist USING (auth.role() = 'service_role');
CREATE POLICY "Service role toàn quyền sip_monthly_reviews" ON public.sip_monthly_reviews USING (auth.role() = 'service_role');

-- Trigger cập nhật updated_at cho sip_watchlist
DROP TRIGGER IF EXISTS update_sip_watchlist_updated_at ON public.sip_watchlist;
CREATE TRIGGER update_sip_watchlist_updated_at
    BEFORE UPDATE ON public.sip_watchlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

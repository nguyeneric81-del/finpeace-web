-- Bảng companies: Lưu trữ thông tin tĩnh của công ty
CREATE TABLE IF NOT EXISTS public.companies (
    ticker VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    exchange VARCHAR(20),
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng financial_quarterly_reports: Lưu trữ kết quả kinh doanh theo quý
CREATE TABLE IF NOT EXISTS public.financial_quarterly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticker VARCHAR(10) REFERENCES public.companies(ticker) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    report_type VARCHAR(50),           -- Tự lập, soát xét, kiểm toán, chính thức...
    
    market_cap NUMERIC,                -- Vốn hóa (Tỷ VNĐ) tại lúc ra báo cáo
    pe_ttm NUMERIC,                    -- P/E trượt 4 quý
    pb_ttm NUMERIC,                    -- P/B trượt 4 quý
    
    net_revenue NUMERIC,               -- Doanh thu thuần quý (Tỷ VNĐ)
    net_revenue_yoy NUMERIC,           -- Tăng trưởng doanh thu YoY (%)
    
    profit_after_tax NUMERIC,          -- Lợi nhuận sau thuế (Tỷ VNĐ)
    profit_after_tax_yoy NUMERIC,      -- Tăng trưởng LNST YoY (%)
    profit_plan_pct NUMERIC,           -- % Hoàn thành kế hoạch năm
    
    npat_mi NUMERIC,                   -- Lợi nhuận sau thuế Cổ đông công ty mẹ (Tỷ VNĐ)
    npat_mi_yoy NUMERIC,               -- Tăng trưởng NPAT-MI YoY (%)
    
    eps_plan NUMERIC,                  -- EPS kế hoạch (VNĐ)
    pe_plan NUMERIC,                   -- P/E kế hoạch
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Tránh insert lặp dữ liệu của cùng 1 doanh nghiệp trong 1 quý
    CONSTRAINT unique_ticker_year_quarter UNIQUE (ticker, year, quarter)
);

-- RLS (Row Level Security) cho các bảng
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_quarterly_reports ENABLE ROW LEVEL SECURITY;

-- Cấp quyền read cho mọi người
CREATE POLICY "Cho phép đọc companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Cho phép đọc financial_quarterly_reports" ON public.financial_quarterly_reports FOR SELECT USING (true);

-- Cấp quyền ALL cho admin (giả định role là authenticated hoặc service_role)
CREATE POLICY "Service role toàn quyền companies" ON public.companies USING (auth.role() = 'service_role');
CREATE POLICY "Service role toàn quyền reports" ON public.financial_quarterly_reports USING (auth.role() = 'service_role');

-- Trigger cập nhật updated_at (Nên có hàm update_updated_at_column trước đó)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.financial_quarterly_reports;
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.financial_quarterly_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

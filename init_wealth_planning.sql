-- ==============================================================================
-- MODULE: WEALTH PLANNING (KẾ HOẠCH TÀI CHÍNH CÁ NHÂN)
-- File thay thế cho Google Sheets: "Copy of Projection cá nhân"
-- ==============================================================================

-- 1. BẢNG CLIENT ASSETS (Thay thế Sheet: KYC tài sản hiện tại)
-- Lưu trữ chi tiết từng loại tài sản, phân loại mức độ rủi ro để tính điểm cấu trúc.
CREATE TABLE IF NOT EXISTS public.client_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    asset_group TEXT NOT NULL, -- Nhóm tài sản (Ví dụ: Thanh khoản, Đầu tư, Bảo vệ, Tiêu dùng)
    asset_name TEXT NOT NULL,  -- Tên tài sản cụ thể (Ví dụ: Sổ tiết kiệm VCB, Cổ phiếu FPT, Nhà phân lô)
    amount NUMERIC DEFAULT 0,  -- Giá trị hiện tại (VND)
    risk_level INTEGER CHECK (risk_level >= 1 AND risk_level <= 5), -- Mức độ rủi ro (1: Rất an toàn -> 5: Rất rủi ro)
    expected_return NUMERIC DEFAULT 0, -- Tỷ suất sinh lời kỳ vọng hàng năm (%)
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG WEALTH SCENARIOS (Thay thế Sheet: Khuyến nghị & Tóm lược)
-- Lưu trữ các kịch bản dòng tiền (Phương án A, Phương án B, Phương án C)
CREATE TABLE IF NOT EXISTS public.wealth_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_name TEXT NOT NULL, -- Tên phương án (Ví dụ: Plan A - An Toàn, Plan B - Bứt Phá)
    initial_capital NUMERIC DEFAULT 0, -- Số vốn ban đầu rót vào kịch bản này
    monthly_cashflow NUMERIC DEFAULT 0, -- Dòng tiền tích luỹ hàng tháng dành cho kịch bản này
    target_amount NUMERIC NOT NULL,     -- Mục tiêu tự do tài chính (VND)
    target_years INTEGER NOT NULL,      -- Số năm dự kiến đạt mục tiêu
    inflation_rate NUMERIC DEFAULT 3.0, -- Tỷ lệ lạm phát kỳ vọng (%)
    is_selected BOOLEAN DEFAULT false,  -- Đánh dấu nếu khách hàng chốt chọn phương án này
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG ACTION PLANS (Thay thế Sheet: ActionPlan)
-- Checklist công việc cần thực thi sau khi chốt Kế hoạch tài chính
CREATE TABLE IF NOT EXISTS public.action_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    scenario_id UUID REFERENCES public.wealth_scenarios(id) ON DELETE CASCADE, -- Liên kết với Kịch bản (Không bắt buộc)
    category TEXT NOT NULL, -- Phân loại (Ví dụ: Tái cấu trúc nợ, Ký quỹ đầu tư, Mua bảo hiểm)
    task_name TEXT NOT NULL, -- Tên công việc (Ví dụ: Tất toán thẻ tín dụng HSBC)
    amount_required NUMERIC DEFAULT 0, -- Số tiền cần thiết để thực hiện action này (nếu có)
    due_date DATE, -- Hạn chót
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')), -- Trạng thái
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- KÍCH HOẠT VÀ THIẾT LẬP BẢO MẬT RLS (ROW LEVEL SECURITY)
-- ==============================================================================

-- Kích hoạt RLS
ALTER TABLE public.client_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wealth_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

-- Policy cho Client Assets
CREATE POLICY "Users can view own assets" ON public.client_assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assets" ON public.client_assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assets" ON public.client_assets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own assets" ON public.client_assets FOR DELETE USING (auth.uid() = user_id);

-- Policy cho Wealth Scenarios
CREATE POLICY "Users can view own scenarios" ON public.wealth_scenarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scenarios" ON public.wealth_scenarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scenarios" ON public.wealth_scenarios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scenarios" ON public.wealth_scenarios FOR DELETE USING (auth.uid() = user_id);

-- Policy cho Action Plans
CREATE POLICY "Users can view own action plans" ON public.action_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own action plans" ON public.action_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own action plans" ON public.action_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own action plans" ON public.action_plans FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- KÍCH HOẠT REALTIME SUBSCRIPTION
-- ==============================================================================
-- Cho phép Frontend React lắng nghe sự kiện thay đổi trên các bảng này
-- để cập nhật Chart Thời gian thực.
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_assets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wealth_scenarios;
ALTER PUBLICATION supabase_realtime ADD TABLE public.action_plans;

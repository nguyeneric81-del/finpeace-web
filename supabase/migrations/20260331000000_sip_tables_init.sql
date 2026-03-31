-- sip_service_plans
CREATE TABLE IF NOT EXISTS public.sip_service_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stock_code TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  securities_company TEXT,
  securities_account TEXT,
  assigned_dealer TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- sip_asset_valuations
CREATE TABLE IF NOT EXISTS public.sip_asset_valuations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_code TEXT NOT NULL,
  update_date DATE,
  quarter_update TEXT,
  old_intrinsic_value NUMERIC,
  new_intrinsic_value NUMERIC,
  max_buy_price NUMERIC,
  expected_growth TEXT,
  cta TEXT,
  business_outlook TEXT,
  sip_outlook TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'Published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- sip_transactions
CREATE TABLE IF NOT EXISTS public.sip_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.sip_service_plans(id) ON DELETE CASCADE,
  order_date DATE,
  stock_code TEXT NOT NULL,
  buy_price NUMERIC,
  unit NUMERIC,
  total_value NUMERIC,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sip_performance_snapshots
CREATE TABLE IF NOT EXISTS public.sip_performance_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month TEXT,
  stock_code TEXT,
  cumulative_nav NUMERIC,
  sip_return_pct NUMERIC,
  vnindex_return_pct NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enable
ALTER TABLE public.sip_service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sip_asset_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sip_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sip_performance_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- sip_service_plans
CREATE POLICY "Users can view own sip_service_plans" ON public.sip_service_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all sip_service_plans" ON public.sip_service_plans FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- sip_transactions
CREATE POLICY "Users can view own sip_transactions" ON public.sip_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all sip_transactions" ON public.sip_transactions FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- sip_performance_snapshots
CREATE POLICY "Users can view own sip_performance_snapshots" ON public.sip_performance_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all sip_performance_snapshots" ON public.sip_performance_snapshots FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- sip_asset_valuations
CREATE POLICY "Anyone can view published sip_asset_valuations" ON public.sip_asset_valuations FOR SELECT USING (status = 'Published');
CREATE POLICY "Admins can manage all sip_asset_valuations" ON public.sip_asset_valuations FOR ALL USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

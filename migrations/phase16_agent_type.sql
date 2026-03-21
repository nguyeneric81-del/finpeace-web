-- ── Phase 16: Agent Type Classification ──────────────────────────────────────
-- Phân loại 2 mô hình Agent:
--   'inhouse'     = Chuyên viên nội bộ FinPeace Research (dùng brand FinPeace)
--   'independent' = Độc lập dùng công nghệ FinPeace (white label, brand riêng)
-- Chạy tại: https://supabase.com/dashboard/project/slooouceqcarcccryjyt/sql

-- STEP 1: Thêm column (default inhouse)
ALTER TABLE sales_agents
  ADD COLUMN IF NOT EXISTS agent_type TEXT NOT NULL DEFAULT 'inhouse'
    CHECK (agent_type IN ('inhouse', 'independent'));

-- STEP 2: Set 2 agents independent (huyen04, dmd01)
UPDATE sales_agents SET agent_type = 'independent'
  WHERE code IN ('huyen04', 'dmd01');

-- STEP 3: Confirm inhouse cho phần còn lại (redundant nhưng explicit)
UPDATE sales_agents SET agent_type = 'inhouse'
  WHERE code IN ('mq01', 'aduc02', 'thuy03', 'mduc05');

-- STEP 4: Verify
SELECT code, full_name, brand_name, agent_type FROM sales_agents ORDER BY created_at;

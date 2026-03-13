-- Sales Attribution Migration
-- Chạy file này trên Supabase SQL Editor

-- 1. Thêm cột sales_code vào kb_leads
ALTER TABLE kb_leads ADD COLUMN IF NOT EXISTS sales_code TEXT;
ALTER TABLE kb_leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'knowledgebase';

-- 2. Index để GROUP BY nhanh
CREATE INDEX IF NOT EXISTS idx_kb_leads_sales_code ON kb_leads(sales_code);
CREATE INDEX IF NOT EXISTS idx_kb_leads_source ON kb_leads(source);

-- 3. Xem kết quả
SELECT sales_code, COUNT(*) as total FROM kb_leads GROUP BY sales_code;

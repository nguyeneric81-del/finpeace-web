-- Phase 12: Raw News table for News Intelligence module
-- Lưu tin crawl thô từ Mac Mini trước khi analyst xử lý thành Macro Insights

CREATE TABLE IF NOT EXISTS raw_news (
  id           BIGSERIAL PRIMARY KEY,
  crawl_date   DATE NOT NULL,
  title        TEXT NOT NULL,
  link         TEXT,
  description  TEXT,
  source       TEXT,            -- VnEconomy, CafeBuddy, F319...
  published_at TIMESTAMPTZ,
  tags         TEXT[] DEFAULT '{}',        -- ['chứng khoán', 'vĩ mô', 'lãi suất']
  category     TEXT,                       -- macro / stock / sector / crypto
  tickers      TEXT[] DEFAULT '{}',        -- ['VHC', 'HPG', 'MWG']
  relevance    SMALLINT DEFAULT 1,         -- 1=thấp, 2=trung bình, 3=cao
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'ignored')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Index để query theo ngày nhanh
CREATE INDEX IF NOT EXISTS idx_raw_news_crawl_date ON raw_news (crawl_date DESC);
CREATE INDEX IF NOT EXISTS idx_raw_news_status ON raw_news (status);

-- Unique: tránh trùng link cùng ngày
CREATE UNIQUE INDEX IF NOT EXISTS idx_raw_news_link ON raw_news (link) WHERE link IS NOT NULL;

-- RLS
ALTER TABLE raw_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service full raw_news" ON raw_news FOR ALL USING (auth.role() = 'service_role');

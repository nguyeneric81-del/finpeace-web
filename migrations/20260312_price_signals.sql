-- =====================================================
-- Migration: Daily Price Signal System
-- Date: 2026-03-12
-- Chạy trong Supabase SQL Editor
-- =====================================================

-- 1. Bảng giá cổ phiếu theo ngày (upsert mỗi chiều 3h)
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  price NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'tcbs',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ticker, date)
);

-- 2. Bảng tín hiệu giao dịch (tự động rebuild mỗi ngày)
CREATE TABLE IF NOT EXISTS price_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  current_price NUMERIC NOT NULL,
  signal_type TEXT NOT NULL,
  -- 'reduce'         → giá < SL
  -- 'consider_buy'   → SL <= giá <= entry_low
  -- 'wait_pullback'  → entry_high < giá <= entry_high*1.05
  -- 'sell'           → giá ≈ TP (±3%)
  -- 'take_profit'    → giá > TP
  signal_label TEXT NOT NULL,
  signal_detail TEXT,
  plan_entry_low NUMERIC,
  plan_entry_high NUMERIC,
  plan_sl NUMERIC,
  plan_tp NUMERIC,
  generated_at TIMESTAMPTZ DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(ticker, date)
);

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_stock_prices_ticker_date ON stock_prices(ticker, date DESC);
CREATE INDEX IF NOT EXISTS idx_price_signals_date ON price_signals(date DESC);
CREATE INDEX IF NOT EXISTS idx_price_signals_ticker ON price_signals(ticker);

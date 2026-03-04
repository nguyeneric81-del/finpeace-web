-- Migration to add price_series to trading_plans table
-- This stores an array of relative price points extracted from chart images
-- to be used for portfolio covariance and optimization calculation

ALTER TABLE trading_plans 
ADD COLUMN IF NOT EXISTS price_series jsonb;

-- Example initial data format:
-- [1.0, 1.05, 0.98, ...]

-- Migration: Add allocation_assessment to customer_portfolios
-- Date: 2026-03-04

ALTER TABLE customer_portfolios 
ADD COLUMN IF NOT EXISTS allocation_assessment JSONB;

COMMENT ON COLUMN customer_portfolios.allocation_assessment IS 'AI-generated assessment of the portfolio allocation (sectors, risk, advice)';

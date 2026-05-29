-- ====================================================================
-- Migration: Add trading_plan_daily_reviews table for EOD Evaluation
-- Date: 2026-05-06
-- ====================================================================

-- 1. Create Enum for Action and Status if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_action_type') THEN
        CREATE TYPE review_action_type AS ENUM ('HOLD', 'TRIGGER_BUY', 'TAKE_PROFIT', 'STOP_LOSS', 'CANCEL');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_approval_status') THEN
        CREATE TYPE review_approval_status AS ENUM ('pending_approval', 'approved', 'rejected');
    END IF;
END $$;

-- 2. Create the evaluations table
CREATE TABLE IF NOT EXISTS trading_plan_daily_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES trading_plans(id) ON DELETE CASCADE,
    review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    eod_price NUMERIC,
    suggested_action review_action_type NOT NULL DEFAULT 'HOLD',
    agent_reasoning TEXT,
    status review_approval_status NOT NULL DEFAULT 'pending_approval',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure only one review per plan per day
    CONSTRAINT unique_plan_review_per_day UNIQUE (plan_id, review_date)
);

-- 3. Enable RLS
ALTER TABLE trading_plan_daily_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read/write their related plans (simplified for admin/service role)
-- Service Role will bypass this anyway, but good practice to have.
CREATE POLICY "Enable read access for authenticated users" ON trading_plan_daily_reviews
    FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Create indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_trading_plan_reviews_plan_id ON trading_plan_daily_reviews(plan_id);
CREATE INDEX IF NOT EXISTS idx_trading_plan_reviews_status ON trading_plan_daily_reviews(status);
CREATE INDEX IF NOT EXISTS idx_trading_plan_reviews_date ON trading_plan_daily_reviews(review_date);

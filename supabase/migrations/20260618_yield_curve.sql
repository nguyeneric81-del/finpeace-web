-- Migration: 20260618_yield_curve
-- Description: Create tables to store bond yields and extracted PCA factors

-- 1. Table for Raw Bond Yields
CREATE TABLE IF NOT EXISTS bond_yields (
    date DATE PRIMARY KEY,
    yield_1y NUMERIC,
    yield_2y NUMERIC,
    yield_3y NUMERIC,
    yield_5y NUMERIC,
    yield_10y NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Yield Curve Factors (PCA extracted)
CREATE TABLE IF NOT EXISTS yield_curve_factors (
    date DATE PRIMARY KEY REFERENCES bond_yields(date) ON DELETE CASCADE,
    level NUMERIC NOT NULL,
    slope NUMERIC NOT NULL,
    curvature NUMERIC NOT NULL,
    risk_signal TEXT CHECK (risk_signal IN ('Risk-On', 'Risk-Off', 'Neutral')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bond_yields_date ON bond_yields(date DESC);
CREATE INDEX IF NOT EXISTS idx_yield_curve_factors_date ON yield_curve_factors(date DESC);

-- Enable RLS
ALTER TABLE bond_yields ENABLE ROW LEVEL SECURITY;
ALTER TABLE yield_curve_factors ENABLE ROW LEVEL SECURITY;

-- Create Policies (Read-only for public, all for service role)
CREATE POLICY "Enable read access for all users on bond_yields"
    ON bond_yields FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users on yield_curve_factors"
    ON yield_curve_factors FOR SELECT USING (true);

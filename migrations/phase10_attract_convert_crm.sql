-- Migration: Attract & Convert CRM fields
-- Run via Supabase SQL Editor
-- Adds notes and CRM pipeline stage to agent_leads

ALTER TABLE agent_leads
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS crm_stage TEXT DEFAULT 'new'
    CHECK (crm_stage IN ('new', 'contacted', 'qualified', 'opened'));

-- Update existing rows that might have status info
UPDATE agent_leads
  SET crm_stage = status
  WHERE status IN ('new', 'contacted', 'converted')
    AND crm_stage = 'new';

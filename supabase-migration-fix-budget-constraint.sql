-- Migration: Fix budget CHECK constraint to match frontend values
-- The frontend sends budget values: under-10000, 10000-25000, 25000-50000, 50000-100000, 100000-plus
-- This was out of sync with the original constraint that expected: under-500, 500-1000, etc.

-- Drop the old constraint
ALTER TABLE project_requests DROP CONSTRAINT IF EXISTS valid_budget;

-- Add the corrected constraint matching the frontend values
ALTER TABLE project_requests ADD CONSTRAINT valid_budget
  CHECK (budget IN ('under-10000','10000-25000','25000-50000','50000-100000','100000-plus'));

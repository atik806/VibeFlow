-- Migration: Add user_id to project_requests table
-- Run this if you already have the project_requests table

-- Add user_id column if it doesn't exist
ALTER TABLE project_requests 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old policies
DROP POLICY IF EXISTS "Allow authenticated read" ON project_requests;

-- Create new policies
CREATE POLICY "Users can read own requests" ON project_requests FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

CREATE POLICY "Users can update own requests" ON project_requests FOR UPDATE USING (
  auth.uid() = user_id
);

-- Verify the table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'project_requests' 
ORDER BY ordinal_position;

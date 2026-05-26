-- Create requests table in Supabase
CREATE TABLE requests (
  id BIGSERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_data TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security if you want auth
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (adjust based on your needs)
CREATE POLICY "Allow public access" ON requests FOR ALL USING (true);

-- Error logs table for automatic error tracking
CREATE TABLE IF NOT EXISTS error_logs (
  id BIGSERIAL PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT,
  route TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access on error_logs" ON error_logs
  FOR ALL USING (true);

-- Project request submissions (via api/submit-request)
CREATE TABLE IF NOT EXISTS project_requests (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON project_requests FOR INSERT WITH CHECK (
  char_length(name) BETWEEN 2 AND 80
  AND char_length(email) BETWEEN 5 AND 254
  AND char_length(description) BETWEEN 20 AND 2000
);
CREATE POLICY "Allow authenticated read" ON project_requests FOR SELECT USING (auth.role() = 'authenticated');

-- Constraints for data integrity
ALTER TABLE project_requests ADD CONSTRAINT valid_budget
  CHECK (budget IN ('under-500','500-1000','1000-2500','2500-5000','5000+'));
ALTER TABLE project_requests ADD CONSTRAINT valid_status
  CHECK (status IN ('new','contacted','in-progress','completed','cancelled'));
ALTER TABLE project_requests ADD CONSTRAINT name_length
  CHECK (char_length(name) BETWEEN 2 AND 80);
ALTER TABLE project_requests ADD CONSTRAINT desc_length
  CHECK (char_length(description) BETWEEN 20 AND 2000);

ALTER TABLE requests ADD CONSTRAINT prompt_length
  CHECK (char_length(prompt) BETWEEN 1 AND 5000);

ALTER TABLE error_logs ADD CONSTRAINT msg_length
  CHECK (char_length(message) <= 2000);

-- Visitor tracking for admin online dashboard
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  page_path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can insert their own session" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Visitors can update their own session" ON visitor_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Only service role can read" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'service_role');

CREATE INDEX idx_visitors_active ON visitor_sessions (last_active_at);
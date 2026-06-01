-- Create requests table in Supabase
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_data TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security if you want auth
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (adjust based on your needs)
DROP POLICY IF EXISTS "Allow public access" ON requests;
CREATE POLICY IF NOT EXISTS "Allow public access" ON requests FOR ALL USING (true);

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
CREATE POLICY IF NOT EXISTS "Allow admin full access on error_logs" ON error_logs
  FOR ALL USING (true);

-- Project request submissions (via api/submit-request)
CREATE TABLE IF NOT EXISTS project_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Allow public insert (anonymous users)
CREATE POLICY IF NOT EXISTS "Allow public insert" ON project_requests FOR INSERT WITH CHECK (
  char_length(name) BETWEEN 2 AND 80
  AND char_length(email) BETWEEN 5 AND 254
  AND char_length(description) BETWEEN 20 AND 2000
);

-- Allow authenticated users to read their own requests
DROP POLICY IF EXISTS "Allow authenticated read" ON project_requests;
CREATE POLICY "Users can read own requests" ON project_requests FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow authenticated users to update their own requests (for admin)
CREATE POLICY IF NOT EXISTS "Users can update own requests" ON project_requests FOR UPDATE USING (
  auth.uid() = user_id
);

-- Constraints for data integrity
ALTER TABLE project_requests ADD CONSTRAINT valid_budget
  CHECK (budget IN ('under-10000','10000-25000','25000-50000','50000-100000','100000-plus'));
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

-- Extended profile fields (Phase 1 client dashboard)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;

-- Client messages table for dashboard communication
CREATE TABLE IF NOT EXISTS client_messages (
  id BIGSERIAL PRIMARY KEY,
  project_request_id BIGINT REFERENCES project_requests(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'admin')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read any client_messages (frontend filters by user_id)
DROP POLICY IF EXISTS "Users can read own messages" ON client_messages;
CREATE POLICY "Authenticated users can read all" ON client_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert their own messages
DROP POLICY IF EXISTS "Users can insert own messages" ON client_messages;
CREATE POLICY "Users can insert own messages" ON client_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND sender = 'client');

-- Allow service role full access (admin API)
CREATE POLICY IF NOT EXISTS "Service role full access on client_messages" ON client_messages
  FOR ALL USING (auth.role() = 'service_role');

-- Request updates table for status timeline
CREATE TABLE IF NOT EXISTS request_updates (
  id BIGSERIAL PRIMARY KEY,
  project_request_id BIGINT REFERENCES project_requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE request_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read own request updates" ON request_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM project_requests
      WHERE project_requests.id = request_updates.project_request_id
      AND (project_requests.user_id = auth.uid() OR project_requests.user_id IS NULL)
    )
  );

CREATE POLICY IF NOT EXISTS "Service role full access on request_updates" ON request_updates
  FOR ALL USING (auth.role() = 'service_role');

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

CREATE POLICY IF NOT EXISTS "Visitors can insert their own session" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Visitors can update their own session" ON visitor_sessions
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Only service role can read" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'service_role');

CREATE INDEX idx_visitors_active ON visitor_sessions (last_active_at);
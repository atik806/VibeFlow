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
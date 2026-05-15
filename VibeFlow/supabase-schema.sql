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
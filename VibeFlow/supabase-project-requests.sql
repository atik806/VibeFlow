-- Table for project brief / discovery call submissions
CREATE TABLE project_requests (
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

CREATE POLICY "Allow public insert" ON project_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON project_requests FOR SELECT USING (auth.role() = 'authenticated');

-- User profiles — created client-side after signup.
-- No trigger on auth.users — avoids internal 500 errors from
-- Supabase's built-in trigger conflicts. The client creates the
-- profile row after a successful auth.signUp().
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Drop known custom triggers on auth.users (built-in template triggers cause
-- "Database error saving new user" when they conflict with our schema).
-- System constraint triggers (RI_ConstraintTrigger_*) are left untouched.
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT tgname FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
      AND tgname NOT LIKE 'RI\_ConstraintTrigger\_%'
      AND tgname NOT LIKE 'trg\_encrypted\_%'
      AND tgname NOT LIKE 'repl\_%'
  LOOP
    EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(rec.tgname) || ' ON auth.users';
  END LOOP;
END $$;

-- Drop the function too so it doesn't linger unused
DROP FUNCTION IF EXISTS handle_new_user();

-- Link user_id to project_requests (nullable = anonymous submissions still allowed)
ALTER TABLE project_requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

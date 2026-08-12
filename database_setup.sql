-- 1. Create a table for notes
CREATE TABLE notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a storage bucket for note attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- 3. We intentionally leave Row Level Security (RLS) OFF or WEAK initially to demonstrate vulnerabilities!

-- In this initial state:
-- - The `notes` table does not have RLS enabled.
-- - ANY authenticated or unauthenticated user with the anon key can read, insert, update, or delete ANY note.
-- - The `attachments` storage bucket doesn't have policies.

-- (You can verify that RLS is disabled by checking the table settings in the Supabase Dashboard)

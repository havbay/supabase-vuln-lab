-- 1. Create a table for documents
CREATE TABLE documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a storage bucket for document files (PDFs, Images)
INSERT INTO storage.buckets (id, name, public) VALUES ('secure_files', 'secure_files', false);

-- 3. We intentionally leave Row Level Security (RLS) OFF initially to demonstrate vulnerabilities!

-- In this initial state:
-- - The `documents` table does not have RLS enabled.
-- - ANY authenticated or unauthenticated user with the anon key can read, insert, update, or delete ANY document in the entire system.
-- - The `secure_files` storage bucket doesn't have policies, meaning anyone can download anyone else's files.

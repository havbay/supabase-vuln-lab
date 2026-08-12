-- =============================================================
-- VaultShare Security Lab — Phase 1: INSECURE SETUP
-- =============================================================
-- Purpose:
--   Deploy a deliberately vulnerable database to demonstrate
--   what happens when Row Level Security (RLS) is NOT configured.
--
-- Vulnerabilities introduced:
--   1. RLS is DISABLED on the documents table
--      → Any request with the anon key can read ALL rows,
--        even without a user session.
--   2. Storage bucket has NO access policies
--      → Any authenticated user can list and download ANY file.
--   3. No role-based access control
--      → Every authenticated user has identical DB permissions.
--
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. Drop existing tables to start fresh
DROP TABLE IF EXISTS documents CASCADE;

-- 2. Create the documents table
CREATE TABLE documents (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. Create the storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('secure_files', 'secure_files', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Intentionally leave RLS DISABLED (default for new tables)
--    This is the insecure state we will test and then fix.
--
--    Verify with:
--    SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'documents';
--    → rowsecurity = false   means VULNERABLE

-- 5. Remove any existing policies to ensure a clean insecure state
DROP POLICY IF EXISTS "Users can view their own documents"   ON documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
DROP POLICY IF EXISTS "Users upload to own folder"           ON storage.objects;
DROP POLICY IF EXISTS "Users read own files"                 ON storage.objects;
DROP POLICY IF EXISTS "Users delete own files"               ON storage.objects;

-- Done. Database is now in INSECURE state.
-- Proceed to: scripts/test-vulns.sh to demonstrate the vulnerabilities.

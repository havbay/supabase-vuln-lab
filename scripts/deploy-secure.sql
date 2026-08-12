-- =============================================================
-- VaultShare Security Lab — Phase 2: SECURE SETUP
-- =============================================================
-- Purpose:
--   Apply the corrected Row Level Security (RLS) policies that
--   fix every vulnerability exposed in the insecure phase.
--
-- Changes made:
--   1. Enable RLS on the documents table
--      → The database now enforces per-user data isolation at
--        the Postgres level, regardless of client-side code.
--   2. Add SELECT, INSERT, DELETE policies scoped to auth.uid()
--      → Users can only access rows where user_id = their own UID.
--   3. Add Storage bucket policies scoped to folder = user UID
--      → Users can only upload/read/delete their own files.
--
-- Run this in: Supabase Dashboard → SQL Editor
-- Then re-run: scripts/test-vulns.sh to verify the fixes.
-- =============================================================


-- ── Part 1: Secure the documents table ──────────────────────

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT — users can only read their own documents
CREATE POLICY "Users can view their own documents"
  ON documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: INSERT — users can only insert rows for themselves
--   WITH CHECK ensures they cannot forge another user's user_id
CREATE POLICY "Users can insert their own documents"
  ON documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: DELETE — users can only delete their own documents
CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: UPDATE — users can only update their own documents
CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Part 2: Secure the Storage bucket ───────────────────────

-- Policy: INSERT — users can only upload to their own folder
--   Files must be stored at <user_id>/<filename>
CREATE POLICY "Users upload to own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'secure_files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: SELECT — users can only read their own files
CREATE POLICY "Users read own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'secure_files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: DELETE — users can only delete their own files
CREATE POLICY "Users delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'secure_files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ── Verify ───────────────────────────────────────────────────
-- Check RLS is now enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'documents';
-- → rowsecurity = true   means PROTECTED

-- List all active policies:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'documents';

# 🔒 VaultShare — Supabase Security Lab

> **A hands-on security lab disguised as a real SaaS product.**
>
> VaultShare is a fictional "Secure Document Exchange" platform for financial firms, built with React (Vite) and Supabase. The entire app is intentionally built **first in an insecure state** (no Row Level Security, open storage buckets) so you can learn to identify, exploit, and fix each vulnerability step by step.

---

## 🎯 Lab Objectives

| # | Goal | Status |
|---|------|--------|
| 1 | Build a full-stack app with Supabase Auth, Postgres, and Storage | ✅ |
| 2 | Learn and configure Row Level Security (RLS) policies | 🔜 |
| 3 | Test missing or weak RLS — read other users' documents | 🔜 |
| 4 | Test user-to-user record access (horizontal privilege escalation) | 🔜 |
| 5 | Test insecure Storage bucket and object permissions | 🔜 |
| 6 | Document insecure setup, apply corrected policies, and verify fixes | 🔜 |

---

## 🏗️ Application Structure

The app has three user-facing surfaces:

| Route | Who uses it | What it does |
|-------|-------------|--------------|
| `/` | Public | Landing page — marketing, features, pricing |
| `/auth` | Anyone | Login and Sign up |
| `/portal` | Clients | Upload financial documents (W-2s, tax returns, etc.) |
| `/admin` | Officers | View **all** client documents in a compliance dashboard |

---

## ⚠️ Intentional Vulnerabilities (Phase 1)

These are built-in for learning purposes. **Do not deploy this to production without fixing them.**

### 1. Row Level Security is OFF
The `documents` table has RLS disabled. This means:
- Any authenticated user can query `SELECT * FROM documents` and get **every record** from every client.
- The frontend *looks* secure because the React UI only requests `WHERE user_id = me`, but a malicious user can bypass the frontend entirely using the Supabase client directly in the browser console:
  ```js
  // Run this in the browser console while logged in as Client A
  // It will return EVERY document from EVERY client — a complete data breach
  const { createClient } = supabase;
  const { data } = await window.supabaseClient.from('documents').select('*');
  console.log(data);
  ```

### 2. Storage Bucket has No Policies
The `secure_files` bucket has no access policies. Any authenticated user can:
- List all files in the bucket
- Download any file uploaded by any other user

### 3. No Admin Role Check
The `/admin` route is only "protected" by the React Router — there is no server-side role check. Any logged-in user can navigate to `/admin` and see all documents.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- A [Supabase](https://supabase.com/) account (free tier is fine)

### Step 1 — Clone and Install

```bash
git clone git@github.com:havbay/supabase-vuln-lab.git
cd supabase-vuln-lab
npm install
```

### Step 2 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and click **New Project**.
2. Fill in a project name, a strong database password, and choose a region.
3. Wait for the project to finish provisioning (~2 minutes).

### Step 3 — Run the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar).
2. Click **New Query** and paste the entire contents of [`database_setup.sql`](./database_setup.sql).
3. Click **Run**. This creates:
   - The `documents` table (with RLS intentionally **disabled**)
   - The `secure_files` storage bucket (with **no** access policies)

### Step 4 — Connect the App

1. In your Supabase dashboard, go to **Project Settings → API**.
2. Copy your **Project URL** and **anon / public key**.
3. Open `.env.local` in the project root and fill in the values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5 — Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

### Step 6 — Create Test Users

Sign up two different accounts to simulate two separate clients:
- `client-a@test.com` / `password123`
- `client-b@test.com` / `password123`

Log in as Client A, upload a document. Then log in as Client B — and try to access Client A's files from the browser console to observe the vulnerability!

---

## 🔐 The Fix (Phase 2 — Coming Soon)

After exploring the vulnerabilities, we will apply proper RLS policies:

```sql
-- Enable RLS on the documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read their own documents
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can only insert their own documents
CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can only delete their own documents
CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);
```

And for Storage:

```sql
-- Allow users to upload to their own folder only
CREATE POLICY "Users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'secure_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own files only
CREATE POLICY "Users read own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'secure_files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 📁 Project Structure

```
supabase-vuln-lab/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client initialization
│   ├── pages/
│   │   ├── Landing.jsx          # Public marketing page
│   │   ├── Auth.jsx             # Login / Sign up
│   │   ├── UserPortal.jsx       # Client document upload portal
│   │   ├── AdminDashboard.jsx   # Compliance officer dashboard
│   │   └── MockPreview.jsx      # Preview shown when DB is not connected
│   ├── App.jsx                  # Router and auth state management
│   ├── index.css                # Design system and global styles
│   └── main.jsx                 # React entry point
├── database_setup.sql           # Initial (intentionally insecure) DB schema
├── .env.local                   # Your Supabase credentials (not committed)
└── README.md
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Supabase (Postgres, Auth, Storage) |
| Styling | Vanilla CSS with CSS Custom Properties |
| Icons | Lucide React |
| Router | React Router DOM v6 |

---

## 📚 Learning Resources

- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [Postgres RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

> Built for learning purposes. Do not use in production without completing Phase 2 security fixes.

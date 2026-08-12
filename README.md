# VaultShare — Supabase Security Lab

A hands-on security lab built around a realistic SaaS product.

VaultShare is a fictional "Secure Document Exchange" platform for financial firms, built with React (Vite) and Supabase. The app is intentionally deployed in two states — **insecure** and **secure** — so you can attack, observe, fix, and verify each vulnerability yourself.

---

## Lab Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Build a real full-stack app with Supabase Auth, Postgres and Storage | Done |
| 2 | Deploy in an intentionally insecure state (no RLS) | Done |
| 3 | Run the automated test suite and observe all failures | Done |
| 4 | Apply RLS policies and storage access controls | Phase 2 |
| 5 | Re-run the same tests and observe all passing | Phase 2 |
| 6 | Document all findings and policy explanations | This README |

---

## Application Structure

VaultShare simulates a document exchange portal for CPAs and financial advisors.

| Route | Who | Purpose |
|-------|-----|---------|
| `/` | Public | SaaS landing page with features and pricing |
| `/auth` | Anyone | Login / Sign up |
| `/portal` | Clients | Upload financial documents (W-2s, tax returns, etc.) |
| `/admin` | Officers | Compliance dashboard — review all uploaded documents |

---

## Setup

### Prerequisites
- Node.js 18+ and npm
- A [Supabase](https://supabase.com/) account (free tier is fine)

### 1 — Clone and install

```bash
git clone git@github.com:havbay/supabase-vuln-lab.git
cd supabase-vuln-lab
npm install
```

### 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com/) and create a new project
2. Set a project name and a strong database password
3. Wait roughly 2 minutes for provisioning to complete

### 3 — Run the insecure schema

1. Open the **SQL Editor** in your Supabase dashboard
2. Paste the contents of [`scripts/deploy-insecure.sql`](./scripts/deploy-insecure.sql)
3. Click **Run**

### 4 — Connect the app

1. Go to **Project Settings > API**
2. Copy the **Project URL** and **anon / public key**
3. Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5 — Run locally

```bash
npm run dev
# Open http://localhost:5173
```

---

## The Security Test Suite

The automated test suite in [`scripts/test-vulns.sh`](./scripts/test-vulns.sh) probes the API using only the **anon key** — the public key that is visible in the browser's compiled JavaScript bundle. No login, no session required.

```bash
chmod +x scripts/test-vulns.sh
./scripts/test-vulns.sh
```

The script tests five vulnerability classes:

| Test | Attack | Severity |
|------|--------|----------|
| T1 | Unauthenticated SELECT — read all records | Critical |
| T2 | Unauthenticated INSERT — write without an account | High |
| T3 | Unauthenticated DELETE — destroy data without login | Critical |
| T4 | Storage bucket enumeration — list all uploaded files | High |
| T5 | Schema discovery via REST API | Medium |

---

## Phase 1 — Insecure Results

Run after applying [`scripts/deploy-insecure.sql`](./scripts/deploy-insecure.sql):

```
══════════════════════════════════════════════════════
  VaultShare — Supabase Security Lab Test Suite
══════════════════════════════════════════════════════

TEST 1: Unauthenticated SELECT on documents table
→ No login. No session. Just the anon key from the browser JS.
VULNERABLE — Got real data with no authentication!

[
  { "title": "2025 Federal Tax Return", "description": "SSN and full income details attached." },
  { "title": "Bank Statement - March 2026", "description": "Account #4521-XXXX. Balance: $48,200." },
  { "title": "Investment Portfolio Q1 2026", "description": "Brokerage totaling $1.2M." },
  ...
]

TEST 2: Unauthenticated INSERT
VULNERABLE — Wrote a record without any account!

TEST 3: Unauthenticated DELETE
VULNERABLE — Deleted records anonymously!

TEST 4: Storage bucket enumeration
SECURE — No public files exposed.

TEST 5: Schema discovery
SECURE — Table schema not exposed.

RESULTS: 2 passed  |  3 failed
INSECURE STATE DETECTED
```

### Why this happens

Supabase exposes a REST API at `https://<project>.supabase.co/rest/v1/`. The anon key is embedded in your compiled JavaScript bundle — anyone can copy it from DevTools in seconds.

Without RLS, a single curl command dumps your entire database with no authentication at all:

```bash
curl 'https://<project>.supabase.co/rest/v1/documents?select=*' \
  -H 'apikey: <anon_key>' \
  -H 'Authorization: Bearer <anon_key>'
```

The frontend appears secure because the React UI only queries `WHERE user_id = me`. This is client-side filtering. An attacker ignores the React app entirely and calls the API directly.

---

## Phase 2 — Applying the Fix

Open the **Supabase SQL Editor**, paste and run [`scripts/deploy-secure.sql`](./scripts/deploy-secure.sql), then re-run the test suite:

```bash
./scripts/test-vulns.sh
```

### What the fix does

#### 1. Enable Row Level Security on the documents table

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

This activates Postgres's built-in per-row access control. With RLS enabled, all rows are hidden by default unless a policy explicitly grants access. The database enforces this at the engine level — it cannot be bypassed from client-side code.

#### 2. Scope SELECT to the authenticated user

```sql
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);
```

`auth.uid()` is injected by Supabase from the JWT token in the Authorization header. If no valid session exists, `auth.uid()` returns null, and `null = user_id` is always false — so unauthenticated requests return zero rows.

#### 3. Scope INSERT so users cannot forge ownership

```sql
CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

`WITH CHECK` validates the incoming data. Without this, an authenticated user could insert a row with another user's `user_id`, effectively claiming ownership of documents that are not theirs.

#### 4. Scope DELETE and UPDATE to the row's owner

```sql
CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);
```

Without this, any authenticated user can delete any row, including rows they did not create.

#### 5. Scope Storage to the user's own folder

```sql
CREATE POLICY "Users upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'secure_files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

Files are stored at `<user_id>/<filename>`. This policy checks that the first folder segment matches the authenticated user's UID, so a user cannot upload to or read from another user's folder.

---

## Phase 2 — Secure Results (Expected)

After applying `deploy-secure.sql` and re-running the test suite:

```
TEST 1: Unauthenticated SELECT
SECURE — Got empty result. RLS is working.
Response: []

TEST 2: Unauthenticated INSERT
SECURE — Insert blocked. RLS is working.

TEST 3: Unauthenticated DELETE
SECURE — Delete blocked by RLS.

TEST 4: Storage enumeration
SECURE — No files exposed.

TEST 5: Schema discovery
SECURE — Table schema not exposed.

RESULTS: 5 passed  |  0 failed
ALL TESTS PASSED — Database is properly secured.
```

---

## Bonus Finding — Broken Access Control on /admin

The `/admin` route is protected only by React Router:

```js
// Only checks: are you logged in? NOT: are you an admin?
<Route path="/admin" element={session ? <AdminDashboard /> : <Navigate to="/auth" />} />
```

Any registered client can navigate to `/admin` and see all documents in the compliance dashboard. This maps to OWASP A01:2021 — Broken Access Control.

**The fix:** Add a `role` column to a `profiles` table and enforce it server-side using an RLS policy or a Supabase Edge Function before returning any admin-scoped data.

---

## Project Structure

```
supabase-vuln-lab/
├── scripts/
│   ├── deploy-insecure.sql     Phase 1: intentionally vulnerable schema
│   ├── deploy-secure.sql       Phase 2: hardened schema with RLS policies
│   └── test-vulns.sh           Automated curl-based vulnerability test suite
├── src/
│   ├── lib/supabase.js         Supabase client initialization
│   ├── pages/
│   │   ├── Landing.jsx         Public marketing page
│   │   ├── Auth.jsx            Login and sign up
│   │   ├── UserPortal.jsx      Client document upload portal
│   │   ├── AdminDashboard.jsx  Compliance officer dashboard
│   │   └── MockPreview.jsx     Preview shown when DB is not connected
│   ├── App.jsx                 Router and auth state
│   └── index.css               Design system
├── .env.local                  Supabase credentials (not committed to git)
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Supabase (Postgres, Auth, Storage) |
| Styling | Vanilla CSS with CSS Custom Properties |
| Icons | Lucide React |
| Router | React Router DOM v6 |

---

## Further Reading

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
- [OWASP A01:2021 — Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [OWASP A07:2021 — Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- [Postgres Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

Built for learning purposes. Do not deploy the insecure state to production.

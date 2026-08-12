#!/usr/bin/env bash
# =============================================================
# VaultShare Security Lab — Vulnerability Test Suite
# =============================================================
# Usage:
#   chmod +x scripts/test-vulns.sh
#   ./scripts/test-vulns.sh
#
# What it tests:
#   T1 — Unauthenticated SELECT (no session, anon key only)
#   T2 — Unauthenticated INSERT (write data without logging in)
#   T3 — Unauthenticated DELETE (delete any record by ID)
#   T4 — Storage bucket enumeration (list all files)
#   T5 — Table schema enumeration via PostgREST
#
# Expected results:
#   INSECURE state → All tests return data or succeed (FAIL)
#   SECURE state   → All tests return [] or 401/403 (PASS)
# =============================================================

# ── Config ───────────────────────────────────────────────────
SUPABASE_URL="https://gyetiyjbqerfqqilatbv.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5ZXRpeWpicWVyZnFxaWxhdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDc0ODQsImV4cCI6MjEwMjA4MzQ4NH0.YvxDg5nwkcE0_Pro6X82RqWBBkg-cf9opLZPUAnNES0"

# ── Helpers ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

PASS=0
FAIL=0

print_header() {
  echo ""
  echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}"
  echo -e "${BOLD}${CYAN}  VaultShare — Supabase Security Lab Test Suite       ${RESET}"
  echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}"
  echo ""
}

print_test() {
  echo -e "${BOLD}────────────────────────────────────────────${RESET}"
  echo -e "${BOLD}$1${RESET}"
  echo -e "${YELLOW}→ $2${RESET}"
}

check_result() {
  local response=$1
  local test_name=$2

  # Empty array or error = secure
  if echo "$response" | grep -q '"code"' || [ "$response" = "[]" ]; then
    echo -e "${GREEN}✅  SECURE   — Got empty result or error. RLS is working.${RESET}"
    echo -e "Response: $response"
    PASS=$((PASS + 1))
  else
    echo -e "${RED}🔴  VULNERABLE — Got real data with no authentication!${RESET}"
    echo ""
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
    FAIL=$((FAIL + 1))
  fi
}

# ── Run Tests ─────────────────────────────────────────────────
print_header

# ── T1: Unauthenticated SELECT ───────────────────────────────
print_test "TEST 1: Unauthenticated SELECT on documents table" \
  "No login. No session. Just the anon key visible in the browser JS bundle."
echo -e "${YELLOW}Severity: CRITICAL — Exposes all client financial documents to the public internet${RESET}"
echo ""
RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/documents?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}")
check_result "$RESPONSE" "T1"

# ── T2: Unauthenticated INSERT ───────────────────────────────
print_test "TEST 2: Unauthenticated INSERT into documents table" \
  "Can an anonymous user write data into the database?"
echo -e "${YELLOW}Severity: HIGH — Allows data pollution and spam without any account${RESET}"
echo ""
RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/documents" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"title":"HACKED","description":"Injected by unauthenticated attacker","user_id":null}')
check_result "$RESPONSE" "T2"

# ── T3: Unauthenticated DELETE ───────────────────────────────
print_test "TEST 3: Unauthenticated DELETE — wipe all documents" \
  "Can an anonymous user delete every record in the table?"
echo -e "${YELLOW}Severity: CRITICAL — Complete data destruction without any login${RESET}"
echo ""
# Use a filter that matches nothing real, so we don't actually destroy real data during testing
RESPONSE=$(curl -s -X DELETE "${SUPABASE_URL}/rest/v1/documents?title=eq.HACKED" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Prefer: return=representation")

# For DELETE, an empty response also means RLS blocked it
if [ -z "$RESPONSE" ] || echo "$RESPONSE" | grep -q '"code"'; then
  echo -e "${GREEN}✅  SECURE   — Delete was blocked by RLS.${RESET}"
  echo -e "Response: ${RESPONSE:-'(empty — blocked)'}"
  PASS=$((PASS + 1))
else
  echo -e "${RED}🔴  VULNERABLE — Unauthenticated delete succeeded!${RESET}"
  echo "$RESPONSE"
  FAIL=$((FAIL + 1))
fi

# ── T4: Storage Bucket Enumeration ──────────────────────────
print_test "TEST 4: Storage bucket enumeration" \
  "Can an anonymous user list all uploaded files in the bucket?"
echo -e "${YELLOW}Severity: HIGH — Exposes all file paths and metadata to anonymous users${RESET}"
echo ""
RESPONSE=$(curl -s "${SUPABASE_URL}/storage/v1/object/list/secure_files" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"prefix":"","limit":100}' \
  -X POST)
check_result "$RESPONSE" "T4"

# ── T5: Schema Enumeration ───────────────────────────────────
print_test "TEST 5: REST API schema discovery" \
  "Does the PostgREST API expose table definitions to anonymous users?"
echo -e "${YELLOW}Severity: MEDIUM — Reveals your database structure, table names and column types${RESET}"
echo ""
RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${ANON_KEY}")
if echo "$RESPONSE" | grep -q '"documents"'; then
  echo -e "${RED}🔴  INFO LEAK — Table schema is publicly visible via the REST API${RESET}"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null | head -30
  FAIL=$((FAIL + 1))
else
  echo -e "${GREEN}✅  SECURE — Table schema not exposed.${RESET}"
  PASS=$((PASS + 1))
fi

# ── Summary ───────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}"
echo -e "${BOLD}  RESULTS: ${GREEN}${PASS} passed${RESET}${BOLD}  |  ${RED}${FAIL} failed${RESET}"
echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════════${RESET}"
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}${BOLD}⚠  INSECURE STATE DETECTED${RESET}"
  echo -e "  Run ${BOLD}scripts/deploy-secure.sql${RESET} in the Supabase SQL Editor"
  echo -e "  then re-run this script to verify the fixes."
else
  echo -e "${GREEN}${BOLD}✅  ALL TESTS PASSED — Database is properly secured!${RESET}"
fi
echo ""

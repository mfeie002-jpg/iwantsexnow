# P0.4 – Internal analyzer proxy hardening

Timestamp: 2026-10-20. Repo: mfeie002-jpg/iwantsexnow. Source changes only.

## Problem observed
`src/pages/api/supabase-function.ts` previously allowed public POST callers to specify arbitrary Supabase Edge-function names and forwarded each request using the anonymous key. The public `/web-analyzer` interface used that proxy without login. This exposed downstream tasks to untrusted callers, even though the intended interface is an internal admin tool.

## Precise fix
- Allowlist exactly five analyzer functions used by the Web Analyzer UI: `capture-screenshot`, `fetch-html`, `ai-website-analyze`, `firecrawl-map`, `capture-rendered-html`. Other functions are rejected with HTTP 400.
- The server requires `Authorization: Bearer <JWT>`. It validates the token with Supabase Auth's `/auth/v1/user` and verifies an `admin` role via the user's own JWT at `/rest/v1/user_roles` under existing RLS. Missing token yields 401, insufficient role 403; no implicit administrative privilege.
- Calls to the selected Edge functions use that verified **user JWT** plus the public `apikey`, never the Supabase service-role key. Invalid configuration or upstream errors fail closed.
- The existing `src/pages/web-analyzer.tsx` acquires the current admin session via Supabase Auth before its eight API calls and attaches the access token. This preserves the intended admin workflow without permitting anonymous invocations.
- Requests use no-store, 256kB body limit, a narrow payload structure, and generic errors without token/raw source leakage.

## QA performed
- `npx tsc --noEmit`: PASS.
- `npm run build` Next.js 15.5.9: PASS, 49 static pages and an API route. Existing repository lint notices remain.
- `node --experimental-strip-types --test tests/analyzer-proxy.test.mjs`: **12/12 PASS**.
- Local Next.js bound to `127.0.0.1:43127` with `node scripts/analyzer-api-http-smoke.mjs`: **5/5 PASS** (405 for GET; 400 for invalid/unknown functions; 401 for missing/malformed bearer); local server terminated after test.
- `node scripts/preview-smoke.cjs`: **169/169 PASS**.
- Full admin JWT with a live provisioned Supabase role was NOT tested; requires an authenticated admin user and live schema inspection.

## Important remaining boundary
This changes the **Next.js proxy**, not the upstream Edge functions. Some Supabase function configurations in the repository allow direct unauthenticated calls. Those URLs, authentication settings and database RLS must be reviewed separately through the existing Softgen-managed Supabase. Do not claim end-to-end Supabase access control from this PR alone.

## Release
GitHub merge and production Softgen deployment are separate. If approved, merge exact SHA, then use the existing Softgen **Force Pull from Main Branch** (correct repo `mfeie002-jpg/iwantsexnow`) followed by its managed Vercel **Redeploy** and read-only smoke checks. No migrations, user data, secrets, new providers, payments or accounts were touched.

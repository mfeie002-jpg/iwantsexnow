# IWSN · Softgen release candidate reconciled to latest main

Date: 27 November 2026 (Europe/Zurich)

## Sources and isolation

- Current upstream `origin/main`: `616cacd` (Xenia visitor-search PR #24 merged).
- Existing release PR #25: branch `release/iwsn-quality-private-reports-20261127`, original head `c9d3124`.
- Reconciliation worktree: `C:\Users\thest\Documents\GitHub\rearea\iwantsexnow-softgen-deploy-candidate`.
- The Git merge had three conflicts limited to CI YAML and two regression tests; resolved preserving the newer main readiness loop, strict dependency checks and fail-closed test policy.
- Site route / database source files merged cleanly. Neither original local `main` nor any active user worktree was changed.
- No database migration, provider contact, case submission or production publish was executed.

## Local clean-package verification

| Gate | Result |
|---|---|
| `npm ci --legacy-peer-deps --no-audit --no-fund` | PASS, Next.js 15.5.29 |
| `npm run build` | PASS, optimized production build |
| `npm run lint -- --quiet` | PASS, zero ESLint errors |
| CI/dependency focused checks | PASS, 5/5 |
| `node --test tests/*.test.mjs`, `IWSN_TEST_BASE_URL=http://127.0.0.1:4277` | PASS, **285/285** |
| Chrome 390×844, paginated search and saved selection | PASS, 24 → 48 cards, one page API call |
| Chrome 390×844, confidential report form | PASS, accessible validation, no real submission |
| Read-only local release smoke | PASS, 4/4 |

The local tests use data fixtures and mocked services for privacy-dependent paths. A passing build is **not** a claim about the current Softgen-managed database, RLS or legal publishing permissions.

## Public drift, independently reproduced

- `https://iwantsexnow.ch/` still returns the older page shell and two `<footer>` tags.
- `/search` and `/report` also do not match the new Night shell.
- The paginated `/api/catalogue/page` has not been detected on the deployed host.
- Read-only live smoke: **0/4 PASS**. The newer source revision has not been verified as deployed.

## Deployment prerequisites

1. In the **existing Softgen project**, confirm its GitHub repository/branch and revision, custom domain and rollback reference. Do not create a second database or a replacement hosting project.
2. Through the managed database console, verify the private `iwsn_report_cases` table, row-level security, anonymous/authenticated permissions and intake operation, using `docs/verification/SOFTGEN-READONLY-PREFLIGHT-20261127.sql` (metadata only, SELECT-only).
3. Reconcile publication rights, consent and adulthood evidence for real imported provider records and photos. Unverified source flags cannot be treated as proof.
4. Use the successful actual GitHub CI checks on the reconciled PR, confirm the release SHA in Softgen, and only then publish the approved revision.
5. Immediately run `IWSN_RELEASE_ORIGIN=https://iwantsexnow.ch node scripts/verify-public-release.mjs`; if the smoke fails, stop/rollback rather than claiming a successful release.

No part of this note authorizes writing to a live database or exposing imported third-party images without valid rights.

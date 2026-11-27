# Release quality and private report intake candidate

Date: 2026-11-27. Scope: technical quality, confidential report intake, accessibility, and regression prevention. No production approval.

## Source provenance

- Base main: 333cbe00b6eadebad198727bfd9c716064e63896.
- Existing CI and runtime correction: 0f6ce85 (tested code fbc50fd).
- Prior integration candidate: e0ab5dd.
- Private report corrections through: 643baad, including database deadlines (a448f96), retry deduplication (166e9c3), and reload contract tests (d0193ef).
- The technical tree was reconciled without conflicts. This branch is intentionally based directly on main and contains the 24 reviewed technical files, without the local raw logs from intermediate commits.
- Tested staged tree (before this documentation-only addition): 52f3dcd6608b43b2e9988c6f18c93b85a8d08f5f.

## Fresh local QA of the initial integration

Windows, Node 26.4.0, isolated worktree, no production service credentials.

| Check | Result |
| --- | --- |
| npm ci --legacy-peer-deps --no-audit --no-fund --prefer-offline | Exit 0; 672 installed packages |
| npm run lint -- --quiet | Exit 0 |
| TypeScript no-emit, nonincremental | Exit 0 |
| npm run build | Exit 0; 47/47 static pages; shared first-load JS 143 KB |
| Loopback production server | HTTP 200; homepage 48,666 uncompressed UTF-8 bytes; one footer |
| node --test tests/*.test.mjs | 264 passed, zero failed, zero cancelled, zero skipped |
| git diff --cached --check | Exit 0 |

Test server stopped after QA. Raw logs are retained locally, not published. Added-line secret pattern screening flagged only three intentionally invalid credential-shaped test URLs using example.invalid; no confirmed secret hit. No profile datasets or media changed.

## Technical follow-up

The isolated review retained the stronger existing CI checks and reconciled the newer technical workflow changes from 135063e: invoke the installed TypeScript binary directly, track the actual Next server process, bound each readiness request to five seconds, and reject `continue-on-error: true`. The unrelated visitor-search changes from that branch are excluded.

A fresh production dependency audit reported three moderate advisories against the single Next.js dependency at 15.5.28. Next.js and its ESLint configuration are updated together to 15.5.29; only their matched framework packages change in the lockfile. Existing PostCSS and selector-parser overrides are preserved. The vendor identifies this patch in its [November security release](https://nextjs.org/blog/november-2026-security-release). This is dependency remediation, not evidence of an exploited application vulnerability. The initial QA table above predates this follow-up; the PR records the final commit's fresh installation, build, tests, audit and CI results.

## Remaining release gates

GitHub Actions must independently pass the strict quality workflow. The previous green status on main was misleading because its build command suppressed failures. Local tests do not establish production database readiness, publication rights, or actual PostgreSQL/PostgREST concurrency behavior. Retry recovery is scoped to a retained random submission key, not globally across devices; optional notification delivery is not guaranteed after response loss. The existing report table migration, real RLS, abuse prevention, intake operations and durable opt-out/removal behavior require target-environment verification. No production configuration or database was changed.

Softgen remains the deployment-management workflow. No merge into main, Softgen Publish, or production deployment is authorized by this candidate.

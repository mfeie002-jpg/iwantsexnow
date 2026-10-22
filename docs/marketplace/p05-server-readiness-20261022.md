# P0.5: server session and blocked provider readiness — 22 October 2026

## Scope and repository evidence

Active repository: https://github.com/mfeie002-jpg/iwantsexnow (GitHub reports public, not archived, default branch main).
Inspected base: `3185a5be57c63a26e2a3a6cea9647b19ddddc3ab`, tree `61c5dad401d871f653ef25cc76097859ab672622`.
This supersedes the previously referenced `482ebd0e0c7cde2d84fb710b6a848ed252953e7b` and preserves merged PR #5.
Branch: `feat/p05-server-provider-eligibility-20261022`. The archived repository was not accessed.
The referenced ChatGPT preview contained no P0.5 implementation details; a ChatGPT read_thread tool was unavailable. The user's current explicit scope governs this change.

This is the minimal safe, **read-only P0.5 foundation**, not completed production authentication/onboarding or a release authorization. No database, auth settings, Edge deployment, storage, content, payments, external identity service, Softgen synchronization or live deployment was changed.

## Implemented behavior

- `GET /api/marketplace/session`: verifies the supplied Bearer token with the configured existing Supabase `GET /auth/v1/user` on every request. Only a UUID subject with Auth-returned role `authenticated` and explicit `is_anonymous: false` succeeds. No decoded JWT, browser metadata, cookie or localStorage identity is trusted.
- The only returned account fields are subject UUID and email-confirmed boolean. Confirmation is never treated as identity, adulthood, consent or permission to publish. No email address, metadata, access/refresh token or upstream error is returned.
- `GET /api/marketplace/provider-status`: uses the same verification and returns `mode: demo`, onboarding `state: blocked` / `canSubmit: false`, and publication `eligible: false` with explicit blockers. This describes current-user readiness, **not an evaluation of an existing listing**: no trusted marketplace evidence store is connected.
- Both endpoints reject query parameters and nonempty bodies, accept only GET, set private/no-store and noindex headers, and never set cookies. Anonymous/invalid sessions get 401, invalid inputs 400, writes 405 with Allow, backend/configuration failures 503. Auth requests have a ten-second timeout and refuse redirects.
- Only the public anon/publishable configuration and the caller's user token are used; there is no service-role fallback, role grant, signup, refresh-token persistence, write adapter, listing submission or publication endpoint.
- No environment flag can turn on collection or publication. The existing publication policy and whitelist projection remain unchanged, unconnected to browser-supplied evidence.
- Public login/register/action gates and global noindex remain intact. Existing Analyzer API/auth flows are unchanged.

These endpoints can later consume an existing Supabase user access token; this PR intentionally adds no public login or credential form. It does not implement cookie sessions, refresh, recovery, logout or prove immediate access-token revocation. Supabase Auth determines token validity; lifecycle and revocation acceptance remain required.

## Supabase source audit (not live database evidence)

Inspected `supabase/config.toml`, both committed migrations, all eight Edge handler entry points, admin login/session usage, the Analyzer proxy, publication policy and SQL candidate.

- Config contains local/template settings: localhost site URL, empty redirect allowlist, email confirmations disabled, signup enabled, placeholder JWT secret and legacy-looking `edge_functions` / `api.jwt` sections. These are not proof of deployed Auth or function configuration. Do not blindly push this config.
- Two migrations share the 20250121 version prefix, define incompatible versions of several tables and different has_role signatures (text vs app_role). CREATE TABLE IF NOT EXISTS does not reconcile them. Their replay order, deployed ledger, role grants and SECURITY DEFINER function resolution require inspection before any migration.
- The complete migration declares RLS for eleven Analyzer tables, owner profile reads/updates, own-role reads and admin-managed roles. None of this proves actual deployed grants/RLS. Do not reuse Analyzer `profiles` as provider verification.
- **Release blocker:** the policy named "Public can view reports by token" actually uses `USING (true)`, without token binding. If deployed with SELECT grants it allows broad report reads. Cache SELECT policies are also broad. The screenshots archive is declared public and is unsuitable for identity evidence. This PR does not query any report/cache/object rows.
- The candidate `docs/marketplace/schema-candidate.sql` is outside migrations and is not a deployed schema. Its draft, verification, moderation and public projection design has no audited mapping to the existing TypeScript provenance/consent policy, revocation ledger or real verification issuer. No provider schema is assumed by the new endpoints.
- None of the eight Edge handler sources calls getUser or queries user_roles. Config marks fetch-html, capture-rendered-html, firecrawl-map and lighthouse as not requiring JWT. Other functions are marked JWT-protected, which by itself does not enforce an admin role. scheduled-screenshots uses a service-role client to write archives; calling it could mutate data. **No Edge function was invoked.**
- Wildcard CORS and arbitrary URL inputs in Analyzer functions require a separate authorization, SSRF, rate/cost-limit and error-disclosure review. The existing guarded Next proxy does not protect direct Edge URLs.
- Existing admin login uses Supabase SDK browser session persistence and a role query; it includes an admin signup option. Public marketplace login/register are blocked placeholders. The new endpoints neither rely on nor alter those browser checks.
- No connected Supabase management tool or verified project identifier/management access was available. Live schema, grants, migration history, RLS, buckets, email/SMTP, redirect allowlist, session settings, Edge versions/secrets and schedules remain **unverified**. No credentials were searched for or copied.

`p05-managed-audit.sql` is a proposed operator-run catalog-only transaction using READ ONLY and ROLLBACK. It is outside migrations and was **not executed**. Review exported function definitions privately and redact any unexpected embedded secret before attaching evidence.

## Public site and deployment audit

Read-only public checks on 22 October 2026:

- Existing `node scripts/verify-live-release.mjs`: **8/8 passed** for /, /register, /login, /booking-confirmation, /verify, /create-post, /privacy and /terms, including noindex and blocked-action text.
- Additional GETs: /, /register, /login, /create-post, /contact and /imprint returned 200, demo notice and HTML noindex. Server header: Vercel. Next build ID: `SLbgqIWEFZAylmc1J4qju`.
- The two new API routes returned 404 on production before this change, as expected. This is not deployment evidence for the PR.
- Vercel connector lookup for iwantsexnow.ch returned deployment_not_found (404); team discovery and repository-filtered project discovery returned empty lists. No connected deployment settings, preview or production commit could be verified.
- GitHub combined status lookup for the base returned no status entries. A Next build ID is not a Git SHA. **Do not claim main or this PR is deployed from these checks.**

## Validation

| Check | Result |
|---|---|
| Locked install | npm ci --no-audit --no-fund passed (824 packages); no dependency/lock changes |
| TypeScript | npx-equivalent local tsc --noEmit passed after install |
| Production build | npm run build passed, Next 15.5.9; 51 static pages plus dynamic APIs; existing lint/deprecation warnings |
| Publication policy | 19/19 passed |
| Analyzer policy | 12/12 passed |
| Built API handler security tests | 19/19 new provider tests + 3/3 existing Analyzer tests passed |
| Public preview smoke | 173/173 assertions, 51 static pages, passed |
| Preview integrity | 2,206/2,206 assertions; 358 internal links to 49 paths, passed |
| Local provider API HTTP rejection | 10/10 passed |
| Local Analyzer API HTTP rejection | 5/5 passed |
| Local preview HTTP sweep | 68/68 routes, 12/12 action gates; noindex preserved |
| Public live release check (existing deployment) | 8/8 passed; does not identify deployed commit |
| Dependency security audit | **FAILED release gate:** 52 findings: 3 critical, 37 high, 9 moderate, 3 low |
| Diff hygiene | git diff --check passed |

Local runtime: Node v24.19.0 on Windows X1; committed CI retains Node 22 on Ubuntu. The first typecheck was started before npm ci finished and failed on missing dependencies; it was rerun after the completed install and passed. The initial audit-summary reader failed on PowerShell's UTF-16 output; the JSON was then decoded correctly. Neither initial tooling failure is presented as a passing check.

The dependency findings are inherited from the unchanged lockfile. `p05-dependency-audit-20261022.json` records counts, critical advisory links and registry-proposed fixes. Next 15.5.28 is the reported compatible Next fix; jsPDF 4.2.1 and the suggested Vercel CLI fix require major-version review. Applicability depends on features/runtime; this was not exploit-tested. Remediate and rerun the full build/security suite before a production release; no automatic audit-fix was applied.

Tests mock Auth for all successful sessions; no real account or token was used. HTTP tests use loopback only and exercise rejection paths, never signup, publication or an upstream action.

## Precise completion steps

1. Review/merge this source-only foundation through normal repository review. Confirm the PR CI and preserve demo/noindex and all existing gates. This PR itself does not authorize deployment or activation.
2. Remediate the dependency audit in a separate tested patch (start with Next, jsPDF and the Vercel/tar dependency chain); rerun the registry audit, build and regression suite. In the **existing Softgen-managed project**, have its operator review/run the catalog-only inventory and export dashboard metadata without secrets. Record actual migration versions, schemas, grants, policies, Auth confirmation/SMTP/redirect/session settings, Edge versions/JWT enforcement and schedules. Resolve the conflicting migration history in a staging clone with backup and rollback before proposing any live change.
3. In a separate reviewed change, remediate broad report access and direct Edge authorization/SSRF/cost limits; validate with anon, ordinary user, owner, other owner and admin in isolated staging. Do not test mutation paths on production or treat mocked tests here as real RLS acceptance.
4. Establish the legal operator/contact, applicable Swiss/cantonal requirements, final terms/privacy, data categories, retention/deletion, processing agreements, complaints/moderation and legal acceptance. Record approved policy versions.
5. Implement account lifecycle in isolated staging against managed Supabase: email confirmation/delivery, login, refresh, recovery, logout, expiry/revocation and rate limits; choose and test secure session/CSRF handling for future mutations. Remove the legacy admin signup route or separately authorize its operational use. Test with synthetic accounts only.
6. Design namespaced provider drafts, first-party provenance, private consent and trusted age/identity receipts, independent moderation, revocation and evidence expiry. Do not collect IDs or activate an external identity provider until legal/vendor/storage/retention controls are approved. The provider cannot set evidence, origin, moderation, publication state or another owner's ID.
7. Connect a trusted server evidence loader and transactional submission/publication service only after the schema and RLS are audited. Extend the current publication policy with receipt-to-listing/version binding, revocation and race handling. Prove cross-tenant denial, self-approval denial, imported/demo denial, expired/revoked consent denial and safe public projection with real staging RLS tests.
8. Obtain explicit authorization for any future live migration or service activation. After a separately authorized Softgen sync/deployment, verify repository+branch+exact commit in deployment metadata and rerun public QA. Keep noindex and demo gates until real provenance, identity/age/consent, legal requirements and end-to-end release acceptance are all verified. Payments stay disabled.

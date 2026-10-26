# IWSN execution status

26 October 2026 · Europe/Zurich · canonical repository `mfeie002-jpg/iwantsexnow`.

This is the continuing execution record for the supplied Goal and Masterplan, not a replacement plan. The first work package is a **P0 containment candidate**, not completion of the entire Goal and not a production release.

## Source and delivery

- Audited plan baseline: `4a5250cdf57aa517b88bc0f468d11f113c88e82d`.
- Current-main baseline verified twice this run: `9f867194061d1b28e4e2efce636e278b46d474d3`. Its only extra commit redirects old template pages; preserved.
- Tested source commit: `38debd0e99ffeb12e73fa499f7f7f20ad1791d1d` (following documentation-only commits do not change application code).
- Verified GitHub candidate: `d76b17a6294c4c232dc4809b449d87baf57682ac`, full tree `b42bfc56f9d17ded3ddd0bb80bc6814e89bd5638` matched the local candidate exactly. CLI credentials were unavailable; the connected GitHub Git-data interface transferred the tree.
- Work branch: `fix/iwsn-p0-foundation-20261026`.
- Existing open PRs #6 and #15 and their branches were inspected, not merged or overwritten.
- Public HTML fingerprint: Next build `f0pqs7dFTJsnZkN8JUIXk`, deployment `dpl_GKChaCqmTKg8RiMmhbZhYiY4NSGN`. **Not a verified Git revision.**
- No production application deployment, Edge deployment, database mutation or outgoing message was performed.

## What changed

1. Retired the legacy metrics writer entirely. No local file hydration, swallowed file writes, owner-token recovery, self-verification, public case text, event payload forwarding or false counter updates remain in that route. GET exposes empty public state and an explicit `measurementStatus: unavailable`; known old writes return 410, unknown actions 400. Old published tokens cannot authorize any of those writes.
2. Admin overview and import endpoints verify a real Supabase user and an admin role, then stay closed with 503 until the backend is verified. An anonymous user, short token or PIN receives 401; a verified non-admin receives 403. No service-role fallback or import work occurs.
3. All eight Edge entry points now verify user and admin role themselves before work. Gateway JWT verification is enabled in source. This does **not** prove deployed Edge protection. A targeted SQL correction for previously public reports/cache/screenshots is prepared **outside** the migration directory in `docs/goal/sql`; it has not been applied or accepted against live RLS.
4. Removed all 96 generated Wave-4 records from the source archive. The remaining archive has 650 observations / 646 canonical source IDs. No observation count is presented as a person count. Current pilot credential and legacy state files are empty; the deterministic token generator is retired. Previously published Git history remains public; no history rewrite was attempted.
5. Public browser data now imports only `approved-public-offers.json`, currently empty. This deliberately quarantines the remaining unapproved archive too: the supplied evidence does not establish its publication or image permissions. No raw archive enters the public search API. Public synthetic catalogue records were removed; neutral fixtures exist only in tests. Automated scheduled scraping/pushing is paused; historical source-patch generators stop immediately if executed.
6. Removed modulo/name/position identity fallback. Unknown and retired profile identifiers return server-side 404; they never show a different listing. Unknown regional/editorial slugs also return 404. Added a tested source-URL identity primitive; **full import/identity migration is not complete**. Ambiguous old aliases are rejected rather than remapped.
7. Public search now has the same `status/results/totalMatches` contract used by its clients, finite validated pagination, filter-before-pagination and an explicit field projection. Invalid/multiple query values return 400, not a false empty success. Search errors and valid empty inventories have different UI messages. Full integrated nonempty production inventory acceptance remains pending.
8. Canonicals and `og:url` use the current route, without query/fragment; wrong cross-city hreflangs and unsupported global booking/verification metadata were removed. Indexing remains withheld in HTML and headers; the sitemap is empty instead of claiming fresh lastmods for unaccepted pages. Type/build errors and lint errors are no longer hidden by build ignore flags. Existing lint warnings remain warnings.
9. Public login, admin, ownership, verification and transactional routes show honest unavailable states. Report collection is unavailable until confidential durable storage and a responsible operator are verified. No fake report, inquiry or verification success is displayed. Contact/privacy/operator status pages no longer promise unimplemented processing or an unverified mailbox. Existing secure private draft routes are preserved behind their existing opt-in gate.
10. Removed index-derived online/self-managed/verified states and foreign portrait fallbacks. The dark/gold gallery and X are preserved. Xenia is explicitly labelled rule-based; no LLM connection or message delivery is claimed. This is not desktop/mobile design acceptance.

## Validation

GitHub Actions run [40255365211](https://github.com/mfeie002-jpg/iwantsexnow/actions/runs/40255365211) passed every quality-gate step for candidate `d76b17a`. The following evidence update changes documentation only. See `evidence-20261026.json` and the PR for source/tree details.

- TypeScript and production build passed, with TypeScript and lint build checks enabled.
- All 105 unit and compiled-handler tests passed, no failures or skips. Includes existing private draft ownership/storage-error tests, new legacy/admin boundary tests, source identities, search validation/redaction, geo counterexamples, canonical policy and Edge role checks.
- Built-page safety: 354/354 assertions, 62 static pages.
- Internal link/asset inventory: 1422/1422 assertions.
- Loopback P0 HTTP: 47/47 cases, including initial HTML canonicals, genuine unknown-ID/slug 404s, old-token denial, unknown-action rejection, no public case state and invalid search inputs.
- Retired catalogue HTTP: 2/2. Analyzer denial HTTP: 5/5. Private flow disabled HTTP: 6/6.
- Existing private flow HTTP acceptance passed using its synthetic backend: session, owner create/read/edit, other-user denial, spoof/CSRF/size rejection and logout. **This is not a live database persistence, concurrent-instance or live RLS test.**
- Browser bundle check: all 20 previously published owner tokens are absent from all 91 built JavaScript chunks.
- Lockfile dependency audit: 0 vulnerabilities at this run. Diff whitespace checks passed.
- Not executed: current live DB/RLS, deployed Edge authorization, production credential rotation outside retired paths, production removal/reimport/restore, full concurrent storage acceptance, Deno runtime typecheck and visual desktop/mobile usability QA.

The obsolete smoke assertions described a different starter homepage and 8 public demo records. They are replaced by explicit current containment policy checks. Existing authorization/publication/draft suites are still run. The catalogue filter tests now inject neutral private test fixtures; `view=approved` cannot return demo data, and location filtering no longer silently includes other cities through service areas.

## Backlog state

| IDs | State in this candidate | Remaining acceptance |
|---|---|---|
| 001 | Current managed project/repository/source-tree/schema mapped read-only | Exact candidate deployment/readback and authorized production changes remain |
| 002 | Implemented and locally checked containment | Deployed routes/Edge and actual grants/RLS; SQL candidate not applied |
| 003 | Implemented and locally checked rejection of legacy access | Verify production no longer accepts old credentials; inventory any other authenticators |
| 004 | Checked within current disabled/empty public scope | Real report/verification/owner workflows stay unavailable until their own acceptance |
| 005 | Checked for known-invalid and retired IDs | Nonempty approved inventory and full migration acceptance |
| 006 | Checked locally; remote CI tracked in PR | Deployment/initial-HTML checks after separately authorized rollout |
| 007 | In progress: stable source-ID primitive and aggregate inventory | Persisted mapping, ambiguous observations and migration/reimport proof |
| 008–009 | Existing private foundation preserved and retested synthetically | Current managed backend acceptance, actual roles, persistence, concurrent updates |
| 010–012 | Partial: quarantine, whitelist search, shared IDs, selected geo fixes | Durable suppression, full projection/geo/import/client acceptance |
| 013–015 | Blocked on 001/008–010 | Actual private case storage, owner administration, global removal and verified expiry |
| 016–020 | Not complete | Existing design preserved; route/metadata and truthful status fixes only; no new design or ungrounded research claims |
| 021–022 | In progress: honest unavailable metrics and this containment candidate | Real measurement, current backend/operations, rollback/restore and complete Goal acceptance |
| 023–025 | Not started | Masterplan dependencies not yet accepted |

## Connections and next executable dependency

GitHub is readable/writable; GSC and Firecrawl work. GSC Web property `sc-domain:iwantsexnow.ch`, full property, 26 Sep–23 Oct 2026: 1 click / 16 impressions. It does not measure the current release. The targeted Lovable searches `iwantsexnow` and `IWSN` returned no projects; no new copy was created. DataForSEO is not exposed directly and Firecrawl capability discovery returned no match; no synthetic volume data is treated as a real measurement.

Repository evidence identifies existing Softgen project `4d3af0ab-bad5-4906-84f5-bdd09bdb40d6` and records real managed draft/RLS acceptance on 23 October. That is useful historical evidence, not a current verification. Opening that exact existing project for read-only confirmation was rejected by **automatic approval review** because the current named-tool authorization did not include the Softgen origin. No alternative route was used to access its private content.

**Resume, 26 October 2026:** The user explicitly approved the requested read-only Softgen inspection ("Ja freigegeben"). That authorization remains valid. The local Browser connector is no longer exposed; the permitted cloud browser opened the existing project URL but was redirected to Softgen's public homepage, then reached its Kinde sign-in page. No signed-in project or database configuration was available to inspect. The secure browser-auth method/credential request was rejected by automatic approval review: read-only inspection did not explicitly authorize authentication, which may transmit an email or OAuth choice. No sign-in method was selected, credentials submitted, backend changes made or alternate private-access route attempted. Main remains `9f86719`; PR #16 remains the candidate and its `68fb0f9` CI run 40255558375 is successful.

**Required next input:** authorize the secure Softgen sign-in flow, where the user chooses their existing method and authenticates through the secure browser interface. Do not request passwords or codes in chat. After sign-in, inspect the same existing project/database read-only and continue this Goal; no replacement resource or Lovable copy.

## Recovery boundary

This tested containment source commit is the source fallback for subsequent work. The old main before this branch is **not** an acceptable safety rollback because it reopens legacy writes and private-state exposure. No live rollback has been exercised. Keep the public data empty, old tokens rejected, importer paused and account/report gates closed during any recovery. The SQL candidate is not a schema rollback and must not be applied blindly; inspect actual policies/history and take an approved backup before a concrete production change. No migration was applied by this run.

## Current continuation — signed-in managed inspection completed

The user reported signed in; the existing local Chrome session now opens the exact project successfully. Read-only authorization and authentication blockers are resolved. [Managed inspection](managed-backend-inspection-20261026.md) supersedes the older connection-blocker paragraphs above for current state. Runtime tree `66611147` matches main `9f86719` exactly; the managed commit ID differs. Only two public tables exist, no buckets and no deployed Edge functions. A real new P0 is confirmed: empty `profiles` has public SELECT including email/full name and excessive anon/authenticated grants. The mapped profiles SQL correction is prepared and passes nine isolated PostgreSQL tests. The historical analyzer SQL is explicitly blocked as inapplicable. Current suite: **114 passed, zero failures/skips**. Managed DB writes and P0 deployment are not authorized by the read-only inspection and have not occurred. PR #16 remains the single candidate; no parallel product copy or runner was created.

# IWSN execution status

26 October 2026 · Europe/Zurich · canonical repository `mfeie002-jpg/iwantsexnow`.

**Current result: the approved P0 production package is applied, merged and live. The full Goal is not complete.** The supplied Goal and Masterplan remain the work order.

## Verified delivery

- PR [#16](https://github.com/mfeie002-jpg/iwantsexnow/pull/16) merged as `e08451b5c0ec969df720a00309195978da28eb1b`; application/source tree `a646abac25f6c3b17c6cddb269ccb89dca3e1f43`.
- Targeted existing-`profiles` ACL/RLS correction applied and read back: anonymous profile/email reads denied, authenticated owner-only policies, service-role access retained. Counts unchanged: 0 profiles / 2 private drafts.
- Existing Softgen project `4d3af0ab-bad5-4906-84f5-bdd09bdb40d6` safely updated and deployed through its existing Vercel connection. Managed post-deployment HEAD `6fd6b36dd5855a4c1ea73ac033efe0859ecab9b9` has the exact same complete tree and a clean worktree.
- Live **62/62 HTTP checks passed**. New build `bZY6C1DvzDlw-5GjkXsxs`, deployment fingerprint `dpl_77dg9UmDcsN6PssuxaNeBYMyWkqL`. Public app bundle matches the managed build byte-for-byte. Exact Vercel Git-SHA metadata is not exposed and is not claimed.
- Public approved inventory remains empty; indexing/account/report/transaction gates stay closed; importer schedules remain paused.
- No new project/backend/runner/scheduler, no Edge deployment, no environment/credential change, no outgoing message, no personal-row inspection or fixture write.

The user explicitly approved these concrete production actions after reviewing the SQL and PR. Earlier read-only authorization/authentication blockers are resolved. [Production receipt and screenshots](production-p0-receipt-20261026.md) are the current evidence; [initial inspection](managed-backend-inspection-20261026.md) remains a dated historical before-state.

## What changed

1. Retired the legacy metrics writer entirely. No local file hydration, swallowed file writes, owner-token recovery, self-verification, public case text, event payload forwarding or false counter updates remain in that route. GET exposes empty public state and an explicit `measurementStatus: unavailable`; known old writes return 410, unknown actions 400. Old published tokens cannot authorize any of those writes.
2. Admin overview and import endpoints verify a real Supabase user and an admin role, then stay closed with 503 until the backend is verified. An anonymous user, short token or PIN receives 401; a verified non-admin receives 403. No service-role fallback or import work occurs.
3. All eight Edge entry points now verify user and admin role themselves before work. Gateway JWT verification is enabled in source. The actual managed project has 0 deployed Edge functions. Historical analyzer SQL is explicitly blocked as inapplicable to the actual two-table schema. The targeted correction for the real profiles table is now applied; no analyzer tables were provisioned.
4. Removed all 96 generated Wave-4 records from the source archive. The remaining archive has 650 observations / 646 canonical source IDs. No observation count is presented as a person count. Current pilot credential and legacy state files are empty; the deterministic token generator is retired. Previously published Git history remains public; no history rewrite was attempted.
5. Public browser data now imports only `approved-public-offers.json`, currently empty. This deliberately quarantines the remaining unapproved archive too: the supplied evidence does not establish its publication or image permissions. No raw archive enters the public search API. Public synthetic catalogue records were removed; neutral fixtures exist only in tests. Automated scheduled scraping/pushing is paused; historical source-patch generators stop immediately if executed.
6. Removed modulo/name/position identity fallback. Unknown and retired profile identifiers return server-side 404; they never show a different listing. Unknown regional/editorial slugs also return 404. Added a tested source-URL identity primitive; **full import/identity migration is not complete**. Ambiguous old aliases are rejected rather than remapped.
7. Public search now has the same `status/results/totalMatches` contract used by its clients, finite validated pagination, filter-before-pagination and an explicit field projection. Invalid/multiple query values return 400, not a false empty success. Search errors and valid empty inventories have different UI messages. Full integrated nonempty production inventory acceptance remains pending.
8. Canonicals and `og:url` use the current route, without query/fragment; wrong cross-city hreflangs and unsupported global booking/verification metadata were removed. Indexing remains withheld in HTML and headers; the sitemap is empty instead of claiming fresh lastmods for unaccepted pages. Type/build errors and lint errors are no longer hidden by build ignore flags. Existing lint warnings remain warnings.
9. Public login, admin, ownership, verification and transactional routes show honest unavailable states. Report collection is unavailable until confidential durable storage and a responsible operator are verified. No fake report, inquiry or verification success is displayed. Contact/privacy/operator status pages no longer promise unimplemented processing or an unverified mailbox. Existing secure private draft routes are preserved behind their existing opt-in gate.
10. Removed index-derived online/self-managed/verified states and foreign portrait fallbacks. The dark/gold gallery and X are preserved. Xenia is explicitly labelled rule-based; no LLM connection or message delivery is claimed. This is not desktop/mobile design acceptance.


## Validation

- 114 unit/compiled-handler/PostgreSQL tests passed, zero failures/skips. Includes 9 actual isolated PostgreSQL ACL/RLS tests; these remain distinct from production cross-user/persistence acceptance.
- Lint/typecheck/build passed; build-time lint and type checks enabled. Existing lint warnings remain visible.
- Main CI [40292982854](https://github.com/mfeie002-jpg/iwantsexnow/actions/runs/40292982854): all 26 recorded steps successful.
- Actual managed locked install/build: passed; 354/354 built-page assertions, 62 pages, 1,422/1,422 internal route/asset checks.
- Local loopback: 47 P0 + 2 catalogue + 5 analyzer + 6 private-disabled HTTP cases passed; existing synthetic private-draft flow acceptance passed.
- Actual production [62 HTTP checks](live-p0-acceptance-20261026.json): passed. Includes noindex/canonicals, genuine 404s, old writer/token denial, private-state absence, invalid-input errors, empty approved projection/sitemap and disabled private endpoints.
- Actual DB readback: anonymous profiles/email SELECT false; authenticated column SELECT true with owner RLS; service-role SELECT true; 0 profile / 2 draft rows before and after. SQL console restored to read-only.
- Old-token bundle scan: 20 tokens / 91 built JS chunks / 0 matches. Dependency lock audit: 0 vulnerabilities.
- Desktop/mobile homepage spot-check passed; mobile no horizontal overflow (375px client/scroll/body). Full multi-route usability QA remains open.
- Not yet established: live A/B/persistence/concurrency/removal/reimport/restore acceptance; Deno runtime checks; all remaining Masterplan phases.

## Backlog state

| IDs | Current state | Remaining acceptance |
|---|---|---|
| 001 | Existing project/repository/source tree/schema mapped and P0 rollout read back | Continued release traceability; platform Git-SHA metadata unavailable |
| 002 | Legacy boundaries deployed; actual profiles ACL/RLS corrected | Role-backed future operations and live cross-user acceptance; source Edge guards are not deployed |
| 003 | Legacy writer/token paths retired and rejected live | Inventory other future authenticators before enabling workflows |
| 004 | Public account/report/verification collection truthfully gated | Actual private workflow and responsible operator acceptance |
| 005 | Unknown/retired IDs return real 404 live | Approved nonempty inventory/full identity migration |
| 006 | Current metadata/noindex/404 release verified live | Earned indexing release after downstream acceptance |
| 007 | Stable source-ID primitive and aggregate archive inventory | Persisted mapping, ambiguous observations and migration/reimport proof |
| 008–009 | Existing private foundation preserved; profiles privacy hardened | Current live roles, cross-user persistence, concurrent updates |
| 010–012 | Quarantine, whitelist search, selected geo fixes deployed | Durable suppression, full projection/geo/import/client acceptance |
| 013–015 | Not enabled | Confidential cases, owner operations, global removal/expiry and responsible operator/contact |
| 016–020 | Partial | Preserved design and current metadata; full UX/research/SEO work remains |
| 021–022 | P0 receipt and live technical checks complete | Real measurement, recovery drills and complete Goal acceptance |
| 023–025 | Not started | Masterplan dependencies remain |

## Connected sources

GitHub read/write, GSC and Firecrawl work. GSC Web property `sc-domain:iwantsexnow.ch`, full property 26 Sep–23 Oct 2026: 1 click / 16 impressions; this predates the release. Targeted Lovable searches returned no existing matching project; no copy created. DataForSEO is not exposed directly; provider discovery found no matching capability. No invented keyword volume or deployment attribution.

## Concurrent writer reconciliation

After P0 production acceptance, a parallel merge `22e5c228…` put 13 unresolved conflict blocks into favicon, BrandLogo and homepage on main. The follow-up repair keeps only the already reviewed P0 side of those conflict blocks: the complete source tree before receipt additions matches `a646abac…` exactly. Historical design commits are retained in Git; no conflicting main was deployed by this run. See the [receipt](production-p0-receipt-20261026.md#concurrent-merge-repair). The existing CI verifies the repair before merge. A dependency-free tracked-source/asset guard now rejects unresolved merge markers before installation/compilation; it prints filenames only.

## Recovery boundary

Retain corrected profile RLS, retired legacy writers/tokens, empty approved data, noindex and gated workflows during recovery. The preserved old managed-source ref is forensic material, not an acceptable public rollback. Do not apply the historical analyzer SQL/migration directory to the mapped database. No history rewrite or unsafe rollback performed.

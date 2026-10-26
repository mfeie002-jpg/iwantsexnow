# Source security regression — 26 October 2026

The source advanced from the accepted P0 record `8a2733f60ade8227a3403abd0e7b02ead64322eb` to `e40e0a149e5328904cf42855041fc12ae8710048` through two commits by another writer. This candidate changes only a legacy API security boundary, its regression tests/CI, a missing lockfile peer entry and aggregate audit evidence. It does not implement the requested directory republication or SEO release. No production database or application deployment is changed by this candidate.

## Reproduced defects in the new source

- An anonymous `claim_or_create_profile` for an unowned ID creates an owner token without a verified session or evidence of ownership. Checking an existing token only protects an already claimed ID; it does not protect the initial claim.
- `report_or_optout` catches filesystem write failures but still returns success and a case number. The counters also acknowledge success after failed persistence.
- State is cached before the write succeeds. Instance changes/concurrent writes are not safely handled.
- The public GET hydrates the legacy local file and emits personal state fields; cache/privacy response headers and the prior bounded body-parser configuration are absent.

These are source findings, reproduced using synthetic in-memory storage only. No production token, report or private row was fetched. The existing read-only production evidence from the earlier release cannot establish whether this later source is deployed.

## Candidate correction

Restore the previously reviewed legacy metrics boundary byte-for-byte. Known retired actions return 410 without creating ownership, modifying any state or accepting a report. Unknown/malformed actions return 400; unsupported methods return 405. Public GET returns only empty state/counters and `measurementStatus: unavailable`, with no-store/no-referrer headers. A request body is bounded to 4KB. The current public inventory inputs, page components, image behavior, SEO component and sitemap are outside this change.

Add ten source-handler regression tests before the CI build. They run the actual TypeScript handler against synthetic legacy files and simulated write failures. On unpatched `e40e0a1` all ten fail; with the protected boundary all ten pass. This catches future security regressions before the later publication-policy gates.

## Install correction

A clean `npm ci` fails on the source baseline because `node_modules/react-is` is absent from the lockfile although it is required by an existing peer dependency. Resolve only the missing `react-is` 19.3.1 entry from the npm registry. Preserve all existing package versions, integrity fields and platform metadata; package.json is unchanged. The final lockfile difference is seven added lines. Locked installation with lifecycle scripts disabled passes.

## Aggregate data verification

See `inventory-integrity-20261026.json`, reproduced with `node scripts/inventory-integrity-audit.cjs`. Only counts and Git blob identifiers are emitted, never names, phones, listing URLs or report contents.

The core archive is still 650 source observations / 646 distinct source URL strings, byte-identical to Git blob `8f18ab3a8feddab9df0f71debc28aba1255ba417`. One observation has an example.com host; 150 have no thumbnail value. There are 162 separate establishment observations with 162 source URL strings. These are counts of records, not proof of real/unique people, current availability, publication permission, image rights or non-overlap between archives. No source pages or image URLs were crawled in this run.

## Validation and remaining boundary

- 10 new security tests: 0 pass / 10 fail against the unpatched handler; 10 pass / 0 fail after correction.
- 9 isolated PostgreSQL profile ACL/RLS tests pass.
- 44 existing private-session/storage/owner and analyzer/Edge authorization tests pass.
- Source lint and TypeScript pass.
- No current managed A/B/persistence/restore acceptance, production deployment or full Phase B completion is claimed.
- Full repository CI is tracked on the draft PR; any remaining failures are reported as failures, not waived or relabelled as successful.

The prior production receipt remains historical evidence. This isolated candidate preserves the parallel writer's other files and requires integration with the current main rather than a hard reset or force push.

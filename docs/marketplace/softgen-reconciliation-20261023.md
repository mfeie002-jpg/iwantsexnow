# Softgen integration reconciliation — 2026-10-23

## Source provenance

Base: main 3185a5be57c63a26e2a3a6cea9647b19ddddc3ab (tree 61c5dad401d871f653ef25cc76097859ab672622).
Softgen managed HEAD e0d7ab07de666bc0f38e991171aa5843ba071152 had the same committed tree, with managed integration changes on top.

The managed package.json and package-lock.json were copied exactly: Supabase SDK 2.89.0 to 2.118.0 and its dependency changes. CI uses Node 22, meeting the SDK requirement. No unrelated dependency upgrade or blanket audit fix was applied.

The three generated integration/auth files were imported, then hardened locally: browser client initialization is lazy and rejects server use or missing configuration; draft database types reflect the applied schema and column permissions; the dormant auth service uses that client. No public page imports this auth service.

Seven tested storage files matched the managed workspace byte for byte: draft service, SDK adapter, their tests, opt-in live test, applied migration and SQL policy test. Hash evidence is retained in the task output softgen-storage-source-hashes-20261023.json. This reconciliation did not rerun live acceptance or mutate the database. See private-draft-storage-acceptance-20261023.md for the earlier actual database/session acceptance and fixture retirement.

## Fresh validation

- Clean dependency install and TypeScript check passed.
- Draft, SDK transport, integration-client, publication and analyzer tests: 60/60.
- Production build: passed (51 static pages; existing lint warnings).
- Compiled analyzer handler tests: 3/3.
- Preview safety: 173/173; integrity: 2206/2206, covering 358 links and 49 paths.
- Local HTTP checks: 68/68, all 12 action gates and noindex retained.
- Unauthenticated API rejection checks: 5/5.
- SEO, app wrapper, login and registration gate files unchanged from main; diff whitespace checks passed.

Consistent lockfile-only npm audits report 37 baseline findings versus 36 after reconciliation (low 3, moderate 12, high 18, critical 3). The removed finding is ws. Existing critical findings in jspdf, next and tar remain release blockers requiring separate remediation. Passing functional checks does not establish security release readiness.

## Release boundary

No deployment, merge, public onboarding, listing publication or enquiry activation is included. Noindex and all action gates remain. Operator details are still undecided. Existing PR #6 is a separate server eligibility proposal and is not incorporated here.

The private draft migration was already applied through the managed database SQL editor. Do not blindly push the historical migration directory: older analyzer migrations were not applied as part of this work. Review database history before any future migration operation.

# iWantSexNow.ch pre-launch corrections (20 Oct 2026)

Status: SOURCE-CANDIDATE. This document is not deployment evidence.

## Product decision
Preserve the previously discussed Swiss comparison marketplace concept. Current zero-traffic site is a UI prototype, not a directory of independently verified individuals or a transaction system.

## Guardrails for this source package
- Keep demonstration profiles and filters, but visibly mark all stock images, purported reviews, prices, availability and bookings as fictitious sample data.
- Replace fabricated live audience and booking indicators.
- Remove the accidental Hello World SEO default in Next Document, set meaningful defaults and de-CH locale.
- Default every route to noindex/nofollow until separate inventory, identity, consent, authentication, age-verification, legal and conversion approvals.
- Replace localStorage password registration, sign-in and password-reset public routes with safe preview-only pages. Existing demo designs remain available at /demo-accounts; this does not create real accounts.
- Pricing is a proposed model, not an active product or charged checkout.

## Explicitly outside scope
No importing real individual profiles, no copying photographs, no partner verification, no external outreach, no payment setup, no production deployment, no new orchestrator, no account deletion, no rewriting the marketplace concept.

## Launch gate
Before switching robots to index, prove server-side authentication and safe session handling, identity/age/consent and removal workflows, real user-supplied listing provenance, a legally reviewed CH commercial model, working terms/privacy, payment and booking acceptance, canonical/metadata QA, and measured traffic after release.

## Executed QA, 2026-10-20
- Isolated ROG working tree, branch `fix/prelaunch-trust-seo-20261020`, based on repository main at `fb5817fe10b1ab1bddf340a51f2ebe18e5d950f7`.
- `npm ci --no-audit --no-fund`: PASS; packages installed (existing lifecycle-script warnings observed).
- `npx tsc --noEmit`: PASS.
- `npm run build` (Next.js 15.5.9): PASS, 47 static routes generated. Existing lint warnings and Next experimental.turbo deprecation remain; no blocking errors.
- Compiled HTML critical-path checks: 43/43 PASS for /, /escort-zurich, /register, /login, /forgot-password, /pricing, /demo-accounts.
- Compiled HTML full static coverage: 47/47 include non-Hello-World title and noindex/nofollow; 0 failures.
- `git diff --check`: PASS (only Windows LF/CRLF notices).
- NO production deployment, real registration, payment, booking, messages, personal-data collection, or publication claimed. Preview-marked sample data is intentionally retained in design components.
- Durable regression check: `node scripts/preview-smoke.cjs` after `npm run build`, **119/119 assertions PASS across 47 static pages**, including critical demo claims, noindex, metadata and public authentication entrypoints.

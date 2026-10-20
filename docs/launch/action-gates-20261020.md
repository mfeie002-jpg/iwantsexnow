# P0.2 – Preview-only action gates (2026-10-20)

## Context
Production release PR #1 is LIVE VERIFIED after GitHub merge (7a388098bb243814d0b45e84d66f2a20930d794d), Softgen Force Pull and managed Vercel Redeploy. 7/7 critical live routes returned 200 and reflected the intended demo disclosures, noindex policy and disabled browser-local signup.

A follow-up read-only live/source audit on 2026-10-20 found:
- /booking-confirmation: an apparent booking form storing a "confirmed" result in localStorage without any actual provider notification or authenticated backend.
- /verify: verification-image upload UI that only simulates submission.
- /create-post: publication UI writes to localStorage and claims content is live.
- /premium and /boost: marketing of unimplemented paid benefits, no proven accounting.
- /terms and /privacy return HTTP 404. These are future legal-content dependencies, NOT replaced with fake policies in this change.

## Change
One shared UI gate in `src/pages/_app.tsx` routes twelve potentially sensitive or commercial actions to the existing `PreviewAccess` component, with explicit route-specific heading and SEO metadata. Underlying page components are untouched for later server-backed development.

Gated routes:
- /booking-confirmation
- /create-post
- /verify
- /upload-photos
- /messages
- /premium
- /boost
- /gifts
- /content-feed
- /creator-dashboard
- /profile
- /account-settings

Existing regional pages, search, pricing explanations and /demo-accounts remain browsable as disclosed examples. Every page retains temporary noindex/nofollow while the site is pre-launch.

## Acceptance / release boundary
- npm run build: PASS (Next.js 15.5.9, 47 statically generated pages; pre-existing lint notices not blocking).
- `node scripts/preview-smoke.cjs`: 155/155 assertions PASS (47 pages, 12 preview-only gates, static metadata).
- `git diff --check`: PASS (line-ending advisories on Windows only).

No live deployment, database mutation, user registration, personal-information processing, payment, provider onboarding, or SEO indexation is part of this package. This patch remains a source candidate until merged AND separately published by Softgen after a verified pull from GitHub main.

## Unblock to real marketplace
1. Confirm CH-specific operating model, terms/privacy, age/consent/identity requirements, moderation, data-removal process.
2. Set up server-side user auth + session/account controls against supported Softgen-managed Supabase, with RLS and auditability; no localStorage passwords.
3. Implement consent-backed provider onboarding and source-proofed public listing inventory, then editorial review.
4. Connect lead/booking request server-side to verifiable recipient confirmation and user receipt; never show success on local-only storage.
5. Validate payments, prices and advertising claims only if/when real payment infrastructure is integrated.
6. Release production routes one at a time with automated QA; remove noindex only when real content and functionality pass SEO review.

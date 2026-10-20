# Marketplace pre-launch foundation

**Status: source-only proposal. No production database writes or live account activation.**

Our previously discussed iWantSexNow.ch concept is a Swiss comparison marketplace. The public pages are a design demonstration with no verified inventory or live bookings. This scope does not turn the demo into a production marketplace.

## Shipped in this source package
- Readable, honest `/privacy` and `/terms` information pages replacing 404s. **These are not final legal policies**, and both remain noindex.
- Independent first-party provider publication eligibility and a field-whitelisting public projection: no scraped profiles or demo profiles can be published, and all real records require consent, identity/age evidence, independent moderation and current policy version.
- A conservative **SQL schema candidate** in `docs/marketplace/schema-candidate.sql`, deliberately **outside** `supabase/migrations`: never automatically applied to Softgen-managed Supabase.
- GitHub Actions read-only PR quality workflow, plus `scripts/verify-live-release.mjs` for post-Softgen deployment QA.

## QA
- `npx tsc --noEmit`: PASS.
- `npm run build` with Next.js 15.5.9: PASS, 49 statically generated routes. Existing global lint warnings remain.
- `node scripts/preview-smoke.cjs`: **169/169 PASS**, 49 prerendered pages including the two new policy placeholders.
- `node --experimental-strip-types --test tests/marketplace-publication.test.mjs`: **19/19 PASS**.
- `git diff --check`: PASS.

## Explicit non-achievements
- There is no real server-side provider verification, secure customer authentication, true consent ledger, live brokerage, payment or booking.
- Nothing was written to live Supabase, no personal or government ID data was collected, and none of the legal placeholders should be described as satisfying statutory disclosure requirements.
- No published GitHub commit proves Softgen pulled and redeployed the source. A separately verified Softgen Force Pull and publish remains necessary.

## Production activation dependency
Use the existing **Softgen-managed Supabase**, not a separate account. Before applying any schema, inspect the actual database, RLS, auth email and SMTP setup, migrations and existing `profiles` and `user_roles` from the Web Analyzer Suite. Identify the legal data controller, contact details, applicable CH regional restrictions, authentic terms/privacy/retention, age/identity-verification vendor and verification evidence policy. Then build opt-in onboarding and server-confirmed enquiries one component at a time. Remove noindex only after approved real inventory, legal content and functional conversion acceptance.

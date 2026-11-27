# Softgen live schema recovery — 27 November 2026

Status: **Verified recovery of the published catalogue**. This report contains database metadata and HTTP results only, no credentials, names, contacts or report bodies.

## Incident and cause

On the published `https://iwantsexnow.ch` deployment, homepage, search, regional pages and sitemap returned HTTP 500; `GET /api/catalogue/page` returned HTTP 503. The Night application correctly refused to treat its live database query failure as confirmed public status data.

In the authenticated iwantsexnow.ch Softgen project, read-only PostgreSQL metadata checks established that two required tables did not exist:

- `public.managed_profile_states`, read by `src/lib/night-catalogue-server.ts`
- `public.iwsn_report_cases`, used by the confidential reporting endpoint

The SQL Editor initially rejected `CREATE` because **Options → Allow writes** was Off. No database change occurred from that rejected attempt.

## Scope of the applied repair

After confirming the correct existing project and `service_role` with `BYPASSRLS`, the supported **Allow writes** switch was temporarily enabled. A single SQL transaction applied:

1. The additive table definition in `supabase/migrations/20261127_managed_profile_states_private.sql`
2. The already versioned report-table definition in `supabase/migrations/20261127_private_report_intake.sql`

Both migrations use `CREATE TABLE IF NOT EXISTS`. The transaction enables RLS, revokes all direct privileges from `PUBLIC`, `anon` and `authenticated`, and grants table operations to `service_role`. No destructive DDL, profile import, identity verification, user update or report submission was performed. The existing `public.profiles` table and other database contents were left untouched.

After successful verification, **Options → Allow writes** was restored to **Off** and its state was checked.

## Database metadata verified afterward

| Check | Observed |
|---|---|
| `managed_profile_states` exists | true |
| `iwsn_report_cases` exists | true |
| Row-level security on both | true |
| `anon`: SELECT/INSERT on managed states | false / false |
| `authenticated`: SELECT on managed states | false |
| `anon`: SELECT on confidential reports | false |
| `authenticated`: SELECT on confidential reports | false |
| `service_role`: SELECT on managed states | true |
| `service_role`: INSERT on confidential reports | true |
| New managed state rows | 0 |
| New report rows | 0 |

The local pre-existing managed-status JSON aggregate contained 2,546 states, with no hidden, paused, removed-by-report, claimed, identity-verified or confirmed-availability flags set. That file was not imported into the database; the server's existing safe local metadata remains its own separate source.

## Verified public recovery

- `scripts/verify-public-release.mjs` against `https://iwantsexnow.ch`: **4/4 PASS**, no errors; home, search, report and count-only catalogue API
- 20 main public pages checked with GET: **20/20 HTTP 200**, expected Night shell, one main and one footer each
- Sitemap `/sitemap.xml`: HTTP 200
- `/api/catalogue/page?canton=ZG&count=1`: HTTP 200, total **95**, zero profile bodies
- `/api/catalogue/page?limit=1`: HTTP 200, one profile returned, total **2,578** at the time of testing
- Real Chrome mobile viewport 390×844: `/search?canton=ZG` loaded 24 cards, one paginated HTTP 200 loaded 24 more to 48, selected second-page profiles persisted in Favorites and Compare, no horizontal overflow or uncaught browser exceptions

No real person was contacted, no booking/payment made and no report sent.

## Remaining boundaries

- The published `/report` page uses an older implementation than the latest unmerged confidential-report PR. A browser test written for the newer error-element contract did **not** pass on the live page. This is a release-version mismatch, not evidence of a failed database migration. No production report was submitted, so end-to-end report intake is **not** yet verified.
- The provider/photo rights, adult-status evidence, publication consent, moderation processing, opt-out permanence and real Core Web Vitals remain outside this targeted infrastructure repair.
- This migration file is now committed for reproducibility; applying a migration in the future still requires verifying the correct environment and private RLS boundaries.

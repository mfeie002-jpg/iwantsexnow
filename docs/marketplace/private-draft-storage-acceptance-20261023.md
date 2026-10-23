# Private draft storage acceptance — 23 October 2026

## Authorization and scope

The user explicitly approved activating Softgen's built-in managed database and
connecting/testing private draft storage, with no separate account or dashboard.
Noindex and all public action gates must remain in place.

## Managed activation and schema

- Activated Platform Plan / Connect Now within existing Softgen project
  4d3af0ab-bad5-4906-84f5-bdd09bdb40d6.
- Softgen confirmed Connected Supabase Project, Platform Managed, Connected.
- Used only the integrated Database console and project Terminal.
- Initial public schema contained an empty profiles table. It was preserved.
- Applied only 20261023_private_marketplace_drafts.sql, not the historical
  analyzer migrations or the broader marketplace schema candidate.
- Verified marketplace_listing_drafts has RLS enabled and three owner policies.
- Authenticated users receive explicit read/insert/update column grants only.
  They cannot set state/owner on updates, supply approvals, or delete records.

## Real database acceptance

Executed supabase/tests/private_drafts_rls.sql in the integrated SQL editor.
Every assertion completed without error; the final result was
PASS anonymous read/insert denied. Covered owner create/read/update,
owner spoof denial, approval denial, ownership transfer denial, other-user
read/update denial and submitted-record update denial. The transaction rolled
back its synthetic auth users and drafts; verified zero remaining test users
for the two rollback-only fixture IDs.

Executed tests/private-drafts-live.mjs inside the configured Softgen runtime
using the installed Supabase SDK and actual authenticated sessions for two
synthetic app identities. No mock HTTP transport was supplied. Results:

1. Two real synthetic sessions established.
2. Owner draft persisted across independent create/read requests.
3. Owner edit persisted across update/read requests.
4. Other authenticated user could neither read nor update that draft.
5. Direct database insert with spoofed ownership returned permission denial.
6. Direct self-approval and ownership updates returned permission denial.
7. Anonymous direct reads and inserts returned permission denial.

The test loaded the platform-injected public configuration in .env.local. No
service-role key was used by the adapter, and no keys or session tokens were
printed. No real customer/provider information or outbound emails were used.

## Fixture retirement

- Both SDK sessions were signed out and the temporary credential file removed.
- Both synthetic app identities were reversibly disabled with deleted_at and
  banned_until=infinity, rather than permanently deleting account records.
- The single persisted test draft was marked rejected, making it inaccessible
  through the owner-draft policies. No active test drafts remain.
- Verified counts: active drafts 0; retired fixture drafts 1; disabled synthetic
  identities 2; rollback-only fixture users 0.
- Restored the integrated SQL editor to read-only mode.

## Release boundary

The configured Softgen project passed TypeScript, all 46 draft/adapter/publication
tests and a full production build. It also passed 173 preview safety assertions,
2206 integrity assertions, 68 HTTP route checks, all 12 original action gates,
and five unauthenticated API rejection checks. The temporary localhost test
server was shut down afterward. The terminal disconnected during the build;
after reconnecting, the completed build log was inspected and HTTP/safety
checks were executed against that built output.

Activation generated src/integrations/supabase/client.ts and types.ts plus
src/services/authService.ts, and changed the managed package dependency from
@supabase/supabase-js ^2.89.0 to ^2.118.0 with its lockfile. These generated files
were reviewed: the client uses environment variables rather than embedded
credentials; the auth scaffold is not wired to the gated public pages. The
generated client initializes at module scope and needs its configured runtime;
its generated Database type is an empty scaffold, not a complete typed schema.
They were preserved in Softgen. The generated dependency/files remain managed
workspace changes, not part of the local draft-only source snapshot. Attempts
to export the full lockfile through terminal output stalled the browser, so no
claim of an exact full local mirror or completed GitHub reconciliation is made.

Storage is verified through actual SDK sessions and database policies. Public
onboarding, listings, enquiries, operator details and legal acceptance are still
separate milestones. No action gate was removed and no public collection route
was added. This package does not open real registrations or provider intake.

During terminal interaction, Softgen unexpectedly opened a deployment workflow.
It was explicitly canceled; the UI returned to its prior deployment timestamp.
No completed application deployment is claimed for this work. Use keyboard
activation for command buttons to avoid the observed click-target issue.

## Evidence

User-facing outputs are in the task outputs directory:

- softgen-managed-database-connected-20261023.png
- softgen-private-draft-live-sdk-20261023.json
- softgen-draft-rls-result-20261023.txt
- softgen-draft-fixture-cleanup-20261023.txt
- softgen-draft-fixture-cleanup-20261023.png

The prior managed-connection diagnosis describes the pre-activation state and
is superseded by this acceptance record for connection and storage readiness.

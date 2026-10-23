# Marketplace implementation sequence

Baseline: main 3185a5be57c63a26e2a3a6cea9647b19ddddc3ab, deployed demo preview.
User decision: first release is verified listings + private enquiries. Operator
entity and published contact details are not decided. Keep noindex and every
action gate until the relevant real feature passes acceptance and activation
is explicitly approved. No activation is included in this source package.

## Priority and acceptance

| Order | Deliverable | Acceptance before activating |
| --- | --- | --- |
| 0 | Confirm existing backend, schema, grants/RLS, storage, migrations and Auth configuration; isolated test environment | Correct project identified; schema reconciled; anonymous and cross-user access denied; role escalation denied; recovery/backup tested. Existing analyzer data preserved. |
| 0, parallel | Operator, contact, business rules and legal review | Named responsible entity, reviewed terms/privacy/retention, regional scope, adult/identity and consent process, complaint/takedown ownership. No invented details. |
| 1 | Real provider authentication and private drafts | Verified server session, email confirmation/recovery, rate limits, logout/revocation handling; owner creates/reads/edits only own draft; browser cannot grant roles or approvals. |
| 2 | Provider consent, verification, media and moderation | First-party opt-in; trusted age/identity receipt without public ID documents; private upload checks, rights attestation, independent review; expiry, withdrawal, rejection and removal tested. |
| 3 | Approved real listings and search | Public projection exposes allowed fields only; no demo/imported/unapproved/expired records; accurate filters/cities, pagination, empty states and delisting. |
| 4 | Private enquiries, the first conversion | Verified sender, live approved listing, persisted enquiry ID; recipient-only access; actual delivery receipt/status; retry/idempotency, rate limits, abuse reporting, blocking and retention. No fake sent screen. |
| 5 | Operational readiness and controlled beta | Genuine support/takedown handling, audit logs without sensitive payloads, alerts, restore drill, feature rollback, end-to-end two-user tests and permission matrix; separately approve each gate removal. |
| Later | Payments, bookings, subscriptions, boosts, gifts, feeds | Separate product acceptance and provider eligibility. Not in first release. Noindex removal requires its own search-readiness decision after beta acceptance. |

## New evidence from managed project inspection

The correct Softgen project is 4d3af0ab-bad5-4906-84f5-bdd09bdb40d6.
Its historical GitHub name redirects to repository ID 1354919228,
mfeie002-jpg/iwantsexnow. Publish settings map to iwantsexnow.ch.
However, its Supabase panel currently opens "Connect to Supabase", offering
"Connect Now" or "Authorize". This does not establish whether a legacy backend
is absent, disconnected, or configured separately. No connection/provisioning
button was pressed. Do not create a replacement or apply historical migrations
until identity and existing state are reconciled.

Source contains analyzer tables named profiles and user_roles, plus public cache
and screenshot policies, so marketplace data must remain namespaced. Source
config also disables JWT checks for some Edge functions: deployed settings and
direct-function authorization need review before trusting the Next.js proxy as
the only boundary. Source settings are not evidence of live configuration.

The repository contains Stripe dependencies; this is not merchant eligibility.
Stripe's restricted-business page lists adult content and services. Do not wire
checkout for this business without an eligible provider and verified product
scope. First release has no payments.

## Started: private provider draft use cases

src/lib/marketplace/drafts.ts implements create/read/replace behind a server
session resolver and storage interface. Only alias, city, description and media
rights attestation are accepted. Owner, state, evidence and consent versions
cannot be supplied by the browser. Submitted/approved/rejected listings cannot
be edited through this interface. Responses whitelist fields and errors omit
upstream details. Partial drafts may have empty descriptions and unconfirmed
media rights; publication remains a separate stricter policy.

18 tests use an in-memory repository and mock verified sessions. These prove
application behavior, not Supabase RLS or working customer authentication.
The interface contract requires atomic owner/state predicates at storage time;
there is no read-then-write authorization. Text is plain data, never trusted HTML.
Future rendering must escape it, and any public projection needs the publication
policy. No route, UI, live storage, consent collection or feature activation was
added. Noindex and original gate code are unchanged.

## Next implementation step

1. Obtain the existing backend project identity/access through the current
   managed project. Inspect auth email/SMTP, redirects, password/session policies,
   deployed Edge permissions and private bucket configuration without retrieving
   secrets or personal records.
2. Run backend-inventory.sql in that backend's SQL editor. It uses a read-only
   transaction and metadata only. Review policy expressions and migration ledger
   separately under privileged access. Query was prepared but not executed here.
3. Reconcile the draft schema candidate; add an owner-scoped Supabase adapter
   mapping camelCase application fields to existing snake_case draft columns.
   Use verified user JWT/RLS, not a browser service-role key. Add actual database
   tests as anonymous, owner, different owner and reviewer, including state-change
   races. Never call the in-memory tests a substitute for these tests.
4. Implement real auth and internal testing with synthetic data in isolation.
   Public data collection remains blocked until the operator/legal dependency
   is resolved. Enable only a feature that has passed its acceptance matrix.

## References checked 22 October 2026

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/local-development/testing/overview
- https://stripe.com/legal/restricted-businesses

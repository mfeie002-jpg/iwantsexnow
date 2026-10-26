# Existing managed backend — current read-only verification

26 October 2026 · project `4d3af0ab-bad5-4906-84f5-bdd09bdb40d6` · scope: existing IWSN project/database read-only.

## Confirmed identity

- The signed-in browser shows **iWantSexNow.ch** at the exact existing Softgen project URL.
- The Github settings still show historical repository `mfeie002-jpg/sg-05d84038-fdad-4625-84df-fdf93c28ccd5-1788362366.git`. The connected GitHub API resolves it to repository ID **1354919228**, canonical name **mfeie002-jpg/iwantsexnow**.
- Supabase settings: **Connected Supabase Project / Platform Managed / Connected**.
- Publish settings: connected domain `https://iwantsexnow.ch`, deployed using **Softgen's Vercel account**. The UI reported last deployed “3:37 AM 26 October”; its displayed timestamp alone does not identify a Git SHA.
- A fresh read in the managed terminal returned clean worktree, detached HEAD **14b9c417c6c0a4e83a483aec7e9a0673c7934f79**, tree **6661114724dcde20a4e959e81d9296692931e994**. That complete tree equals current GitHub main **9f867194061d1b28e4e2efce636e278b46d474d3**. The commit IDs differ while the source files match exactly. The Softgen commit is not available through the GitHub commit API; no extra source changes were inferred.
- `.env.local` names indicate configured Supabase URL, public key and service-role key; their values were neither printed nor copied. The private-provider-flow activation flag is absent. No environment change was made.
- PR #16 is not incorporated into that current managed source tree.

## Actual database inventory

The integrated database console and read-only catalog queries show:

| Object | Current finding |
|---|---|
| `public.marketplace_listing_drafts` | 2 rows; RLS enabled; 3 authenticated-owner/draft-state policies |
| `public.profiles` | 0 rows in console; RLS enabled; `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at` |
| Auth identities | Console aggregate: 5; no identity rows were opened |
| Storage | 0 buckets |
| Edge Functions | 0 deployed functions |
| `public.user_roles` / analysis/cache/report tables | Not in the observed public table inventory |

RLS policies for `marketplace_listing_drafts` retain the `owner_id = auth.uid()` and `state = 'draft'` conditions for SELECT, INSERT and UPDATE. The actual table ACL has owner/service-role grants only; effective column read is granted to authenticated users and denied to anonymous users. The current role/column ACLs were inspected, without reading any draft contents.

`profiles` has `Public profiles are viewable by everyone`, `SELECT TO public USING(true)`. Its table ACL grants **all table privileges** to both anon and authenticated, as well as owner/service-role. A read-only `has_table_privilege` query confirms anonymous and authenticated SELECT are granted. Therefore future profile emails/names would not be private under these rules. The table is currently empty; no disclosure of an actual person's row was demonstrated or claimed.

The console is in read-only mode. Its scanner rejected metadata queries containing the words UPDATE or DROP, even where they occurred inside privilege strings or catalog identifiers. Those failed metadata checks performed no writes. The successful subsequent queries were ordinary SELECT-only metadata reads. Read-only mode was not disabled.

## Concrete correction prepared

`docs/goal/sql/20261026_harden_existing_profiles.sql` is the candidate for **this actual schema**:

- Validates the exact existing column and known-policy inventory before changing anything; aborts atomically on drift.
- Removes anonymous/PUBLIC table and column rights, and removes excessive authenticated table rights.
- Grants authenticated users only the profile columns needed for their own read/insert/edit. Ownership, email and audit timestamps are not caller-editable.
- Replaces the public read policy with authenticated owner-only read/insert/update policies.
- Preserves rows, service-role privileges and the existing private draft table/policies.
- Safe to rerun on its own accepted policy set. No DROP TABLE, TRUNCATE or data deletion.

The earlier `20261026_remove_public_analyzer_access.sql` was based on repository-only analyzer migrations. It is **not applicable to this database** and now stops immediately if executed. Do not apply historical migrations to manufacture absent analyzer tables or storage.

## Verification boundary

Nine new tests run actual PostgreSQL through pinned **PGlite 0.5.11** against an isolated, synthetic replica. They reproduce the old public-read issue, prove anonymous and cross-user denial after correction, preserve own-profile creation/editing and private drafts, deny email/ownership/timestamp changes and destructive operations, retain trusted backend access, preserve rows on rerun and abort on an unexpected policy. This is a local PostgreSQL policy test, **not** current managed-database A/B or production persistence acceptance. PGlite is a development-only test dependency and is not imported by application code. Official API reference: https://pglite.dev/docs/.

All 114 current tests pass locally. Production build, lint/type checks, existing built-page/HTTP safeguards and dependency audit also pass; the audit reports zero findings. No production code deployment, database migration, credential change, fixture creation, message, schema provisioning or account modification was performed during this inspection.

## Next production action requiring acceptance

The prepared P0 candidate remains PR #16. A concrete controlled rollout consists of applying the targeted profiles correction to the mapped existing database, merging the reviewed PR, updating the existing managed source without overwriting concurrent work, and deploying/reading back that exact candidate. Keep the new profile privacy rules on rollback; never restore public profile read. Until actual approved records and working private case/removal operations are accepted, the public projection remains empty and indexing/account/report gates remain closed.

The current read-only authorization has been used in full. It is not presented as approval for these live writes or publication. No new backend, Lovable project, runner or scheduler was created.

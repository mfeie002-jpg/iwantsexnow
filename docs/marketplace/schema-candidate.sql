-- DRAFT DESIGN ONLY. DO NOT AUTO-RUN AS A SOFTGEN MIGRATION.
-- Owner details, legal terms, identity verification and backend capabilities
-- require approval BEFORE any real personal data is collected.
-- Namespaced to avoid colliding with the existing Web Analyzer "profiles" table.

CREATE TABLE IF NOT EXISTS public.marketplace_listing_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_alias text NOT NULL CHECK (char_length(display_alias) BETWEEN 1 AND 80),
  city text NOT NULL CHECK (char_length(city) BETWEEN 1 AND 100),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  photo_rights_attested boolean NOT NULL DEFAULT false,
  consent_version text,
  consent_at timestamptz,
  state text NOT NULL DEFAULT 'draft'
    CHECK (state IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS marketplace_listing_owner_idx
  ON public.marketplace_listing_drafts (owner_id);

-- Never place document photographs or original identity information in
-- the publicly queryable listing table.
CREATE TABLE IF NOT EXISTS public.marketplace_verification_receipts (
  listing_id uuid PRIMARY KEY REFERENCES public.marketplace_listing_drafts(id) ON DELETE CASCADE,
  age_checked_at timestamptz,
  identity_checked_at timestamptz,
  checked_by uuid REFERENCES auth.users(id),
  method_reference text,
  expires_at timestamptz
);
CREATE TABLE IF NOT EXISTS public.marketplace_moderation_receipts (
  listing_id uuid PRIMARY KEY REFERENCES public.marketplace_listing_drafts(id) ON DELETE CASCADE,
  reviewed_by uuid NOT NULL REFERENCES auth.users(id),
  reviewed_at timestamptz NOT NULL,
  approved boolean NOT NULL DEFAULT false
);

-- Deliberate publication boundary: a separate safe public projection table.
-- A trusted server process (never a browser) decides what to insert here
-- after matching consent version, media rights and evidence.
CREATE TABLE IF NOT EXISTS public.marketplace_public_listings (
  id uuid PRIMARY KEY,
  display_alias text NOT NULL CHECK (char_length(display_alias) BETWEEN 1 AND 80),
  city text NOT NULL CHECK (char_length(city) BETWEEN 1 AND 100),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 1000),
  is_live boolean NOT NULL DEFAULT false,
  last_approved_at timestamptz,
  evidence_expires_at timestamptz
);

ALTER TABLE public.marketplace_listing_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_verification_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_moderation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_public_listings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.marketplace_listing_drafts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.marketplace_verification_receipts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.marketplace_moderation_receipts FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.marketplace_public_listings FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.marketplace_listing_drafts TO authenticated;
GRANT INSERT (owner_id,display_alias,city,description,photo_rights_attested)
  ON public.marketplace_listing_drafts TO authenticated;
GRANT UPDATE (display_alias,city,description,photo_rights_attested)
  ON public.marketplace_listing_drafts TO authenticated;

CREATE POLICY marketplace_draft_owner_read
  ON public.marketplace_listing_drafts FOR SELECT TO authenticated
  USING (owner_id = (SELECT auth.uid()));
CREATE POLICY marketplace_draft_owner_insert
  ON public.marketplace_listing_drafts FOR INSERT TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()) AND state = 'draft');
CREATE POLICY marketplace_draft_owner_update
  ON public.marketplace_listing_drafts FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()) AND state = 'draft')
  WITH CHECK (owner_id = (SELECT auth.uid()) AND state = 'draft');

-- There is deliberately no client-side right to submit/approve, set
-- verification evidence, grant consent versions, or publish. Build a
-- separately audited server flow and grant only after live legal approval.
GRANT SELECT (id,display_alias,city,description) ON public.marketplace_public_listings
  TO anon, authenticated;
CREATE POLICY marketplace_public_read_approved
  ON public.marketplace_public_listings FOR SELECT TO anon, authenticated
  USING (is_live = true AND evidence_expires_at > now() AND last_approved_at IS NOT NULL);

-- ACCEPTANCE GATES before applying in managed Supabase:
-- 1. Compare with live schema and migration ledger, backup / rollback plan.
-- 2. Validate actual RLS as anon, owner and other user; test cross-tenant denial.
-- 3. Implement private first-party opt-in, age/identity provider, moderation,
--    GDPR/FADP policies and controlled, auditable publication service.
-- 4. Verify a newly created provider cannot set state='approved', spoof
--    age/identity verification, inspect another draft, or read documents.
-- 5. Do NOT upload sensitive identity files into storage without protected
--    bucket policies, retention, access logging and deletion procedures.

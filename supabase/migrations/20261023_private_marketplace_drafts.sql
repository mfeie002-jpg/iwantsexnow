-- Private drafts only. Public registration and all existing action gates stay closed.
BEGIN;
CREATE TABLE public.marketplace_listing_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_alias text NOT NULL CHECK (char_length(btrim(display_alias)) BETWEEN 1 AND 80),
  city text NOT NULL CHECK (char_length(btrim(city)) BETWEEN 1 AND 100),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  photo_rights_attested boolean NOT NULL DEFAULT false,
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','submitted','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX marketplace_listing_drafts_owner_idx ON public.marketplace_listing_drafts(owner_id);
ALTER TABLE public.marketplace_listing_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_listing_drafts FROM PUBLIC, anon, authenticated;
GRANT SELECT (id,owner_id,display_alias,city,description,photo_rights_attested,state)
  ON public.marketplace_listing_drafts TO authenticated;
GRANT INSERT (owner_id,display_alias,city,description,photo_rights_attested)
  ON public.marketplace_listing_drafts TO authenticated;
GRANT UPDATE (display_alias,city,description,photo_rights_attested)
  ON public.marketplace_listing_drafts TO authenticated;
CREATE POLICY marketplace_draft_owner_read ON public.marketplace_listing_drafts
  FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()) AND state = 'draft');
CREATE POLICY marketplace_draft_owner_insert ON public.marketplace_listing_drafts
  FOR INSERT TO authenticated WITH CHECK (owner_id = (SELECT auth.uid()) AND state = 'draft');
CREATE POLICY marketplace_draft_owner_update ON public.marketplace_listing_drafts
  FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()) AND state = 'draft')
  WITH CHECK (owner_id = (SELECT auth.uid()) AND state = 'draft');
CREATE FUNCTION public.marketplace_draft_touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER marketplace_draft_touch_updated_at
  BEFORE UPDATE ON public.marketplace_listing_drafts FOR EACH ROW
  EXECUTE FUNCTION public.marketplace_draft_touch_updated_at();
COMMIT;

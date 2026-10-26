-- Existing Softgen-managed project 4d3af0ab-bad5-4906-84f5-bdd09bdb40d6.
-- PREPARED, NOT APPLIED. Based on read-only inspection on 26 October 2026.
-- No row deletion, schema replacement, provisioning or changes to private drafts.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '15s';
DO $$
DECLARE actual_columns text[]; actual_policies text[];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relname='profiles' AND c.relkind='r' AND c.relrowsecurity)
  THEN RAISE EXCEPTION 'PROFILE_PREFLIGHT_FAILED: expected existing RLS-enabled table'; END IF;
  SELECT array_agg(column_name::text ORDER BY ordinal_position) INTO actual_columns
    FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles';
  IF actual_columns IS DISTINCT FROM ARRAY['id','email','full_name','avatar_url','created_at','updated_at']::text[]
  THEN RAISE EXCEPTION 'PROFILE_PREFLIGHT_FAILED: inspect changed columns before applying'; END IF;
  SELECT array_agg(policyname::text ORDER BY policyname) INTO actual_policies FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles';
  IF actual_policies IS DISTINCT FROM ARRAY['Public profiles are viewable by everyone','Users can insert their own profile','Users can update their own profile']::text[]
    AND actual_policies IS DISTINCT FROM ARRAY['profiles_owner_insert','profiles_owner_read','profiles_owner_update']::text[]
  THEN RAISE EXCEPTION 'PROFILE_PREFLIGHT_FAILED: inspect unexpected policies before applying'; END IF;
END $$;
-- Both table and column ACLs must be reset: table-level REVOKE alone can leave
-- explicit column permissions behind. Service-role/owner privileges are preserved.
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL (id,email,full_name,avatar_url,created_at,updated_at)
  ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT (id,email,full_name,avatar_url,created_at,updated_at) ON public.profiles TO authenticated;
GRANT INSERT (id,email,full_name,avatar_url) ON public.profiles TO authenticated;
GRANT UPDATE (full_name,avatar_url) ON public.profiles TO authenticated;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS profiles_owner_read ON public.profiles;
DROP POLICY IF EXISTS profiles_owner_insert ON public.profiles;
DROP POLICY IF EXISTS profiles_owner_update ON public.profiles;
CREATE POLICY profiles_owner_read ON public.profiles FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));
CREATE POLICY profiles_owner_insert ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY profiles_owner_update ON public.profiles FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));
COMMIT;

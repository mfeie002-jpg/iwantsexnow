-- OPERATOR-RUN READ-ONLY INVENTORY ONLY. Not a migration; not executed by this PR.
-- Use the existing Softgen-managed project. Never include row contents, tokens or keys.
BEGIN TRANSACTION READ ONLY;
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;
SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'storage') AND c.relkind IN ('r','p')
ORDER BY 1,2;
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname IN ('public', 'storage') ORDER BY 1,2,3;
SELECT grantee, table_schema, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee IN ('anon','authenticated','PUBLIC') AND table_schema IN ('public','storage')
ORDER BY 1,2,3,4;
SELECT grantee, table_schema, table_name, column_name, privilege_type
FROM information_schema.column_privileges
WHERE grantee IN ('anon','authenticated','PUBLIC') AND table_schema = 'public'
ORDER BY 1,2,3,4,5;
SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS arguments,
       p.prosecdef AS security_definer, p.proconfig AS settings, p.proacl AS grants,
       pg_get_functiondef(p.oid) AS definition
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN
  ('has_role','is_admin','handle_new_user','cleanup_expired_cache')
ORDER BY 1,2,3;
SELECT id, public, file_size_limit, allowed_mime_types FROM storage.buckets ORDER BY id;
ROLLBACK;
-- Separately export dashboard metadata (no secrets): Auth email confirmation, signup,
-- redirect allowlist, SMTP delivery status, session lifetimes, deployed Edge versions,
-- verify_jwt settings, schedules and private storage retention/access controls.

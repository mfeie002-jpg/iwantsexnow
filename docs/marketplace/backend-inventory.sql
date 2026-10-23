-- Run manually in the existing project's SQL editor after project identity is
-- confirmed. READ ONLY: metadata only, no user rows, tokens, connection strings,
-- ID documents or storage object names. Does not apply schema-candidate.sql.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '10s';

SELECT n.nspname AS schema_name, c.relname AS table_name,
       c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('public', 'storage') AND c.relkind IN ('r', 'p')
ORDER BY 1, 2;

SELECT table_schema, table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Policy expressions need a separate privileged review; this inventory only
-- captures policy coverage and role/command metadata.
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;

SELECT table_schema, table_name, grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema IN ('public', 'storage') AND grantee IN ('anon', 'authenticated', 'PUBLIC')
ORDER BY table_schema, table_name, grantee, privilege_type;

SELECT table_schema, table_name, column_name, grantee, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated', 'PUBLIC')
ORDER BY table_name, column_name, grantee, privilege_type;

SELECT n.nspname AS schema_name, p.proname AS function_name,
       p.prosecdef AS security_definer, p.provolatile AS volatility
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Check presence without selecting migration history or user records.
SELECT to_regclass('supabase_migrations.schema_migrations') IS NOT NULL AS has_migration_ledger,
       to_regclass('auth.users') IS NOT NULL AS has_auth_users,
       to_regclass('storage.buckets') IS NOT NULL AS has_storage_buckets;
ROLLBACK;

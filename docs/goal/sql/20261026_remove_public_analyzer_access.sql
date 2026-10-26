-- PREPARED ONLY. Inspect actual policies and test with anon/A/B/admin in staging
-- before applying to the mapped existing backend. No DROP TABLE or row deletion.
BEGIN;
DROP POLICY IF EXISTS "Public can view reports by token" ON public.analysis_reports;
DROP POLICY IF EXISTS "Public can read html cache" ON public.html_cache;
DROP POLICY IF EXISTS "Anyone can read cache" ON public.html_cache;
DROP POLICY IF EXISTS "Public can read url discovery cache" ON public.url_discovery_cache;
DROP POLICY IF EXISTS "Anyone can read discovery cache" ON public.url_discovery_cache;
DROP POLICY IF EXISTS "Public can view screenshots" ON storage.objects;
UPDATE storage.buckets SET public = false WHERE id = 'screenshots-archive';
COMMIT;

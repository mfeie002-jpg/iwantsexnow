-- Real Postgres/RLS acceptance. Run via the project's managed SQL tool as admin.
-- All synthetic auth users and drafts are rolled back, including on disconnection.
BEGIN;
SET LOCAL statement_timeout = '15s';
INSERT INTO auth.users(id,email) VALUES
 ('e0310764-3b95-42dc-85ec-d9284ad7d101','draft-rls-owner@example.invalid'),
 ('e0310764-3b95-42dc-85ec-d9284ad7d102','draft-rls-other@example.invalid');
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"e0310764-3b95-42dc-85ec-d9284ad7d101","role":"authenticated"}',true);
INSERT INTO public.marketplace_listing_drafts(owner_id,display_alias,city,description)
 VALUES ('e0310764-3b95-42dc-85ec-d9284ad7d101','Synthetic RLS draft','Zürich','Synthetic data only');
DO $$ DECLARE n integer; BEGIN
 SELECT count(id) INTO n FROM public.marketplace_listing_drafts WHERE display_alias='Synthetic RLS draft';
 IF n <> 1 THEN RAISE EXCEPTION 'Owner read failed'; END IF;
 UPDATE public.marketplace_listing_drafts SET description='Updated synthetic draft' WHERE display_alias='Synthetic RLS draft';
 GET DIAGNOSTICS n = ROW_COUNT;
 IF n <> 1 THEN RAISE EXCEPTION 'Owner update failed'; END IF;
END $$;
SELECT 'PASS owner create/read/update' AS result;
DO $$ BEGIN
 BEGIN
  INSERT INTO public.marketplace_listing_drafts(owner_id,display_alias,city)
   VALUES ('e0310764-3b95-42dc-85ec-d9284ad7d102','Spoof','Zürich');
  RAISE EXCEPTION 'Owner spoof unexpectedly allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.marketplace_listing_drafts SET state='approved';
  RAISE EXCEPTION 'Self approval unexpectedly allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  UPDATE public.marketplace_listing_drafts SET owner_id='e0310764-3b95-42dc-85ec-d9284ad7d102';
  RAISE EXCEPTION 'Ownership transfer unexpectedly allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT 'PASS spoof/approval/ownership change denied' AS result;
SELECT set_config('request.jwt.claims','{"sub":"e0310764-3b95-42dc-85ec-d9284ad7d102","role":"authenticated"}',true);
DO $$ DECLARE n integer; BEGIN
 SELECT count(id) INTO n FROM public.marketplace_listing_drafts WHERE display_alias='Synthetic RLS draft';
 IF n <> 0 THEN RAISE EXCEPTION 'Cross-user read allowed'; END IF;
 UPDATE public.marketplace_listing_drafts SET description='Cross-user overwrite' WHERE display_alias='Synthetic RLS draft';
 GET DIAGNOSTICS n = ROW_COUNT;
 IF n <> 0 THEN RAISE EXCEPTION 'Cross-user update allowed'; END IF;
END $$;
SELECT 'PASS other-user read/update denied' AS result;
RESET ROLE;
UPDATE public.marketplace_listing_drafts SET state='submitted'
 WHERE owner_id='e0310764-3b95-42dc-85ec-d9284ad7d101';
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"e0310764-3b95-42dc-85ec-d9284ad7d101","role":"authenticated"}',true);
DO $$ DECLARE n integer; BEGIN
 UPDATE public.marketplace_listing_drafts SET description='After submission'
 WHERE owner_id='e0310764-3b95-42dc-85ec-d9284ad7d101';
 GET DIAGNOSTICS n = ROW_COUNT;
 IF n <> 0 THEN RAISE EXCEPTION 'Submitted record changed'; END IF;
END $$;
SELECT 'PASS submitted record update denied' AS result;
SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN
  PERFORM id FROM public.marketplace_listing_drafts;
  RAISE EXCEPTION 'Anonymous read allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  INSERT INTO public.marketplace_listing_drafts(owner_id,display_alias,city)
   VALUES ('e0310764-3b95-42dc-85ec-d9284ad7d102','Anonymous','Zürich');
  RAISE EXCEPTION 'Anonymous insert allowed';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT 'PASS anonymous read/insert denied' AS result;
ROLLBACK;

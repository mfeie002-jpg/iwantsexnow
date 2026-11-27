-- Private report intake; deploy only after confirming the target Supabase project.
-- No anonymous SELECT, UPDATE or DELETE. The server-side service role alone writes cases.
CREATE TABLE IF NOT EXISTS public.iwsn_report_cases (
  case_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id text,
  source_url text,
  reason text NOT NULL,
  contact text,
  status text NOT NULL DEFAULT 'RECEIVED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reason_length CHECK (char_length(reason) BETWEEN 5 AND 500),
  CONSTRAINT contact_length CHECK (contact IS NULL OR char_length(contact) <= 120),
  CONSTRAINT source_length CHECK (source_url IS NULL OR char_length(source_url) <= 500)
);
CREATE INDEX IF NOT EXISTS iwsn_report_cases_profile_idx
  ON public.iwsn_report_cases (profile_id, created_at DESC);
ALTER TABLE public.iwsn_report_cases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.iwsn_report_cases FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.iwsn_report_cases TO service_role;

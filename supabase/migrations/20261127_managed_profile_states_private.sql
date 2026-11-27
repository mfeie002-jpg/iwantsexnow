-- Private managed profile status projection expected by night-catalogue-server.ts.
-- Public visitors have NO direct table privileges; publication goes through filtered server routes.
-- Additive migration only. Does not import, delete, reveal, claim or verify existing profiles.
CREATE TABLE IF NOT EXISTS public.managed_profile_states (
  profile_id text PRIMARY KEY,
  display_name text,
  city text,
  canton text,
  rate30_chf numeric,
  rate60_chf numeric,
  price_confirmed boolean NOT NULL DEFAULT false,
  rate_confirmed boolean NOT NULL DEFAULT false,
  price_confirmed_at timestamptz,
  rate_updated_at timestamptz,
  claimed boolean NOT NULL DEFAULT false,
  identity_verified boolean NOT NULL DEFAULT false,
  ai_opt_in boolean NOT NULL DEFAULT false,
  availability_confirmed boolean NOT NULL DEFAULT false,
  available_until timestamptz,
  availability_confirmed_at timestamptz,
  availability_withdrawn_at timestamptz,
  hidden boolean NOT NULL DEFAULT false,
  paused boolean NOT NULL DEFAULT false,
  removed_by_report boolean NOT NULL DEFAULT false,
  sponsored boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.managed_profile_states ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.managed_profile_states FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.managed_profile_states TO service_role;

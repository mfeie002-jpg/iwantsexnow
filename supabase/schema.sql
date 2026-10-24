-- iWantSexNow.ch · Swiss Escort Index & Direct Booking Schema
create table if not exists public.provider_profiles (
  id uuid primary key default gen_random_uuid(),
  dedup_cluster_id text unique not null,
  normalized_phone text unique not null,
  display_name text not null,
  age int default 25,
  primary_city text not null,
  canton text not null,
  subareas text[] default '{}',
  booking_mode text default 'indexed' check (booking_mode in ('direct', 'indexed')),
  rate_30_chf int default 250,
  rate_60_chf int default 400,
  rate_120_chf int default 750,
  portal_avg_60_chf int default 480,
  included_services text[] default '{}',
  extra_prices_chf jsonb default '{}'::jsonb,
  incall boolean default true,
  outcall boolean default true,
  verified_shield boolean default false,
  last_freshness_ping timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.portal_sources (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.provider_profiles(id) on delete cascade,
  portal_name text not null,
  source_url text,
  listed_price_chf int not null,
  is_direct boolean default false,
  last_seen_at timestamptz default now()
);

create table if not exists public.private_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text unique not null,
  provider_name text not null,
  duration_minutes int not null,
  selected_extras text[] default '{}',
  guaranteed_total_chf int not null,
  requested_time text not null,
  meeting_city text not null,
  customer_contact text not null,
  notes text,
  status text default 'new' check (status in ('new', 'accepted', 'declined')),
  created_at timestamptz default now()
);
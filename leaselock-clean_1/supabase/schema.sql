-- ============================================================
-- RenterReady — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor → New query.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================

-- ---------- profiles (one row per user; quiz answers + identity) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  pets        text,
  roommates   text,
  cosigner    text,
  departure   text,
  furnished   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- calendar_events ----------
create table if not exists public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  type        text not null,
  title       text not null,
  date        date not null,
  created_at  timestamptz not null default now()
);
create index if not exists calendar_events_user_idx on public.calendar_events (user_id);

-- ---------- maintenance_issues ----------
create table if not exists public.maintenance_issues (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  room        text,
  note        text,
  status      text not null default 'open',
  msg         text,
  created_at  timestamptz not null default now()
);
create index if not exists maintenance_issues_user_idx on public.maintenance_issues (user_id);

-- ---------- rent_payments ----------
create table if not exists public.rent_payments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  month       text not null,
  amount      numeric not null,
  method      text,
  paid_at     timestamptz not null default now()
);
create index if not exists rent_payments_user_idx on public.rent_payments (user_id);

-- ---------- roommate_agreements (one row per user) ----------
create table if not exists public.roommate_agreements (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  address       text,
  start_date    text,
  roommates     jsonb not null default '[]'::jsonb,
  terms         jsonb not null default '{}'::jsonb,
  generated     text,
  generated_at  timestamptz,
  signatures    jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: each user only sees/edits their own rows.
-- ============================================================
alter table public.profiles            enable row level security;
alter table public.calendar_events     enable row level security;
alter table public.maintenance_issues  enable row level security;
alter table public.rent_payments        enable row level security;
alter table public.roommate_agreements enable row level security;

-- profiles (keyed by id = auth.uid())
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- helper macro pattern for user_id-owned tables
drop policy if exists "calendar_all_own" on public.calendar_events;
create policy "calendar_all_own" on public.calendar_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "maintenance_all_own" on public.maintenance_issues;
create policy "maintenance_all_own" on public.maintenance_issues
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "rent_all_own" on public.rent_payments;
create policy "rent_all_own" on public.rent_payments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "roommate_all_own" on public.roommate_agreements;
create policy "roommate_all_own" on public.roommate_agreements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create a profile row when a new user signs up.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

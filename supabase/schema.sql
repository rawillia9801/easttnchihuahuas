create extension if not exists pgcrypto;

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'available' check (status in ('available','reserved','pending','placed','hidden')),
  sex text,
  birth_date date,
  price numeric(10,2),
  ready_date date,
  registry text,
  coat text,
  color text,
  size_category text,
  sire text,
  dam text,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists puppies_status_idx on public.puppies(status);
create index if not exists puppies_created_at_idx on public.puppies(created_at desc);

alter table public.puppies enable row level security;

insert into storage.buckets (id, name, public)
values ('puppy-images', 'puppy-images', true)
on conflict (id) do update set public = excluded.public;

-- The website API uses the Supabase service role on the server. No public table
-- policies are created, so direct anonymous writes are not allowed.

create table if not exists public.litters (
  id uuid primary key default gen_random_uuid(), name text not null,
  status text not null default 'planned' check (status in ('planned','bred','confirmed','born','completed','cancelled','hidden')),
  sire text, dam text, breeding_date date, due_date date, birth_date date, expected_count integer, actual_count integer,
  announcement_date date, notes text, image_url text, image_urls jsonb not null default '[]'::jsonb, is_public boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.breeding_dogs (
  id uuid primary key default gen_random_uuid(), name text not null, registered_name text, role text check (role in ('sire','dam')),
  sex text, status text not null default 'active' check (status in ('active','planned','retired','pet','hidden')), birth_date date,
  registry text, registration_number text, coat text, color text, weight numeric(8,2), health_summary text, genetic_testing text,
  patella_result text, eye_result text, hip_result text, description text, image_url text, image_urls jsonb not null default '[]'::jsonb,
  is_public boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.puppies add column if not exists markings text;
alter table public.puppies add column if not exists litter_id uuid references public.litters(id) on delete set null;
alter table public.puppies add column if not exists image_urls jsonb not null default '[]'::jsonb;
alter table public.puppies add column if not exists birth_weight numeric(8,2);
alter table public.puppies add column if not exists current_weight numeric(8,2);
alter table public.puppies add column if not exists microchip text;
alter table public.puppies add column if not exists is_public boolean not null default true;
create index if not exists puppies_litter_idx on public.puppies(litter_id);
create index if not exists litters_created_at_idx on public.litters(created_at desc);
create index if not exists breeding_dogs_created_at_idx on public.breeding_dogs(created_at desc);
alter table public.litters enable row level security;
alter table public.breeding_dogs enable row level security;

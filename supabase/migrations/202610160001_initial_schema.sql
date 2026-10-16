create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'client');
create type public.campaign_status as enum (
  'payment_received',
  'production',
  'editing',
  'delivery',
  'completed'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles (id) on delete restrict,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  base_price numeric(12, 2) not null default 0 check (base_price >= 0),
  currency text not null default 'COP' check (char_length(currency) = 3),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.models (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete restrict,
  package_id uuid references public.packages (id) on delete set null,
  model_id uuid references public.models (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null,
  description text,
  status public.campaign_status not null default 'payment_received',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaign_status_history (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  status public.campaign_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);

create index brands_owner_profile_id_idx on public.brands (owner_profile_id);
create index campaigns_brand_id_idx on public.campaigns (brand_id);
create index campaigns_status_idx on public.campaigns (status);
create index campaign_status_history_campaign_id_idx on public.campaign_status_history (campaign_id, changed_at);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.record_campaign_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.campaign_status_history (campaign_id, status, changed_by)
    values (new.id, new.status, (select auth.uid()));
  end if;
  return new;
end;
$$;

create trigger campaign_status_audit
  after insert or update of status on public.campaigns
  for each row execute function public.record_campaign_status();

create or replace function public.touch_campaign_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger campaign_updated_at
  before update on public.campaigns
  for each row execute function public.touch_campaign_updated_at();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.packages enable row level security;
alter table public.models enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_status_history enable row level security;

create policy "Profiles can be read by owner or admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Clients can update their display name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create policy "Brands can be read by their owner or admin"
  on public.brands for select to authenticated
  using (owner_profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "Clients can create their own brands"
  on public.brands for insert to authenticated
  with check (owner_profile_id = (select auth.uid()));
create policy "Brands can be updated by their owner or admin"
  on public.brands for update to authenticated
  using (owner_profile_id = (select auth.uid()) or (select public.is_admin()))
  with check (owner_profile_id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins can delete brands"
  on public.brands for delete to authenticated
  using ((select public.is_admin()));

create policy "Active packages can be read publicly"
  on public.packages for select to anon, authenticated
  using (is_active);
create policy "Admins manage packages"
  on public.packages for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins manage models"
  on public.models for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Campaigns can be read by brand owner or admin"
  on public.campaigns for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1
      from public.brands
      where brands.id = campaigns.brand_id
        and brands.owner_profile_id = (select auth.uid())
    )
  );
create policy "Admins manage campaigns"
  on public.campaigns for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Campaign history can be read by brand owner or admin"
  on public.campaign_status_history for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1
      from public.campaigns
      join public.brands on brands.id = campaigns.brand_id
      where campaigns.id = campaign_status_history.campaign_id
        and brands.owner_profile_id = (select auth.uid())
    )
  );
create policy "Admins can add campaign history"
  on public.campaign_status_history for insert to authenticated
  with check ((select public.is_admin()));

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

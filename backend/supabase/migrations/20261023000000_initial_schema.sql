create extension if not exists pgcrypto with schema extensions;

create type public.user_role as enum ('admin', 'client');
create type public.campaign_status as enum (
  'payment_received',
  'production',
  'editing',
  'delivery',
  'completed'
);
create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role public.user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles(id),
  name text not null,
  description text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  features text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id),
  package_id uuid references public.packages(id) on delete set null,
  model_id uuid references public.models(id) on delete set null,
  title text not null,
  description text,
  status public.campaign_status not null default 'payment_received',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, brand_id)
);

create table public.campaign_status_history (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  previous_status public.campaign_status,
  new_status public.campaign_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id),
  campaign_id uuid,
  scheduled_at timestamptz not null,
  notes text,
  status public.reservation_status not null default 'pending',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (campaign_id, brand_id) references public.campaigns(id, brand_id)
);

create index brands_owner_profile_id_idx on public.brands(owner_profile_id);
create index campaigns_brand_id_created_at_idx on public.campaigns(brand_id, created_at desc);
create index campaigns_status_idx on public.campaigns(status);
create index campaign_status_history_campaign_id_created_at_idx
  on public.campaign_status_history(campaign_id, created_at desc);
create index reservations_brand_id_scheduled_at_idx on public.reservations(brand_id, scheduled_at);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = coalesce(new.email, ''),
      full_name = coalesce(new.raw_user_meta_data ->> 'full_name', full_name)
  where id = new.id;
  return new;
end;
$$;

create function public.record_campaign_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.campaign_status_history (campaign_id, previous_status, new_status, changed_by)
    values (new.id, null, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.campaign_status_history (campaign_id, previous_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();
create trigger auth_user_updated_profile
  after update of email, raw_user_meta_data on auth.users
  for each row execute function public.sync_profile_from_auth_user();

insert into public.profiles (id, email, full_name)
select id, coalesce(email, ''), coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands
  for each row execute function public.set_updated_at();
create trigger packages_set_updated_at before update on public.packages
  for each row execute function public.set_updated_at();
create trigger models_set_updated_at before update on public.models
  for each row execute function public.set_updated_at();
create trigger campaigns_set_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();
create trigger campaigns_record_status
  after insert or update of status on public.campaigns
  for each row execute function public.record_campaign_status();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.packages enable row level security;
alter table public.models enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_status_history enable row level security;
alter table public.reservations enable row level security;

create policy profiles_read_self_or_admin on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_admin_update on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());

create policy brands_read_owner_or_admin on public.brands for select
  using (owner_profile_id = auth.uid() or public.is_admin());
create policy brands_admin_insert on public.brands for insert
  with check (public.is_admin());
create policy brands_admin_update on public.brands for update
  using (public.is_admin()) with check (public.is_admin());
create policy brands_admin_delete on public.brands for delete
  using (public.is_admin());

create policy packages_read_active_or_admin on public.packages for select
  using (active or public.is_admin());
create policy packages_admin_insert on public.packages for insert
  with check (public.is_admin());
create policy packages_admin_update on public.packages for update
  using (public.is_admin()) with check (public.is_admin());
create policy packages_admin_delete on public.packages for delete
  using (public.is_admin());

create policy models_admin_read on public.models for select
  using (public.is_admin());
create policy models_admin_insert on public.models for insert
  with check (public.is_admin());
create policy models_admin_update on public.models for update
  using (public.is_admin()) with check (public.is_admin());
create policy models_admin_delete on public.models for delete
  using (public.is_admin());

create policy campaigns_read_brand_owner_or_admin on public.campaigns for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.brands
      where brands.id = campaigns.brand_id and brands.owner_profile_id = auth.uid()
    )
  );
create policy campaigns_admin_insert on public.campaigns for insert
  with check (public.is_admin());
create policy campaigns_admin_update on public.campaigns for update
  using (public.is_admin()) with check (public.is_admin());
create policy campaign_history_read_owner_or_admin on public.campaign_status_history for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.campaigns
      join public.brands on brands.id = campaigns.brand_id
      where campaigns.id = campaign_status_history.campaign_id
        and brands.owner_profile_id = auth.uid()
    )
  );

create policy reservations_read_owner_or_admin on public.reservations for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.brands
      where brands.id = reservations.brand_id and brands.owner_profile_id = auth.uid()
    )
  );
create policy reservations_create_brand_owner on public.reservations for insert
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.brands
      where brands.id = reservations.brand_id and brands.owner_profile_id = auth.uid()
    )
  );
create policy reservations_admin_update on public.reservations for update
  using (public.is_admin()) with check (public.is_admin());
create policy reservations_admin_delete on public.reservations for delete
  using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.packages to anon;
grant select, insert, update, delete on public.profiles, public.brands, public.packages,
  public.models, public.campaigns, public.campaign_status_history, public.reservations
  to authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

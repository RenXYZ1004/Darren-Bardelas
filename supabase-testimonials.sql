-- Run this script in Supabase Dashboard > SQL Editor.
-- The browser uses only the anon/publishable key. Row Level Security is the
-- security boundary. Never put a service_role/secret key in a VITE_ variable.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  affiliation text not null default '' check (char_length(affiliation) <= 100),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (char_length(btrim(message)) between 20 and 1200),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_status_created_at_idx
  on public.testimonials (status, created_at desc);

alter table public.testimonials enable row level security;

-- Start from known table-level permissions, then grant only what the app needs.
grant usage on schema public to anon, authenticated;
revoke all on table public.testimonials from PUBLIC, anon, authenticated;
grant select on table public.testimonials to anon;
grant insert (name, affiliation, rating, message) on table public.testimonials to anon;
grant select, delete on table public.testimonials to authenticated;
grant update (status) on table public.testimonials to authenticated;

drop policy if exists "Visitors can read approved testimonials" on public.testimonials;
create policy "Visitors can read approved testimonials"
  on public.testimonials
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Visitors can submit pending testimonials" on public.testimonials;
create policy "Visitors can submit pending testimonials"
  on public.testimonials
  for insert
  to anon
  with check (status = 'pending');

drop policy if exists "Admins can read every testimonial" on public.testimonials;
create policy "Admins can read every testimonial"
  on public.testimonials
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'is_testimonials_admin') = 'true');

drop policy if exists "Admins can update testimonials" on public.testimonials;
create policy "Admins can update testimonials"
  on public.testimonials
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'is_testimonials_admin') = 'true')
  with check ((auth.jwt() -> 'app_metadata' ->> 'is_testimonials_admin') = 'true');

drop policy if exists "Admins can delete testimonials" on public.testimonials;
create policy "Admins can delete testimonials"
  on public.testimonials
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'is_testimonials_admin') = 'true');

-- Always reset public submissions to pending, even if someone changes the request.
create or replace function public.force_testimonial_submission_defaults()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.status := 'pending';
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists force_testimonial_submission_defaults on public.testimonials;
create trigger force_testimonial_submission_defaults
  before insert on public.testimonials
  for each row execute function public.force_testimonial_submission_defaults();

create or replace function public.set_testimonial_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_testimonial_updated_at on public.testimonials;
create trigger set_testimonial_updated_at
  before update on public.testimonials
  for each row execute function public.set_testimonial_updated_at();

-- After creating the admin account under Authentication > Users, replace the
-- email below with that exact account address and run this separate statement:
--
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
--   || jsonb_build_object('is_testimonials_admin', true)
-- where lower(email) = lower('YOUR_ADMIN_EMAIL');
--
-- Then sign out and sign back in so the JWT contains the new app_metadata claim.

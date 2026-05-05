-- 003_storage_and_admin_bootstrap.sql
-- Storage buckets + RLS policies + admin bootstrap helper.
-- Target: Supabase Postgres
--
-- File path suggestions (frontend upload targets):
-- public-assets:
--   - logo/logo-main.svg
--   - logo/logo-dark.svg
--   - og/home-og.webp
--   - og/default-og.webp
--   - hero/hero-bg.webp
-- coach-avatars:
--   - coaches/{coach_id}/avatar.webp
--   - coaches/{coach_id}/profile.webp
-- product-images:
--   - products/{product_id}/main.webp
--   - products/{product_id}/gallery-1.webp
--   - products/{product_id}/gallery-2.webp

-- =========================
-- I. Storage buckets
-- =========================

-- Note: Supabase Storage metadata lives in schema "storage".
-- Buckets are created by inserting into storage.buckets.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'public-assets',
    'public-assets',
    true,
    5242880, -- 5MB
    array['image/png','image/jpeg','image/webp','image/svg+xml']::text[]
  ),
  (
    'coach-avatars',
    'coach-avatars',
    true,
    5242880, -- 5MB
    array['image/png','image/jpeg','image/webp']::text[]
  ),
  (
    'product-images',
    'product-images',
    true,
    8388608, -- 8MB
    array['image/png','image/jpeg','image/webp']::text[]
  )
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- =========================
-- II. Storage policies
-- =========================

-- Ensure RLS is enabled on storage.objects (Supabase enables this by default,
-- but "enable" is idempotent).
alter table storage.objects enable row level security;

-- Public read (anon + authenticated) for specific buckets
drop policy if exists storage_public_read_assets on storage.objects;
create policy storage_public_read_assets
on storage.objects
for select
to anon, authenticated
using (bucket_id in ('public-assets','coach-avatars','product-images'));

-- Admin/editor write policies (upload/update/delete) for specific buckets
-- Uses existing helper: public.is_editor_or_admin()

drop policy if exists storage_editor_insert_assets on storage.objects;
create policy storage_editor_insert_assets
on storage.objects
for insert
to authenticated
with check (
  public.is_editor_or_admin()
  and bucket_id in ('public-assets','coach-avatars','product-images')
);

drop policy if exists storage_editor_update_assets on storage.objects;
create policy storage_editor_update_assets
on storage.objects
for update
to authenticated
using (
  public.is_editor_or_admin()
  and bucket_id in ('public-assets','coach-avatars','product-images')
)
with check (
  public.is_editor_or_admin()
  and bucket_id in ('public-assets','coach-avatars','product-images')
);

drop policy if exists storage_editor_delete_assets on storage.objects;
create policy storage_editor_delete_assets
on storage.objects
for delete
to authenticated
using (
  public.is_editor_or_admin()
  and bucket_id in ('public-assets','coach-avatars','product-images')
);

-- =========================
-- III. Admin bootstrap helper
-- =========================

-- SECURITY NOTE:
-- This function is intended ONLY for first-time project initialization.
-- It will refuse to run if ANY super_admin already exists.

create or replace function public.bootstrap_super_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if exists (
    select 1 from public.profiles
    where role = 'super_admin'::public.user_role
  ) then
    raise exception 'bootstrap_super_admin is disabled: super_admin already exists';
  end if;

  select u.id into v_user_id
  from auth.users u
  where lower(u.email) = lower(p_email)
  limit 1;

  if v_user_id is null then
    raise exception 'No auth user found for email: %', p_email;
  end if;

  -- Ensure a profile row exists (created by trigger in 002, but we keep it safe)
  insert into public.profiles (id, role, display_name, created_at, updated_at)
  values (v_user_id, 'member'::public.user_role, p_email, now(), now())
  on conflict (id) do nothing;

  update public.profiles
  set role = 'super_admin'::public.user_role,
      display_name = coalesce(nullif(display_name,''), p_email),
      updated_at = now()
  where id = v_user_id;

  return format('OK: %s promoted to super_admin', p_email);
end;
$$;

-- =========================
-- IV. Indexes / hardening
-- =========================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_line_bindings_member_status on public.line_bindings(member_id, status);
create index if not exists idx_line_bindings_line_user_id on public.line_bindings(line_user_id);


-- 002_auth_profile_member_trigger.sql
-- Auth triggers: auto-create profiles/members on signup,
-- and sync members.is_line_bound from line_bindings.
-- Target: Supabase Postgres

-- =========================
-- I. Auth trigger function
-- =========================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
  v_member_name text;
  v_member_email text;
begin
  -- profiles.display_name priority: display_name > name > email
  v_display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'name',
    new.email
  );

  insert into public.profiles (id, role, display_name, created_at, updated_at)
  values (new.id, 'member'::public.user_role, v_display_name, now(), now())
  on conflict (id) do nothing;

  -- members.name priority: name > display_name > email > '未命名會員'
  v_member_name := coalesce(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    new.email,
    '未命名會員'
  );

  -- members.email priority: new.email > raw_user_meta_data.email > ''
  v_member_email := coalesce(
    new.email,
    new.raw_user_meta_data->>'email',
    ''
  );

  insert into public.members (
    auth_user_id,
    name,
    phone,
    email,
    city,
    badminton_level,
    is_line_bound,
    created_at,
    updated_at
  )
  values (
    new.id,
    v_member_name,
    nullif(new.raw_user_meta_data->>'phone',''),
    v_member_email,
    nullif(new.raw_user_meta_data->>'city',''),
    nullif(new.raw_user_meta_data->>'badminton_level',''),
    false,
    now(),
    now()
  )
  on conflict (auth_user_id) do nothing;

  return new;
end;
$$;

-- =========================
-- II. Trigger on auth.users
-- =========================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================
-- III. Sync members.is_line_bound
-- =========================

create or replace function public.sync_member_line_bound_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_member_id uuid;
  v_new_member_id uuid;
begin
  if (tg_op = 'INSERT') then
    v_old_member_id := null;
    v_new_member_id := new.member_id;
  elsif (tg_op = 'UPDATE') then
    v_old_member_id := old.member_id;
    v_new_member_id := new.member_id;
  elsif (tg_op = 'DELETE') then
    v_old_member_id := old.member_id;
    v_new_member_id := null;
  else
    v_old_member_id := null;
    v_new_member_id := null;
  end if;

  -- Update old.member_id if changed (or on delete)
  if v_old_member_id is not null then
    update public.members m
    set is_line_bound = exists (
      select 1
      from public.line_bindings lb
      where lb.member_id = v_old_member_id
        and lb.status = 'bound'::public.line_binding_status
        and lb.unbound_at is null
    ),
    updated_at = now()
    where m.id = v_old_member_id;
  end if;

  -- Update new.member_id if present and different
  if v_new_member_id is not null and v_new_member_id is distinct from v_old_member_id then
    update public.members m
    set is_line_bound = exists (
      select 1
      from public.line_bindings lb
      where lb.member_id = v_new_member_id
        and lb.status = 'bound'::public.line_binding_status
        and lb.unbound_at is null
    ),
    updated_at = now()
    where m.id = v_new_member_id;
  end if;

  if (tg_op = 'DELETE') then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists on_line_binding_changed on public.line_bindings;
create trigger on_line_binding_changed
after insert or update or delete on public.line_bindings
for each row execute function public.sync_member_line_bound_status();

-- =========================
-- IV. Indexes
-- =========================

create index if not exists idx_members_auth_user_id on public.members(auth_user_id);
create index if not exists idx_members_email on public.members(email);


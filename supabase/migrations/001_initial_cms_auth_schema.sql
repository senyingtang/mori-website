-- 001_initial_cms_auth_schema.sql
-- Initial CMS/Auth schema for Mori badminton brand website.
-- Target: Supabase Postgres

-- =========================
-- I. Extensions
-- =========================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =========================
-- II. Enum Types
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('super_admin','admin','editor','coach','member');
  end if;

  if not exists (select 1 from pg_type where typname = 'service_type') then
    create type public.service_type as enum ('teaching','dropin','both');
  end if;

  if not exists (select 1 from pg_type where typname = 'map_tab_type') then
    create type public.map_tab_type as enum ('teaching','dropin');
  end if;

  if not exists (select 1 from pg_type where typname = 'session_type') then
    create type public.session_type as enum ('dropin','teaching','training');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft','coming_soon','active','sold_out');
  end if;

  if not exists (select 1 from pg_type where typname = 'line_binding_status') then
    create type public.line_binding_status as enum ('pending','bound','unbound');
  end if;
end
$$;

-- =========================
-- III. Tables
-- =========================

-- profiles: maps to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'member',
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- members: member profile data
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text not null,
  city text,
  badminton_level text,
  is_line_bound boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- line_bindings: LINE binding records
create table if not exists public.line_bindings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  line_user_id text,
  status public.line_binding_status not null default 'pending',
  bound_at timestamptz,
  unbound_at timestamptz,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- site_settings: global settings
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_at timestamptz default now()
);

-- cms_pages: generic CMS pages
create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- home_sections: homepage section control
create table if not exists public.home_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  content jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- locations: venues / locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  district text,
  name text not null,
  address text,
  service_type public.service_type not null default 'both',
  description text,
  latitude numeric,
  longitude numeric,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- map_city_settings: taiwan map configuration per tab + city
create table if not exists public.map_city_settings (
  id uuid primary key default gen_random_uuid(),
  tab_type public.map_tab_type not null,
  city text not null,
  is_enabled boolean not null default true,
  glow_color text not null,
  hover_title text not null,
  hover_description text,
  cta_text text not null,
  cta_href text not null,
  location_ids uuid[] default '{}'::uuid[],
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint map_city_settings_tab_city_unique unique (tab_type, city)
);

-- sessions: dropin / teaching / training sessions
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  title text,
  session_type public.session_type not null,
  weekday text,
  start_time time,
  end_time time,
  level_min int,
  level_max int,
  shuttlecock text,
  price numeric,
  capacity int,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- coaches: coach profiles
create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  avatar_url text,
  city text,
  experience_years int,
  specialties text[] default '{}'::text[],
  level_tags text[] default '{}'::text[],
  teaching_styles text[] default '{}'::text[],
  description text,
  line_contact_url text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- product categories
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric,
  compare_at_price numeric,
  image_url text,
  category_id uuid references public.product_categories(id) on delete set null,
  status public.product_status not null default 'coming_soon',
  stock_quantity int not null default 0,
  is_active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- seo settings
create table if not exists public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text not null,
  meta_description text not null,
  h1 text,
  og_title text,
  og_description text,
  og_image_url text,
  canonical_url text,
  schema_json jsonb default '{}'::jsonb,
  noindex boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- footer links
create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  label text not null,
  href text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- policy pages
create table if not exists public.policy_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================
-- IV. updated_at Trigger
-- =========================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_set_updated_at') then
    create trigger trg_profiles_set_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_members_set_updated_at') then
    create trigger trg_members_set_updated_at
    before update on public.members
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_line_bindings_set_updated_at') then
    create trigger trg_line_bindings_set_updated_at
    before update on public.line_bindings
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_site_settings_set_updated_at') then
    create trigger trg_site_settings_set_updated_at
    before update on public.site_settings
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_cms_pages_set_updated_at') then
    create trigger trg_cms_pages_set_updated_at
    before update on public.cms_pages
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_home_sections_set_updated_at') then
    create trigger trg_home_sections_set_updated_at
    before update on public.home_sections
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_locations_set_updated_at') then
    create trigger trg_locations_set_updated_at
    before update on public.locations
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_map_city_settings_set_updated_at') then
    create trigger trg_map_city_settings_set_updated_at
    before update on public.map_city_settings
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_sessions_set_updated_at') then
    create trigger trg_sessions_set_updated_at
    before update on public.sessions
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_coaches_set_updated_at') then
    create trigger trg_coaches_set_updated_at
    before update on public.coaches
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_product_categories_set_updated_at') then
    create trigger trg_product_categories_set_updated_at
    before update on public.product_categories
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_products_set_updated_at') then
    create trigger trg_products_set_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_faqs_set_updated_at') then
    create trigger trg_faqs_set_updated_at
    before update on public.faqs
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_seo_settings_set_updated_at') then
    create trigger trg_seo_settings_set_updated_at
    before update on public.seo_settings
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_footer_links_set_updated_at') then
    create trigger trg_footer_links_set_updated_at
    before update on public.footer_links
    for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_policy_pages_set_updated_at') then
    create trigger trg_policy_pages_set_updated_at
    before update on public.policy_pages
    for each row execute function public.set_updated_at();
  end if;
end
$$;

-- =========================
-- V. Role Helper Functions
-- =========================

create or replace function public.get_my_role()
returns public.user_role
language sql
stable
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'member'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.get_my_role() in ('super_admin'::public.user_role, 'admin'::public.user_role);
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
as $$
  select public.get_my_role() in (
    'super_admin'::public.user_role,
    'admin'::public.user_role,
    'editor'::public.user_role
  );
$$;

-- =========================
-- VI. RLS
-- =========================

alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.line_bindings enable row level security;
alter table public.site_settings enable row level security;
alter table public.cms_pages enable row level security;
alter table public.home_sections enable row level security;
alter table public.locations enable row level security;
alter table public.map_city_settings enable row level security;
alter table public.sessions enable row level security;
alter table public.coaches enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.faqs enable row level security;
alter table public.seo_settings enable row level security;
alter table public.footer_links enable row level security;
alter table public.policy_pages enable row level security;

-- ---- Public read policies (anon + authenticated) ----

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
on public.site_settings
for select
to anon, authenticated
using (is_public = true);

drop policy if exists cms_pages_public_read on public.cms_pages;
create policy cms_pages_public_read
on public.cms_pages
for select
to anon, authenticated
using (is_published = true);

drop policy if exists home_sections_public_read on public.home_sections;
create policy home_sections_public_read
on public.home_sections
for select
to anon, authenticated
using (is_enabled = true);

drop policy if exists locations_public_read on public.locations;
create policy locations_public_read
on public.locations
for select
to anon, authenticated
using (is_active = true);

drop policy if exists map_city_settings_public_read on public.map_city_settings;
create policy map_city_settings_public_read
on public.map_city_settings
for select
to anon, authenticated
using (is_enabled = true);

drop policy if exists sessions_public_read on public.sessions;
create policy sessions_public_read
on public.sessions
for select
to anon, authenticated
using (is_active = true);

drop policy if exists coaches_public_read on public.coaches;
create policy coaches_public_read
on public.coaches
for select
to anon, authenticated
using (is_active = true);

drop policy if exists product_categories_public_read on public.product_categories;
create policy product_categories_public_read
on public.product_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists products_public_read on public.products;
create policy products_public_read
on public.products
for select
to anon, authenticated
using (is_active = true or status = 'coming_soon'::public.product_status);

drop policy if exists faqs_public_read on public.faqs;
create policy faqs_public_read
on public.faqs
for select
to anon, authenticated
using (is_active = true);

drop policy if exists seo_settings_public_read on public.seo_settings;
create policy seo_settings_public_read
on public.seo_settings
for select
to anon, authenticated
using (true);

drop policy if exists footer_links_public_read on public.footer_links;
create policy footer_links_public_read
on public.footer_links
for select
to anon, authenticated
using (is_active = true);

drop policy if exists policy_pages_public_read on public.policy_pages;
create policy policy_pages_public_read
on public.policy_pages
for select
to anon, authenticated
using (true);

-- ---- Admin/editor content management policies ----

-- cms_pages
drop policy if exists cms_pages_manage on public.cms_pages;
create policy cms_pages_manage
on public.cms_pages
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- home_sections
drop policy if exists home_sections_manage on public.home_sections;
create policy home_sections_manage
on public.home_sections
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- locations
drop policy if exists locations_manage on public.locations;
create policy locations_manage
on public.locations
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- map_city_settings
drop policy if exists map_city_settings_manage on public.map_city_settings;
create policy map_city_settings_manage
on public.map_city_settings
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- sessions
drop policy if exists sessions_manage on public.sessions;
create policy sessions_manage
on public.sessions
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- coaches
drop policy if exists coaches_manage on public.coaches;
create policy coaches_manage
on public.coaches
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- product_categories
drop policy if exists product_categories_manage on public.product_categories;
create policy product_categories_manage
on public.product_categories
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- products
drop policy if exists products_manage on public.products;
create policy products_manage
on public.products
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- faqs
drop policy if exists faqs_manage on public.faqs;
create policy faqs_manage
on public.faqs
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- seo_settings
drop policy if exists seo_settings_manage on public.seo_settings;
create policy seo_settings_manage
on public.seo_settings
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- footer_links
drop policy if exists footer_links_manage on public.footer_links;
create policy footer_links_manage
on public.footer_links
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- policy_pages
drop policy if exists policy_pages_manage on public.policy_pages;
create policy policy_pages_manage
on public.policy_pages
for all
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- site_settings: admin only
drop policy if exists site_settings_manage_admin on public.site_settings;
create policy site_settings_manage_admin
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- profiles: admin only (and self read)
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- members: self read/update + admin read all + self insert
drop policy if exists members_self_read on public.members;
create policy members_self_read
on public.members
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists members_self_update on public.members;
create policy members_self_update
on public.members
for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists members_self_insert on public.members;
create policy members_self_insert
on public.members
for insert
to authenticated
with check (auth_user_id = auth.uid());

drop policy if exists members_admin_read on public.members;
create policy members_admin_read
on public.members
for select
to authenticated
using (public.is_admin());

-- line_bindings: self read (via member) + admin read/update all + self insert (optional)
drop policy if exists line_bindings_self_read on public.line_bindings;
create policy line_bindings_self_read
on public.line_bindings
for select
to authenticated
using (
  exists (
    select 1 from public.members m
    where m.id = line_bindings.member_id
      and m.auth_user_id = auth.uid()
  )
);

drop policy if exists line_bindings_admin_read on public.line_bindings;
create policy line_bindings_admin_read
on public.line_bindings
for select
to authenticated
using (public.is_admin());

drop policy if exists line_bindings_admin_update on public.line_bindings;
create policy line_bindings_admin_update
on public.line_bindings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists line_bindings_self_insert on public.line_bindings;
create policy line_bindings_self_insert
on public.line_bindings
for insert
to authenticated
with check (
  exists (
    select 1 from public.members m
    where m.id = line_bindings.member_id
      and m.auth_user_id = auth.uid()
  )
);

-- =========================
-- VII. Seed Data
-- =========================

-- site_settings
insert into public.site_settings (key, value, is_public)
values
  ('brand', jsonb_build_object(
    'site_name', '森映球團｜羽森桃園',
    'slogan', '從教學到臨打，找到最適合你的羽球節奏。',
    'logo_url', null
  ), true),
  ('links', jsonb_build_object(
    'line_official', null,
    'facebook', null,
    'instagram', null
  ), true),
  ('theme', jsonb_build_object(
    'primary_purple', '#6D28D9',
    'deep_purple', '#1E103D',
    'neon_purple', '#A855F7',
    'electric_blue', '#2563EB',
    'energy_red', '#EF4444',
    'white', '#FFFFFF',
    'soft_white', '#F8FAFC'
  ), true),
  ('contact', jsonb_build_object(
    'support_email', 'support@example.com'
  ), true)
on conflict (key) do update
set value = excluded.value,
    is_public = excluded.is_public,
    updated_at = now();

-- home_sections
insert into public.home_sections (section_key, is_enabled, sort_order, content)
values
  ('hero', true, 10, '{}'::jsonb),
  ('features', true, 20, '{}'::jsonb),
  ('service_intro', true, 30, '{}'::jsonb),
  ('popular_venues', true, 40, '{}'::jsonb),
  ('featured_coaches', true, 50, '{}'::jsonb),
  ('line_intro', true, 60, '{}'::jsonb),
  ('testimonials', true, 70, '{}'::jsonb),
  ('coming_soon_products', true, 80, '{}'::jsonb),
  ('faqs', true, 90, '{}'::jsonb),
  ('final_cta', true, 100, '{}'::jsonb)
on conflict (section_key) do nothing;

-- seo_settings
insert into public.seo_settings (page_key, title, meta_description, noindex)
values
  ('home', '森映球團｜桃園羽球教學、臨打報名與 LINE 羽球系統', '森映球團提供桃園、中壢及多地羽球教學與臨打服務，整合 LINE 報名、候補通知與會員綁定系統。', false),
  ('coaches', '羽球教練團介紹｜桃園羽球教學、新手入門與進階訓練', '查看森映球團羽球教練團，提供新手入門、成人團課、雙打輪轉與步伐訓練等。', false),
  ('products', '羽球商品專區｜球團隊服、羽球配件與限定周邊', '森映球團商品專區將推出球團隊服、運動毛巾、羽球配件與限定周邊商品。', false),
  ('login', '會員登入｜森映球團', '登入後可查看臨打報名、候補、教學預約與未來商品訂單。', true),
  ('register', '會員註冊｜森映球團', '建立會員以啟用 LINE 綁定、報名紀錄、候補通知與預約管理。', true),
  ('member_dashboard', '會員中心｜森映球團', '查看個人資料、臨打報名、候補狀態、教學預約與訂單紀錄。', true),
  ('line_binding', 'LINE 綁定｜森映球團', '完成會員與 LINE 帳號綁定，以接收報名與候補通知。', true),
  ('contact', '聯絡我們｜森映球團', '臨打報名、教學預約、場地合作與商品合作，歡迎透過表單或 LINE 聯絡。', false),
  ('privacy_policy', '隱私權政策｜森映球團', '說明資料蒐集、LINE 綁定資料使用、Cookie 與第三方服務等。', false),
  ('terms', '使用條款｜森映球團', '包含會員帳號、報名規則、取消候補、付款退款與商品購買規範。', false)
on conflict (page_key) do update
set title = excluded.title,
    meta_description = excluded.meta_description,
    noindex = excluded.noindex,
    updated_at = now();

-- product_categories
insert into public.product_categories (name, slug, description, sort_order, is_active)
values
  ('球團服飾', 'team-apparel', null, 10, true),
  ('羽球配件', 'badminton-accessories', null, 20, true),
  ('訓練用品', 'training-gear', null, 30, true),
  ('限定周邊', 'limited-merch', null, 40, true),
  ('活動紀念商品', 'event-souvenirs', null, 50, true)
on conflict (slug) do nothing;

-- products (coming soon)
insert into public.products (name, slug, description, price, image_url, status, is_active, sort_order, category_id)
select
  v.name,
  v.slug,
  v.description,
  v.price,
  null::text,
  'coming_soon'::public.product_status,
  false,
  v.sort_order,
  pc.id
from (
  values
    ('森映球團限定隊服', 'mori-team-jersey', '球團限定隊服 Coming Soon', null::numeric, 10, 'team-apparel'),
    ('羽森桃園運動毛巾', 'mori-sports-towel', '運動毛巾 即將開賣', 390::numeric, 20, 'limited-merch'),
    ('球團限定握把布', 'mori-grip-tape', '握把布 預購準備中', 180::numeric, 30, 'badminton-accessories')
) as v(name, slug, description, price, sort_order, category_slug)
join public.product_categories pc on pc.slug = v.category_slug
on conflict (slug) do nothing;

-- faqs (home)
insert into public.faqs (page_key, question, answer, sort_order, is_active)
values
  ('home', '羽球臨打需要自備球拍嗎？', '建議自備球拍；若臨時需要協助，請先透過聯絡我們或 LINE 詢問可否提供借用。', 10, true),
  ('home', '新手可以參加臨打嗎？', '可以。建議先查看該場次的程度限制；若不確定適合程度，歡迎先詢問，我們會協助安排。', 20, true),
  ('home', '羽球教學適合完全沒基礎的人嗎？', '適合。我們提供新手入門課程，從握拍、步伐到基礎擊球循序建立能力。', 30, true),
  ('home', '候補遞補會怎麼通知？', '當候補遞補為正式名單時，系統會透過 LINE 通知（完成會員綁定可確保通知不漏接）。', 40, true),
  ('home', '球團商品什麼時候開賣？', '商品目前籌備中，將陸續釋出預購與上架資訊；你也可以先加入通知名單。', 50, true)
on conflict do nothing;

-- policy_pages
insert into public.policy_pages (page_key, title, content)
values
  ('privacy_policy', '隱私權政策', '本政策說明我們蒐集與使用資料的方式，包含會員資料、LINE 綁定資料、報名與預約資料、Cookie 使用與第三方服務。你可依本政策說明申請查詢或刪除個人資料。'),
  ('terms', '使用條款', '本條款包含網站使用規範、會員帳號規範、報名與候補規則、取消與退款原則、教學預約規範，以及未來商品購買與付款相關條款。')
on conflict (page_key) do update
set title = excluded.title,
    content = excluded.content,
    updated_at = now();

-- locations
insert into public.locations (city, district, name, address, service_type, description, is_active)
values
  ('桃園市', '中壢區', '中壢飆球俱樂部', null, 'dropin'::public.service_type, '固定開團臨打據點', true),
  ('桃園市', '桃園區', '羽森桃園教學據點', null, 'teaching'::public.service_type, '成人羽球教學據點', true),
  ('宜蘭縣', '羅東鎮', '宜蘭合作場館', null, 'both'::public.service_type, '不定期開團與交流', true)
on conflict do nothing;

-- map_city_settings (MVP)
insert into public.map_city_settings (
  tab_type, city, is_enabled, glow_color,
  hover_title, hover_description, cta_text, cta_href,
  location_ids, sort_order
)
select
  v.tab_type::public.map_tab_type,
  v.city,
  true,
  v.glow_color,
  v.hover_title,
  v.hover_description,
  v.cta_text,
  v.cta_href,
  v.location_ids,
  v.sort_order
from (
  values
    ('teaching', '桃園市', '#2563EB', '桃園市｜羽森桃園教學據點', '服務類型：成人羽球教學 / 入門 / 進階', '查看教學課程', '/contact', array[]::uuid[], 10),
    ('teaching', '宜蘭縣', '#2563EB', '宜蘭縣｜宜蘭合作場館', '服務類型：教學 / 交流賽（依公告）', '查看教學課程', '/contact', array[]::uuid[], 20),
    ('dropin',  '桃園市', '#EF4444', '桃園市｜中壢飆球俱樂部', '開團時間：每週三 20:00–22:00', '查看臨打場次', '/contact', array[]::uuid[], 10),
    ('dropin',  '宜蘭縣', '#EF4444', '宜蘭縣｜宜蘭合作場館', '不定期開團：臨打 / 交流賽', '查看臨打場次', '/contact', array[]::uuid[], 20)
) as v(tab_type, city, glow_color, hover_title, hover_description, cta_text, cta_href, location_ids, sort_order)
on conflict (tab_type, city) do update
set is_enabled = excluded.is_enabled,
    glow_color = excluded.glow_color,
    hover_title = excluded.hover_title,
    hover_description = excluded.hover_description,
    cta_text = excluded.cta_text,
    cta_href = excluded.cta_href,
    sort_order = excluded.sort_order,
    updated_at = now();

-- sessions
insert into public.sessions (
  location_id, title, session_type, weekday, start_time, end_time,
  level_min, level_max, shuttlecock, price, capacity, is_active
)
select
  l.id,
  case when l.name = '中壢飆球俱樂部' then '中壢飆球俱樂部 臨打' else '羽森桃園 教學場次' end,
  case when l.name = '中壢飆球俱樂部' then 'dropin'::public.session_type else 'teaching'::public.session_type end,
  case when l.name = '中壢飆球俱樂部' then '每週三' else null end,
  case when l.name = '中壢飆球俱樂部' then '20:00'::time else null end,
  case when l.name = '中壢飆球俱樂部' then '22:00'::time else null end,
  case when l.name = '中壢飆球俱樂部' then 4 else null end,
  case when l.name = '中壢飆球俱樂部' then 6 else null end,
  case when l.name = '中壢飆球俱樂部' then 'RSL No.4' else null end,
  case when l.name = '中壢飆球俱樂部' then 200 else null end,
  null::int,
  true
from public.locations l
where l.name in ('中壢飆球俱樂部', '羽森桃園教學據點')
on conflict do nothing;

-- =========================
-- VIII. Indexes
-- =========================

create index if not exists idx_home_sections_section_key on public.home_sections (section_key);
create index if not exists idx_seo_settings_page_key on public.seo_settings (page_key);
create index if not exists idx_faqs_page_key_sort_order on public.faqs (page_key, sort_order);
create index if not exists idx_locations_city_service_type_is_active on public.locations (city, service_type, is_active);
create index if not exists idx_map_city_settings_tab_city_is_enabled on public.map_city_settings (tab_type, city, is_enabled);
create index if not exists idx_sessions_location_type_is_active on public.sessions (location_id, session_type, is_active);
create index if not exists idx_coaches_featured_sort_active on public.coaches (is_featured, sort_order, is_active);
create index if not exists idx_products_category_status_active on public.products (category_id, status, is_active);
create index if not exists idx_product_categories_slug on public.product_categories (slug);
create index if not exists idx_footer_links_group_sort on public.footer_links (group_key, sort_order);


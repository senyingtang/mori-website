-- 004_contact_submissions.sql
-- Public contact form submissions (no email sending; DB only)

-- =========================
-- I. Table
-- =========================

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  line_id text,
  inquiry_type text not null,
  subject text,
  message text not null,
  source_path text,
  source_type text,
  source_id uuid,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new',
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint contact_submissions_status_check
    check (status in ('new', 'contacted', 'closed', 'spam'))
);

-- =========================
-- II. Indexes
-- =========================

create index if not exists idx_contact_submissions_status_created_at
  on public.contact_submissions (status, created_at desc);

create index if not exists idx_contact_submissions_inquiry_created_at
  on public.contact_submissions (inquiry_type, created_at desc);

create index if not exists idx_contact_submissions_source
  on public.contact_submissions (source_type, source_id);

create index if not exists idx_contact_submissions_email
  on public.contact_submissions (email);

create index if not exists idx_contact_submissions_phone
  on public.contact_submissions (phone);

-- =========================
-- III. updated_at trigger
-- =========================

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_contact_submissions_set_updated_at') then
    create trigger trg_contact_submissions_set_updated_at
    before update on public.contact_submissions
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- =========================
-- IV. RLS
-- =========================

alter table public.contact_submissions enable row level security;

-- Public / authenticated can insert
create policy "contact_submissions_public_insert"
on public.contact_submissions
for insert
to public
with check (true);

-- Admin/editor can read all
create policy "contact_submissions_admin_select"
on public.contact_submissions
for select
to authenticated
using (public.is_editor_or_admin());

-- Admin/editor can update all
create policy "contact_submissions_admin_update"
on public.contact_submissions
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

-- Admin/editor can delete all
create policy "contact_submissions_admin_delete"
on public.contact_submissions
for delete
to authenticated
using (public.is_editor_or_admin());


-- 005_coach_main_featured.sql
-- Add a single "main featured coach" flag for homepage hero section.
-- Idempotent and safe to re-run.

alter table public.coaches
add column if not exists is_main_featured boolean not null default false;

create index if not exists idx_coaches_main_featured
on public.coaches(is_main_featured, is_featured, sort_order);


-- Uplore English: progress tables
-- Run once in Supabase: SQL Editor → New query → paste all of this → Run. Safe to run again.
-- Then add English_schema in Supabase: Project Settings → Data API → Exposed schemas
-- (next to Math_schema).
--
-- Families and learners stay where they are (Math_schema.families / Math_schema.learners, managed on
-- the Uplore home page). English stores only each learner's English progress:
--   progress  one row per learner who has started English: lessons, stickers, coins, practice times
-- No names, emails, photos or location here.

create schema if not exists "English_schema";
grant usage on schema "English_schema" to anon, authenticated;

create table if not exists "English_schema".progress (
  family_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  learner_id  text not null,                           -- the learner's id (same as in Math_schema.learners)
  data        jsonb not null default '{}'::jsonb,      -- progress, bests, stickers, coins, sessions
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (family_id, learner_id),
  constraint learner_id_ok check (char_length(learner_id) between 1 and 64),
  constraint progress_size check (pg_column_size(data) < 300000)
);

create or replace function "English_schema".touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists progress_touch on "English_schema".progress;
create trigger progress_touch before insert or update on "English_schema".progress for each row execute function "English_schema".touch_updated_at();

-- Each family sees only its own rows.
alter table "English_schema".progress enable row level security;
drop policy if exists "family owns its progress" on "English_schema".progress;
create policy "family owns its progress" on "English_schema".progress for all to authenticated
  using (family_id = (select auth.uid())) with check (family_id = (select auth.uid()));
revoke all on "English_schema".progress from anon;
grant select, insert, update, delete on "English_schema".progress to authenticated;

-- Owner's overview (totals only, no names). Uses the same admins list as Maths.
create or replace function "English_schema".admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not "Math_schema".is_admin() then raise exception 'Only the owner can see this' using errcode = '42501'; end if;
  select jsonb_build_object(
    'families',      (select count(distinct family_id) from "English_schema".progress),
    'learners',      (select count(*) from "English_schema".progress),
    'active7',       (select count(*) from "English_schema".progress where updated_at > now() - interval '7 days'),
    'newFamilies30', (select count(*) from (select family_id from "English_schema".progress group by 1 having min(created_at) > now() - interval '30 days') x),
    'byMode',        (select coalesce(jsonb_object_agg(m, n), '{}'::jsonb) from (
                        select coalesce(l.data->>'mode', 'unknown') m, count(*) n from "English_schema".progress p
                        left join "Math_schema".learners l on l.family_id = p.family_id and l.id = p.learner_id group by 1) x),
    'byCountry',     (select coalesce(jsonb_object_agg(c, n), '{}'::jsonb) from (
                        select coalesce(f.settings->>'region', 'unknown') c, count(distinct p.family_id) n from "English_schema".progress p
                        left join "Math_schema".families f on f.id = p.family_id group by 1) x),
    'topLessons',    (select coalesce(jsonb_agg(jsonb_build_object('id', k, 'learners', n) order by n desc), '[]'::jsonb) from (
                        select k, count(*) n from "English_schema".progress p, jsonb_object_keys(coalesce(p.data->'progress', '{}'::jsonb)) k
                        where jsonb_typeof(p.data->'progress') = 'object' group by k order by n desc limit 15) x)
  ) into result;
  return result;
end $$;
revoke execute on function "English_schema".admin_overview() from public, anon;
revoke execute on function "English_schema".touch_updated_at() from public, anon, authenticated;
grant  execute on function "English_schema".admin_overview() to authenticated;
-- Deleting a family account (Math_schema.delete_my_account) removes these rows too (on delete cascade).

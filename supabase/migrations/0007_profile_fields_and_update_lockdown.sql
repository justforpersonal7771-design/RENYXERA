-- RENYXERA — Profile maturity, student IDs, onboarding + security fix.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. New profile details (all optional).
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists college text;
alter table public.profiles add column if not exists degree text;
alter table public.profiles add column if not exists graduation_year int;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists aspirant_status text;
alter table public.profiles add column if not exists attempt_number int;
alter table public.profiles add column if not exists exam_date date;
alter table public.profiles add column if not exists study_days_per_week int not null default 6;
alter table public.profiles add column if not exists preferred_study_time text;

alter table public.profiles drop constraint if exists profiles_details_check;
alter table public.profiles add constraint profiles_details_check check (
  (bio is null or char_length(bio) <= 160)
  and (college is null or char_length(college) <= 120)
  and (degree is null or char_length(degree) <= 80)
  and (graduation_year is null or graduation_year between 1990 and 2040)
  and (state is null or char_length(state) <= 60)
  and (city is null or char_length(city) <= 60)
  and (aspirant_status is null or aspirant_status in ('student', 'final_year', 'graduate', 'working', 'dropper'))
  and (attempt_number is null or attempt_number between 1 and 10)
  and (study_days_per_week between 1 and 7)
  and (preferred_study_time is null or preferred_study_time in ('early_morning', 'morning', 'afternoon', 'evening', 'night'))
  and (display_name is null or char_length(display_name) <= 60)
);

-- 2. Student ID (permanent, unique, assigned by the database) + onboarding.
create sequence if not exists public.student_id_seq start 100001;
alter table public.profiles add column if not exists student_id text;
alter table public.profiles alter column student_id set default ('RNX' || nextval('public.student_id_seq')::text);
update public.profiles set student_id = 'RNX' || nextval('public.student_id_seq')::text where student_id is null;
alter table public.profiles alter column student_id set not null;
create unique index if not exists profiles_student_id_uq on public.profiles (student_id);

-- Onboarding: new accounts must finish the required details before using the app.
-- Accounts that already have the required details count as onboarded; the rest see the setup step.
alter table public.profiles add column if not exists onboarded_at timestamptz;
update public.profiles set onboarded_at = coalesce(onboarded_at, now())
  where username is not null and display_name is not null and target_year is not null;
alter table public.profiles drop constraint if exists profiles_onboarding_check;
alter table public.profiles add constraint profiles_onboarding_check check (
  onboarded_at is null or (username is not null and display_name is not null and target_year is not null)
);

-- 3. SECURITY: users could previously update EVERY column of their own row — including
--    tier, entitlements, AI counters and status (e.g. make themselves "pro"). Lock updates
--    down to the fields a user is meant to edit; everything else is server-only.
revoke update on public.profiles from authenticated, anon;
grant update (
  username, display_name, avatar_seed, avatar_style,
  target_branch, target_year, target_rank, target_score, daily_study_hours,
  bio, college, degree, graduation_year, state, city, aspirant_status, attempt_number,
  exam_date, study_days_per_week, preferred_study_time, onboarded_at, updated_at
) on public.profiles to authenticated;

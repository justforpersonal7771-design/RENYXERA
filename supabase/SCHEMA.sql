-- ============================================================================
-- RENYXERA — complete database schema (Supabase Postgres)
-- ============================================================================
-- This file is the ordered migration history (supabase/migrations/0001…0022) as one
-- script. On a NEW Supabase project, run it top to bottom in the SQL Editor to recreate
-- the full schema. Never edit it by hand: add a new numbered migration, then regenerate:
--   npm run schema:build
-- Human-readable explanation of every table, policy and function: docs/TECHNICAL_REFERENCE.md §6
-- ============================================================================


-- ############################################################################
-- ##  0001_init.sql
-- ############################################################################

-- RENYXERA — Module 4B initial schema
--
-- Run this once, in full, via the Supabase SQL Editor (or `supabase db push` if you
-- adopt the Supabase CLI later). It is idempotent-ish (uses IF NOT EXISTS / OR REPLACE
-- where practical) so re-running it after a partial failure is safe, but it is not a
-- migration *chain* — for schema changes after this, add a new numbered file
-- (0002_*.sql) rather than editing this one, so history stays reviewable.
--
-- Design principle carried over from RENYXERA_Master_Plan §4B / FINDING-3: the answer
-- key (question_answers) gets ROW LEVEL SECURITY enabled with *zero* policies for the
-- anon and authenticated roles. In Postgres RLS, enabling RLS with no matching policy
-- means "no rows visible" for that role — not "some rows," none. That is not a filter
-- to get right, it is the structural fix: the anon/authenticated key literally cannot
-- read this table under any query, no matter what a client sends. Only the
-- service_role key (server-only, used inside Edge Functions / the grading route) can
-- read it, because service_role bypasses RLS entirely by design.

-- ============================================================================
-- 1. BRANCHES — multi-branch scaffolding from day one (Module 4H / Release 8)
-- ============================================================================

create table if not exists public.branches (
  code text primary key,                          -- 'CSE', 'ECE', 'EE', 'ME', 'CE', 'DA'
  name text not null,
  status text not null default 'coming_soon' check (status in ('live', 'coming_soon')),
  question_count int not null default 0,
  sort_order int not null default 0
);

alter table public.branches enable row level security;

-- Branch metadata is public reference data — same trust level as a syllabus page.
create policy "branches are publicly readable"
  on public.branches for select
  to anon, authenticated
  using (true);

insert into public.branches (code, name, status, sort_order) values
  ('CSE', 'Computer Science & Information Technology', 'live', 1),
  ('DA',  'Data Science & Artificial Intelligence',    'coming_soon', 2),
  ('ECE', 'Electronics & Communication Engineering',   'coming_soon', 3),
  ('EE',  'Electrical Engineering',                    'coming_soon', 4),
  ('ME',  'Mechanical Engineering',                    'coming_soon', 5),
  ('CE',  'Civil Engineering',                          'coming_soon', 6)
on conflict (code) do nothing;

-- ============================================================================
-- 2. QUESTIONS + OPTIONS — the PUBLIC half. Safe to serve to any client, any time.
-- ============================================================================

create table if not exists public.questions (
  id text primary key,                            -- e.g. 'GATE_CS_2026_FN_Q1'
  branch_code text not null references public.branches(code),
  year int,
  session text,
  question_no int,
  question_type text not null check (question_type in ('MCQ', 'MSQ', 'NAT')),
  marks numeric not null,
  section text,
  subject text,
  topic text,
  difficulty text,
  question_text text not null,
  has_image boolean not null default false,
  image_paths text[] not null default '{}',       -- RELATIVE paths only — see master plan §2.3.
                                                     -- Never a binary, never an absolute 3rd-party URL.
  created_at timestamptz not null default now()
);

create index if not exists questions_branch_idx on public.questions(branch_code);
create index if not exists questions_subject_idx on public.questions(subject);
create index if not exists questions_topic_idx on public.questions(topic);

alter table public.questions enable row level security;

create policy "questions are publicly readable"
  on public.questions for select
  to anon, authenticated
  using (true);

create table if not exists public.question_options (
  question_id text not null references public.questions(id) on delete cascade,
  option_id text not null,                        -- 'A' | 'B' | 'C' | 'D'
  text text not null,
  image_path text,                                 -- relative path only
  primary key (question_id, option_id)
  -- is_correct is deliberately NOT a column on this table. It lives only in
  -- question_answers below. A public table that cannot even express the answer is a
  -- stronger guarantee than a public table with a column policy has to hide it.
);

alter table public.question_options enable row level security;

create policy "question options are publicly readable"
  on public.question_options for select
  to anon, authenticated
  using (true);

-- ============================================================================
-- 3. QUESTION_ANSWERS — the PRIVATE half. No anon/authenticated policy. On purpose.
-- ============================================================================

create table if not exists public.question_answers (
  question_id text primary key references public.questions(id) on delete cascade,
  correct_option_ids text[] not null default '{}', -- MCQ: exactly 1. MSQ: 1 or more.
  nat_min numeric,
  nat_max numeric,
  solution_text text,
  solution_image_paths text[] not null default '{}'
);

alter table public.question_answers enable row level security;
-- No CREATE POLICY statement follows. That absence is the fix for FINDING-3 — see the
-- file header. Only service_role (used server-side in the grading Edge
-- Function/route) can read this table.

-- ============================================================================
-- 4. PROFILES — one row per auth user, auto-created, never client-inserted
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  phone text unique,
  phone_verified boolean not null default false,
  avatar_seed text not null default md5(random()::text),  -- DiceBear seed — never an image
  avatar_style text not null default 'adventurer',
  target_branch text not null default 'CSE' references public.branches(code),
  target_year int,
  target_rank int,
  target_score numeric,
  daily_study_hours numeric not null default 2,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  entitlements jsonb not null default '{}'::jsonb,
  daily_ai_calls int not null default 0,
  daily_ai_reset_at timestamptz,
  active_session_id uuid,
  status text not null default 'active' check (status in ('active', 'suspended', 'anonymized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Deliberately NO insert/delete policy for authenticated: rows are created only by the
-- trigger below (on auth.users insert) and deletion is handled by the anonymization
-- backstop (Module 4C — status='anonymized', never a client-issued DELETE).

-- Auto-create a profile row the moment a new auth user is created. A client-side "create
-- my profile" call would be skippable or forgeable; a trigger on auth.users cannot be.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at honest on every profile write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 5. EXAM_ATTEMPTS + EXAM_RESPONSES — server-authoritative, append-only responses
-- ============================================================================

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  branch_code text not null references public.branches(code),
  config jsonb not null default '{}'::jsonb,
  question_ids text[] not null default '{}',
  mode text not null default 'practice' check (mode in ('practice', 'graded')),
  server_started_at timestamptz not null default now(),
  duration_seconds int not null,
  submitted_at timestamptz,
  server_score numeric,
  server_max numeric,
  percentile numeric,
  air int,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'expired')),
  integrity_flags jsonb not null default '[]'::jsonb
);

create index if not exists exam_attempts_user_idx on public.exam_attempts(user_id);

alter table public.exam_attempts enable row level security;

create policy "users can read their own attempts"
  on public.exam_attempts for select
  to authenticated
  using (auth.uid() = user_id);

-- No insert/update policy for authenticated: attempts are created and scored by the
-- server-side grading path (service_role), never directly by the client — this is what
-- makes server_score authoritative (Module 5B). A client that could INSERT/UPDATE its
-- own exam_attempts row could simply write its own score.

create table if not exists public.exam_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id text not null references public.questions(id),
  selected_option_ids text[],
  nat_value numeric,
  time_spent_seconds int,
  marked_for_review boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists exam_responses_attempt_idx on public.exam_responses(attempt_id);

alter table public.exam_responses enable row level security;

create policy "users can read responses on their own attempts"
  on public.exam_responses for select
  to authenticated
  using (
    exists (
      select 1 from public.exam_attempts a
      where a.id = exam_responses.attempt_id and a.user_id = auth.uid()
    )
  );

-- No update/delete policy at all — append-only, enforced structurally rather than by
-- convention (master plan §4E "exam_responses are append-only"). Writes happen via the
-- service_role grading path only.

-- ============================================================================
-- 6. USER_QUESTION_STATE — bookmarks, mistakes, notes (mirrors the IndexedDB stores)
-- ============================================================================

create table if not exists public.user_question_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  bookmarked boolean not null default false,
  mistake_count int not null default 0,
  last_seen_at timestamptz,
  note text,
  primary key (user_id, question_id)
);

alter table public.user_question_state enable row level security;

create policy "users can read their own question state"
  on public.user_question_state for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can write their own question state"
  on public.user_question_state for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own question state"
  on public.user_question_state for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete their own question state"
  on public.user_question_state for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================================
-- 7. BRANCH_WAITLIST — Module 4H "Notify Me" on Coming Soon branches
-- ============================================================================

create table if not exists public.branch_waitlist (
  id uuid primary key default gen_random_uuid(),
  branch_code text not null references public.branches(code),
  email text,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint branch_waitlist_has_contact check (email is not null or user_id is not null)
);

alter table public.branch_waitlist enable row level security;

-- Anyone (including guests) can join a waitlist — that's the point of the feature — but
-- can only ever INSERT, never read back the list (which would leak other users' emails).
create policy "anyone can join the waitlist"
  on public.branch_waitlist for insert
  to anon, authenticated
  with check (true);

-- ============================================================================
-- Done. Next: Project Settings → API to get the URL + keys, then wire them into
-- Vercel/Cloudflare env vars (never paste the service_role key into chat or a
-- NEXT_PUBLIC_* var — see lib/supabase/server.ts and the master plan §5.3).
-- ============================================================================


-- ############################################################################
-- ##  0002_username_lowercase.sql
-- ############################################################################

-- Usernames are lowercase-only and unique regardless of case.
--
-- The profile form already lowercases input and checks availability via
-- /api/username/check, but that's the client; these constraints make it true at the
-- database level too (a direct PostgREST call can't write "Adil", and two people can't
-- race to "adil" and "ADIL"). Run once in the Supabase SQL editor.

-- 1. Normalise any existing mixed-case usernames.
update public.profiles set username = lower(username)
where username is not null and username <> lower(username);

-- 2. Lowercase + allowed characters + length, enforced on every write.
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format
  check (username is null or username ~ '^[a-z][a-z0-9_]{2,19}$') not valid;
-- NOT VALID: enforced on every new insert/update, without failing the migration if an
-- older username happens not to fit the new rules (it stays until its owner edits it).

-- 3. Case-insensitive uniqueness (belt and braces alongside the existing unique column).
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));


-- ############################################################################
-- ##  0003_ai_quota_and_cache.sql
-- ############################################################################

-- Module 4G · per-user daily AI quota (enforced in Postgres) + server-side response cache.
-- Run once in the Supabase SQL editor.

-- 1. Atomic quota check-and-increment. One statement under a row lock, so concurrent
--    Worker instances can't both slip past the limit. The day rolls over at midnight IST.
create or replace function public.consume_ai_call(p_user uuid, p_limit int)
returns table (allowed boolean, used int, day_limit int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_used int;
  v_reset date;
begin
  select daily_ai_calls, (daily_ai_reset_at at time zone 'Asia/Kolkata')::date
    into v_used, v_reset
    from profiles where id = p_user
    for update;

  if not found then
    return query select false, 0, p_limit;
    return;
  end if;

  if v_reset is null or v_reset < v_today then
    v_used := 0;
  end if;

  if v_used >= p_limit then
    update profiles set daily_ai_calls = v_used, daily_ai_reset_at = now() where id = p_user;
    return query select false, v_used, p_limit;
    return;
  end if;

  update profiles set daily_ai_calls = v_used + 1, daily_ai_reset_at = now() where id = p_user;
  return query select true, v_used + 1, p_limit;
end;
$$;

-- Server (service role) only — a signed-in user must not be able to call it directly.
revoke all on function public.consume_ai_call(uuid, int) from public, anon, authenticated;

-- 2. Response cache keyed by a hash of the exact instruction + prompt. Identical questions
--    are answered from here and cost no quota. No RLS policies: service role only.
create table if not exists public.ai_response_cache (
  prompt_hash text primary key,
  response text not null,
  hits int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.ai_response_cache enable row level security;


-- ############################################################################
-- ##  0004_graded_attempts.sql
-- ############################################################################

-- RENYXERA — Step 6 (5A/5B): answer-key withholding + server-graded attempts.
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- (exam_attempts / exam_responses already exist from 0001 and are used as-is.)

-- NAT questions whose official key accepts "A OR B" — keep every range.
-- Shape: [[min, max], [min, max]]. nat_min/nat_max stay as the first range.
alter table public.question_answers
  add column if not exists nat_ranges jsonb;


-- ############################################################################
-- ##  0005_device_sessions.sql
-- ############################################################################

-- RENYXERA — Step 7 (4F): Active Devices + sign out a single device.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- One row per (account, browser/device). Written only by our server (service_role) from
-- the verified JWT, so session_id can't be spoofed. Users may read their own rows.
create table if not exists public.device_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id text not null check (char_length(device_id) between 8 and 64),
  session_id uuid,
  label text not null default 'Unknown device' check (char_length(label) <= 80),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, device_id)
);

create index if not exists device_sessions_user_idx on public.device_sessions(user_id, last_seen_at desc);

alter table public.device_sessions enable row level security;

drop policy if exists "users read own devices" on public.device_sessions;
create policy "users read own devices"
  on public.device_sessions for select
  to authenticated
  using (auth.uid() = user_id);
-- No insert/update/delete policy: only the server writes.

-- Ends one Supabase Auth session (its refresh token stops working; the short-lived access
-- token expires within the hour, and the device signs itself out on its next check-in).
-- Only callable with the service_role key, and only for a session owned by p_user.
create or replace function public.revoke_auth_session(p_user uuid, p_session uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.sessions where id = p_session and user_id = p_user;
$$;

revoke all on function public.revoke_auth_session(uuid, uuid) from public, anon, authenticated;
grant execute on function public.revoke_auth_session(uuid, uuid) to service_role;


-- ############################################################################
-- ##  0006_waitlist_hardening.sql
-- ############################################################################

-- RENYXERA — Step 8 (4H): waitlist hardening.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. Joins now go through /api/waitlist (email validation, rate limit, dedupe) using the
--    service role. The old open INSERT policy let anyone with the public key write any
--    number of rows straight to the table — remove it.
drop policy if exists "anyone can join the waitlist" on public.branch_waitlist;

-- 2. Clear exact duplicates before adding uniqueness (keeps the earliest signup).
delete from public.branch_waitlist a
using public.branch_waitlist b
where a.ctid > b.ctid
  and a.branch_code = b.branch_code
  and (
    (a.email is not null and lower(a.email) = lower(b.email))
    or (a.user_id is not null and a.user_id = b.user_id)
  );

-- 3. One signup per person per branch (emails compared case-insensitively).
create unique index if not exists branch_waitlist_email_uq
  on public.branch_waitlist (branch_code, lower(email)) where email is not null;
create unique index if not exists branch_waitlist_user_uq
  on public.branch_waitlist (branch_code, user_id) where user_id is not null;

-- 4. Sanity limit on stored emails.
alter table public.branch_waitlist drop constraint if exists branch_waitlist_email_len;
alter table public.branch_waitlist add constraint branch_waitlist_email_len
  check (email is null or char_length(email) <= 254);


-- ############################################################################
-- ##  0007_profile_fields_and_update_lockdown.sql
-- ############################################################################

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


-- ############################################################################
-- ##  0008_student_id_format.sql
-- ############################################################################

-- RENYXERA — Student ID format: RNX-GATE-<BRANCH>-<6 digits>, e.g. RNX-GATE-CSIT-100001.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- New accounts (all CS & IT today; other branches get their own code when they launch).
alter table public.profiles
  alter column student_id set default ('RNX-GATE-CSIT-' || nextval('public.student_id_seq')::text);

-- Existing IDs keep their number: RNX100001 -> RNX-GATE-CSIT-100001.
update public.profiles
  set student_id = 'RNX-GATE-CSIT-' || substring(student_id from 4)
  where student_id ~ '^RNX[0-9]+$';

-- Guard the format from now on.
alter table public.profiles drop constraint if exists profiles_student_id_format;
alter table public.profiles add constraint profiles_student_id_format
  check (student_id ~ '^RNX-GATE-[A-Z]{2,5}-[0-9]{6,}$');


-- ############################################################################
-- ##  0009_all_india_mocks.sql
-- ############################################################################

-- RENYXERA — Step 11 (5E): scheduled All-India mocks + leaderboards.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. Scheduled mocks (public schedule; question ids are public — answers stay private).
create table if not exists public.mock_events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 120),
  branch_code text not null default 'CSE' references public.branches(code),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  results_at timestamptz not null,
  question_ids text[] not null,
  duration_seconds int not null check (duration_seconds between 600 and 14400),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at and results_at >= ends_at)
);
create index if not exists mock_events_starts_idx on public.mock_events (starts_at desc);
alter table public.mock_events enable row level security;
drop policy if exists "mock schedule is public" on public.mock_events;
create policy "mock schedule is public" on public.mock_events for select to anon, authenticated using (true);
-- Mocks are created only by the server/admin script (service role).

-- 2. Attempts can belong to a mock — one attempt per person per mock.
alter table public.exam_attempts add column if not exists mock_id uuid references public.mock_events(id) on delete set null;
create unique index if not exists exam_attempts_one_per_mock on public.exam_attempts (user_id, mock_id) where mock_id is not null;

-- 3. Leaderboard privacy: names are shown only for people who opt in.
alter table public.profiles add column if not exists leaderboard_opt_in boolean not null default false;
grant update (leaderboard_opt_in) on public.profiles to authenticated;

-- 4. Leaderboard (server-computed rank + percentile). Only after results are released;
--    only submitted, on-time, UNFLAGGED attempts are ranked (flagged ones are kept, not
--    shown). Opted-out people appear as "Aspirant ####". Always includes the caller's row.
create or replace function public.mock_leaderboard(p_mock uuid, p_limit int default 50)
returns table (rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (
    select * from public.mock_events where id = p_mock and now() >= results_at
  ),
  eligible as (
    select a.user_id, a.server_score
    from public.exam_attempts a
    join m on a.mock_id = m.id
    where a.status = 'submitted'
      and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '15 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
  ),
  ranked as (
    select e.user_id, e.server_score,
           rank() over (order by e.server_score desc) as rnk,
           count(*) over () as n
    from eligible e
  )
  select r.rnk,
         case when p.leaderboard_opt_in then coalesce(nullif(p.display_name, ''), p.username, 'Aspirant')
              else 'Aspirant ' || right(coalesce(p.student_id, '0000'), 4) end,
         r.server_score,
         round(100.0 * (r.n - r.rnk) / greatest(r.n - 1, 1), 2),
         r.user_id = auth.uid(),
         r.n
  from ranked r
  join public.profiles p on p.id = r.user_id
  where r.rnk <= greatest(1, least(p_limit, 200)) or r.user_id = auth.uid()
  order by r.rnk;
$$;

revoke all on function public.mock_leaderboard(uuid, int) from public;
grant execute on function public.mock_leaderboard(uuid, int) to anon, authenticated;


-- ############################################################################
-- ##  0010_mock_timing_and_leaderboard_privacy.sql
-- ############################################################################

-- RENYXERA — Step 11 (5E): real-exam mock timing + leaderboard display choices.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. Late-start grace per mock (server trouble at 10:00 shouldn't cost anyone the paper).
--    Window: starts_at 10:00, starts accepted until starts_at + start_grace_minutes (10:30),
--    everyone gets exactly duration_seconds (180 min), hard close ends_at = 13:30.
alter table public.mock_events add column if not exists start_grace_minutes int not null default 30
  check (start_grace_minutes between 0 and 60);

-- 2. How a person appears on leaderboards. Display labels only — neither the username nor
--    the student ID can be used to sign in, look anyone up, or change anything.
alter table public.profiles add column if not exists leaderboard_display text not null default 'anonymous';
alter table public.profiles drop constraint if exists profiles_leaderboard_display_check;
alter table public.profiles add constraint profiles_leaderboard_display_check
  check (leaderboard_display in ('anonymous', 'username', 'username_student_id'));
update public.profiles set leaderboard_display = 'username'
  where leaderboard_opt_in = true and leaderboard_display = 'anonymous';
grant update (leaderboard_display) on public.profiles to authenticated;

-- 3. Leaderboard: display per the person's choice; on-time = submitted by the hard close
--    (+2 min network grace); unflagged only; released after results_at.
create or replace function public.mock_leaderboard(p_mock uuid, p_limit int default 50)
returns table (rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (
    select * from public.mock_events where id = p_mock and now() >= results_at
  ),
  eligible as (
    select a.user_id, a.server_score
    from public.exam_attempts a
    join m on a.mock_id = m.id
    where a.status = 'submitted'
      and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
  ),
  ranked as (
    select e.user_id, e.server_score,
           rank() over (order by e.server_score desc) as rnk,
           count(*) over () as n
    from eligible e
  )
  select r.rnk,
         case
           when p.leaderboard_display = 'username_student_id' and p.username is not null
             then '@' || p.username || ' · ' || coalesce(p.student_id, '')
           when p.leaderboard_display = 'username' and p.username is not null
             then '@' || p.username
           else 'Aspirant ' || right(coalesce(p.student_id, '0000'), 4)
         end,
         r.server_score,
         round(100.0 * (r.n - r.rnk) / greatest(r.n - 1, 1), 2),
         r.user_id = auth.uid(),
         r.n
  from ranked r
  join public.profiles p on p.id = r.user_id
  where r.rnk <= greatest(1, least(p_limit, 200)) or r.user_id = auth.uid()
  order by r.rnk;
$$;

revoke all on function public.mock_leaderboard(uuid, int) from public;
grant execute on function public.mock_leaderboard(uuid, int) to anon, authenticated;


-- ############################################################################
-- ##  0011_gate_style_results.sql
-- ############################################################################

-- RENYXERA — Step 11c (5E): mock results computed exactly the way GATE computes them.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- How GATE results work (GATE information brochure, 2021 onwards) and what we mirror:
--   * All-India Rank is ONE common list for every category, ordered by marks (to 2
--     decimals). Candidates with equal marks get the SAME rank; the next rank skips
--     (1, 2, 2, 4). GATE uses NO tie-breaker — not date of birth, age, or anything else —
--     so date of birth is deliberately not collected.
--   * Qualifying mark (single-session paper, out of 100):
--       General      = max(25, mean + standard deviation of all candidates' marks)
--       OBC-NCL/EWS  = 0.9 × General
--       SC/ST/PwD    = 2/3 × General        (PwD applies whatever the caste category)
--   * GATE score = Sq + (St − Sq) × (M − Mq) / (Mt − Mq), with Sq = 350, St = 900,
--       Mq = General qualifying mark, Mt = mean marks of the top 0.1% of candidates or the
--       top 10, whichever is larger. Clamped to 0–1000. Issued only to qualified candidates.
--   * GATE does not publish a category rank; PSUs/IITs derive one. We show it privately
--     (only to the candidate) because students use it.

-- 1. Category and PwD — private, only the owner can read them (profiles RLS), never shown
--    on leaderboards. Optional: without them we assume General for the qualifying check.
alter table public.profiles add column if not exists category text;
alter table public.profiles drop constraint if exists profiles_category_check;
alter table public.profiles add constraint profiles_category_check
  check (category is null or category in ('GEN', 'EWS', 'OBC_NCL', 'SC', 'ST'));
alter table public.profiles add column if not exists pwd boolean not null default false;
grant update (category, pwd) on public.profiles to authenticated;

-- 2. The caller's own GATE-style result for a mock (after results are released).
--    Uses the same ranked population as the leaderboard: submitted, on time, unflagged.
drop function if exists public.mock_my_result(uuid);
create function public.mock_my_result(p_mock uuid)
returns table (
  status text,              -- 'ranked' | 'flagged' | 'late' | 'not_attempted' | 'pending'
  marks numeric,
  max_marks numeric,
  air bigint,               -- All-India Rank (ties share a rank)
  candidates bigint,        -- ranked candidates
  percentile numeric,
  category text,
  pwd boolean,
  category_rank bigint,     -- among ranked candidates of the same category (PwD: among PwD)
  qualifying_general numeric,
  qualifying_obc_ews numeric,
  qualifying_sc_st_pwd numeric,
  my_qualifying numeric,
  qualified boolean,
  gate_score int,
  mean_marks numeric,
  sd_marks numeric,
  topper_mean numeric
)
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_mock public.mock_events%rowtype;
  v_att public.exam_attempts%rowtype;
  v_n bigint; v_mean numeric; v_sd numeric; v_q numeric; v_top_n int; v_mt numeric;
  v_cat text; v_pwd boolean; v_myq numeric;
  v_uids uuid[]; v_marks numeric[]; v_cats text[]; v_pwds boolean[];
  v_mine numeric; v_in boolean;
begin
  if v_uid is null then return; end if;
  select * into v_mock from public.mock_events where id = p_mock;
  if not found then return; end if;
  select * into v_att from public.exam_attempts where mock_id = p_mock and user_id = v_uid;
  if now() < v_mock.results_at then
    return query select 'pending'::text, null::numeric, null::numeric, null::bigint, null::bigint, null::numeric, null::text, null::boolean, null::bigint, null::numeric, null::numeric, null::numeric, null::numeric, null::boolean, null::int, null::numeric, null::numeric, null::numeric;
    return;
  end if;

  -- Ranked population (same rules as mock_leaderboard), held in arrays (read-only function).
  select coalesce(array_agg(a.user_id), '{}'), coalesce(array_agg(a.server_score), '{}'),
         coalesce(array_agg(coalesce(p.category, 'GEN')), '{}'), coalesce(array_agg(coalesce(p.pwd, false)), '{}')
    into v_uids, v_marks, v_cats, v_pwds
    from public.exam_attempts a join public.profiles p on p.id = a.user_id
    where a.mock_id = p_mock and a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= v_mock.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0;

  select count(*), avg(m), coalesce(stddev_pop(m), 0) into v_n, v_mean, v_sd from unnest(v_marks) m;
  v_q := round(greatest(25, coalesce(v_mean, 0) + coalesce(v_sd, 0)), 2);
  v_top_n := greatest(10, ceil(v_n * 0.001)::int);
  select avg(t.m) into v_mt from (select m from unnest(v_marks) m order by m desc limit v_top_n) t;
  v_in := v_uid = any(v_uids);
  if v_in then v_mine := v_marks[array_position(v_uids, v_uid)]; end if;

  select coalesce(p.category, 'GEN'), coalesce(p.pwd, false) into v_cat, v_pwd from public.profiles p where p.id = v_uid;
  v_myq := case when v_pwd or v_cat in ('SC', 'ST') then round(v_q * 2 / 3, 2)
                when v_cat in ('OBC_NCL', 'EWS') then round(v_q * 0.9, 2)
                else v_q end;

  if v_att.id is null then
    return query select 'not_attempted'::text, null::numeric, null::numeric, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;
  if not v_in then
    return query select (case when coalesce(jsonb_array_length(v_att.integrity_flags), 0) > 0 then 'flagged' else 'late' end)::text,
      v_att.server_score, v_att.server_max, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;

  return query
  with g as (select * from unnest(v_marks, v_cats, v_pwds) as t(marks, cat, pwd))
  select 'ranked'::text,
    v_mine,
    v_att.server_max,
    (select count(*) from g where g.marks > v_mine) + 1,
    v_n,
    round(100.0 * (select count(*) from g where g.marks < v_mine) / greatest(v_n - 1, 1), 2),
    v_cat, v_pwd,
    (select count(*) from g where g.marks > v_mine
       and (case when v_pwd then g.pwd else g.cat = v_cat end)) + 1,
    v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq,
    v_mine >= v_myq,
    case when v_mine >= v_myq and v_mt is not null and v_mt > v_q
      then least(1000, greatest(0, round(350 + (900 - 350) * (v_mine - v_q) / (v_mt - v_q))))::int
      else null end,
    round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
end;
$$;

-- 3. Leaderboard percentile made tie-correct: share of ranked candidates scored strictly
--    below you (equal marks → equal rank AND equal percentile). Otherwise as in 0010.
create or replace function public.mock_leaderboard(p_mock uuid, p_limit int default 50)
returns table (rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (
    select * from public.mock_events where id = p_mock and now() >= results_at
  ),
  eligible as (
    select a.user_id, a.server_score
    from public.exam_attempts a
    join m on a.mock_id = m.id
    where a.status = 'submitted'
      and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
  ),
  ranked as (
    select e.user_id, e.server_score,
           rank() over (order by e.server_score desc) as rnk,
           rank() over (order by e.server_score asc) - 1 as below,
           count(*) over () as n
    from eligible e
  )
  select r.rnk,
         case
           when p.leaderboard_display = 'username_student_id' and p.username is not null
             then '@' || p.username || ' · ' || coalesce(p.student_id, '')
           when p.leaderboard_display = 'username' and p.username is not null
             then '@' || p.username
           else 'Aspirant ' || right(coalesce(p.student_id, '0000'), 4)
         end,
         r.server_score,
         round(100.0 * r.below / greatest(r.n - 1, 1), 2),
         r.user_id = auth.uid(),
         r.n
  from ranked r
  join public.profiles p on p.id = r.user_id
  where r.rnk <= greatest(1, least(p_limit, 200)) or r.user_id = auth.uid()
  order by r.rnk;
$$;
revoke all on function public.mock_leaderboard(uuid, int) from public;
grant execute on function public.mock_leaderboard(uuid, int) to anon, authenticated;

revoke all on function public.mock_my_result(uuid) from public;
grant execute on function public.mock_my_result(uuid) to authenticated;


-- ############################################################################
-- ##  0012_gate_score_small_mocks.sql
-- ############################################################################

-- RENYXERA — Step 11c fix: GATE score for small mocks.
-- Run once in the Supabase SQL Editor. Safe to re-run.
-- With few candidates, Mt (mean of top 0.1% / top 10) can be <= the qualifying mark, so the
-- score formula is undefined; fall back to the topper's marks. Otherwise identical to 0011.

drop function if exists public.mock_my_result(uuid);
create function public.mock_my_result(p_mock uuid)
returns table (
  status text,              -- 'ranked' | 'flagged' | 'late' | 'not_attempted' | 'pending'
  marks numeric,
  max_marks numeric,
  air bigint,               -- All-India Rank (ties share a rank)
  candidates bigint,        -- ranked candidates
  percentile numeric,
  category text,
  pwd boolean,
  category_rank bigint,     -- among ranked candidates of the same category (PwD: among PwD)
  qualifying_general numeric,
  qualifying_obc_ews numeric,
  qualifying_sc_st_pwd numeric,
  my_qualifying numeric,
  qualified boolean,
  gate_score int,
  mean_marks numeric,
  sd_marks numeric,
  topper_mean numeric
)
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_mock public.mock_events%rowtype;
  v_att public.exam_attempts%rowtype;
  v_n bigint; v_mean numeric; v_sd numeric; v_q numeric; v_top_n int; v_mt numeric;
  v_cat text; v_pwd boolean; v_myq numeric;
  v_uids uuid[]; v_marks numeric[]; v_cats text[]; v_pwds boolean[];
  v_mine numeric; v_in boolean;
begin
  if v_uid is null then return; end if;
  select * into v_mock from public.mock_events where id = p_mock;
  if not found then return; end if;
  select * into v_att from public.exam_attempts where mock_id = p_mock and user_id = v_uid;
  if now() < v_mock.results_at then
    return query select 'pending'::text, null::numeric, null::numeric, null::bigint, null::bigint, null::numeric, null::text, null::boolean, null::bigint, null::numeric, null::numeric, null::numeric, null::numeric, null::boolean, null::int, null::numeric, null::numeric, null::numeric;
    return;
  end if;

  -- Ranked population (same rules as mock_leaderboard), held in arrays (read-only function).
  select coalesce(array_agg(a.user_id), '{}'), coalesce(array_agg(a.server_score), '{}'),
         coalesce(array_agg(coalesce(p.category, 'GEN')), '{}'), coalesce(array_agg(coalesce(p.pwd, false)), '{}')
    into v_uids, v_marks, v_cats, v_pwds
    from public.exam_attempts a join public.profiles p on p.id = a.user_id
    where a.mock_id = p_mock and a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= v_mock.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0;

  select count(*), avg(m), coalesce(stddev_pop(m), 0) into v_n, v_mean, v_sd from unnest(v_marks) m;
  v_q := round(greatest(25, coalesce(v_mean, 0) + coalesce(v_sd, 0)), 2);
  v_top_n := greatest(10, ceil(v_n * 0.001)::int);
  select avg(t.m) into v_mt from (select m from unnest(v_marks) m order by m desc limit v_top_n) t;
  -- Small mocks: with few candidates the top-10 mean can fall at/below the qualifying mark,
  -- which makes the formula undefined. Fall back to the topper's marks (a real GATE paper,
  -- with lakhs of candidates, never hits this).
  if v_mt is not null and v_mt <= v_q then select max(m) into v_mt from unnest(v_marks) m; end if;
  v_in := v_uid = any(v_uids);
  if v_in then v_mine := v_marks[array_position(v_uids, v_uid)]; end if;

  select coalesce(p.category, 'GEN'), coalesce(p.pwd, false) into v_cat, v_pwd from public.profiles p where p.id = v_uid;
  v_myq := case when v_pwd or v_cat in ('SC', 'ST') then round(v_q * 2 / 3, 2)
                when v_cat in ('OBC_NCL', 'EWS') then round(v_q * 0.9, 2)
                else v_q end;

  if v_att.id is null then
    return query select 'not_attempted'::text, null::numeric, null::numeric, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;
  if not v_in then
    return query select (case when coalesce(jsonb_array_length(v_att.integrity_flags), 0) > 0 then 'flagged' else 'late' end)::text,
      v_att.server_score, v_att.server_max, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;

  return query
  with g as (select * from unnest(v_marks, v_cats, v_pwds) as t(marks, cat, pwd))
  select 'ranked'::text,
    v_mine,
    v_att.server_max,
    (select count(*) from g where g.marks > v_mine) + 1,
    v_n,
    round(100.0 * (select count(*) from g where g.marks < v_mine) / greatest(v_n - 1, 1), 2),
    v_cat, v_pwd,
    (select count(*) from g where g.marks > v_mine
       and (case when v_pwd then g.pwd else g.cat = v_cat end)) + 1,
    v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq,
    v_mine >= v_myq,
    case when v_mine >= v_myq and v_mt is not null and v_mt > v_q
      then least(1000, greatest(0, round(350 + (900 - 350) * (v_mine - v_q) / (v_mt - v_q))))::int
      else null end,
    round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
end;
$$;

revoke all on function public.mock_my_result(uuid) from public;
grant execute on function public.mock_my_result(uuid) to authenticated;


-- ############################################################################
-- ##  0013_mock_paper_embargo.sql
-- ############################################################################

-- RENYXERA — Step 11d (5E): keep a mock paper secret until it starts.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Mock papers are drawn from past GATE papers. If the question ids were readable before
-- the start, anyone could look the answers up in practice mode beforehand. So:
--   * the public can read the schedule (title, times, number of questions) but NOT the
--     question ids;
--   * mock_paper(p_mock) returns the ids only once the paper has started (signed in).
-- While a paper is running (start → results time) the server also refuses to reveal the
-- answers of its questions anywhere (/api/answers, /api/exam/grade) — see
-- lib/security/mock-embargo.ts.

alter table public.mock_events add column if not exists question_count int
  generated always as (cardinality(question_ids)) stored;

revoke select on public.mock_events from anon, authenticated;
grant select (id, title, branch_code, starts_at, ends_at, results_at, duration_seconds,
              start_grace_minutes, question_count, created_at)
  on public.mock_events to anon, authenticated;

drop function if exists public.mock_paper(uuid);
create function public.mock_paper(p_mock uuid)
returns text[]
language sql
security definer
stable
set search_path = ''
as $$
  select m.question_ids from public.mock_events m
  where m.id = p_mock and now() >= m.starts_at and auth.uid() is not null;
$$;
revoke all on function public.mock_paper(uuid) from public;
grant execute on function public.mock_paper(uuid) to authenticated;


-- ############################################################################
-- ##  0014_leaderboards_with_movement.sql
-- ############################################################################

-- RENYXERA — leaderboards with rank movement (navbar Leaderboard panel).
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Two boards, both showing each person the way they chose (anonymous / username /
-- username + student ID — never email), both returning the previous rank so the UI can
-- animate who moved up or down:
--   * practice_leaderboard(p_days, p_limit): marks scored in practice/Exam-Setup tests
--     (not mocks) over the last p_days days; negatives count as 0. prev_rank = rank over
--     the p_days before that.
--   * mock_leaderboard_moves(p_mock, p_limit): the mock ranking (same rules as
--     mock_leaderboard: released, submitted on time, unflagged) plus prev_rank = the
--     person's rank in the previous released mock.

create or replace function public.display_label(p public.profiles)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p.leaderboard_display = 'username_student_id' and p.username is not null
      then '@' || p.username || ' · ' || coalesce(p.student_id, '')
    when p.leaderboard_display = 'username' and p.username is not null
      then '@' || p.username
    else 'Aspirant ' || right(coalesce(p.student_id, '0000'), 4)
  end;
$$;
revoke all on function public.display_label(public.profiles) from public;

-- Internal: ranked population of one mock (not callable by clients).
create or replace function public._mock_ranks(p_mock uuid)
returns table (user_id uuid, score numeric, rnk bigint, below bigint, n bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (select * from public.mock_events where id = p_mock and now() >= results_at),
  e as (
    select a.user_id, a.server_score
    from public.exam_attempts a join m on a.mock_id = m.id
    where a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '2 minutes'
      and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
  )
  select e.user_id, e.server_score,
         rank() over (order by e.server_score desc),
         rank() over (order by e.server_score asc) - 1,
         count(*) over ()
  from e;
$$;
revoke all on function public._mock_ranks(uuid) from public, anon, authenticated;

drop function if exists public.mock_leaderboard_moves(uuid, int);
create function public.mock_leaderboard_moves(p_mock uuid, p_limit int default 50)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with cur as (select * from public._mock_ranks(p_mock)),
  prev_mock as (
    select id from public.mock_events
    where results_at <= now()
      and results_at < (select results_at from public.mock_events where id = p_mock)
    order by results_at desc limit 1
  ),
  prev as (select r.user_id, r.rnk from prev_mock pm, public._mock_ranks(pm.id) r)
  select c.rnk, p.rnk, public.display_label(pr), c.score,
         round(100.0 * c.below / greatest(c.n - 1, 1), 2),
         c.user_id = auth.uid(), c.n
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prev p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.mock_leaderboard_moves(uuid, int) from public;
grant execute on function public.mock_leaderboard_moves(uuid, int) to anon, authenticated;

drop function if exists public.practice_leaderboard(int, int);
create function public.practice_leaderboard(p_days int default 7, p_limit int default 50)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, tests bigint, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with d as (select greatest(1, least(p_days, 90)) as days),
  win as (
    select a.user_id,
           sum(greatest(a.server_score, 0)) filter (where a.submitted_at >= now() - make_interval(days => d.days)) as cur,
           count(*) filter (where a.submitted_at >= now() - make_interval(days => d.days)) as tests,
           sum(greatest(a.server_score, 0)) filter (where a.submitted_at < now() - make_interval(days => d.days)) as prv
    from public.exam_attempts a, d
    where a.mock_id is null and a.status = 'submitted' and a.server_score is not null
      and a.submitted_at >= now() - make_interval(days => d.days * 2)
    group by a.user_id
  ),
  cur as (
    select user_id, cur, tests, rank() over (order by cur desc) as rnk, count(*) over () as n
    from win where cur > 0
  ),
  prv as (select user_id, rank() over (order by prv desc) as rnk from win where prv > 0)
  select c.rnk, p.rnk, public.display_label(pr), round(c.cur, 2), c.tests, c.user_id = auth.uid(), c.n
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prv p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.practice_leaderboard(int, int) from public;
grant execute on function public.practice_leaderboard(int, int) to anon, authenticated;


-- ############################################################################
-- ##  0015_fair_mock_ranking.sql
-- ############################################################################

-- RENYXERA — fair mock ranking: only disqualifying flags remove an attempt.
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Before: ANY integrity flag removed an attempt from ranking, so an honest candidate who
-- answered quickly or left full screen was dropped. Now (mirrors lib/exam/integrity-rules.ts):
--   disqualifying  → disqualified (auto-submitted at the tab-switch limit), tab_switches (>= 5),
--                    over_time, question_set_mismatch, no_start_token
--   informational  → fullscreen_exits, rapid_answers, long_pause (kept, never cost a rank)
-- Practice leaderboard: tests auto-submitted for leaving the exam window (the same rule
-- as mocks) don't count.
-- Also: a lone ranked candidate is at the 100th percentile (was 0).

create or replace function public.attempt_disqualified(flags jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select exists (
    select 1 from jsonb_array_elements(coalesce(flags, '[]'::jsonb)) f
    where f->>'code' in ('disqualified', 'tab_switches', 'over_time', 'question_set_mismatch', 'no_start_token')
  );
$$;
grant execute on function public.attempt_disqualified(jsonb) to anon, authenticated;

create or replace function public._mock_ranks(p_mock uuid)
returns table (user_id uuid, score numeric, rnk bigint, below bigint, n bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (select * from public.mock_events where id = p_mock and now() >= results_at),
  e as (
    select a.user_id, a.server_score
    from public.exam_attempts a join m on a.mock_id = m.id
    where a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '2 minutes'
      and not public.attempt_disqualified(a.integrity_flags)
  )
  select e.user_id, e.server_score,
         rank() over (order by e.server_score desc),
         rank() over (order by e.server_score asc) - 1,
         count(*) over ()
  from e;
$$;
revoke all on function public._mock_ranks(uuid) from public, anon, authenticated;

drop function if exists public.mock_leaderboard_moves(uuid, int);
create function public.mock_leaderboard_moves(p_mock uuid, p_limit int default 50)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with cur as (select * from public._mock_ranks(p_mock)),
  prev_mock as (
    select id from public.mock_events
    where results_at <= now()
      and results_at < (select results_at from public.mock_events where id = p_mock)
    order by results_at desc limit 1
  ),
  prev as (select r.user_id, r.rnk from prev_mock pm, public._mock_ranks(pm.id) r)
  select c.rnk, p.rnk, public.display_label(pr), c.score,
         case when c.n = 1 then 100 else round(100.0 * c.below / (c.n - 1), 2) end,
         c.user_id = auth.uid(), c.n
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prev p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.mock_leaderboard_moves(uuid, int) from public;
grant execute on function public.mock_leaderboard_moves(uuid, int) to anon, authenticated;

create or replace function public.mock_leaderboard(p_mock uuid, p_limit int default 50)
returns table (rank bigint, display_name text, score numeric, percentile numeric, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with m as (
    select * from public.mock_events where id = p_mock and now() >= results_at
  ),
  eligible as (
    select a.user_id, a.server_score
    from public.exam_attempts a
    join m on a.mock_id = m.id
    where a.status = 'submitted'
      and a.server_score is not null
      and a.submitted_at <= m.ends_at + interval '2 minutes'
      and not public.attempt_disqualified(a.integrity_flags)
  ),
  ranked as (
    select e.user_id, e.server_score,
           rank() over (order by e.server_score desc) as rnk,
           rank() over (order by e.server_score asc) - 1 as below,
           count(*) over () as n
    from eligible e
  )
  select r.rnk,
         case
           when p.leaderboard_display = 'username_student_id' and p.username is not null
             then '@' || p.username || ' · ' || coalesce(p.student_id, '')
           when p.leaderboard_display = 'username' and p.username is not null
             then '@' || p.username
           else 'Aspirant ' || right(coalesce(p.student_id, '0000'), 4)
         end,
         r.server_score,
         case when r.n = 1 then 100 else round(100.0 * r.below / (r.n - 1), 2) end,
         r.user_id = auth.uid(),
         r.n
  from ranked r
  join public.profiles p on p.id = r.user_id
  where r.rnk <= greatest(1, least(p_limit, 200)) or r.user_id = auth.uid()
  order by r.rnk;
$$;
revoke all on function public.mock_leaderboard(uuid, int) from public;
grant execute on function public.mock_leaderboard(uuid, int) to anon, authenticated;

drop function if exists public.mock_my_result(uuid);
create function public.mock_my_result(p_mock uuid)
returns table (
  status text,              -- 'ranked' | 'flagged' | 'late' | 'not_attempted' | 'pending'
  marks numeric,
  max_marks numeric,
  air bigint,               -- All-India Rank (ties share a rank)
  candidates bigint,        -- ranked candidates
  percentile numeric,
  category text,
  pwd boolean,
  category_rank bigint,     -- among ranked candidates of the same category (PwD: among PwD)
  qualifying_general numeric,
  qualifying_obc_ews numeric,
  qualifying_sc_st_pwd numeric,
  my_qualifying numeric,
  qualified boolean,
  gate_score int,
  mean_marks numeric,
  sd_marks numeric,
  topper_mean numeric
)
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_mock public.mock_events%rowtype;
  v_att public.exam_attempts%rowtype;
  v_n bigint; v_mean numeric; v_sd numeric; v_q numeric; v_top_n int; v_mt numeric;
  v_cat text; v_pwd boolean; v_myq numeric;
  v_uids uuid[]; v_marks numeric[]; v_cats text[]; v_pwds boolean[];
  v_mine numeric; v_in boolean;
begin
  if v_uid is null then return; end if;
  select * into v_mock from public.mock_events where id = p_mock;
  if not found then return; end if;
  select * into v_att from public.exam_attempts where mock_id = p_mock and user_id = v_uid;
  if now() < v_mock.results_at then
    return query select 'pending'::text, null::numeric, null::numeric, null::bigint, null::bigint, null::numeric, null::text, null::boolean, null::bigint, null::numeric, null::numeric, null::numeric, null::numeric, null::boolean, null::int, null::numeric, null::numeric, null::numeric;
    return;
  end if;

  -- Ranked population (same rules as mock_leaderboard), held in arrays (read-only function).
  select coalesce(array_agg(a.user_id), '{}'), coalesce(array_agg(a.server_score), '{}'),
         coalesce(array_agg(coalesce(p.category, 'GEN')), '{}'), coalesce(array_agg(coalesce(p.pwd, false)), '{}')
    into v_uids, v_marks, v_cats, v_pwds
    from public.exam_attempts a join public.profiles p on p.id = a.user_id
    where a.mock_id = p_mock and a.status = 'submitted' and a.server_score is not null
      and a.submitted_at <= v_mock.ends_at + interval '2 minutes'
      and not public.attempt_disqualified(a.integrity_flags);

  select count(*), avg(m), coalesce(stddev_pop(m), 0) into v_n, v_mean, v_sd from unnest(v_marks) m;
  v_q := round(greatest(25, coalesce(v_mean, 0) + coalesce(v_sd, 0)), 2);
  v_top_n := greatest(10, ceil(v_n * 0.001)::int);
  select avg(t.m) into v_mt from (select m from unnest(v_marks) m order by m desc limit v_top_n) t;
  -- Small mocks: with few candidates the top-10 mean can fall at/below the qualifying mark,
  -- which makes the formula undefined. Fall back to the topper's marks (a real GATE paper,
  -- with lakhs of candidates, never hits this).
  if v_mt is not null and v_mt <= v_q then select max(m) into v_mt from unnest(v_marks) m; end if;
  v_in := v_uid = any(v_uids);
  if v_in then v_mine := v_marks[array_position(v_uids, v_uid)]; end if;

  select coalesce(p.category, 'GEN'), coalesce(p.pwd, false) into v_cat, v_pwd from public.profiles p where p.id = v_uid;
  v_myq := case when v_pwd or v_cat in ('SC', 'ST') then round(v_q * 2 / 3, 2)
                when v_cat in ('OBC_NCL', 'EWS') then round(v_q * 0.9, 2)
                else v_q end;

  if v_att.id is null then
    return query select 'not_attempted'::text, null::numeric, null::numeric, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;
  if not v_in then
    return query select (case when public.attempt_disqualified(v_att.integrity_flags) then 'flagged' else 'late' end)::text,
      v_att.server_score, v_att.server_max, null::bigint, v_n, null::numeric, v_cat, v_pwd, null::bigint,
      v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq, null::boolean, null::int, round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
    return;
  end if;

  return query
  with g as (select * from unnest(v_marks, v_cats, v_pwds) as t(marks, cat, pwd))
  select 'ranked'::text,
    v_mine,
    v_att.server_max,
    (select count(*) from g where g.marks > v_mine) + 1,
    v_n,
    case when v_n = 1 then 100 else round(100.0 * (select count(*) from g where g.marks < v_mine) / (v_n - 1), 2) end,
    v_cat, v_pwd,
    (select count(*) from g where g.marks > v_mine
       and (case when v_pwd then g.pwd else g.cat = v_cat end)) + 1,
    v_q, round(v_q * 0.9, 2), round(v_q * 2 / 3, 2), v_myq,
    v_mine >= v_myq,
    case when v_mine >= v_myq and v_mt is not null and v_mt > v_q
      then least(1000, greatest(0, round(350 + (900 - 350) * (v_mine - v_q) / (v_mt - v_q))))::int
      else null end,
    round(v_mean, 2), round(v_sd, 2), round(v_mt, 2);
end;
$$;
revoke all on function public.mock_my_result(uuid) from public;
grant execute on function public.mock_my_result(uuid) to authenticated;

drop function if exists public.practice_leaderboard(int, int);
create function public.practice_leaderboard(p_days int default 7, p_limit int default 50)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, tests bigint, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with d as (select greatest(1, least(p_days, 90)) as days),
  win as (
    select a.user_id,
           sum(greatest(a.server_score, 0)) filter (where a.submitted_at >= now() - make_interval(days => d.days)) as cur,
           count(*) filter (where a.submitted_at >= now() - make_interval(days => d.days)) as tests,
           sum(greatest(a.server_score, 0)) filter (where a.submitted_at < now() - make_interval(days => d.days)) as prv
    from public.exam_attempts a, d
    where a.mock_id is null and a.status = 'submitted' and a.server_score is not null
      -- practice rule: attempts auto-submitted for leaving the window don't count
      and not exists (select 1 from jsonb_array_elements(coalesce(a.integrity_flags, '[]'::jsonb)) f where f->>'code' in ('disqualified', 'tab_switches'))
      and a.submitted_at >= now() - make_interval(days => d.days * 2)
    group by a.user_id
  ),
  cur as (
    select user_id, cur, tests, rank() over (order by cur desc) as rnk, count(*) over () as n
    from win where cur > 0
  ),
  prv as (select user_id, rank() over (order by prv desc) as rnk from win where prv > 0)
  select c.rnk, p.rnk, public.display_label(pr), round(c.cur, 2), c.tests, c.user_id = auth.uid(), c.n
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prv p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.practice_leaderboard(int, int) from public;
grant execute on function public.practice_leaderboard(int, int) to anon, authenticated;


-- ############################################################################
-- ##  0016_more_leaderboards_and_fetch_caps.sql
-- ############################################################################

-- RENYXERA — Release 5 leftovers: subject / college / weekly-challenge leaderboards and a
-- per-account daily cap on answer-key lookups.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. Marks per question, written by the grader (lets boards rank by subject).
alter table public.exam_responses add column if not exists awarded numeric;
create index if not exists exam_responses_question_idx on public.exam_responses (question_id);

-- 2. One board function for every non-mock scope. Same privacy as the others: only the
--    chosen display label (never email), previous period's rank for movement.
--      p_scope = 'all'       → marks in practice tests, last p_days
--      p_scope = 'subject'   → marks in questions of subject p_key, last p_days
--      p_scope = 'college'   → like 'all', but only people from the caller's college
--      p_scope = 'challenge' → best score in the weekly challenge whose key is p_key
--    Tests auto-submitted for leaving the exam window never count.
drop function if exists public.board(text, text, int, int);
create function public.board(p_scope text, p_key text default null, p_days int default 7, p_limit int default 50)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, tests bigint, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with d as (select greatest(1, least(coalesce(p_days, 7), 90)) as days),
  me as (select lower(trim(college)) as college from public.profiles where id = auth.uid()),
  att as (
    select a.* from public.exam_attempts a
    where a.mock_id is null and a.status = 'submitted' and a.server_score is not null
      and not exists (select 1 from jsonb_array_elements(coalesce(a.integrity_flags, '[]'::jsonb)) f
                      where f->>'code' in ('disqualified', 'tab_switches'))
  ),
  -- (user, score, when) rows for the chosen scope
  pts as (
    select a.user_id, greatest(a.server_score, 0) as pts, a.submitted_at as at
    from att a where p_scope in ('all', 'college')
    union all
    select a.user_id, greatest(coalesce(r.awarded, 0), 0), a.submitted_at
    from att a
    join public.exam_responses r on r.attempt_id = a.id
    join public.questions q on q.id = r.question_id
    where p_scope = 'subject' and q.subject = p_key
  ),
  scoped as (
    select p.* from pts p
    where p_scope <> 'college'
       or exists (select 1 from public.profiles pr, me
                  where pr.id = p.user_id and me.college is not null and me.college <> ''
                    and lower(trim(pr.college)) = me.college)
  ),
  win as (
    select s.user_id,
           sum(s.pts) filter (where s.at >= now() - make_interval(days => d.days)) as cur,
           count(*) filter (where s.at >= now() - make_interval(days => d.days)) as n,
           sum(s.pts) filter (where s.at < now() - make_interval(days => d.days)) as prv
    from scoped s, d
    where s.at >= now() - make_interval(days => d.days * 2)
    group by s.user_id
  ),
  chal as (
    select a.user_id, max(greatest(a.server_score, 0)) as cur, count(*) as n, null::numeric as prv
    from att a
    where p_scope = 'challenge' and a.config->>'title' = p_key
      and a.server_started_at is not null
      and not exists (select 1 from jsonb_array_elements(coalesce(a.integrity_flags, '[]'::jsonb)) f where f->>'code' = 'no_start_token')
    group by a.user_id
  ),
  src as (select * from win where p_scope <> 'challenge' union all select * from chal),
  cur as (select user_id, cur, n, rank() over (order by cur desc) as rnk, count(*) over () as total from src where cur > 0),
  prv as (select user_id, rank() over (order by prv desc) as rnk from src where prv > 0)
  select c.rnk, p.rnk, public.display_label(pr), round(c.cur, 2), c.n, c.user_id = auth.uid(), c.total
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prv p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.board(text, text, int, int) from public;
grant execute on function public.board(text, text, int, int) to anon, authenticated;

-- 3. Per-account daily cap on answer-key lookups (5D). Counted server-side with the
--    service role; the route refuses past the cap and logs it for review.
create table if not exists public.answer_fetch_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'Asia/Kolkata')::date,
  ids int not null default 0,
  primary key (user_id, day)
);
alter table public.answer_fetch_usage enable row level security; -- no policies: service role only

drop function if exists public.consume_answer_fetch(uuid, int, int);
create function public.consume_answer_fetch(p_user uuid, p_ids int, p_cap int)
returns int -- ids used today after this call, or -1 when the cap would be exceeded
language plpgsql
security definer
set search_path = ''
as $$
declare v_today date := (now() at time zone 'Asia/Kolkata')::date; v_used int;
begin
  insert into public.answer_fetch_usage (user_id, day, ids) values (p_user, v_today, 0)
    on conflict (user_id, day) do nothing;
  select ids into v_used from public.answer_fetch_usage where user_id = p_user and day = v_today for update;
  if v_used + p_ids > p_cap then return -1; end if;
  update public.answer_fetch_usage set ids = ids + p_ids where user_id = p_user and day = v_today;
  return v_used + p_ids;
end;
$$;
revoke all on function public.consume_answer_fetch(uuid, int, int) from public, anon, authenticated;


-- ############################################################################
-- ##  0017_cloud_sync.sql
-- ############################################################################

-- RENYXERA — 4I Cloud Sync: bookmarks, mistakes and finished tests follow the account
-- across devices. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- One row per (account, kind, key). The browser keeps working offline from IndexedDB and
-- syncs through this table: local changes are queued and upserted; other devices pull rows
-- changed since their last pull and merge them (lib/sync/sync-engine.ts). Deletions are
-- kept as tombstones (deleted = true) so they reach every device.

create table if not exists public.user_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('bookmark', 'mistake', 'session')),
  key text not null check (char_length(key) <= 120),
  data jsonb,
  deleted boolean not null default false,
  client_updated_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind, key),
  check (data is null or pg_column_size(data) <= 262144)
);
create index if not exists user_records_pull_idx on public.user_records (user_id, updated_at);

-- Server clock orders pulls (clients' clocks can be wrong).
create or replace function public.user_records_touch()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
drop trigger if exists user_records_touch on public.user_records;
create trigger user_records_touch before insert or update on public.user_records
  for each row execute function public.user_records_touch();

alter table public.user_records enable row level security;
drop policy if exists "own records: read" on public.user_records;
create policy "own records: read" on public.user_records for select to authenticated using (user_id = auth.uid());
drop policy if exists "own records: insert" on public.user_records;
create policy "own records: insert" on public.user_records for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "own records: update" on public.user_records;
create policy "own records: update" on public.user_records for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own records: delete" on public.user_records;
create policy "own records: delete" on public.user_records for delete to authenticated using (user_id = auth.uid());


-- ############################################################################
-- ##  0018_question_reports.sql
-- ############################################################################

-- RENYXERA — 6D "Report an issue" on every question. Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- Students (signed in or guests) flag a wrong answer key, a typo, a broken figure or an
-- unclear solution. Inserts come only through /api/report (service role, rate-limited);
-- nobody can read or change reports from the browser. Target: triage within 24 hours.

create table if not exists public.question_reports (
  id bigint generated always as identity primary key,
  question_id text not null check (char_length(question_id) <= 80),
  reason text not null check (reason in ('wrong_answer', 'typo', 'figure', 'solution', 'other')),
  details text check (details is null or char_length(details) <= 1000),
  user_id uuid references auth.users(id) on delete set null,
  source text not null default 'app' check (source in ('app', 'public', 'review')),
  status text not null default 'open' check (status in ('open', 'accepted', 'fixed', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists question_reports_open_idx on public.question_reports (status, created_at);
create index if not exists question_reports_question_idx on public.question_reports (question_id);

alter table public.question_reports enable row level security;
-- No policies: the anon and authenticated roles get nothing; the API uses the service role.
revoke all on public.question_reports from anon, authenticated;


-- ############################################################################
-- ##  0019_entitlements_and_billing.sql
-- ############################################################################

-- RENYXERA — Release 7A/7B/7C: entitlements, billing orders, webhook idempotency and the
-- "Upgrade to Pro" fake-door interest log. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Entitlements live only on the server and are re-checked on every gated action. Rows are
-- written only by the service role (Razorpay webhook / admin); members can read their own.

-- ── Entitlements: one row per account ─────────────────────────────────────────────────
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  valid_until timestamptz,
  source text check (source is null or source in ('razorpay', 'admin', 'referral', 'promo')),
  updated_at timestamptz not null default now()
);
alter table public.entitlements enable row level security;
drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own on public.entitlements for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.entitlements from anon, authenticated;

-- True while the account has an active paid plan.
create or replace function public.is_pro(p_user uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.entitlements e
    where e.user_id = p_user and e.plan = 'pro' and e.valid_until is not null and e.valid_until > now()
  );
$$;
revoke all on function public.is_pro(uuid) from public, anon, authenticated;
grant execute on function public.is_pro(uuid) to service_role;

-- ── Billing orders (Razorpay) ─────────────────────────────────────────────────────────
create table if not exists public.billing_orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (char_length(plan_id) <= 40),
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  period_days integer not null check (period_days between 1 and 800),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  mode text not null check (mode in ('test', 'live')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists billing_orders_user_idx on public.billing_orders (user_id, created_at desc);
alter table public.billing_orders enable row level security;
drop policy if exists billing_orders_select_own on public.billing_orders;
create policy billing_orders_select_own on public.billing_orders for select to authenticated using (user_id = (select auth.uid()));
revoke insert, update, delete on public.billing_orders from anon, authenticated;

-- Webhook idempotency: a Razorpay event is applied at most once.
create table if not exists public.billing_events (
  event_id text primary key check (char_length(event_id) <= 80),
  event text not null,
  payload jsonb not null,
  received_at timestamptz not null default now()
);
alter table public.billing_events enable row level security;
revoke all on public.billing_events from anon, authenticated;

-- Marks an order paid and extends Pro exactly once (called by the webhook, service role).
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, 'pro', now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = 'pro',
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;
revoke all on function public.apply_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(text, text) to service_role;

-- ── Fake-door: who clicked "Upgrade" before payments are switched on ───────────────────
create table if not exists public.pro_interest (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  plan_id text not null check (char_length(plan_id) <= 40),
  source text not null default 'pro_page' check (char_length(source) <= 40),
  created_at timestamptz not null default now()
);
create unique index if not exists pro_interest_user_plan on public.pro_interest (user_id, plan_id) where user_id is not null;
alter table public.pro_interest enable row level security;
revoke all on public.pro_interest from anon, authenticated;


-- ############################################################################
-- ##  0020_referrals.sql
-- ############################################################################

-- RENYXERA — Release 7E: referral credits (both sides). Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- A member shares /r/<code>. A NEW account (≤ 7 days old) claims it once. When that friend
-- submits their first test (server-graded attempt) with a confirmed email, BOTH accounts get
-- REFERRAL_DAYS of Pro. A referrer can earn at most MAX_CREDITED credits. No self-referral.

create table if not exists public.referral_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9]{6,12}$'),
  created_at timestamptz not null default now()
);
alter table public.referral_codes enable row level security;
revoke all on public.referral_codes from anon, authenticated;

create table if not exists public.referrals (
  referred_id uuid primary key references auth.users(id) on delete cascade,
  referrer_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  credited_at timestamptz,
  check (referred_id <> referrer_id)
);
create index if not exists referrals_referrer_idx on public.referrals (referrer_id);
alter table public.referrals enable row level security;
revoke all on public.referrals from anon, authenticated;

-- The caller's code (created on first use).
create or replace function public.my_referral_code()
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); c text;
begin
  if uid is null then raise exception 'not signed in'; end if;
  select code into c from public.referral_codes where user_id = uid;
  if c is not null then return c; end if;
  loop
    c := substr(md5(gen_random_uuid()::text), 1, 8);
    begin
      insert into public.referral_codes (user_id, code) values (uid, c);
      return c;
    exception when unique_violation then
      select code into c from public.referral_codes where user_id = uid;
      if c is not null then return c; end if;
    end;
  end loop;
end;
$$;
revoke all on function public.my_referral_code() from public, anon;
grant execute on function public.my_referral_code() to authenticated;

-- A new account claims a code once. Returns 'ok' | 'invalid' | 'self' | 'already' | 'too_old'.
create or replace function public.claim_referral(p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid(); ref uuid; made timestamptz;
begin
  if uid is null then return 'invalid'; end if;
  select user_id into ref from public.referral_codes where code = lower(trim(p_code));
  if ref is null then return 'invalid'; end if;
  if ref = uid then return 'self'; end if;
  if exists (select 1 from public.referrals where referred_id = uid) then return 'already'; end if;
  select created_at into made from auth.users where id = uid;
  if made is null or made < now() - interval '7 days' then return 'too_old'; end if;
  insert into public.referrals (referred_id, referrer_id) values (uid, ref) on conflict do nothing;
  return 'ok';
end;
$$;
revoke all on function public.claim_referral(text) from public, anon;
grant execute on function public.claim_referral(text) to authenticated;

-- Grants Pro days to one account (extends from now or from the current end date).
create or replace function public.grant_pro_days(p_user uuid, p_days int, p_source text)
returns void language sql security definer set search_path = '' as $$
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (p_user, 'pro', now() + make_interval(days => p_days), p_source, now())
  on conflict (user_id) do update
    set plan = 'pro',
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => p_days),
        source = coalesce(e.source, p_source), updated_at = now();
$$;
revoke all on function public.grant_pro_days(uuid, int, text) from public, anon, authenticated;
grant execute on function public.grant_pro_days(uuid, int, text) to service_role;

-- Credits a pending referral once the referred account has submitted a test.
create or replace function public.credit_referral(p_referred uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.referrals; confirmed timestamptz; credited int;
  REFERRAL_DAYS constant int := 7; MAX_CREDITED constant int := 5;
begin
  select * into r from public.referrals where referred_id = p_referred and credited_at is null for update;
  if not found then return false; end if;
  select email_confirmed_at into confirmed from auth.users where id = p_referred;
  if confirmed is null then return false; end if;
  select count(*) into credited from public.referrals where referrer_id = r.referrer_id and credited_at is not null;
  update public.referrals set credited_at = now() where referred_id = p_referred;
  perform public.grant_pro_days(p_referred, REFERRAL_DAYS, 'referral');
  if credited < MAX_CREDITED then perform public.grant_pro_days(r.referrer_id, REFERRAL_DAYS, 'referral'); end if;
  return true;
end;
$$;
revoke all on function public.credit_referral(uuid) from public, anon, authenticated;
grant execute on function public.credit_referral(uuid) to service_role;

-- First submitted test → credit (no app code path can forget it).
create or replace function public.referral_on_submit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.submitted_at is not null and (tg_op = 'INSERT' or old.submitted_at is null) then
    perform public.credit_referral(new.user_id);
  end if;
  return new;
end;
$$;
drop trigger if exists referral_on_submit on public.exam_attempts;
create trigger referral_on_submit after insert or update of submitted_at on public.exam_attempts
  for each row execute function public.referral_on_submit();

-- The caller's referral stats.
create or replace function public.my_referrals()
returns table (code text, joined int, credited int) language sql stable security definer set search_path = '' as $$
  select (select c.code from public.referral_codes c where c.user_id = auth.uid()),
         (select count(*)::int from public.referrals where referrer_id = auth.uid()),
         (select count(*)::int from public.referrals where referrer_id = auth.uid() and credited_at is not null);
$$;
revoke all on function public.my_referrals() from public, anon;
grant execute on function public.my_referrals() to authenticated;

-- ── 7E: acquisition (UTM) + weekly growth metrics ──────────────────────────────────────
alter table public.profiles add column if not exists acquisition jsonb;

-- Stores the first-touch UTM/referrer once per account (later calls are ignored).
create or replace function public.set_acquisition(p jsonb)
returns void language sql security definer set search_path = '' as $$
  update public.profiles
     set acquisition = jsonb_strip_nulls(jsonb_build_object(
           'source', left(p->>'source', 60), 'medium', left(p->>'medium', 60),
           'campaign', left(p->>'campaign', 80), 'referrer', left(p->>'referrer', 120),
           'landing', left(p->>'landing', 120), 'at', now()))
   where id = auth.uid() and acquisition is null;
$$;
revoke all on function public.set_acquisition(jsonb) from public, anon;
grant execute on function public.set_acquisition(jsonb) to authenticated;

-- Weekly metrics for the owner (service role only): sign-ups by channel, activation
-- (first test within 24 h of sign-up) and D7 / D30 retention (a test 7+/30+ days later).
create or replace function public.weekly_growth_metrics(p_weeks int default 8)
returns table (week date, channel text, signups int, activated_24h int, retained_d7 int, retained_d30 int)
language sql stable security definer set search_path = '' as $$
  with u as (
    select a.id, a.created_at, date_trunc('week', a.created_at)::date as week,
           coalesce(p.acquisition->>'source', case when r.referred_id is not null then 'referral' else 'direct' end) as channel
    from auth.users a
    left join public.profiles p on p.id = a.id
    left join public.referrals r on r.referred_id = a.id
    where a.created_at >= date_trunc('week', now()) - make_interval(weeks => p_weeks)
  )
  select u.week, u.channel, count(*)::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at <= u.created_at + interval '24 hours'))::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at >= u.created_at + interval '7 days'))::int,
         count(*) filter (where exists (select 1 from public.exam_attempts e where e.user_id = u.id and e.submitted_at >= u.created_at + interval '30 days'))::int
  from u group by u.week, u.channel order by u.week desc, 3 desc;
$$;
revoke all on function public.weekly_growth_metrics(int) from public, anon, authenticated;
grant execute on function public.weekly_growth_metrics(int) to service_role;

-- ── Optional mobile number at onboarding (contact about updates, with explicit consent) ──
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists contact_opt_in boolean not null default false;
do $$ begin
  alter table public.profiles add constraint profiles_phone_format check (phone is null or phone ~ '^\+91[6-9][0-9]{9}$');
exception when duplicate_object then null; end $$;

-- ── Three tiers: free · plus (silver) · pro (gold) ─────────────────────────────────────
alter table public.entitlements drop constraint if exists entitlements_plan_check;
alter table public.entitlements add constraint entitlements_plan_check check (plan in ('free', 'plus', 'pro'));

-- The account's active tier right now ('free' when nothing is active).
create or replace function public.account_tier(p_user uuid)
returns text language sql stable security definer set search_path = '' as $$
  select coalesce((select e.plan from public.entitlements e
                    where e.user_id = p_user and e.plan in ('plus', 'pro')
                      and e.valid_until is not null and e.valid_until > now()), 'free');
$$;
revoke all on function public.account_tier(uuid) from public, anon;
grant execute on function public.account_tier(uuid) to authenticated, service_role;

-- Paid orders grant the tier named by the plan id (plus_* → plus, pro_* → pro). Buying the
-- same tier extends it; buying Pro while on Plus upgrades; buying Plus never downgrades Pro.
create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  t := case when o.plan_id like 'plus%' then 'plus' else 'pro' end;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, t, now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = case when e.plan = 'pro' and e.valid_until > now() and t = 'plus' then 'pro' else t end,
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;

-- ── Premium avatars: only qualifying tiers can SET them (keep in sync with dicebear-styles.ts) ──
create or replace function public.profiles_premium_avatar()
returns trigger language plpgsql security definer set search_path = '' as $$
declare need text; have text;
begin
  if tg_op = 'UPDATE' and new.avatar_style is not distinct from old.avatar_style then return new; end if;
  need := case
    when new.avatar_style in ('avataaars', 'big-smile', 'open-peeps', 'personas', 'pixel-art', 'fun-emoji') then 'plus'
    when new.avatar_style in ('toon-head', 'voxel-art', 'clay', 'dylan', 'cameo', 'miniavs') then 'pro'
    else 'free' end;
  if need = 'free' then return new; end if;
  have := public.account_tier(new.id);
  if (need = 'plus' and have in ('plus', 'pro')) or (need = 'pro' and have = 'pro') then return new; end if;
  raise exception 'premium_avatar_requires_%', need using errcode = 'P0001';
end;
$$;
drop trigger if exists profiles_premium_avatar on public.profiles;
create trigger profiles_premium_avatar before insert or update of avatar_style on public.profiles
  for each row execute function public.profiles_premium_avatar();


-- ############################################################################
-- ##  0021_ai_credits_and_referral_hardening.sql
-- ############################################################################

-- RENYXERA — Release 7E hardening. Run once in the Supabase SQL Editor. Safe to re-run.
--
-- 1. Bonus AI credits: a small ledger spent only after the daily allowance runs out.
-- 2. Referrals no longer grant Pro. The inviter gets 1 day of Plus + 15 AI credits, the friend
--    10 AI credits — and only after REAL use: tests on 2 different IST days, each with 10+
--    answered questions and no integrity flags; never when the two accounts share a device;
--    at most 3 rewards a month and 10 in total per inviter.
-- 4. Free accounts no longer get a daily AI allowance: they get a one-time teaser of 5 AI
--    requests (ensure_welcome_ai), then earn more via sponsor breaks / referrals, or upgrade.
-- 3. Sponsor breaks: watching a short sponsor break earns a few AI credits, fewer each time
--    (+5, +3, +2, +1; max 4 a day), expiring at the end of the IST day. Claims are one-time.

-- ── 1. Bonus AI credits ─────────────────────────────────────────────────────────────────
create table if not exists public.ai_bonus_credits (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  remaining int not null check (remaining >= 0),
  granted int not null check (granted > 0),
  reason text not null check (reason in ('referral', 'sponsor', 'admin', 'welcome')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_bonus_credits_user_idx on public.ai_bonus_credits (user_id, expires_at);
alter table public.ai_bonus_credits enable row level security;
revoke all on public.ai_bonus_credits from anon, authenticated;

create or replace function public.grant_ai_credits(p_user uuid, p_credits int, p_reason text, p_expires timestamptz)
returns void language sql security definer set search_path = '' as $$
  insert into public.ai_bonus_credits (user_id, remaining, granted, reason, expires_at)
  values (p_user, p_credits, p_credits, p_reason, p_expires);
$$;
revoke all on function public.grant_ai_credits(uuid, int, text, timestamptz) from public, anon, authenticated;
grant execute on function public.grant_ai_credits(uuid, int, text, timestamptz) to service_role;

-- Spends one credit (soonest-expiring first). Returns true if one was available.
create or replace function public.consume_ai_bonus(p_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r_id bigint;
begin
  select id into r_id from public.ai_bonus_credits
   where user_id = p_user and remaining > 0 and expires_at > now()
   order by expires_at limit 1 for update skip locked;
  if r_id is null then return false; end if;
  update public.ai_bonus_credits set remaining = remaining - 1 where id = r_id;
  return true;
end;
$$;
revoke all on function public.consume_ai_bonus(uuid) from public, anon, authenticated;
grant execute on function public.consume_ai_bonus(uuid) to service_role;

-- The caller's live bonus balance (for the UI).
create or replace function public.my_ai_bonus()
returns int language sql stable security definer set search_path = '' as $$
  select coalesce(sum(remaining), 0)::int from public.ai_bonus_credits
   where user_id = auth.uid() and remaining > 0 and expires_at > now();
$$;
revoke all on function public.my_ai_bonus() from public, anon;
grant execute on function public.my_ai_bonus() to authenticated;

-- ── 2. Referral hardening ───────────────────────────────────────────────────────────────
create or replace function public.credit_referral(p_referred uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare r public.referrals; confirmed timestamptz; active_days int; month_count int; total_count int;
begin
  select * into r from public.referrals where referred_id = p_referred and credited_at is null for update;
  if not found then return false; end if;

  select email_confirmed_at into confirmed from auth.users where id = p_referred;
  if confirmed is null then return false; end if;

  -- Real use: submitted, unflagged tests with 10+ answered questions, on 2 different IST days.
  select count(distinct (a.submitted_at at time zone 'Asia/Kolkata')::date) into active_days
    from public.exam_attempts a
   where a.user_id = p_referred and a.submitted_at is not null
     and coalesce(jsonb_array_length(a.integrity_flags), 0) = 0
     and (select count(*) from public.exam_responses x
           where x.attempt_id = a.id and (x.nat_value is not null or coalesce(array_length(x.selected_option_ids, 1), 0) > 0)) >= 10;
  if active_days < 2 then return false; end if;

  -- Same device ever used by both accounts → never rewarded (and closed for good).
  if exists (select 1 from public.device_sessions d1 join public.device_sessions d2 on d1.device_id = d2.device_id
              where d1.user_id = p_referred and d2.user_id = r.referrer_id) then
    update public.referrals set credited_at = now() where referred_id = p_referred;
    return false;
  end if;

  select count(*) filter (where credited_at >= date_trunc('month', now())), count(*) filter (where credited_at is not null)
    into month_count, total_count
    from public.referrals where referrer_id = r.referrer_id;

  update public.referrals set credited_at = now() where referred_id = p_referred;
  perform public.grant_ai_credits(p_referred, 10, 'referral', now() + interval '30 days');
  if month_count < 3 and total_count < 10 then
    perform public.grant_pro_days_tier(r.referrer_id, 1, 'plus', 'referral');
    perform public.grant_ai_credits(r.referrer_id, 15, 'referral', now() + interval '30 days');
  end if;
  return true;
end;
$$;
revoke all on function public.credit_referral(uuid) from public, anon, authenticated;
grant execute on function public.credit_referral(uuid) to service_role;

-- Tier-aware grant: never downgrades an active higher tier; extends the same tier.
create or replace function public.grant_pro_days_tier(p_user uuid, p_days int, p_tier text, p_source text)
returns void language plpgsql security definer set search_path = '' as $$
declare e public.entitlements;
begin
  select * into e from public.entitlements where user_id = p_user for update;
  if not found then
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at)
    values (p_user, p_tier, now() + make_interval(days => p_days), p_source, now());
  elsif e.plan = 'pro' and e.valid_until > now() and p_tier = 'plus' then
    return; -- already on a higher tier
  else
    update public.entitlements
       set plan = p_tier,
           valid_until = greatest(coalesce(case when e.plan = p_tier then e.valid_until end, now()), now()) + make_interval(days => p_days),
           source = coalesce(e.source, p_source), updated_at = now()
     where user_id = p_user;
  end if;
end;
$$;
revoke all on function public.grant_pro_days_tier(uuid, int, text, text) from public, anon, authenticated;
grant execute on function public.grant_pro_days_tier(uuid, int, text, text) to service_role;

-- ── 3. Sponsor breaks ───────────────────────────────────────────────────────────────────
create table if not exists public.sponsor_claims (
  nonce text primary key check (char_length(nonce) between 16 and 64),
  user_id uuid not null references auth.users(id) on delete cascade,
  credits int not null,
  claimed_at timestamptz not null default now()
);
create index if not exists sponsor_claims_user_day_idx on public.sponsor_claims (user_id, claimed_at);
alter table public.sponsor_claims enable row level security;
revoke all on public.sponsor_claims from anon, authenticated;

-- Claims one break (nonce is single-use). Returns credits granted (0 = daily cap reached).
create or replace function public.claim_sponsor_break(p_user uuid, p_nonce text)
returns int language plpgsql security definer set search_path = '' as $$
declare n int; credits int; day_end timestamptz;
begin
  select count(*) into n from public.sponsor_claims
   where user_id = p_user and (claimed_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date;
  credits := case n when 0 then 5 when 1 then 3 when 2 then 2 when 3 then 1 else 0 end;
  if credits = 0 then return 0; end if;
  insert into public.sponsor_claims (nonce, user_id, credits) values (p_nonce, p_user, credits); -- unique → replay fails
  day_end := (((now() at time zone 'Asia/Kolkata')::date + 1)::timestamp at time zone 'Asia/Kolkata');
  perform public.grant_ai_credits(p_user, credits, 'sponsor', day_end);
  return credits;
end;
$$;
revoke all on function public.claim_sponsor_break(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_sponsor_break(uuid, text) to service_role;

-- Today's breaks for the caller (UI: how many left and what the next one pays).
create or replace function public.my_sponsor_breaks_today()
returns int language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.sponsor_claims
   where user_id = auth.uid() and (claimed_at at time zone 'Asia/Kolkata')::date = (now() at time zone 'Asia/Kolkata')::date;
$$;
revoke all on function public.my_sponsor_breaks_today() from public, anon;
grant execute on function public.my_sponsor_breaks_today() to authenticated;

-- ── 4. One-time free AI teaser ─────────────────────────────────────────────────────────
-- Grants 5 welcome AI requests exactly once per account (called by the AI route).
create or replace function public.ensure_welcome_ai(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.ai_bonus_credits where user_id = p_user and reason = 'welcome') then return; end if;
  perform pg_advisory_xact_lock(hashtext('welcome_ai:' || p_user::text));
  if exists (select 1 from public.ai_bonus_credits where user_id = p_user and reason = 'welcome') then return; end if;
  insert into public.ai_bonus_credits (user_id, remaining, granted, reason, expires_at)
  values (p_user, 5, 5, 'welcome', now() + interval '10 years');
end;
$$;
revoke all on function public.ensure_welcome_ai(uuid) from public, anon, authenticated;
grant execute on function public.ensure_welcome_ai(uuid) to service_role;


-- ############################################################################
-- ##  0022_prorated_upgrade.sql
-- ############################################################################

-- RENYXERA — Release 7A: prorated Plus → Pro upgrade. Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- An upgrade order carries the paise credited for the unused part of the member's Plus plan
-- (computed on the server from their last paid Plus order). On payment the account becomes
-- Pro for the FULL new period starting now — the unused Plus time is not stacked on top,
-- because it was already refunded as a price credit. Net effect: Plus-then-Pro members pay
-- exactly what a direct Pro buyer pays for the same Pro time.

alter table public.billing_orders add column if not exists upgrade_credit_paise integer not null default 0 check (upgrade_credit_paise >= 0);

create or replace function public.apply_paid_order(p_order text, p_payment text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.billing_orders; t text;
begin
  update public.billing_orders
     set status = 'paid', razorpay_payment_id = p_payment, paid_at = now()
   where razorpay_order_id = p_order and status <> 'paid'
  returning * into o;
  if not found then return false; end if;
  t := case when o.plan_id like 'plus%' then 'plus' else 'pro' end;
  if o.upgrade_credit_paise > 0 then
    -- Prorated upgrade: full Pro period from now, replacing the refunded Plus time.
    insert into public.entitlements (user_id, plan, valid_until, source, updated_at)
    values (o.user_id, 'pro', now() + make_interval(days => o.period_days), 'razorpay', now())
    on conflict (user_id) do update set plan = 'pro', valid_until = now() + make_interval(days => o.period_days), source = 'razorpay', updated_at = now();
    return true;
  end if;
  insert into public.entitlements as e (user_id, plan, valid_until, source, updated_at)
  values (o.user_id, t, now() + make_interval(days => o.period_days), 'razorpay', now())
  on conflict (user_id) do update
    set plan = case when e.plan = 'pro' and e.valid_until > now() and t = 'plus' then 'pro' else t end,
        valid_until = greatest(coalesce(e.valid_until, now()), now()) + make_interval(days => o.period_days),
        source = 'razorpay', updated_at = now();
  return true;
end;
$$;
revoke all on function public.apply_paid_order(text, text) from public, anon, authenticated;
grant execute on function public.apply_paid_order(text, text) to service_role;

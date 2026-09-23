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

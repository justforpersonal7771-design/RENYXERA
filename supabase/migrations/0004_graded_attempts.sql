-- RENYXERA — Step 6 (5A/5B): answer-key withholding + server-graded attempts.
-- Run once in the Supabase SQL Editor. Safe to re-run.

-- 1. NAT questions whose official key accepts "A OR B" — keep every range.
--    Shape: [[min, max], [min, max]]. nat_min/nat_max stay as the first range.
alter table public.question_answers
  add column if not exists nat_ranges jsonb;

-- 2. Attempts. Created and graded only by our server (service_role), so the client
--    never sees the key before submitting. Users may read their own attempts.
create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('graded', 'practice')),
  question_ids text[] not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  responses jsonb,
  score numeric,
  max_score numeric,
  result jsonb
);

create index if not exists exam_attempts_user_idx on public.exam_attempts(user_id, started_at desc);

alter table public.exam_attempts enable row level security;

drop policy if exists "users read own attempts" on public.exam_attempts;
create policy "users read own attempts"
  on public.exam_attempts for select
  to authenticated
  using (auth.uid() = user_id);
-- No insert/update/delete policy: only the server (service_role) writes attempts.

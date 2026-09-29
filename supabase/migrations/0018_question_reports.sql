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

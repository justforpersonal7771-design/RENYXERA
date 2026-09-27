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

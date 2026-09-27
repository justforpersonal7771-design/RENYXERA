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

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

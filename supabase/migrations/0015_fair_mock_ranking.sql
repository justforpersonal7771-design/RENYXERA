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

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

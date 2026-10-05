-- RENYXERA — Release 8: leaderboards per branch (docs/MULTI_BRANCH_DESIGN.md §4.4, §7).
-- Run once in the Supabase SQL Editor (after 0026). Safe to re-run.
--
-- Every practice board (all / subject / college / weekly challenge) now ranks only attempts
-- of ONE branch:
--   * signed-in caller -> their profile branch (cannot be spoofed);
--   * guest            -> p_branch (the branch they are browsing), default CSE.
-- People who used their one branch change are shown only on their CURRENT branch's boards
-- (their earlier attempts stay stored, just not listed on the old board).
-- Mock boards are per mock already, and every mock belongs to one branch.

create or replace function public.board_branch(p_branch text)
returns text language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select target_branch from public.profiles where id = auth.uid()),
    (select code from public.branches where code = upper(p_branch)),
    'CSE');
$$;
revoke all on function public.board_branch(text) from public;
grant execute on function public.board_branch(text) to anon, authenticated;

drop function if exists public.board(text, text, int, int);
drop function if exists public.board(text, text, int, int, text);
create function public.board(p_scope text, p_key text default null, p_days int default 7, p_limit int default 50, p_branch text default null)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, tests bigint, is_me boolean, total bigint)
language sql
security definer
stable
set search_path = ''
as $$
  with d as (select greatest(1, least(coalesce(p_days, 7), 90)) as days),
  br as (select public.board_branch(p_branch) as code),
  me as (select lower(trim(college)) as college from public.profiles where id = auth.uid()),
  att as (
    select a.* from public.exam_attempts a, br
    where a.mock_id is null and a.status = 'submitted' and a.server_score is not null
      and a.branch_code = br.code
      and not exists (select 1 from jsonb_array_elements(coalesce(a.integrity_flags, '[]'::jsonb)) f
                      where f->>'code' in ('disqualified', 'tab_switches'))
  ),
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
  src as (
    select s.* from (select * from win where p_scope <> 'challenge' union all select * from chal) s
    join public.profiles pr on pr.id = s.user_id, br
    where pr.target_branch = br.code          -- only people currently on this branch
  ),
  cur as (select user_id, cur, n, rank() over (order by cur desc) as rnk, count(*) over () as total from src where cur > 0),
  prv as (select user_id, rank() over (order by prv desc) as rnk from src where prv > 0)
  select c.rnk, p.rnk, public.display_label(pr), round(c.cur, 2), c.n, c.user_id = auth.uid(), c.total
  from cur c
  join public.profiles pr on pr.id = c.user_id
  left join prv p on p.user_id = c.user_id
  where c.rnk <= greatest(1, least(p_limit, 200)) or c.user_id = auth.uid()
  order by c.rnk;
$$;
revoke all on function public.board(text, text, int, int, text) from public;
grant execute on function public.board(text, text, int, int, text) to anon, authenticated;

-- Legacy fallback board (used only if board() is unavailable): same branch rule.
drop function if exists public.practice_leaderboard(int, int);
drop function if exists public.practice_leaderboard(int, int, text);
create function public.practice_leaderboard(p_days int default 7, p_limit int default 50, p_branch text default null)
returns table (rank bigint, prev_rank bigint, display_name text, score numeric, tests bigint, is_me boolean, total bigint)
language sql security definer stable set search_path = '' as $$
  select * from public.board('all', null, p_days, p_limit, p_branch);
$$;
revoke all on function public.practice_leaderboard(int, int, text) from public;
grant execute on function public.practice_leaderboard(int, int, text) to anon, authenticated;

-- ── ECE launch (user decision, Oct 2026): GATE EC opens to everyone ─────────────────────
update public.branches set status = 'live' where code = 'ECE';

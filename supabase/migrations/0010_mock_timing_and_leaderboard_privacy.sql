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

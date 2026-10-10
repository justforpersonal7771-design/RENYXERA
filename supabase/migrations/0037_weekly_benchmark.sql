-- Weekly benchmark: how a learner's week compares with other learners on the same paper. Only aggregates leave the
-- database (the learner's own numbers, and peer averages); the percentile is hidden until 10 learners took a test.
-- The week runs Monday 00:00 to Sunday 24:00, India time.
create or replace function public.weekly_benchmark()
returns table (branch text, tests int, avg_pct numeric, peers int, peer_avg_pct numeric, peer_avg_tests numeric, percentile numeric)
language sql stable security definer set search_path = public as $$
  with me as (
    select p.id, coalesce(p.target_branch, 'CSE') as br from public.profiles p where p.id = auth.uid()
  ),
  wk as (
    select (date_trunc('week', (now() at time zone 'Asia/Kolkata')) at time zone 'Asia/Kolkata') as start_at
  ),
  per_user as (
    select a.user_id, count(*)::int as tests, avg(100.0 * a.server_score / nullif(a.server_max, 0)) as pct
    from public.exam_attempts a, me, wk
    where a.branch_code = me.br and a.status = 'submitted' and a.submitted_at >= wk.start_at and a.server_max > 0
    group by a.user_id
  ),
  mine as (select pu.tests, pu.pct from per_user pu, me where pu.user_id = me.id)
  select
    (select br from me),
    coalesce((select tests from mine), 0),
    round((select pct from mine)::numeric, 1),
    (select count(*)::int from per_user),
    round((select avg(pct) from per_user)::numeric, 1),
    round((select avg(tests) from per_user)::numeric, 1),
    case when (select count(*) from per_user) >= 10 and exists (select 1 from mine)
      then round(100.0 * (select count(*) from per_user where pct < (select pct from mine)) / (select count(*) from per_user), 0) end
$$;
revoke all on function public.weekly_benchmark() from public, anon;
grant execute on function public.weekly_benchmark() to authenticated;

-- Telegram weak-topic nudges (Pro): the learner's own device sends a small summary of their weakest topics; the bot
-- reads it once a week. Nothing here is shown to other learners.
alter table public.telegram_accounts add column if not exists weak_topics jsonb;
alter table public.telegram_accounts add column if not exists weak_updated_at timestamptz;

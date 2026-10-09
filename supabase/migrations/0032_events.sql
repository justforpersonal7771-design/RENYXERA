-- Growth events (docs/GROWTH_TASKS.md G-3). Anonymous and minimal: a random per-browser id,
-- the event name, branch and first-touch source. No answers, no emails, no IPs.
-- Inserted only by the server (/api/events, service role); no browser access.
create table if not exists public.events (
  id bigserial primary key,
  anon_id text not null check (char_length(anon_id) between 8 and 40),
  user_id uuid references auth.users(id) on delete set null,
  event text not null check (event in ('visit','test_started','test_submitted','review_opened','ai_used','invite_shared','share_clicked','telegram_join')),
  branch text,
  source text,
  created_at timestamptz not null default now()
);
create index if not exists events_created_idx on public.events (created_at);
create index if not exists events_anon_idx on public.events (anon_id, created_at);
alter table public.events enable row level security;
revoke all on public.events from anon, authenticated;

-- Weekly learner metrics for the admin script (scripts/growth-metrics.mjs).
-- WAL = distinct anon_ids with a submitted test or an opened review in the week.
create or replace function public.learner_metrics(p_weeks int default 6)
returns table (week date, visitors bigint, wal bigint, tests bigint, d1_return_pct numeric, d7_return_pct numeric)
language sql stable security definer set search_path = public as $$
  with w as (
    select generate_series(date_trunc('week', now()) - make_interval(weeks => p_weeks - 1), date_trunc('week', now()), interval '1 week')::date as week
  ),
  first_seen as (select anon_id, min(created_at) as t0 from events group by anon_id)
  select w.week,
    (select count(distinct anon_id) from events e where e.created_at >= w.week and e.created_at < w.week + 7),
    (select count(distinct anon_id) from events e where e.event in ('test_submitted','review_opened') and e.created_at >= w.week and e.created_at < w.week + 7),
    (select count(*) from events e where e.event = 'test_submitted' and e.created_at >= w.week and e.created_at < w.week + 7),
    (select round(100.0 * count(*) filter (where exists (select 1 from events e where e.anon_id = f.anon_id and e.created_at >= f.t0 + interval '1 day' and e.created_at < f.t0 + interval '2 days')) / nullif(count(*), 0), 1)
       from first_seen f where f.t0 >= w.week and f.t0 < w.week + 7),
    (select round(100.0 * count(*) filter (where exists (select 1 from events e where e.anon_id = f.anon_id and e.created_at >= f.t0 + interval '7 days' and e.created_at < f.t0 + interval '8 days')) / nullif(count(*), 0), 1)
       from first_seen f where f.t0 >= w.week and f.t0 < w.week + 7)
  from w order by w.week desc;
$$;
revoke all on function public.learner_metrics(int) from public, anon, authenticated;

-- Keep 400 days of events.
create or replace function public.prune_events() returns void language sql security definer set search_path = public as $$
  delete from events where created_at < now() - interval '400 days';
$$;
revoke all on function public.prune_events() from public, anon, authenticated;

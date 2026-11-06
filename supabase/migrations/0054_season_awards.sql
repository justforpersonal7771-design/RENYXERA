-- 0054: Battle seasons, badges and speed bonus (R29 step 5, owner go-ahead 6 Nov 2026). Safe to re-run.
-- Seasons are fixed 4-week windows (see lib/server/arena.ts seasonWindow); nothing is stored for a season itself.
-- When a season ends, award_season() writes one badge row per top finisher. Rows are written only by the service role.

create table if not exists public.season_awards (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  season int not null check (season >= 1),
  rank int not null check (rank between 1 and 10),
  points int not null check (points >= 0),
  badge text not null check (badge in ('champion', 'podium', 'top10')),
  created_at timestamptz not null default now(),
  unique (user_id, season)
);
create index if not exists season_awards_season_idx on public.season_awards (season, rank);
alter table public.season_awards enable row level security;
revoke all on public.season_awards from anon;
revoke insert, update, delete on public.season_awards from authenticated;
drop policy if exists season_awards_read_own on public.season_awards;
create policy season_awards_read_own on public.season_awards for select to authenticated using (user_id = (select auth.uid()));

-- Speed bonus: a few extra points for the faster of two finishers (0 to 10), set when a battle is settled.
alter table public.points_ledger add column if not exists speed_bonus int not null default 0 check (speed_bonus between 0 and 10);

-- Standings inside a window (past seasons need an upper bound). Service role only.
create or replace function public.arena_leaderboard_between(p_from timestamptz, p_to timestamptz, p_limit int default 50)
returns table (user_id uuid, points bigint, battles bigint, wins bigint)
language sql stable security definer set search_path = public as $$
  select l.user_id, sum(l.amount)::bigint, count(*)::bigint, (count(*) filter (where l.kind = 'win'))::bigint
  from public.points_ledger l
  where l.created_at >= p_from and l.created_at < p_to
  group by l.user_id
  order by 2 desc, 3 desc
  limit least(greatest(p_limit, 1), 200);
$$;
revoke all on function public.arena_leaderboard_between(timestamptz, timestamptz, int) from public, anon, authenticated;
grant execute on function public.arena_leaderboard_between(timestamptz, timestamptz, int) to service_role;

-- Gives the top 10 of a finished season their badge: 1st champion, 2nd and 3rd podium, 4th to 10th top10. Running it twice changes nothing.
-- Returns how many badges were written.
create or replace function public.award_season(p_season int, p_from timestamptz, p_to timestamptz)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if p_to > now() then raise exception 'season % has not ended yet', p_season; end if;
  with top as (
    select t.user_id, t.points, row_number() over (order by t.points desc, t.battles desc) as rnk
    from public.arena_leaderboard_between(p_from, p_to, 10) t
    where t.points > 0
  ), ins as (
    insert into public.season_awards (user_id, season, rank, points, badge)
    select user_id, p_season, rnk::int, points::int, case when rnk = 1 then 'champion' when rnk <= 3 then 'podium' else 'top10' end
    from top
    on conflict (user_id, season) do nothing
    returning 1
  )
  select count(*) into n from ins;
  return n;
end;
$$;
revoke all on function public.award_season(int, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.award_season(int, timestamptz, timestamptz) to service_role;

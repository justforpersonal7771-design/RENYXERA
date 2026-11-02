-- 0049: Arena points, ratings and the weekly leaderboard (R29 step 3). Written only by the API (service role) when a battle is settled,
-- so points cannot be forged from the browser. One ledger row per student, battle and opponent: settling twice changes nothing.
create table if not exists public.points_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  battle_id uuid not null references public.battles(id) on delete cascade,
  opponent_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('win', 'draw', 'loss')),
  amount int not null check (amount >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, battle_id, opponent_id)
);
create index if not exists points_ledger_user_idx on public.points_ledger (user_id, created_at desc);
create index if not exists points_ledger_time_idx on public.points_ledger (created_at desc);

create table if not exists public.ratings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rating int not null default 1000 check (rating between 100 and 4000),
  updated_at timestamptz not null default now()
);

alter table public.points_ledger enable row level security;
alter table public.ratings enable row level security;
revoke all on public.points_ledger, public.ratings from anon;
revoke insert, update, delete on public.points_ledger, public.ratings from authenticated;
drop policy if exists points_ledger_read on public.points_ledger;
create policy points_ledger_read on public.points_ledger for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists ratings_read on public.ratings;
create policy ratings_read on public.ratings for select to authenticated using ((select auth.uid()) = user_id);

-- Everyone's totals since a moment (the API turns ids into usernames). Callable by the service role only.
create or replace function public.arena_leaderboard(p_since timestamptz, p_limit int default 50)
returns table (user_id uuid, points bigint, battles bigint, wins bigint)
language sql stable security definer set search_path = public as $$
  select l.user_id, sum(l.amount)::bigint, count(*)::bigint, (count(*) filter (where l.kind = 'win'))::bigint
  from public.points_ledger l
  where l.created_at >= p_since
  group by l.user_id
  order by 2 desc, 3 desc
  limit least(greatest(p_limit, 1), 200);
$$;
revoke execute on function public.arena_leaderboard(timestamptz, int) from public, anon, authenticated;

-- Clubs (study squads that compete on weekly Arena points) and coins (daily check-in and battle rewards).
-- Written only by the API with the service role; students may read their own coins and their club.
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 40),
  code text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.club_members (
  user_id uuid primary key references auth.users(id) on delete cascade,      -- one club per student
  club_id uuid not null references public.clubs(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now()
);
create index if not exists club_members_club_idx on public.club_members (club_id);

create table if not exists public.coins_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('daily','streak_bonus','battle_win','battle_draw','battle_play')),
  amount int not null check (amount > 0),
  ref text not null,                      -- the IST date for daily rewards, the battle id for battle rewards
  created_at timestamptz not null default now(),
  unique (user_id, kind, ref)             -- each reward is paid once
);
create index if not exists coins_ledger_user_idx on public.coins_ledger (user_id, created_at desc);

alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.coins_ledger enable row level security;
revoke all on public.clubs, public.club_members, public.coins_ledger from anon;
revoke insert, update, delete on public.clubs, public.club_members, public.coins_ledger from authenticated;
drop policy if exists coins_read on public.coins_ledger;
create policy coins_read on public.coins_ledger for select to authenticated using ((select auth.uid()) = user_id);

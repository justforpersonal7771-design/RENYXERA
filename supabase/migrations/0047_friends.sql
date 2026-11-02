-- 0047: Friends and presence (R29, docs/roadmap/R29-BATTLES-AS-A-GAME.md, step 1).
-- One row per pair of students (user_a < user_b so a pair can never be stored twice). Written only by the API (service role).
create table if not exists public.friendships (
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  requested_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b),
  check (requested_by in (user_a, user_b))
);
create index if not exists friendships_b_idx on public.friendships (user_b, status);

alter table public.friendships enable row level security;
revoke all on public.friendships from anon;
revoke insert, update, delete on public.friendships from authenticated;
drop policy if exists friendships_read on public.friendships;
create policy friendships_read on public.friendships for select to authenticated
  using ((select auth.uid()) in (user_a, user_b));

-- Presence: "last seen" is written at most once a minute while the app is open; friends see it only if show_presence is on.
alter table public.profiles add column if not exists last_seen_at timestamptz;
alter table public.profiles add column if not exists show_presence boolean not null default true;

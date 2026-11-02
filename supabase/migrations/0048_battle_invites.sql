-- 0048: Challenge a specific friend (R29 step 2). The owner of a battle invites accepted friends; an invited friend sees the battle in
-- "Challenges for you" without needing the link. Written only by the API (service role), which checks that the two are friends.
create table if not exists public.battle_invites (
  battle_id uuid not null references public.battles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (battle_id, user_id)
);
create index if not exists battle_invites_user_idx on public.battle_invites (user_id, created_at desc);

alter table public.battle_invites enable row level security;
revoke all on public.battle_invites from anon;
revoke insert, update, delete on public.battle_invites from authenticated;
drop policy if exists battle_invites_read on public.battle_invites;
create policy battle_invites_read on public.battle_invites for select to authenticated
  using ((select auth.uid()) in (user_id, invited_by));

-- 0058: When a challenge should be played (Battles redesign). An invite can be "play now" (the friend is shown a live prompt if they are active)
-- or scheduled for a time (the friend sees it at that time and gets a reminder badge). Both are optional: older invites behave as before.
alter table public.battle_invites add column if not exists play_now boolean not null default false;
alter table public.battle_invites add column if not exists scheduled_at timestamptz;
create index if not exists battle_invites_sched_idx on public.battle_invites (user_id, scheduled_at);

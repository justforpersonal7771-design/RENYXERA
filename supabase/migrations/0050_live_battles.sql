-- 0050: Live (concurrent) battles (R29 step 4). A live battle has a lobby: each player presses Ready; when the owner and at least one
-- friend are ready the server sets live_start_at a few seconds ahead, and every player's screen counts down to the same moment.
-- A live battle with nobody joining can be switched back to "play when you like" (async) by the owner. Written only by the API.
alter table public.battles add column if not exists mode text not null default 'async' check (mode in ('async', 'live'));
alter table public.battles add column if not exists live_start_at timestamptz;
alter table public.battles add column if not exists owner_ready_at timestamptz;
alter table public.battle_entries add column if not exists ready_at timestamptz;

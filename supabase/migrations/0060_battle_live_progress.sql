-- Live Battles room: the challenger's own progress during a live match, so both players see each other answer in real time.
alter table public.battles add column if not exists owner_answered int not null default 0 check (owner_answered >= 0);
alter table public.battles add column if not exists owner_total int;
alter table public.battles add column if not exists owner_seen_at timestamptz;

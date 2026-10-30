-- 0043: Battles (R19, docs/roadmap/R19-BATTLES.md): "beat my score" with live status.
-- Scores are never taken from the browser: a battle's owner score and every entry's score are copied by the API from the
-- server-graded exam_attempts row (exam_attempts.server_score). Writes happen only through the API (service role).
create table if not exists public.battles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_name text not null default 'A friend' check (char_length(owner_name) <= 40),
  title text not null default 'Practice set' check (char_length(title) <= 80),
  question_ids text[] not null check (cardinality(question_ids) between 3 and 200),
  owner_attempt_id uuid references public.exam_attempts(id) on delete set null,
  owner_score numeric not null,
  max_score numeric not null check (max_score > 0),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);
create index if not exists battles_owner_idx on public.battles (owner_id, created_at desc);

create table if not exists public.battle_entries (
  battle_id uuid not null references public.battles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null default 'A friend' check (char_length(display_name) <= 40),
  status text not null default 'opened' check (status in ('opened', 'started', 'submitted', 'abandoned')),
  answered int not null default 0 check (answered >= 0),
  total int not null default 0,
  attempt_id uuid references public.exam_attempts(id) on delete set null,
  score numeric,
  max_score numeric,
  started_at timestamptz,
  submitted_at timestamptz,
  last_seen_at timestamptz not null default now(),
  primary key (battle_id, user_id)
);
create index if not exists battle_entries_user_idx on public.battle_entries (user_id, last_seen_at desc);

alter table public.battles enable row level security;
alter table public.battle_entries enable row level security;
revoke all on public.battles, public.battle_entries from anon;
revoke insert, update, delete on public.battles, public.battle_entries from authenticated;

-- The owner and anyone who joined may read; everything else goes through the API.
drop policy if exists battles_read on public.battles;
create policy battles_read on public.battles for select to authenticated
  using (owner_id = auth.uid() or exists (select 1 from public.battle_entries e where e.battle_id = battles.id and e.user_id = auth.uid()));
drop policy if exists battle_entries_read on public.battle_entries;
create policy battle_entries_read on public.battle_entries for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.battles b where b.id = battle_entries.battle_id and b.owner_id = auth.uid()));
